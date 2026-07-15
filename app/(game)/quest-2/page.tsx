"use client";

// ============================================================
// KAWAN — Quest 2: Kasir Bersuara (PECS Digital)
// ============================================================
import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useGame } from "@/app/contexts/GameContext";
import { hitungProgresQuest } from "@/app/lib/analytics";
import { playPositiveTone, playHintTone, playCelebrationTone, ucapkanTeks } from "@/app/lib/audioManager";
import StarReward from "@/app/components/ui/StarReward";
import ProgressBar from "@/app/components/ui/ProgressBar";
import { PECS_KARTU, SKENARIO_PEMULA, SKENARIO_LANJUTAN, SkenarioPECS } from "@/app/lib/gameData";
import { PecsKartu } from "@/app/types";

export default function Quest2Page() {
  const router = useRouter();
  const { state, actions } = useGame();
  const jalur = state.profilAktif?.jalur ?? "pemula";
  const skenarioList: SkenarioPECS[] = jalur === "pemula" ? SKENARIO_PEMULA : SKENARIO_LANJUTAN;

  const [skenarioIdx, setSkenarioIdx] = useState(0);
  const [susunan, setSusunan] = useState<PecsKartu[]>([]);
  const [showResponKasir, setShowResponKasir] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const [rewardBintang, setRewardBintang] = useState(1);
  const [hintKartu, setHintKartu] = useState<string | null>(null);
  const [salah, setSalah] = useState(false);
  const [nextPrompt, setNextPrompt] = useState<string | null>(null);

  const errorCount = useRef(0);
  const hintCount = useRef(0);
  const startTime = useRef(Date.now());
  const responseTimes = useRef<number[]>([]);
  const lastInteractionTime = useRef(Date.now());

  const currentSkenario = skenarioList[skenarioIdx];

  // Kartu PECS yang tersedia untuk skenario ini
  const kartuTersedia = jalur === "pemula"
    ? PECS_KARTU.filter((k) => ["saya", "mau", "terima-kasih", "minta-tolong"].includes(k.id))
    : PECS_KARTU;

  useEffect(() => {
    if (currentSkenario) {
      ucapkanTeks(currentSkenario.narasi, state.aksesibilitas.kecepatanNarasi);
    }
  }, [skenarioIdx, currentSkenario, state.aksesibilitas.kecepatanNarasi]);

  const handleTambahKartu = (kartu: PecsKartu) => {
    if (susunan.find((k) => k.id === kartu.id)) return; // sudah ada
    setSusunan((prev) => [...prev, kartu]);
    ucapkanTeks(kartu.teks, state.aksesibilitas.kecepatanNarasi);
  };

  const handleHapusKartu = (kartuId: string) => {
    setSusunan((prev) => prev.filter((k) => k.id !== kartuId));
  };

  const handleUcapkan = () => {
    if (susunan.length === 0) return;
    const kalimat = susunan.map((k) => k.teks).join(" ");
    ucapkanTeks(kalimat, state.aksesibilitas.kecepatanNarasi);
  };

  const handleSubmit = useCallback(() => {
    const rt = (Date.now() - lastInteractionTime.current) / 1000;
    responseTimes.current.push(rt);
    lastInteractionTime.current = Date.now();

    const ids = susunan.map((k) => k.id);
    const benar = currentSkenario.susunanBenar.every((id) => ids.includes(id)) ||
      currentSkenario.jawabanAlternatif?.some((alt) => alt.every((id) => ids.includes(id)));

    if (benar) {
      playPositiveTone();
      setShowResponKasir(true);
      ucapkanTeks(currentSkenario.responKasir, state.aksesibilitas.kecepatanNarasi);

      if (currentSkenario.promptBerikutnya) {
        setTimeout(() => {
          setNextPrompt(currentSkenario.promptBerikutnya!);
          ucapkanTeks(currentSkenario.promptBerikutnya!, state.aksesibilitas.kecepatanNarasi);
          // hint kartu khusus
          if (currentSkenario.kartuHint) {
            setHintKartu(currentSkenario.kartuHint);
          }
        }, 2000);
      }
    } else {
      errorCount.current++;
      setSalah(true);
      playHintTone();
      ucapkanTeks("Coba lagi, susun kartunya dengan benar!", state.aksesibilitas.kecepatanNarasi);
      setTimeout(() => setSalah(false), 1200);

      if (errorCount.current % 2 === 0) {
        hintCount.current++;
        if (currentSkenario.kartuHint) {
          setHintKartu(currentSkenario.kartuHint);
          setTimeout(() => setHintKartu(null), 4000);
        }
      }
    }
  }, [susunan, currentSkenario, state.aksesibilitas.kecepatanNarasi]);

  const handleNextSkenario = async () => {
    setShowResponKasir(false);
    setNextPrompt(null);
    setHintKartu(null);
    setSusunan([]);

    if (skenarioIdx + 1 < skenarioList.length) {
      setSkenarioIdx((i) => i + 1);
    } else {
      // Quest selesai
      playCelebrationTone();
      const completionTime = (Date.now() - startTime.current) / 1000;
      const totalAttempts = skenarioList.length + errorCount.current;
      const avgRT = responseTimes.current.length > 0
        ? responseTimes.current.reduce((a, b) => a + b, 0) / responseTimes.current.length
        : 10;
      const progres = hitungProgresQuest(errorCount.current, totalAttempts, avgRT, hintCount.current, completionTime);

      await actions.updateQuestProgres(2, progres);
      await actions.addStiker("komunikator");
      setRewardBintang(progres.bintang);
      setShowReward(true);
    }
  };

  const handleTerimaKasih = () => {
    const tkKartu = PECS_KARTU.find((k) => k.id === "terima-kasih");
    if (tkKartu) {
      ucapkanTeks("Terima kasih!", state.aksesibilitas.kecepatanNarasi);
      playPositiveTone();
    }
    setHintKartu(null);
    setNextPrompt(null);
    setTimeout(() => handleNextSkenario(), 1500);
  };

  if (!currentSkenario) return null;

  return (
    <div className="min-h-screen bg-cream px-4 py-6 flex flex-col">
      <div className="max-w-2xl mx-auto w-full flex flex-col flex-1">
        {/* Header */}
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 bg-lavender rounded-2xl flex items-center justify-center text-2xl shadow-md">🛒</div>
          <div className="flex-1">
            <h1 className="text-2xl font-black text-coklat">Quest 2: Kasir Bersuara</h1>
            <p className="text-coklat/60 text-sm font-semibold">Susun kartu gambar untuk berbicara!</p>
          </div>
          <span className="text-2xl font-black text-yellow-warm">⭐ {skenarioIdx}</span>
        </div>

        <ProgressBar current={skenarioIdx} total={skenarioList.length} label="Skenario" className="mb-5" />

        {/* Kasir Scene */}
        <div className="bg-white rounded-3xl border-2 border-border shadow-md p-5 mb-5 relative overflow-hidden">
          {/* Latar kasir */}
          <div className="absolute top-0 right-0 text-6xl opacity-10 p-2">🏪</div>

          <div className="flex items-start gap-4">
            {/* Kasir karakter */}
            <div className="flex-shrink-0 flex flex-col items-center">
              <div className="w-16 h-16 bg-mint/20 rounded-2xl border-2 border-mint flex items-center justify-center text-4xl">
                👩‍💼
              </div>
              <span className="text-xs font-bold text-coklat/60 mt-1">Kasir</span>
            </div>

            {/* Dialog */}
            <div className="flex-1">
              <div className={`bg-cream rounded-2xl border-2 border-border p-3 mb-3 ${salah ? "border-orange-soft animate-shake" : ""}`}>
                <p className="font-bold text-coklat text-lg leading-snug">{currentSkenario.narasi}</p>
              </div>

              {showResponKasir && (
                <div className="bg-mint/20 rounded-2xl border-2 border-mint p-3 animate-fade-in">
                  <p className="font-bold text-coklat">{currentSkenario.responKasir} 😊</p>
                </div>
              )}

              {nextPrompt && (
                <div className="bg-yellow-warm/20 rounded-2xl border-2 border-yellow-warm p-3 mt-2 animate-fade-in">
                  <p className="font-bold text-coklat">💬 {nextPrompt}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Area susun PECS */}
        <div className="bg-white rounded-3xl border-2 border-border shadow-md p-4 mb-4">
          <p className="font-bold text-coklat/60 text-sm mb-3">Susunanmu:</p>
          <div className="min-h-[80px] bg-cream rounded-2xl border-2 border-dashed border-border p-3 flex gap-2 flex-wrap items-center mb-3">
            {susunan.length === 0 && (
              <p className="text-coklat/30 font-semibold text-lg">Pilih kartu di bawah...</p>
            )}
            {susunan.map((kartu, i) => (
              <div
                key={`${kartu.id}-${i}`}
                onClick={() => handleHapusKartu(kartu.id)}
                className="flex flex-col items-center bg-white border-2 border-mint rounded-2xl px-3 py-2 cursor-pointer hover:bg-red-50 hover:border-red-300 transition-all min-w-[64px] shadow-sm"
                title="Klik untuk hapus"
              >
                <span className="text-3xl">{kartu.emoji}</span>
                <span className="text-xs font-bold text-coklat mt-1 text-center">{kartu.teks}</span>
              </div>
            ))}
          </div>

          {/* Tombol aksi */}
          <div className="flex gap-2">
            <button
              onClick={handleUcapkan}
              disabled={susunan.length === 0}
              className="flex-1 min-h-[52px] bg-lavender text-white font-black text-lg rounded-2xl disabled:opacity-40 hover:bg-lavender-dark transition-colors border-2 border-lavender-dark"
              id="btn-ucapkan"
            >
              🔊 Ucapkan
            </button>
            {!showResponKasir && (
              <button
                onClick={handleSubmit}
                disabled={susunan.length === 0}
                className="flex-1 min-h-[52px] bg-mint text-white font-black text-lg rounded-2xl disabled:opacity-40 hover:bg-mint-dark transition-colors border-2 border-mint-dark"
                id="btn-kirim-pecs"
              >
                ✓ Kirim
              </button>
            )}
            {showResponKasir && !nextPrompt && (
              <button
                onClick={handleNextSkenario}
                className="flex-1 min-h-[52px] bg-yellow-warm text-coklat font-black text-lg rounded-2xl hover:opacity-90 transition-colors border-2 border-yellow-600"
                id="btn-next-skenario"
              >
                Lanjut ▶
              </button>
            )}
            {nextPrompt && (
              <button
                onClick={handleTerimaKasih}
                className="flex-1 min-h-[52px] bg-yellow-warm text-coklat font-black text-lg rounded-2xl hover:opacity-90 transition-colors border-2 border-yellow-600 pulse-hint"
                id="btn-terima-kasih"
              >
                🙏 Terima Kasih!
              </button>
            )}
          </div>
        </div>

        {/* Kartu PECS yang tersedia */}
        <div>
          <p className="font-bold text-coklat/60 text-sm mb-3">Pilih kartu:</p>
          <div className="flex flex-wrap gap-3 justify-center">
            {kartuTersedia.map((kartu) => {
              const sudahDipilih = susunan.some((k) => k.id === kartu.id);
              const isHint = hintKartu === kartu.id;
              return (
                <button
                  key={kartu.id}
                  onClick={() => handleTambahKartu(kartu)}
                  disabled={sudahDipilih}
                  className={`
                    flex flex-col items-center min-w-[72px] min-h-[88px] rounded-2xl border-4 px-3 py-2
                    transition-all duration-200 font-bold
                    ${sudahDipilih
                      ? "bg-mint/20 border-mint opacity-60 cursor-not-allowed"
                      : isHint
                      ? "bg-orange-soft/20 border-orange-soft pulse-hint hover:-translate-y-1 cursor-pointer"
                      : "bg-white border-border hover:-translate-y-1 hover:border-mint hover:shadow-md cursor-pointer"
                    }
                  `}
                  id={`btn-pecs-${kartu.id}`}
                >
                  <span className="text-4xl">{kartu.emoji}</span>
                  <span className="text-sm text-coklat text-center mt-1 leading-tight">{kartu.teks}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <StarReward
        show={showReward}
        count={rewardBintang}
        message={`Quest 2 Selesai! ${rewardBintang} Bintang! 🎉`}
        onComplete={() => {
          setShowReward(false);
          router.push("/quest-3");
        }}
      />
    </div>
  );
}
