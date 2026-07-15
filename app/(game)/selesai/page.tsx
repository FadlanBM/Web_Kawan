"use client";

// ============================================================
// KAWAN — Layar Selesai (Stiker Koleksi + Ringkasan)
// ============================================================
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useGame } from "@/app/contexts/GameContext";
import { playCelebrationTone, ucapkanTeks } from "@/app/lib/audioManager";
import { STIKER_DATA } from "@/app/lib/gameData";

const CONFETTI_COLORS = ["#7EC8A4", "#B8A9D9", "#FFD166", "#F4A261", "#FF6B6B"];

export default function SelesaiPage() {
  const router = useRouter();
  const { state } = useGame();
  const [confetti, setConfetti] = useState<{ id: number; x: number; color: string; delay: number; size: number }[]>([]);
  const [ready, setReady] = useState(false);

  const profil = state.profilAktif;
  const totalBintang = profil?.progres.totalBintang ?? 0;
  const stiker = profil?.progres.stiker ?? [];

  useEffect(() => {
    playCelebrationTone();
    ucapkanTeks(`Selamat! Kamu telah menyelesaikan semua quest! Kamu mendapat ${totalBintang} bintang!`, state.aksesibilitas.kecepatanNarasi);

    // Tambah stiker bintang KAWAN jika semua quest selesai
    const allDone = profil?.progres.quest1?.selesai && profil?.progres.quest2?.selesai && profil?.progres.quest3?.selesai;

    // Buat confetti
    setConfetti(
      Array.from({ length: 30 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        delay: Math.random() * 2,
        size: Math.random() * 10 + 8,
      }))
    );

    setTimeout(() => setReady(true), 300);
  }, [totalBintang, profil]);

  const quest1 = profil?.progres.quest1;
  const quest2 = profil?.progres.quest2;
  const quest3 = profil?.progres.quest3;

  return (
    <div className="min-h-screen bg-cream overflow-hidden relative px-4 py-8">
      {/* Confetti */}
      {confetti.map((c) => (
        <div
          key={c.id}
          className="absolute rounded-sm pointer-events-none"
          style={{
            left: `${c.x}%`,
            top: "-20px",
            width: `${c.size}px`,
            height: `${c.size * 0.6}px`,
            backgroundColor: c.color,
            animation: `confetti-fall ${2 + Math.random()}s ease-in ${c.delay}s forwards`,
            opacity: 0.8,
          }}
        />
      ))}

      <div className={`max-w-xl mx-auto relative z-10 transition-all duration-700 ${ready ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
        {/* Hero */}
        <div className="text-center mb-8">
          <div className="text-8xl mb-4 animate-bounce-in">🎉</div>
          <h1 className="text-4xl font-black text-coklat">
            Selamat, <span className="text-mint">{profil?.nama ?? "Pahlawan"}!</span>
          </h1>
          <p className="text-xl font-bold text-coklat/60 mt-2">
            Kamu telah menyelesaikan semua petualangan di Pasar KAWAN!
          </p>
        </div>

        {/* Total Bintang */}
        <div className="bg-white rounded-3xl border-4 border-yellow-warm shadow-lg p-6 mb-6 text-center">
          <p className="text-coklat/60 font-bold mb-2">Total Bintang</p>
          <div className="flex justify-center gap-1 mb-2">
            {Array.from({ length: 9 }).map((_, i) => (
              <span key={i} className={`text-3xl ${i < totalBintang ? "opacity-100" : "opacity-20"}`}>⭐</span>
            ))}
          </div>
          <p className="text-5xl font-black text-yellow-warm">{totalBintang} / 9</p>
        </div>

        {/* Ringkasan Quest */}
        <div className="bg-white rounded-3xl border-2 border-border shadow-md p-5 mb-6">
          <h2 className="font-black text-xl text-coklat mb-4">Ringkasan Perjalanan</h2>
          {[
            { label: "Quest 1: Lapak Gizi 🥗", progres: quest1, icon: "🥗" },
            { label: "Quest 2: Kasir Bersuara 🛒", progres: quest2, icon: "🛒" },
            { label: "Quest 3: Jalan Keluar 🗑️", progres: quest3, icon: "🗑️" },
          ].map(({ label, progres, icon }) => (
            <div key={label} className="flex items-center justify-between py-3 border-b border-cream-dark last:border-0">
              <span className="font-bold text-coklat">{label}</span>
              <div className="flex gap-0.5">
                {Array.from({ length: 3 }).map((_, i) => (
                  <span key={i} className={`text-xl ${i < (progres?.bintang ?? 0) ? "opacity-100" : "opacity-20"}`}>⭐</span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Koleksi Stiker */}
        <div className="bg-white rounded-3xl border-2 border-border shadow-md p-5 mb-8">
          <h2 className="font-black text-xl text-coklat mb-4">Stiker Koleksi 🏆</h2>
          <div className="grid grid-cols-2 gap-3">
            {STIKER_DATA.map((s) => {
              const didapat = stiker.includes(s.id);
              return (
                <div
                  key={s.id}
                  className={`rounded-2xl border-2 p-4 flex items-center gap-3 transition-all ${
                    didapat
                      ? "bg-yellow-warm/20 border-yellow-warm shadow-sm"
                      : "bg-cream border-border opacity-40"
                  }`}
                >
                  <span className="text-4xl">{s.emoji}</span>
                  <div>
                    <p className="font-black text-coklat text-sm">{s.nama}</p>
                    {didapat ? (
                      <p className="text-xs text-green-600 font-bold">✓ Didapat!</p>
                    ) : (
                      <p className="text-xs text-coklat/40">Belum terkumpul</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tombol Aksi */}
        <div className="flex flex-col gap-3">
          <button
            onClick={() => router.push("/dashboard")}
            className="w-full min-h-[60px] bg-mint text-white text-xl font-black rounded-2xl shadow-lg border-2 border-mint-dark hover:bg-mint-dark transition-all"
            id="btn-lihat-hasil"
          >
            📊 Lihat Hasil Lengkap
          </button>
          <button
            onClick={() => router.push("/profil")}
            className="w-full min-h-[56px] bg-white text-coklat text-xl font-bold rounded-2xl shadow-md border-2 border-border hover:shadow-lg transition-all"
            id="btn-main-lagi"
          >
            🎮 Main Lagi
          </button>
        </div>
      </div>
    </div>
  );
}
