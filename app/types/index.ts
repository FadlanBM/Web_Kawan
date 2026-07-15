// ============================================================
// KAWAN — TypeScript Types
// ============================================================

export type JalurBermain = "pemula" | "lanjutan" | null;

export interface ProfilSiswa {
  id: string;
  nama: string;
  foto?: string; // base64 opsional
  jalur: JalurBermain;
  tanggalMulai: string;
  progres: ProgresTotal;
}

export interface ProgresTotal {
  quest1: ProgresQuest | null;
  quest2: ProgresQuest | null;
  quest3: ProgresQuest | null;
  stiker: string[]; // ID stiker yang didapat
  totalBintang: number;
}

export interface ProgresQuest {
  selesai: boolean;
  bintang: number; // 1-3
  errorRate: number; // 0-1 (persentase)
  avgResponseTime: number; // detik
  promptLevel: number; // 0 = mandiri, 1 = 1 hint, 2 = >1 hint
  completionTime: number; // detik
  sesi: SessionData[];
}

export interface SessionData {
  timestamp: string;
  errorCount: number;
  totalAttempts: number;
  responseTime: number;
  hintUsed: number;
}

export interface PengaturanAksesibilitas {
  volume: number; // 0-1
  ukuranTeks: "normal" | "besar" | "sangat-besar";
  kecepatanNarasi: number; // 0.5-2
  animasiDinonaktifkan: boolean;
}

// ---- Game Data Types ----

export interface MakananItem {
  id: string;
  nama: string;
  emoji: string;
  kelompok: "sehat" | "tidak-sehat";
  kategoriGizi?: "karbohidrat" | "protein" | "sayur" | "buah";
  warna: string;
}

export interface PecsKartu {
  id: string;
  teks: string;
  emoji: string;
  audio?: string; // path audio opsional
}

export interface SampahItem {
  id: string;
  nama: string;
  emoji: string;
  jenis: "organik" | "anorganik";
  deskripsi?: string;
}

// ---- Dashboard Types ----

export type IndikatorWarna = "hijau" | "kuning" | "merah";

export interface MetrikDashboard {
  errorRate: {
    nilai: number;
    indikator: IndikatorWarna;
  };
  responseTime: {
    nilai: number;
    indikator: IndikatorWarna;
  };
  promptLevel: {
    nilai: number;
    indikator: IndikatorWarna;
  };
}

// ---- Context Types ----

export interface GameState {
  profilAktif: ProfilSiswa | null;
  semuaProfil: ProfilSiswa[];
  currentQuest: 1 | 2 | 3 | null;
  aksesibilitas: PengaturanAksesibilitas;
}

export type GameAction =
  | { type: "SET_PROFIL_AKTIF"; payload: ProfilSiswa }
  | { type: "SET_SEMUA_PROFIL"; payload: ProfilSiswa[] }
  | { type: "UPDATE_PROGRES_QUEST"; payload: { questId: 1 | 2 | 3; progres: ProgresQuest } }
  | { type: "SET_CURRENT_QUEST"; payload: 1 | 2 | 3 | null }
  | { type: "UPDATE_AKSESIBILITAS"; payload: Partial<PengaturanAksesibilitas> }
  | { type: "TAMBAH_STIKER"; payload: string }
  | { type: "RESET_PROFIL"; payload: string }; // by id
