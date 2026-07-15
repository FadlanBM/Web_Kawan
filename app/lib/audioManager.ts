// ============================================================
// KAWAN — Audio Manager (Web Audio API)
// ============================================================

let audioCtx: AudioContext | null = null;
let globalVolume = 0.7;

function getAudioContext(): AudioContext {
  if (!audioCtx || audioCtx.state === "closed") {
    audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  }
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

export function setVolume(volume: number): void {
  globalVolume = Math.max(0, Math.min(1, volume));
}

// Mainkan nada pendek (efek suara positif)
export function playPositiveTone(): void {
  try {
    const ctx = getAudioContext();
    const notes = [523.25, 659.25, 783.99]; // C5, E5, G5 — akord mayor
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = freq;
      osc.type = "sine";
      gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.12);
      gain.gain.linearRampToValueAtTime(globalVolume * 0.3, ctx.currentTime + i * 0.12 + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.12 + 0.4);
      osc.start(ctx.currentTime + i * 0.12);
      osc.stop(ctx.currentTime + i * 0.12 + 0.4);
    });
  } catch { /* silent fail */ }
}

// Mainkan nada hint/error lembut (bukan suara keras)
export function playHintTone(): void {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 440; // A4
    osc.type = "sine";
    gain.gain.setValueAtTime(globalVolume * 0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.5);
  } catch { /* silent fail */ }
}

// Mainkan suara selesai / celebration
export function playCelebrationTone(): void {
  try {
    const ctx = getAudioContext();
    const notes = [523.25, 587.33, 659.25, 698.46, 783.99];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = freq;
      osc.type = "sine";
      const startTime = ctx.currentTime + i * 0.1;
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(globalVolume * 0.4, startTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.5);
      osc.start(startTime);
      osc.stop(startTime + 0.5);
    });
  } catch { /* silent fail */ }
}

let lastTeks: string | null = null;
let lastKecepatan = 1;
let speechActive = false;
let audioUnlocked = false;

export function unlockAudio(): void {
  if (audioUnlocked) return;
  if (typeof window === "undefined") return;

  console.log("[AudioManager] Unlocking audio via user interaction...");

  // 1. Unlock Web Audio API
  try {
    const ctx = getAudioContext();
    if (ctx.state === "suspended") {
      ctx.resume().then(() => {
        console.log("[AudioManager] AudioContext successfully resumed.");
      }).catch(err => {
        console.warn("[AudioManager] Failed to resume AudioContext:", err);
      });
    }
  } catch (e) {
    console.warn("[AudioManager] Failed to initialize AudioContext:", e);
  }

  // 2. Unlock SpeechSynthesis
  try {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }
      
      // Speak a silent utterance to trigger browser activation
      const u = new SpeechSynthesisUtterance("");
      window.speechSynthesis.speak(u);
      
      console.log("[AudioManager] SpeechSynthesis unlocked.");
    }
  } catch (e) {
    console.warn("[AudioManager] Failed to unlock SpeechSynthesis:", e);
  }

  audioUnlocked = true;

  // 3. Play pending narration if any
  if (lastTeks) {
    console.log("[AudioManager] Playing pending narration:", lastTeks);
    const t = lastTeks;
    const k = lastKecepatan;
    lastTeks = null; // Clear to avoid repeating
    ucapkanTeks(t, k);
  }
}

// Register global event listener for user interaction to unlock audio
if (typeof window !== "undefined") {
  const handleInteraction = () => {
    unlockAudio();
    window.removeEventListener("click", handleInteraction);
    window.removeEventListener("touchstart", handleInteraction);
    window.removeEventListener("keydown", handleInteraction);
  };
  window.addEventListener("click", handleInteraction, { passive: true });
  window.addEventListener("touchstart", handleInteraction, { passive: true });
  window.addEventListener("keydown", handleInteraction, { passive: true });
}

// Text-to-Speech menggunakan Web Speech API
export function ucapkanTeks(teks: string, kecepatan = 1): void {
  if (typeof window === "undefined" || !window.speechSynthesis) {
    console.warn("[AudioManager] SpeechSynthesis is not supported in this browser.");
    return;
  }

  // Store for replay on unlock if not unlocked yet
  if (!audioUnlocked) {
    console.log("[AudioManager] Audio not unlocked yet. Queueing narration:", teks);
    lastTeks = teks;
    lastKecepatan = kecepatan;
    return;
  }

  console.log(`[AudioManager] Speaking: "${teks}" (speed: ${kecepatan}, volume: ${globalVolume})`);

  try {
    window.speechSynthesis.cancel(); // Stop current speech
    
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }

    const utterance = new SpeechSynthesisUtterance(teks);
    utterance.lang = "id-ID";
    utterance.rate = kecepatan;
    utterance.volume = globalVolume;
    utterance.pitch = 1.1;

    utterance.onstart = () => {
      speechActive = true;
      console.log("[AudioManager] Speech started successfully.");
    };

    utterance.onend = () => {
      speechActive = false;
      console.log("[AudioManager] Speech ended.");
    };

    utterance.onerror = (e) => {
      speechActive = false;
      console.warn("[AudioManager] SpeechSynthesisUtterance error:", e.error);
      
      // If blocked by autoplay policy
      if (e.error === "not-allowed") {
        audioUnlocked = false;
        lastTeks = teks;
        lastKecepatan = kecepatan;
      }
    };

    // Check if id-ID voice exists, if not, find closest or print warning
    const voices = window.speechSynthesis.getVoices();
    const hasIndonesian = voices.some(v => v.lang.includes("id") || v.lang.includes("ID"));
    if (voices.length > 0 && !hasIndonesian) {
      console.warn("[AudioManager] Indonesian (id-ID) voice not found. Using default voice.");
    }

    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.error("[AudioManager] Error during speak():", err);
  }
}

export function stopSpeech(): void {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  try {
    window.speechSynthesis.cancel();
    lastTeks = null;
    speechActive = false;
  } catch {}
}

// Musik latar lembut menggunakan Web Audio API (pad ambien)
let bgGainNode: GainNode | null = null;
let bgOscillators: OscillatorNode[] = [];

export function startBgMusic(): void {
  try {
    const ctx = getAudioContext();
    stopBgMusic();

    const chords = [
      [261.63, 329.63, 392.0], // C major
      [293.66, 369.99, 440.0], // D minor
    ];

    bgGainNode = ctx.createGain();
    bgGainNode.gain.value = globalVolume * 0.08;
    bgGainNode.connect(ctx.destination);

    chords[0].forEach((freq) => {
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.value = freq;
      osc.connect(bgGainNode!);
      osc.start();
      bgOscillators.push(osc);
    });
  } catch { /* silent fail */ }
}

export function stopBgMusic(): void {
  try {
    bgOscillators.forEach((osc) => {
      try { osc.stop(); } catch { /* ignore */ }
    });
    bgOscillators = [];
    bgGainNode = null;
  } catch { /* silent fail */ }
}
