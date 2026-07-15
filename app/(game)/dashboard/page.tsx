"use client";

// ============================================================
// KAWAN — Dashboard Guru (Analitik Perkembangan)
// ============================================================
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGame } from "@/app/contexts/GameContext";
import { hitungMetrikDashboard } from "@/app/lib/analytics";
import { getAllProfil } from "@/app/lib/storage";
import MetricCard from "@/app/components/dashboard/MetricCard";
import { ProfilSiswa } from "@/app/types";

const PASSWORD_GURU = "guru123";

export default function DashboardPage() {
  const router = useRouter();
  const { state, dispatch } = useGame();
  const [authenticated, setAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [selectedProfil, setSelectedProfil] = useState<ProfilSiswa | null>(null);
  const [profils, setProfils] = useState<ProfilSiswa[]>([]);
  const [printMode, setPrintMode] = useState(false);

  useEffect(() => {
    getAllProfil().then(setProfils).catch(console.error);
  }, []);

  const handleLogin = () => {
    if (passwordInput === PASSWORD_GURU) {
      setAuthenticated(true);
      setPasswordError(false);
    } else {
      setPasswordError(true);
      setPasswordInput("");
    }
  };

  const handlePilihSiswa = (profil: ProfilSiswa) => {
    setSelectedProfil(profil);
  };

  const handlePrint = () => {
    setPrintMode(true);
    setTimeout(() => {
      window.print();
      setPrintMode(false);
    }, 300);
  };

  // Halaman Login
  if (!authenticated) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center px-4">
        <div className="max-w-sm w-full bg-white rounded-3xl border-2 border-border shadow-xl p-8 text-center animate-fade-in">
          <span className="text-6xl mb-4 block">👩‍🏫</span>
          <h1 className="text-3xl font-black text-coklat mb-2">Mode Guru</h1>
          <p className="text-coklat/60 font-semibold mb-6">Masukkan password untuk mengakses dashboard</p>

          <input
            type="password"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            placeholder="Password..."
            className={`w-full border-2 rounded-2xl px-4 py-3 text-xl font-semibold text-coklat bg-cream focus:outline-none transition-colors mb-1 ${
              passwordError ? "border-orange-soft" : "border-border focus:border-mint"
            }`}
            id="input-password-guru"
          />
          {passwordError && (
            <p className="text-orange-soft font-bold text-sm mb-3">Password salah, coba lagi.</p>
          )}

          <button
            onClick={handleLogin}
            className="w-full min-h-[56px] bg-mint text-white text-xl font-black rounded-2xl mt-4 hover:bg-mint-dark transition-colors border-2 border-mint-dark"
            id="btn-login-guru"
          >
            Masuk 🔓
          </button>

          <button
            onClick={() => router.push("/")}
            className="w-full min-h-[48px] bg-transparent text-coklat/60 font-bold rounded-2xl mt-3 hover:text-coklat transition-colors"
            id="btn-kembali-dari-dashboard"
          >
            ← Kembali ke Beranda
          </button>
        </div>
      </div>
    );
  }

  // Dashboard utama
  return (
    <div className="min-h-screen bg-cream px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 no-print">
          <div>
            <button onClick={() => router.push("/")} className="text-coklat/60 hover:text-coklat font-bold mb-2 flex items-center gap-1">
              ← Beranda
            </button>
            <h1 className="text-3xl font-black text-coklat">Dashboard Guru</h1>
            <p className="text-coklat/60 font-semibold">Pantau perkembangan siswa</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handlePrint}
              className="px-5 py-3 bg-white border-2 border-border text-coklat font-bold rounded-2xl hover:border-mint transition-colors min-h-[48px]"
              id="btn-cetak"
            >
              🖨️ Cetak
            </button>
            <button
              onClick={() => setAuthenticated(false)}
              className="px-5 py-3 bg-cream-dark border-2 border-border text-coklat font-bold rounded-2xl hover:bg-orange-soft/10 transition-colors min-h-[48px]"
              id="btn-logout-guru"
            >
              Keluar
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-[280px_1fr] gap-6">
          {/* Panel Daftar Siswa */}
          <div className="bg-white rounded-3xl border-2 border-border shadow-md p-5 h-fit">
            <h2 className="font-black text-xl text-coklat mb-4">Daftar Siswa</h2>
            {profils.length === 0 ? (
              <p className="text-coklat/50 text-center py-8">Belum ada profil siswa.</p>
            ) : (
              <div className="flex flex-col gap-3">
                {profils.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => handlePilihSiswa(p)}
                    className={`flex items-center gap-3 p-3 rounded-2xl border-2 text-left transition-all ${
                      selectedProfil?.id === p.id
                        ? "border-mint bg-mint/10"
                        : "border-border hover:border-mint/50 bg-cream"
                    }`}
                    id={`btn-siswa-${p.id}`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-mint/20 border border-mint flex items-center justify-center text-xl flex-shrink-0">
                      {p.foto ? <img src={p.foto} alt={p.nama} className="w-full h-full rounded-xl object-cover" /> : "😊"}
                    </div>
                    <div className="min-w-0">
                      <p className="font-black text-coklat truncate">{p.nama}</p>
                      <p className="text-xs text-coklat/50 font-semibold">
                        {p.jalur ? (p.jalur === "pemula" ? "🌱 Pemula" : "🚀 Lanjutan") : "Belum ditempatkan"}
                        {" · "}⭐{p.progres.totalBintang}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}

            <button
              onClick={() => router.push("/profil")}
              className="w-full mt-4 min-h-[48px] bg-mint/10 text-mint font-bold text-sm rounded-2xl border-2 border-mint/30 hover:bg-mint/20 transition-colors"
              id="btn-ke-profil"
            >
              + Kelola Profil
            </button>
          </div>

          {/* Panel Detail Siswa */}
          <div>
            {!selectedProfil ? (
              <div className="bg-white rounded-3xl border-2 border-dashed border-border p-12 text-center">
                <span className="text-6xl">👈</span>
                <p className="text-xl font-bold text-coklat/50 mt-4">Pilih siswa untuk melihat data perkembangan</p>
              </div>
            ) : (
              <div className="flex flex-col gap-5">
                {/* Info Siswa */}
                <div className="bg-white rounded-3xl border-2 border-border shadow-md p-5">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-mint/20 border-2 border-mint flex items-center justify-center text-3xl">
                      {selectedProfil.foto ? (
                        <img src={selectedProfil.foto} alt={selectedProfil.nama} className="w-full h-full rounded-2xl object-cover" />
                      ) : "😊"}
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-coklat">{selectedProfil.nama}</h2>
                      <div className="flex items-center gap-3 mt-1">
                        <span className={`text-sm font-bold px-3 py-1 rounded-full ${
                          selectedProfil.jalur === "pemula" ? "bg-yellow-warm/20 text-yellow-700" : "bg-lavender/20 text-purple-700"
                        }`}>
                          {selectedProfil.jalur === "pemula" ? "🌱 Jalur Pemula" : "🚀 Jalur Lanjutan"}
                        </span>
                        <span className="text-sm text-coklat/50">
                          Mulai: {new Date(selectedProfil.tanggalMulai).toLocaleDateString("id-ID")}
                        </span>
                      </div>
                    </div>
                    <div className="ml-auto text-right">
                      <p className="text-3xl font-black text-yellow-warm">⭐ {selectedProfil.progres.totalBintang}</p>
                      <p className="text-sm text-coklat/50">Total Bintang</p>
                    </div>
                  </div>
                </div>

                {/* Metrik per Quest */}
                {[
                  { questKey: "quest1" as const, label: "Quest 1: Lapak Gizi", icon: "🥗", color: "mint" },
                  { questKey: "quest2" as const, label: "Quest 2: Kasir Bersuara", icon: "🛒", color: "lavender" },
                  { questKey: "quest3" as const, label: "Quest 3: Jalan Keluar", icon: "🗑️", color: "green" },
                ].map(({ questKey, label, icon }) => {
                  const progres = selectedProfil.progres[questKey];
                  if (!progres) {
                    return (
                      <div key={questKey} className="bg-white rounded-3xl border-2 border-dashed border-border p-5 text-center">
                        <span className="text-3xl">{icon}</span>
                        <p className="font-bold text-coklat/40 mt-2">{label}</p>
                        <p className="text-sm text-coklat/30">Belum dimainkan</p>
                      </div>
                    );
                  }

                  const metrik = hitungMetrikDashboard(progres);
                  return (
                    <div key={questKey} className="bg-white rounded-3xl border-2 border-border shadow-md p-5">
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-2xl">{icon}</span>
                        <h3 className="font-black text-lg text-coklat">{label}</h3>
                        <div className="ml-auto flex gap-0.5">
                          {Array.from({ length: 3 }).map((_, i) => (
                            <span key={i} className={`text-xl ${i < progres.bintang ? "" : "opacity-20"}`}>⭐</span>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        <MetricCard
                          label="Error Rate"
                          nilai={metrik.errorRate.nilai}
                          satuan="%"
                          indikator={metrik.errorRate.indikator}
                          deskripsi="< 20% = Baik"
                          icon="❌"
                        />
                        <MetricCard
                          label="Waktu Respons"
                          nilai={metrik.responseTime.nilai}
                          satuan="det"
                          indikator={metrik.responseTime.indikator}
                          deskripsi="< 10 det = Baik"
                          icon="⏱️"
                        />
                        <MetricCard
                          label="Prompt Level"
                          nilai={metrik.promptLevel.nilai === 0 ? "Mandiri" : metrik.promptLevel.nilai === 1 ? "1 Hint" : "> 1 Hint"}
                          indikator={metrik.promptLevel.indikator}
                          deskripsi="Mandiri = Terbaik"
                          icon="💡"
                        />
                      </div>

                      <div className="mt-3 p-3 bg-cream rounded-2xl">
                        <p className="text-sm font-semibold text-coklat/60">
                          ⏱️ Waktu penyelesaian: {Math.round(progres.completionTime)} detik
                          {" · "}🎯 Total sesi: {progres.sesi.length}
                        </p>
                      </div>
                    </div>
                  );
                })}

                {/* Stiker Koleksi */}
                <div className="bg-white rounded-3xl border-2 border-border shadow-md p-5">
                  <h3 className="font-black text-lg text-coklat mb-3">🏆 Stiker Koleksi</h3>
                  <div className="flex gap-3 flex-wrap">
                    {selectedProfil.progres.stiker.map((stikerId) => {
                      const { STIKER_DATA } = require("@/app/lib/gameData");
                      const s = STIKER_DATA.find((st: { id: string }) => st.id === stikerId);
                      return s ? (
                        <div key={stikerId} className="flex items-center gap-2 bg-yellow-warm/20 border border-yellow-warm rounded-xl px-3 py-2">
                          <span className="text-2xl">{s.emoji}</span>
                          <span className="font-bold text-coklat text-sm">{s.nama}</span>
                        </div>
                      ) : null;
                    })}
                    {selectedProfil.progres.stiker.length === 0 && (
                      <p className="text-coklat/40 font-semibold">Belum ada stiker</p>
                    )}
                  </div>
                </div>

                {/* Panduan Interpretasi */}
                <div className="bg-lavender/10 rounded-3xl border-2 border-lavender p-5 no-print">
                  <h3 className="font-black text-coklat mb-3">📖 Panduan Interpretasi</h3>
                  <div className="grid grid-cols-3 gap-3 text-sm">
                    {[
                      { emoji: "🟢", label: "Hijau", desc: "Anak berkembang baik, pertahankan" },
                      { emoji: "🟡", label: "Kuning", desc: "Perlu perhatian khusus, tambah latihan" },
                      { emoji: "🔴", label: "Merah", desc: "Butuh intervensi segera dari terapis" },
                    ].map((item) => (
                      <div key={item.label} className="bg-white rounded-2xl p-3 text-center">
                        <div className="text-2xl mb-1">{item.emoji}</div>
                        <p className="font-black text-coklat">{item.label}</p>
                        <p className="text-coklat/60 text-xs">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
