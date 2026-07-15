"use client";

// ============================================================
// KAWAN — AccessibilityPanel (SQLite-backed via actions)
// ============================================================
import { useState } from "react";
import { useGame } from "@/app/contexts/GameContext";
import { stopSpeech, stopBgMusic } from "@/app/lib/audioManager";

export default function AccessibilityPanel() {
  const { state, actions } = useGame();
  const [open, setOpen] = useState(false);
  const { aksesibilitas } = state;

  const updateVolume = async (v: number) => {
    await actions.updateAksesibilitas({ volume: v });
    if (v === 0) {
      stopSpeech();
      stopBgMusic();
    }
  };

  return (
    <div className="fixed top-4 right-4 z-40">
      <button
        onClick={() => setOpen(!open)}
        className="w-14 h-14 bg-white border-2 border-border rounded-full shadow-md flex items-center justify-center text-2xl hover:shadow-lg transition-all"
        aria-label="Pengaturan aksesibilitas"
        id="btn-aksesibilitas"
      >
        ⚙️
      </button>

      {open && (
        <div className="absolute top-16 right-0 bg-white border-2 border-border rounded-2xl shadow-xl p-5 w-72">
          <h3 className="font-bold text-lg text-coklat mb-4">Pengaturan</h3>

          {/* Volume */}
          <div className="mb-4">
            <label className="flex items-center gap-2 font-semibold text-coklat mb-2">
              🔊 Volume: {Math.round(aksesibilitas.volume * 100)}%
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={aksesibilitas.volume}
              onChange={(e) => updateVolume(parseFloat(e.target.value))}
              className="w-full h-3 accent-mint cursor-pointer"
              id="slider-volume"
            />
          </div>

          {/* Ukuran Teks */}
          <div className="mb-4">
            <label className="font-semibold text-coklat mb-2 block">🔤 Ukuran Teks</label>
            <div className="flex gap-2">
              {(["normal", "besar", "sangat-besar"] as const).map((size) => (
                <button
                  key={size}
                  onClick={() => actions.updateAksesibilitas({ ukuranTeks: size })}
                  className={`flex-1 py-2 rounded-xl border-2 font-bold text-sm transition-all ${
                    aksesibilitas.ukuranTeks === size
                      ? "bg-mint text-white border-mint"
                      : "bg-cream border-border text-coklat"
                  }`}
                >
                  {size === "normal" ? "A" : size === "besar" ? "A+" : "A++"}
                </button>
              ))}
            </div>
          </div>

          {/* Kecepatan Narasi */}
          <div className="mb-4">
            <label className="font-semibold text-coklat mb-2 block">
              🗣️ Kecepatan Narasi: {aksesibilitas.kecepatanNarasi}x
            </label>
            <input
              type="range"
              min="0.5"
              max="1.5"
              step="0.25"
              value={aksesibilitas.kecepatanNarasi}
              onChange={(e) =>
                actions.updateAksesibilitas({ kecepatanNarasi: parseFloat(e.target.value) })
              }
              className="w-full h-3 accent-mint cursor-pointer"
              id="slider-narasi"
            />
          </div>

          {/* Animasi */}
          <div className="flex items-center justify-between">
            <label className="font-semibold text-coklat">✨ Animasi</label>
            <button
              onClick={() =>
                actions.updateAksesibilitas({
                  animasiDinonaktifkan: !aksesibilitas.animasiDinonaktifkan,
                })
              }
              className={`w-14 h-7 rounded-full border-2 transition-all relative ${
                aksesibilitas.animasiDinonaktifkan ? "bg-gray-300 border-gray-400" : "bg-mint border-mint"
              }`}
              id="toggle-animasi"
            >
              <span
                className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow transition-all ${
                  aksesibilitas.animasiDinonaktifkan ? "left-0.5" : "left-7"
                }`}
              />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
