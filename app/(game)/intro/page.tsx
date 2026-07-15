"use client";

// ============================================================
// KAWAN — Intro Cerita (Visual Novel Style)
// ============================================================
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGame } from "@/app/contexts/GameContext";
import DialogBox from "@/app/components/ui/DialogBox";
import { DIALOG_INTRO } from "@/app/lib/gameData";

export default function IntroPage() {
  const router = useRouter();
  const { state } = useGame();
  const [dialogIdx, setDialogIdx] = useState(0);
  const [sceneReady, setSceneReady] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setSceneReady(true), 400);
    return () => clearTimeout(t);
  }, []);

  const currentDialog = DIALOG_INTRO[dialogIdx];
  const isLast = dialogIdx === DIALOG_INTRO.length - 1;
  const profil = state.profilAktif;

  const handleNext = () => {
    if (dialogIdx < DIALOG_INTRO.length - 1) {
      setDialogIdx((i) => i + 1);
    }
  };

  const handleComplete = () => {
    router.push("/quest-1");
  };

  return (
    <div className="min-h-screen flex flex-col bg-cream relative overflow-hidden">
      {/* Background Pasar KAWAN */}
      <div className="absolute inset-0 bg-gradient-to-b from-sky-100 via-cream to-cream" />

      {/* Elemen latar pasar (statis, tidak bergerak terus) */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Matahari */}
        <div className="absolute top-6 right-12 w-20 h-20 bg-yellow-warm rounded-full shadow-lg opacity-80" />
        {/* Awan */}
        <div className="absolute top-10 left-10 flex gap-1">
          <div className="w-16 h-10 bg-white rounded-full opacity-70" />
          <div className="w-20 h-12 bg-white rounded-full -ml-4 opacity-70" />
          <div className="w-12 h-8 bg-white rounded-full -ml-3 opacity-70" />
        </div>
        {/* Tenda pasar */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-mint/10 to-transparent" />

        {/* Umbul-umbul pasar */}
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="absolute bottom-28"
            style={{ left: `${i * 22 + 5}%` }}
          >
            <div className="w-0.5 h-24 bg-coklat/30 mx-auto" />
            <div
              className="w-6 h-8 -mt-1 mx-auto rounded-b-full opacity-70"
              style={{
                backgroundColor: ["#7EC8A4", "#B8A9D9", "#FFD166", "#F4A261", "#7EC8A4"][i],
              }}
            />
          </div>
        ))}

        {/* Stand pasar */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex gap-4">
          {["🍎", "🥬", "🥕"].map((emoji, i) => (
            <div key={i} className="flex flex-col items-center">
              <span className="text-4xl">{emoji}</span>
              <div className="w-16 h-3 bg-coklat/20 rounded-full" />
            </div>
          ))}
        </div>
      </div>

      {/* Konten utama */}
      <div className={`relative z-10 flex flex-col flex-1 justify-between p-6 transition-all duration-700 ${sceneReady ? "opacity-100" : "opacity-0"}`}>
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="bg-white/80 rounded-2xl px-4 py-2 border-2 border-border shadow">
            <span className="font-black text-coklat">
              {profil ? `Halo, ${profil.nama}! 👋` : "Halo! 👋"}
            </span>
          </div>
          <div className={`bg-white/80 rounded-full px-4 py-2 border-2 border-border shadow text-sm font-bold ${
            state.profilAktif?.jalur === "pemula" ? "text-yellow-700" : "text-purple-700"
          }`}>
            {state.profilAktif?.jalur === "pemula" ? "🌱 Jalur Pemula" : "🚀 Jalur Lanjutan"}
          </div>
        </div>

        {/* Maskot karakter */}
        <div className="flex justify-center my-4">
          <div className="animate-float">
            <div className="w-32 h-32 bg-white rounded-[40px] shadow-2xl border-4 border-mint flex items-center justify-center">
              <span className="text-7xl select-none">🌟</span>
            </div>
          </div>
        </div>

        {/* Dialog Box */}
        <div className="animate-fade-in">
          <DialogBox
            karakter="KAWAN"
            teks={currentDialog.teks}
            onNext={handleNext}
            onComplete={handleComplete}
            isLast={isLast}
            autoSpeak={true}
            kecepatan={state.aksesibilitas.kecepatanNarasi}
          />
        </div>

        {/* Indikator dialog */}
        <div className="flex justify-center gap-2 mt-4">
          {DIALOG_INTRO.map((_, i) => (
            <div
              key={i}
              className={`w-2.5 h-2.5 rounded-full transition-all ${i === dialogIdx ? "bg-mint w-6" : "bg-border/40"}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
