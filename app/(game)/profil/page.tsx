"use client";

// ============================================================
// KAWAN — Pilih / Buat Profil Siswa (SQLite-backed)
// ============================================================
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useGame } from "@/app/contexts/GameContext";
import { createProfil, setProfilAktifId } from "@/app/lib/storage";
import { ProfilSiswa } from "@/app/types";

export default function ProfilPage() {
  const router = useRouter();
  const { state, dispatch, actions } = useGame();
  const [showForm, setShowForm] = useState(false);
  const [nama, setNama] = useState("");
  const [fotoPreview, setFotoPreview] = useState<string | undefined>();
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleCreateProfil = async () => {
    if (!nama.trim()) return;
    setLoading(true);
    try {
      const profil = await createProfil(nama.trim(), fotoPreview);
      dispatch({ type: "SET_SEMUA_PROFIL", payload: [...state.semuaProfil, profil] });
      setNama("");
      setFotoPreview(undefined);
      setShowForm(false);
    } catch (err) {
      console.error("Gagal membuat profil:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePilihProfil = (profil: ProfilSiswa) => {
    dispatch({ type: "SET_PROFIL_AKTIF", payload: profil });
    setProfilAktifId(profil.id);
    if (profil.jalur) {
      router.push("/intro");
    } else {
      router.push("/placement");
    }
  };

  const handleReset = async (id: string) => {
    setLoading(true);
    try {
      await actions.resetProfilProgres(id);
    } finally {
      setLoading(false);
      setConfirmDelete(null);
    }
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    try {
      await actions.deleteProfilById(id);
    } finally {
      setLoading(false);
      setConfirmDelete(null);
    }
  };

  const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setFotoPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen bg-cream px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => router.push("/")}
          className="mb-6 flex items-center gap-2 text-coklat/60 hover:text-coklat font-bold transition-colors"
          id="btn-back-splash"
        >
          ← Kembali
        </button>

        <div className="text-center mb-8">
          <span className="text-6xl">👤</span>
          <h1 className="text-4xl font-black text-coklat mt-3">Pilih Profil Siswa</h1>
          <p className="text-coklat/60 font-semibold mt-1">Siapa yang akan bermain hari ini?</p>
        </div>

        {/* Daftar profil */}
        <div className="grid gap-4 mb-6">
          {state.semuaProfil.length === 0 && (
            <div className="text-center py-12 bg-white rounded-3xl border-2 border-dashed border-border">
              <span className="text-5xl">😊</span>
              <p className="mt-3 font-bold text-coklat/60 text-lg">Belum ada profil siswa.</p>
              <p className="text-coklat/50">Tambahkan profil baru di bawah!</p>
            </div>
          )}

          {state.semuaProfil.map((profil) => (
            <div
              key={profil.id}
              className="bg-white rounded-3xl border-2 border-border shadow-md p-5 flex items-center gap-4"
            >
              <div className="flex-shrink-0">
                {profil.foto ? (
                  <img src={profil.foto} alt={profil.nama} className="w-16 h-16 rounded-full object-cover border-2 border-mint" />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-mint/20 border-2 border-mint flex items-center justify-center text-3xl">
                    😊
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-black text-xl text-coklat truncate">{profil.nama}</p>
                <div className="flex items-center gap-2 mt-1">
                  {profil.jalur ? (
                    <span className={`text-sm font-bold px-3 py-0.5 rounded-full ${profil.jalur === "pemula" ? "bg-yellow-warm/30 text-yellow-700" : "bg-lavender/30 text-purple-700"}`}>
                      Jalur {profil.jalur === "pemula" ? "Pemula 🌱" : "Lanjutan 🚀"}
                    </span>
                  ) : (
                    <span className="text-sm font-bold text-coklat/40">Belum ditempatkan</span>
                  )}
                  <span className="text-sm text-coklat/50">⭐ {profil.progres.totalBintang} bintang</span>
                </div>
              </div>

              <div className="flex flex-col gap-2 flex-shrink-0">
                <button
                  onClick={() => handlePilihProfil(profil)}
                  className="px-4 py-2 bg-mint text-white font-bold rounded-xl min-h-[44px] hover:bg-mint-dark transition-colors"
                  id={`btn-pilih-${profil.id}`}
                >
                  Pilih
                </button>
                <button
                  onClick={() => setConfirmDelete(profil.id)}
                  className="px-4 py-2 bg-cream-dark text-coklat/60 font-bold rounded-xl min-h-[44px] hover:bg-orange-soft/20 transition-colors text-sm"
                  id={`btn-opsi-${profil.id}`}
                >
                  ⋯ Opsi
                </button>
              </div>
            </div>
          ))}
        </div>

        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="w-full min-h-[60px] bg-white border-2 border-dashed border-mint text-mint text-xl font-black rounded-3xl hover:bg-mint/5 transition-colors"
            id="btn-tambah-profil"
          >
            + Tambah Profil Baru
          </button>
        )}

        {showForm && (
          <div className="bg-white rounded-3xl border-2 border-mint shadow-lg p-6 animate-bounce-in">
            <h2 className="text-2xl font-black text-coklat mb-5">Profil Baru</h2>

            <div className="flex items-center gap-4 mb-5">
              <div
                onClick={() => fileRef.current?.click()}
                className="w-20 h-20 rounded-full bg-cream-dark border-2 border-dashed border-border flex items-center justify-center cursor-pointer hover:border-mint transition-colors overflow-hidden"
              >
                {fotoPreview ? (
                  <img src={fotoPreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-3xl">📷</span>
                )}
              </div>
              <div>
                <p className="font-bold text-coklat">Foto (opsional)</p>
                <button onClick={() => fileRef.current?.click()} className="text-mint font-semibold text-sm underline">
                  Pilih foto
                </button>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFotoChange} />
              </div>
            </div>

            <div className="mb-5">
              <label className="block font-bold text-coklat mb-2" htmlFor="input-nama">
                Nama Siswa <span className="text-orange-soft">*</span>
              </label>
              <input
                id="input-nama"
                type="text"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                placeholder="Contoh: Bima, Sari..."
                className="w-full border-2 border-border rounded-2xl px-4 py-3 text-xl font-semibold text-coklat bg-cream focus:outline-none focus:border-mint transition-colors"
                onKeyDown={(e) => e.key === "Enter" && handleCreateProfil()}
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleCreateProfil}
                disabled={!nama.trim() || loading}
                className="flex-1 min-h-[52px] bg-mint text-white text-xl font-black rounded-2xl disabled:opacity-40 hover:bg-mint-dark transition-colors"
                id="btn-simpan-profil"
              >
                {loading ? "Menyimpan..." : "Simpan ✓"}
              </button>
              <button
                onClick={() => { setShowForm(false); setNama(""); setFotoPreview(undefined); }}
                className="min-h-[52px] px-6 bg-cream-dark text-coklat font-bold rounded-2xl hover:bg-cream-dark/70 transition-colors"
                id="btn-batal-profil"
              >
                Batal
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal Konfirmasi */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-3xl border-2 border-border shadow-2xl p-6 max-w-sm w-full animate-bounce-in">
            <h3 className="text-2xl font-black text-coklat mb-2">Opsi Profil</h3>
            <p className="text-coklat/60 mb-5">Pilih tindakan untuk profil ini:</p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => handleReset(confirmDelete)}
                disabled={loading}
                className="w-full min-h-[52px] bg-yellow-warm/20 text-yellow-700 font-bold text-lg rounded-2xl border-2 border-yellow-warm hover:bg-yellow-warm/30 transition-colors disabled:opacity-50"
                id="btn-reset-progres"
              >
                🔄 Reset Progres
              </button>
              <button
                onClick={() => handleDelete(confirmDelete)}
                disabled={loading}
                className="w-full min-h-[52px] bg-red-50 text-red-600 font-bold text-lg rounded-2xl border-2 border-red-200 hover:bg-red-100 transition-colors disabled:opacity-50"
                id="btn-hapus-profil"
              >
                🗑️ Hapus Profil
              </button>
              <button
                onClick={() => setConfirmDelete(null)}
                className="w-full min-h-[52px] bg-cream-dark text-coklat font-bold text-lg rounded-2xl hover:bg-cream-dark/70 transition-colors"
                id="btn-batal-opsi"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
