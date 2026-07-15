// ============================================================
// KAWAN — API: GET /api/profil/[id]   → ambil profil
//              PUT /api/profil/[id]   → update profil (jalur, progres, stiker, dll)
//              DELETE /api/profil/[id] → hapus profil
// ============================================================
import { dbGetProfilById, dbUpsertProfil, dbDeleteProfil } from "@/app/lib/db";
import { ProfilSiswa, ProgresQuest } from "@/app/types";

function rowToProfil(row: NonNullable<ReturnType<typeof dbGetProfilById>>): ProfilSiswa {
  return {
    id: row.id,
    nama: row.nama,
    foto: row.foto ?? undefined,
    jalur: (row.jalur as ProfilSiswa["jalur"]) ?? null,
    tanggalMulai: row.tanggal_mulai,
    progres: JSON.parse(row.progres),
  };
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const row = dbGetProfilById(id);
    if (!row) return Response.json({ error: "Profil tidak ditemukan" }, { status: 404 });
    return Response.json(rowToProfil(row));
  } catch (err) {
    console.error("[GET /api/profil/[id]]", err);
    return Response.json({ error: "Gagal mengambil profil" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const existing = dbGetProfilById(id);
    if (!existing) return Response.json({ error: "Profil tidak ditemukan" }, { status: 404 });

    const body = await request.json() as Partial<ProfilSiswa> & {
      questId?: 1 | 2 | 3;
      progresQuest?: ProgresQuest;
      tambahStiker?: string;
      resetProgres?: boolean;
    };

    // Parse progres yang ada
    const currentProgres = JSON.parse(existing.progres);

    let newProgres = { ...currentProgres };
    let newJalur = body.jalur !== undefined ? body.jalur : existing.jalur;
    let newNama = body.nama ?? existing.nama;
    let newFoto = body.foto !== undefined ? (body.foto ?? null) : existing.foto;

    // Update progres quest spesifik
    if (body.questId && body.progresQuest) {
      const key = `quest${body.questId}`;
      newProgres = {
        ...newProgres,
        [key]: body.progresQuest,
        totalBintang:
          (key === "quest1" ? body.progresQuest.bintang : currentProgres.quest1?.bintang ?? 0) +
          (key === "quest2" ? body.progresQuest.bintang : currentProgres.quest2?.bintang ?? 0) +
          (key === "quest3" ? body.progresQuest.bintang : currentProgres.quest3?.bintang ?? 0),
      };
    }

    // Tambah stiker
    if (body.tambahStiker && !newProgres.stiker?.includes(body.tambahStiker)) {
      newProgres = {
        ...newProgres,
        stiker: [...(newProgres.stiker ?? []), body.tambahStiker],
      };
    }

    // Reset progres
    if (body.resetProgres) {
      newProgres = { quest1: null, quest2: null, quest3: null, stiker: [], totalBintang: 0 };
      newJalur = null;
    }

    // Jika body.progres dikirim langsung (full replace)
    if (body.progres && !body.questId && !body.tambahStiker && !body.resetProgres) {
      newProgres = body.progres;
    }

    dbUpsertProfil({
      id,
      nama: newNama,
      foto: newFoto,
      jalur: newJalur ?? null,
      tanggal_mulai: existing.tanggal_mulai,
      progres: JSON.stringify(newProgres),
    });

    const updated = dbGetProfilById(id)!;
    return Response.json(rowToProfil(updated));
  } catch (err) {
    console.error("[PUT /api/profil/[id]]", err);
    return Response.json({ error: "Gagal update profil" }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const existing = dbGetProfilById(id);
    if (!existing) return Response.json({ error: "Profil tidak ditemukan" }, { status: 404 });
    dbDeleteProfil(id);
    return Response.json({ success: true });
  } catch (err) {
    console.error("[DELETE /api/profil/[id]]", err);
    return Response.json({ error: "Gagal hapus profil" }, { status: 500 });
  }
}
