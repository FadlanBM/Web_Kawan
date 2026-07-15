// ============================================================
// KAWAN — Game Content Data
// ============================================================
import { MakananItem, PecsKartu, SampahItem } from "@/app/types";

// ---- Quest 1: Lapak Gizi ----

export const MAKANAN_DATA: MakananItem[] = [
  // Sehat
  { id: "apel", nama: "Apel", emoji: "🍎", kelompok: "sehat", kategoriGizi: "buah", warna: "#FF6B6B" },
  { id: "pisang", nama: "Pisang", emoji: "🍌", kelompok: "sehat", kategoriGizi: "buah", warna: "#FFD166" },
  { id: "wortel", nama: "Wortel", emoji: "🥕", kelompok: "sehat", kategoriGizi: "sayur", warna: "#F4A261" },
  { id: "bayam", nama: "Bayam", emoji: "🥬", kelompok: "sehat", kategoriGizi: "sayur", warna: "#7EC8A4" },
  { id: "tahu", nama: "Tahu", emoji: "🟡", kelompok: "sehat", kategoriGizi: "protein", warna: "#FFD166" },
  { id: "telur", nama: "Telur", emoji: "🥚", kelompok: "sehat", kategoriGizi: "protein", warna: "#FFF3CD" },
  { id: "nasi", nama: "Nasi", emoji: "🍚", kelompok: "sehat", kategoriGizi: "karbohidrat", warna: "#F8F4EF" },
  { id: "roti", nama: "Roti Gandum", emoji: "🍞", kelompok: "sehat", kategoriGizi: "karbohidrat", warna: "#C49A6C" },
  // Tidak Sehat
  { id: "permen", nama: "Permen", emoji: "🍬", kelompok: "tidak-sehat", warna: "#FF9FF3" },
  { id: "keripik", nama: "Keripik", emoji: "🍟", kelompok: "tidak-sehat", warna: "#FFEAA7" },
  { id: "soda", nama: "Minuman Soda", emoji: "🥤", kelompok: "tidak-sehat", warna: "#74B9FF" },
  { id: "cokelat-bar", nama: "Cokelat Manis", emoji: "🍫", kelompok: "tidak-sehat", warna: "#8B4513" },
];

// Jalur Pemula: 4 item (2 sehat, 2 tidak sehat)
export const MAKANAN_PEMULA = MAKANAN_DATA.filter((m) =>
  ["apel", "pisang", "permen", "keripik"].includes(m.id)
);

// Jalur Lanjutan: 8 item (semua kategori gizi)
export const MAKANAN_LANJUTAN = MAKANAN_DATA.filter((m) =>
  ["apel", "wortel", "tahu", "nasi", "pisang", "roti", "bayam", "telur"].includes(m.id)
);

export const KATEGORI_GIZI = [
  { id: "karbohidrat", nama: "Karbohidrat", emoji: "🍚", warna: "#F4D03F", deskripsi: "Sumber energi utama" },
  { id: "protein", nama: "Protein", emoji: "🥚", warna: "#E59866", deskripsi: "Pembangun otot" },
  { id: "sayur", nama: "Sayuran", emoji: "🥦", warna: "#58D68D", deskripsi: "Kaya vitamin" },
  { id: "buah", nama: "Buah-buahan", emoji: "🍎", warna: "#EC7063", deskripsi: "Kaya serat" },
];

// ---- Quest 2: Kasir Bersuara (PECS Digital) ----

export const PECS_KARTU: PecsKartu[] = [
  { id: "saya", teks: "Saya", emoji: "👤" },
  { id: "mau", teks: "Mau", emoji: "👉" },
  { id: "beli", teks: "Beli", emoji: "🛒" },
  { id: "apel-pecs", teks: "Apel", emoji: "🍎" },
  { id: "pisang-pecs", teks: "Pisang", emoji: "🍌" },
  { id: "terima-kasih", teks: "Terima Kasih", emoji: "🙏" },
  { id: "minta-tolong", teks: "Minta Tolong", emoji: "🙋" },
  { id: "antre", teks: "Antre", emoji: "👫" },
  { id: "bayar", teks: "Bayar", emoji: "💰" },
];

// Skenario Quest 2
export interface SkenarioPECS {
  id: string;
  narasi: string;
  susunanBenar: string[]; // ID kartu dalam urutan benar
  jawabanAlternatif?: string[][]; // susunan alternatif yang diterima
  responKasir: string;
  promptBerikutnya?: string;
  kartuHint?: string; // ID kartu yang akan blink sebagai hint
}

