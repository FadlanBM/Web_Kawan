// ============================================================
// KAWAN — Storage Layer (Client-side LocalStorage)
// Semua data profil dan aksesibilitas disimpan secara lokal
// di browser user.
// ============================================================
import { ProfilSiswa, ProgresQuest, PengaturanAksesibilitas } from "@/app/types";

// ---- Key Constants ----
const PROFIL_STORAGE_KEY = "kawan_semua_profil";
const AKSESIBILITAS_STORAGE_KEY = "kawan_aksesibilitas";

// Helper helper untuk browser storage
function getLocalStorageItem<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") return defaultValue;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (err) {
    console.error(`Error reading ${key} from localStorage:`, err);
    return defaultValue;
  }
}

function setLocalStorageItem<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Error writing ${key} to localStorage:`, err);
  }
}

// ---- Profil ----

export async function getAllProfil(): Promise<ProfilSiswa[]> {
  return getLocalStorageItem<ProfilSiswa[]>(PROFIL_STORAGE_KEY, []);
}

export async function getProfilById(id: string): Promise<ProfilSiswa | null> {
  const profils = await getAllProfil();
  return profils.find((p) => p.id === id) || null;
}

export async function createProfil(nama: string, foto?: string): Promise<ProfilSiswa> {
  const profils = await getAllProfil();
  const newProfil: ProfilSiswa = {
    id: `profil-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    nama,
    foto: foto || undefined,
    jalur: null,
    tanggalMulai: new Date().toISOString(),
    progres: {
      quest1: null,
      quest2: null,
      quest3: null,
      stiker: [],
      totalBintang: 0,
    },
  };
  
  profils.push(newProfil);
  setLocalStorageItem(PROFIL_STORAGE_KEY, profils);
  return newProfil;
}

export async function saveProfil(profil: ProfilSiswa): Promise<ProfilSiswa> {
  const profils = await getAllProfil();
  const index = profils.findIndex((p) => p.id === profil.id);
  if (index !== -1) {
    profils[index] = profil;
  } else {
    profils.push(profil);
  }
  setLocalStorageItem(PROFIL_STORAGE_KEY, profils);
  return profil;
}

export async function updateProgresQuest(
  profilId: string,
  questId: 1 | 2 | 3,
  progres: ProgresQuest
): Promise<ProfilSiswa | null> {
  const profil = await getProfilById(profilId);
  if (!profil) return null;

  const key = `quest${questId}` as "quest1" | "quest2" | "quest3";
  
  // Hitung total bintang baru
  const q1Bintang = key === "quest1" ? progres.bintang : profil.progres.quest1?.bintang ?? 0;
  const q2Bintang = key === "quest2" ? progres.bintang : profil.progres.quest2?.bintang ?? 0;
  const q3Bintang = key === "quest3" ? progres.bintang : profil.progres.quest3?.bintang ?? 0;
  const totalBintang = q1Bintang + q2Bintang + q3Bintang;

  const updatedProfil: ProfilSiswa = {
    ...profil,
    progres: {
      ...profil.progres,
      [key]: progres,
      totalBintang,
    },
  };

  return saveProfil(updatedProfil);
}

export async function tambahStiker(profilId: string, stikerId: string): Promise<ProfilSiswa | null> {
  const profil = await getProfilById(profilId);
  if (!profil) return null;

  if (profil.progres.stiker.includes(stikerId)) return profil;

  const updatedProfil: ProfilSiswa = {
    ...profil,
    progres: {
      ...profil.progres,
      stiker: [...profil.progres.stiker, stikerId],
    },
  };

  return saveProfil(updatedProfil);
}

export async function resetProgres(profilId: string): Promise<ProfilSiswa | null> {
  const profil = await getProfilById(profilId);
  if (!profil) return null;

  const updatedProfil: ProfilSiswa = {
    ...profil,
    jalur: null,
    progres: {
      quest1: null,
      quest2: null,
      quest3: null,
      stiker: [],
      totalBintang: 0,
    },
  };

  return saveProfil(updatedProfil);
}

export async function deleteProfil(profilId: string): Promise<boolean> {
  const profils = await getAllProfil();
  const filtered = profils.filter((p) => p.id !== profilId);
  setLocalStorageItem(PROFIL_STORAGE_KEY, filtered);
  return true;
}

// ---- Aksesibilitas ----

const DEFAULT_AKSESIBILITAS: PengaturanAksesibilitas = {
  volume: 0.7,
  ukuranTeks: "normal",
  kecepatanNarasi: 1,
  animasiDinonaktifkan: false,
};

export async function getAksesibilitas(): Promise<PengaturanAksesibilitas> {
  return getLocalStorageItem<PengaturanAksesibilitas>(AKSESIBILITAS_STORAGE_KEY, DEFAULT_AKSESIBILITAS);
}

export async function saveAksesibilitas(
  pengaturan: Partial<PengaturanAksesibilitas>
): Promise<PengaturanAksesibilitas> {
  const current = await getAksesibilitas();
  const updated = { ...current, ...pengaturan };
  setLocalStorageItem(AKSESIBILITAS_STORAGE_KEY, updated);
  return updated;
}

// ---- Profil Aktif (session — tetap di sessionStorage) ----
// ID profil aktif disimpan di sessionStorage agar tidak
// mengganggu sesi guru/siswa berbeda di tab yang sama.

export function getProfilAktifId(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem("kawan_profil_aktif_id");
}

export function setProfilAktifId(id: string): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem("kawan_profil_aktif_id", id);
}
