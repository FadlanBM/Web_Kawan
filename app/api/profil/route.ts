// ============================================================
// KAWAN — API: GET /api/profil  →  semua profil
//              POST /api/profil →  buat profil baru
// ============================================================
import { dbGetAllProfil, dbUpsertProfil } from "@/app/lib/db";
import { ProfilSiswa } from "@/app/types";

function rowToProfil(row: ReturnType<typeof dbGetAllProfil>[number]): ProfilSiswa {
  return {
    id: row.id,
    nama: row.nama,
    foto: row.foto ?? undefined,
    jalur: (row.jalur as ProfilSiswa["jalur"]) ?? null,
    tanggalMulai: row.tanggal_mulai,
    progres: JSON.parse(row.progres),
  };
}

export async function GET() {
  try {
    const rows = dbGetAllProfil();
    return Response.json(rows.map(rowToProfil));
  } catch (err) {
    console.error("[GET /api/profil]", err);
    return Response.json({ error: "Gagal mengambil data profil" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nama, foto } = body as { nama: string; foto?: string };

    if (!nama?.trim()) {
      return Response.json({ error: "Nama wajib diisi" }, { status: 400 });
    }

    const id = `siswa_${Date.now()}`;
    const tanggalMulai = new Date().toISOString();
    const progresDefault = {
      quest1: null,
      quest2: null,
      quest3: null,
      stiker: [],
      totalBintang: 0,
    };

    dbUpsertProfil({
      id,
      nama: nama.trim(),
      foto: foto ?? null,
      jalur: null,
      tanggal_mulai: tanggalMulai,
      progres: JSON.stringify(progresDefault),
    });

    const profil: ProfilSiswa = {
      id,
      nama: nama.trim(),
      foto,
      jalur: null,
      tanggalMulai,
      progres: progresDefault,
    };

    return Response.json(profil, { status: 201 });
  } catch (err) {
    console.error("[POST /api/profil]", err);
    return Response.json({ error: "Gagal membuat profil" }, { status: 500 });
  }
}