export const SKENARIO_PEMULA: SkenarioPECS[] = [
  {
    id: "skenario1-pemula",
    narasi: "Kamu mau beli apel. Pilih kartu yang benar!",
    susunanBenar: ["saya", "mau"],
    responKasir: "Boleh! Apelnya sudah siap.",
    promptBerikutnya: "Jangan lupa ucapkan terima kasih!",
    kartuHint: "terima-kasih",
  },
];

export const SKENARIO_LANJUTAN: SkenarioPECS[] = [
  {
    id: "skenario1-lanjutan",
    narasi: "Wah, kamu sudah sampai di kasir! Apa yang ingin kamu katakan?",
    susunanBenar: ["saya", "mau", "beli", "apel-pecs"],
    jawabanAlternatif: [["saya", "mau", "beli", "pisang-pecs"]],
    responKasir: "Tentu! Ini buahnya. Silakan!",
    promptBerikutnya: "Jangan lupa ucapkan terima kasih!",
    kartuHint: "terima-kasih",
  },
  {
    id: "skenario2-lanjutan",
    narasi: "Ada orang di depanmu. Apa yang sebaiknya kamu lakukan?",
    susunanBenar: ["antre"],
    responKasir: "Pintar! Kamu sabar menunggu giliran.",
    kartuHint: "antre",
  },
];

// ---- Quest 3: Jalan Keluar Pasar (Pilah Sampah) ----

export const SAMPAH_DATA: SampahItem[] = [
  // Organik
  { id: "kulit-pisang", nama: "Kulit Pisang", emoji: "🍌", jenis: "organik", deskripsi: "Bisa menjadi kompos" },
  { id: "sisa-sayur", nama: "Sisa Sayuran", emoji: "🥬", jenis: "organik", deskripsi: "Bisa terurai oleh alam" },
  { id: "tulang-ikan", nama: "Tulang Ikan", emoji: "🐟", jenis: "organik", deskripsi: "Sisa makanan yang bisa terurai" },
  { id: "daun-kering", nama: "Daun Kering", emoji: "🍂", jenis: "organik", deskripsi: "Berasal dari alam" },
  // Anorganik
  { id: "botol-plastik", nama: "Botol Plastik", emoji: "🍶", jenis: "anorganik", deskripsi: "Harus didaur ulang" },
  { id: "kaleng", nama: "Kaleng", emoji: "🥫", jenis: "anorganik", deskripsi: "Dapat didaur ulang" },
  { id: "kantong-plastik", nama: "Kantong Plastik", emoji: "🛍️", jenis: "anorganik", deskripsi: "Tidak bisa terurai" },
  { id: "kertas-koran", nama: "Kertas Koran", emoji: "📰", jenis: "anorganik", deskripsi: "Dapat didaur ulang" },
];

// Jalur Pemula: 4 item
export const SAMPAH_PEMULA = SAMPAH_DATA.filter((s) =>
  ["kulit-pisang", "sisa-sayur", "botol-plastik", "kantong-plastik"].includes(s.id)
);

// Jalur Lanjutan: semua
export const SAMPAH_LANJUTAN = SAMPAH_DATA;

// ---- Stiker Koleksi ----

export const STIKER_DATA = [
  { id: "chef", emoji: "👨‍🍳", nama: "Ahli Gizi", questId: 1 },
  { id: "komunikator", emoji: "🗣️", nama: "Komunikator Hebat", questId: 2 },
  { id: "pejuang-lingkungan", emoji: "🌱", nama: "Pejuang Lingkungan", questId: 3 },
  { id: "bintang-kawan", emoji: "⭐", nama: "Bintang KAWAN", questId: null }, // semua quest selesai
];

// ---- Dialog Narasi ----

export const DIALOG_INTRO = [
  {
    id: "intro-1",
    karakter: "KAWAN",
    teks: "Halo! Selamat datang di Pasar KAWAN! 👋",
    audio: null,
  },
  {
    id: "intro-2",
    karakter: "KAWAN",
    teks: "Di sini kamu akan belajar banyak hal menyenangkan!",
    audio: null,
  },
  {
    id: "intro-3",
    karakter: "KAWAN",
    teks: "Siap untuk petualangan? Ayo kita mulai! 🌟",
    audio: null,
  },
];
