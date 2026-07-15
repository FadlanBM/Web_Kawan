// ============================================================
// KAWAN — SQLite Database Singleton
// ============================================================
import Database from "better-sqlite3";
import path from "path";

const DB_PATH = path.join(process.cwd(), "kawan.db");

// Singleton — satu instance untuk seluruh server lifecycle
let _db: Database.Database | null = null;

function getDb(): Database.Database {
  if (_db) return _db;

  _db = new Database(DB_PATH, {
    // verbose: process.env.NODE_ENV === "development" ? console.log : undefined,
  });

  // WAL mode untuk performa lebih baik di concurrent reads
  _db.pragma("journal_mode = WAL");
  _db.pragma("foreign_keys = ON");

  migrate(_db);
  return _db;
}

// ============================================================
// Schema Migration
// ============================================================
function migrate(db: Database.Database): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS profil (
      id              TEXT PRIMARY KEY,
      nama            TEXT NOT NULL,
      foto            TEXT,
      jalur           TEXT,
      tanggal_mulai   TEXT NOT NULL,
      progres         TEXT NOT NULL DEFAULT '{}'
    );

    CREATE TABLE IF NOT EXISTS aksesibilitas (
      id                    TEXT PRIMARY KEY DEFAULT 'default',
      volume                REAL NOT NULL DEFAULT 0.7,
      ukuran_teks           TEXT NOT NULL DEFAULT 'normal',
      kecepatan_narasi      REAL NOT NULL DEFAULT 1.0,
      animasi_dinonaktifkan INTEGER NOT NULL DEFAULT 0
    );

    -- Pastikan baris default aksesibilitas selalu ada
    INSERT OR IGNORE INTO aksesibilitas (id) VALUES ('default');
  `);
}

// ============================================================
// Profil CRUD
// ============================================================

export interface DbProfilRow {
  id: string;
  nama: string;
  foto: string | null;
  jalur: string | null;
  tanggal_mulai: string;
  progres: string; // JSON string
}

export function dbGetAllProfil(): DbProfilRow[] {
  const db = getDb();
  return db.prepare("SELECT * FROM profil ORDER BY tanggal_mulai ASC").all() as DbProfilRow[];
}

export function dbGetProfilById(id: string): DbProfilRow | null {
  const db = getDb();
  return (db.prepare("SELECT * FROM profil WHERE id = ?").get(id) as DbProfilRow) ?? null;
}

export function dbUpsertProfil(row: DbProfilRow): void {
  const db = getDb();
  db.prepare(`
    INSERT INTO profil (id, nama, foto, jalur, tanggal_mulai, progres)
    VALUES (@id, @nama, @foto, @jalur, @tanggal_mulai, @progres)
    ON CONFLICT(id) DO UPDATE SET
      nama            = excluded.nama,
      foto            = excluded.foto,
      jalur           = excluded.jalur,
      tanggal_mulai   = excluded.tanggal_mulai,
      progres         = excluded.progres
  `).run(row);
}

export function dbDeleteProfil(id: string): void {
  const db = getDb();
  db.prepare("DELETE FROM profil WHERE id = ?").run(id);
}

// ============================================================
// Aksesibilitas CRUD
// ============================================================

export interface DbAksesibilitasRow {
  id: string;
  volume: number;
  ukuran_teks: string;
  kecepatan_narasi: number;
  animasi_dinonaktifkan: number; // 0 | 1 (SQLite boolean)
}

export function dbGetAksesibilitas(): DbAksesibilitasRow {
  const db = getDb();
  return db
    .prepare("SELECT * FROM aksesibilitas WHERE id = 'default'")
    .get() as DbAksesibilitasRow;
}

export function dbSaveAksesibilitas(row: Omit<DbAksesibilitasRow, "id">): void {
  const db = getDb();
  db.prepare(`
    UPDATE aksesibilitas SET
      volume                = @volume,
      ukuran_teks           = @ukuran_teks,
      kecepatan_narasi      = @kecepatan_narasi,
      animasi_dinonaktifkan = @animasi_dinonaktifkan
    WHERE id = 'default'
  `).run(row);
}
