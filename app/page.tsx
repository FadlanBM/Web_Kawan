"use client";

// ============================================================
// KAWAN — Splash Screen (app/page.tsx)
// ============================================================
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { GameProvider, useGame } from "@/app/contexts/GameContext";
import AccessibilityPanel from "@/app/components/ui/AccessibilityPanel";
import { ucapkanTeks } from "@/app/lib/audioManager";

function SplashContent() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const { state } = useGame();

  useEffect(() => {
    ucapkanTeks("Selamat Datang di Pasar KAWAN! Belajar bersama sambil bermain di Pasar KAWAN!", state.aksesibilitas.kecepatanNarasi);
    const t = setTimeout(() => setReady(true), 300);
    return () => clearTimeout(t);
  }, [state.aksesibilitas.kecepatanNarasi]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-cream relative overflow-hidden px-4">
      {/* Dekorasi latar belakang — lingkaran statis lembut */}
      <div className="absolute top-[-80px] left-[-80px] w-64 h-64 rounded-full bg-mint/20 blur-3xl" />
      <div className="absolute bottom-[-60px] right-[-60px] w-80 h-80 rounded-full bg-lavender/20 blur-3xl" />
      <div className="absolute top-1/3 right-1/4 w-40 h-40 rounded-full bg-yellow-warm/20 blur-2xl" />

      {/* Konten utama */}
      <div className={`flex flex-col items-center gap-6 transition-all duration-700 ${ready ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
        {/* Logo / Maskot */}
        <div className="relative animate-float">
          <div className="w-40 h-40 bg-white rounded-[40px] shadow-2xl border-4 border-mint flex items-center justify-center">
            <span className="text-7xl select-none">🌟</span>
          </div>
          {/* Badge KAWAN */}
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-mint text-white font-black text-xl px-6 py-1 rounded-full shadow-md whitespace-nowrap">
            KAWAN
          </div>
        </div>

        {/* Judul */}
        <div className="text-center mt-8">
          <h1 className="text-4xl sm:text-5xl font-black text-coklat leading-tight">
            Selamat Datang di
            <br />
            <span className="text-mint">Pasar KAWAN!</span>
          </h1>
          <p className="mt-3 text-lg text-coklat/70 font-semibold max-w-sm mx-auto leading-relaxed">
            Belajar bersama sambil bermain di Pasar KAWAN 🏪
          </p>
        </div>

        {/* Tombol utama */}
        <div className="flex flex-col gap-3 w-full max-w-xs mt-4">
          <button
            id="btn-mulai"
            onClick={() => router.push("/profil")}
            className="w-full min-h-[64px] bg-mint text-white text-2xl font-black rounded-2xl shadow-lg border-2 border-mint-dark hover:shadow-xl hover:-translate-y-1 active:translate-y-0 transition-all duration-200"
          >
            🎮 Mulai Bermain
          </button>

          <button
            id="btn-guru"
            onClick={() => router.push("/dashboard")}
            className="w-full min-h-[56px] bg-white text-coklat text-xl font-bold rounded-2xl shadow-md border-2 border-border hover:shadow-lg hover:-translate-y-1 active:translate-y-0 transition-all duration-200"
          >
            👩‍🏫 Mode Guru
          </button>
        </div>

        {/* Kredit */}
        <p className="text-sm text-coklat/50 font-semibold mt-4 text-center">
          © 2026 Tim KAWAN — Universitas Gadjah Mada
        </p>
      </div>

      <AccessibilityPanel />
    </div>
  );
}

export default function HomePage() {
  return (
    <GameProvider>
      <SplashContent />
    </GameProvider>
  );
}
