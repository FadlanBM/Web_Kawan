// ============================================================
// KAWAN — Storage Layer (async, via SQLite API routes)
// Semua fungsi kini memanggil Next.js Route Handlers yang
// menyimpan data ke SQLite via better-sqlite3 di server.
// ============================================================
import { ProfilSiswa, ProgresQuest, PengaturanAksesibilitas } from "@/app/types";

// ---- Helpers ----

async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: { "Content-Type": "application/json", ...options?.headers },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API error ${res.status}: ${text}`);
  }
  return res.json() as Promise<T>;
}

// ---- Profil ----

export async function getAllProfil(): Promise<ProfilSiswa[]> {
  return apiFetch<ProfilSiswa[]>("/api/profil");
}

export async function getProfilById(id: string): Promise<ProfilSiswa | null> {
  try {
    return await apiFetch<ProfilSiswa>(`/api/profil/${id}`);
  } catch {
    return null;
  }
}

export async function createProfil(nama: string, foto?: string): Promise<ProfilSiswa> {
  return apiFetch<ProfilSiswa>("/api/profil", {
    method: "POST",
    body: JSON.stringify({ nama, foto }),
  });
}

export async function saveProfil(profil: ProfilSiswa): Promise<ProfilSiswa> {
  return apiFetch<ProfilSiswa>(`/api/profil/${profil.id}`, {
    method: "PUT",
    body: JSON.stringify({
      nama: profil.nama,
      foto: profil.foto,
      jalur: profil.jalur,
      progres: profil.progres,
    }),
  });
}

export async function updateProgresQuest(
  profilId: string,
  questId: 1 | 2 | 3,
  progres: ProgresQuest
): Promise<ProfilSiswa | null> {
  try {
    return await apiFetch<ProfilSiswa>(`/api/profil/${profilId}`, {
      method: "PUT",
      body: JSON.stringify({ questId, progresQuest: progres }),
    });
  } catch {
    return null;
  }
}

export async function tambahStiker(profilId: string, stikerId: string): Promise<ProfilSiswa | null> {
  try {
    return await apiFetch<ProfilSiswa>(`/api/profil/${profilId}`, {
      method: "PUT",
      body: JSON.stringify({ tambahStiker: stikerId }),
    });
  } catch {
    return null;
  }
}

export async function resetProgres(profilId: string): Promise<ProfilSiswa | null> {
  try {
    return await apiFetch<ProfilSiswa>(`/api/profil/${profilId}`, {
      method: "PUT",
      body: JSON.stringify({ resetProgres: true }),
    });
  } catch {
    return null;
  }
}

export async function deleteProfil(profilId: string): Promise<boolean> {
  try {
    await apiFetch<{ success: boolean }>(`/api/profil/${profilId}`, {
      method: "DELETE",
    });
    return true;
  } catch {
    return false;
  }
}

// ---- Aksesibilitas ----

export async function getAksesibilitas(): Promise<PengaturanAksesibilitas> {
  try {
    return await apiFetch<PengaturanAksesibilitas>("/api/aksesibilitas");
  } catch {
    // Fallback ke default jika server belum siap
    return {
      volume: 0.7,
      ukuranTeks: "normal",
      kecepatanNarasi: 1,
      animasiDinonaktifkan: false,
    };
  }
}

export async function saveAksesibilitas(
  pengaturan: Partial<PengaturanAksesibilitas>
): Promise<PengaturanAksesibilitas> {
  return apiFetch<PengaturanAksesibilitas>("/api/aksesibilitas", {
    method: "PUT",
    body: JSON.stringify(pengaturan),
  });
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
