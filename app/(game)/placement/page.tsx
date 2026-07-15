"use client";

// ============================================================
// KAWAN — Adaptive Placement Gate (SQLite-backed)
// ============================================================
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useGame } from "@/app/contexts/GameContext";
import { saveProfil } from "@/app/lib/storage";
import { JalurBermain, ProfilSiswa } from "@/app/types";

interface Kriteria {
  id: string;
  pertanyaan: string;
  icon: string;
  deskripsiPemula: string;
  deskripsiLanjutan: string;
}

const KRITERIA: Kriteria[] = [
  {
    id: "kontak-mata",
    pertanyaan: "Kontak mata siswa",
    icon: "👁️",
    deskripsiPemula: "Kurang dari 3 detik per interaksi",
    deskripsiLanjutan: "3 detik atau lebih per interaksi",
  },
  {
    id: "verbalisasi",
    pertanyaan: "Kemampuan berbicara",
    icon: "🗣️",
    deskripsiPemula: "Belum bisa mengucapkan kata",
    deskripsiLanjutan: "Bisa mengucapkan 1-2 kata atau lebih",
  },
  {
    id: "duduk-tenang",
    pertanyaan: "Durasi duduk tenang",
    icon: "🪑",
    deskripsiPemula: "Kurang dari 15 menit",
    deskripsiLanjutan: "15 menit atau lebih",
  },
];

type PilihanKriteria = Record<string, "pemula" | "lanjutan" | null>;

export default function PlacementPage() {
  const router = useRouter();
  const { state, dispatch } = useGame();
  const [loading, setLoading] = useState(false);
  const [pilihan, setPilihan] = useState<PilihanKriteria>({
    "kontak-mata": null,
    verbalisasi: null,
    "duduk-tenang": null,
  });
  const [hasilJalur, setHasilJalur] = useState<JalurBermain>(null);
  const [showResult, setShowResult] = useState(false);

  const semuaTerisi = Object.values(pilihan).every((v) => v !== null);

  const handlePilih = (kriteriaId: string, nilai: "pemula" | "lanjutan") => {
    setPilihan((prev) => ({ ...prev, [kriteriaId]: nilai }));
  };

  const hitungJalur = (): JalurBermain => {
    const jumlahLanjutan = Object.values(pilihan).filter((v) => v === "lanjutan").length;
    return jumlahLanjutan >= 2 ? "lanjutan" : "pemula";
  };

  const handleSubmit = async () => {
    if (!semuaTerisi || !state.profilAktif) return;
    setLoading(true);
    try {
      const jalur = hitungJalur();
      setHasilJalur(jalur);

      // Update profil dengan jalur ke SQLite
      const updatedProfil: ProfilSiswa = { ...state.profilAktif, jalur };
      const saved = await saveProfil(updatedProfil);
      dispatch({ type: "SET_PROFIL_AKTIF", payload: saved });
      dispatch({
        type: "SET_SEMUA_PROFIL",
        payload: state.semuaProfil.map((p) => (p.id === saved.id ? saved : p)),
      });
      setShowResult(true);
    } catch (err) {
      console.error("Gagal menyimpan jalur:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!state.profilAktif) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-coklat/60 font-bold">Pilih profil siswa terlebih dahulu.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream px-4 py-8">
      <div className="max-w-xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <span className="text-6xl">📋</span>
          <h1 className="text-3xl font-black text-coklat mt-3">Penempatan Siswa</h1>
          <p className="text-coklat/60 font-semibold mt-1">
            Untuk: <span className="text-mint font-black">{state.profilAktif.nama}</span>
          </p>
          <p className="text-coklat/50 mt-2 text-sm">
            Guru / Terapis: Jawab pertanyaan di bawah berdasarkan kemampuan siswa
          </p>
        </div>

        {/* Kriteria */}
        <div className="flex flex-col gap-5 mb-8">
          {KRITERIA.map((k, idx) => (
            <div key={k.id} className="bg-white rounded-3xl border-2 border-border shadow-md p-5">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">{k.icon}</span>
                <div>
                  <span className="text-xs font-bold text-coklat/40 uppercase tracking-wide">Kriteria {idx + 1}</span>
                  <p className="font-black text-xl text-coklat">{k.pertanyaan}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handlePilih(k.id, "pemula")}
                  className={`min-h-[80px] rounded-2xl border-2 p-3 text-left transition-all font-bold ${
                    pilihan[k.id] === "pemula"
                      ? "bg-yellow-warm/20 border-yellow-warm text-yellow-800 scale-[1.02]"
                      : "bg-cream border-border text-coklat hover:border-yellow-warm/60"
                  }`}
                  id={`btn-pemula-${k.id}`}
                >
                  <div className="text-2xl mb-1">🌱</div>
                  <div className="text-sm">{k.deskripsiPemula}</div>
                </button>

                <button
                  onClick={() => handlePilih(k.id, "lanjutan")}
                  className={`min-h-[80px] rounded-2xl border-2 p-3 text-left transition-all font-bold ${
                    pilihan[k.id] === "lanjutan"
                      ? "bg-lavender/20 border-lavender text-purple-800 scale-[1.02]"
                      : "bg-cream border-border text-coklat hover:border-lavender/60"
                  }`}
                  id={`btn-lanjutan-${k.id}`}
                >
                  <div className="text-2xl mb-1">🚀</div>
                  <div className="text-sm">{k.deskripsiLanjutan}</div>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Tombol Submit */}
        <button
          onClick={handleSubmit}
          disabled={!semuaTerisi || loading}
          className="w-full min-h-[64px] bg-mint text-white text-2xl font-black rounded-2xl shadow-lg border-2 border-mint-dark disabled:opacity-40 disabled:cursor-not-allowed hover:bg-mint-dark transition-all"
          id="btn-tentukan-jalur"
        >
          {loading ? "Menyimpan..." : "Tentukan Jalur Bermain ✓"}
        </button>

        {!semuaTerisi && (
          <p className="text-center text-coklat/50 text-sm font-semibold mt-3">
            * Jawab semua pertanyaan terlebih dahulu
          </p>
        )}
      </div>

      {/* Modal Hasil */}
      {showResult && hasilJalur && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-3xl border-4 border-mint shadow-2xl p-8 max-w-sm w-full text-center animate-bounce-in">
            <div className="text-7xl mb-4">{hasilJalur === "pemula" ? "🌱" : "🚀"}</div>
            <h2 className="text-3xl font-black text-coklat mb-2">
              Jalur {hasilJalur === "pemula" ? "Pemula" : "Lanjutan"}!
            </h2>
            <p className="text-coklat/60 font-semibold mb-2">
              {hasilJalur === "pemula"
                ? "Pengenalan objek & warna yang menyenangkan!"
                : "Kategorisasi logika & komunikasi PECS Digital!"}
            </p>
            <div className={`inline-block px-4 py-2 rounded-full font-bold mb-6 ${
              hasilJalur === "pemula" ? "bg-yellow-warm/20 text-yellow-700" : "bg-lavender/20 text-purple-700"
            }`}>
              untuk <span className="font-black">{state.profilAktif?.nama}</span>
            </div>

            <button
              onClick={() => router.push("/intro")}
              className="w-full min-h-[60px] bg-mint text-white text-2xl font-black rounded-2xl shadow-lg hover:bg-mint-dark transition-all"
              id="btn-mulai-petualangan"
            >
              Mulai Petualangan! 🎮
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
