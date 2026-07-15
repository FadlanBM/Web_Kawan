// ============================================================
// KAWAN — API: GET /api/aksesibilitas  → ambil pengaturan
//              PUT /api/aksesibilitas  → simpan pengaturan
// ============================================================
import { dbGetAksesibilitas, dbSaveAksesibilitas } from "@/app/lib/db";
import { PengaturanAksesibilitas } from "@/app/types";

function rowToAksesibilitas(row: ReturnType<typeof dbGetAksesibilitas>): PengaturanAksesibilitas {
  return {
    volume: row.volume,
    ukuranTeks: row.ukuran_teks as PengaturanAksesibilitas["ukuranTeks"],
    kecepatanNarasi: row.kecepatan_narasi,
    animasiDinonaktifkan: row.animasi_dinonaktifkan === 1,
  };
}

export async function GET() {
  try {
    const row = dbGetAksesibilitas();
    return Response.json(rowToAksesibilitas(row));
  } catch (err) {
    console.error("[GET /api/aksesibilitas]", err);
    return Response.json({ error: "Gagal mengambil pengaturan" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json() as Partial<PengaturanAksesibilitas>;
    const current = dbGetAksesibilitas();

    dbSaveAksesibilitas({
      volume: body.volume ?? current.volume,
      ukuran_teks: body.ukuranTeks ?? current.ukuran_teks,
      kecepatan_narasi: body.kecepatanNarasi ?? current.kecepatan_narasi,
      animasi_dinonaktifkan: body.animasiDinonaktifkan !== undefined
        ? (body.animasiDinonaktifkan ? 1 : 0)
        : current.animasi_dinonaktifkan,
    });

    const updated = dbGetAksesibilitas();
    return Response.json(rowToAksesibilitas(updated));
  } catch (err) {
    console.error("[PUT /api/aksesibilitas]", err);
    return Response.json({ error: "Gagal simpan pengaturan" }, { status: 500 });
  }
}
