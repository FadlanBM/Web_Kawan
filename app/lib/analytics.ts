// ============================================================
// KAWAN — Analytics (Kalkulasi Metrik Dashboard)
// ============================================================
import { IndikatorWarna, MetrikDashboard, ProgresQuest, SessionData } from "@/app/types";

export function hitungIndikatorErrorRate(errorRate: number): IndikatorWarna {
  if (errorRate < 0.2) return "hijau";
  if (errorRate <= 0.4) return "kuning";
  return "merah";
}

export function hitungIndikatorResponseTime(avgDetik: number): IndikatorWarna {
  if (avgDetik < 10) return "hijau";
  if (avgDetik <= 20) return "kuning";
  return "merah";
}

export function hitungIndikatorPromptLevel(level: number): IndikatorWarna {
  if (level === 0) return "hijau";
  if (level === 1) return "kuning";
  return "merah";
}

export function hitungMetrikDashboard(progres: ProgresQuest): MetrikDashboard {
  return {
    errorRate: {
      nilai: Math.round(progres.errorRate * 100),
      indikator: hitungIndikatorErrorRate(progres.errorRate),
    },
    responseTime: {
      nilai: Math.round(progres.avgResponseTime),
      indikator: hitungIndikatorResponseTime(progres.avgResponseTime),
    },
    promptLevel: {
      nilai: progres.promptLevel,
      indikator: hitungIndikatorPromptLevel(progres.promptLevel),
    },
  };
}

export function hitungBintang(errorRate: number, promptLevel: number): number {
  if (errorRate < 0.1 && promptLevel === 0) return 3;
  if (errorRate < 0.3 && promptLevel <= 1) return 2;
  return 1;
}

export function buatSessionBaru(
  errorCount: number,
  totalAttempts: number,
  responseTime: number,
  hintUsed: number
): SessionData {
  return {
    timestamp: new Date().toISOString(),
    errorCount,
    totalAttempts,
    responseTime,
    hintUsed,
  };
}

export function hitungProgresQuest(
  errorCount: number,
  totalAttempts: number,
  avgResponseTime: number,
  hintUsed: number,
  completionTime: number,
  sesiSebelumnya: SessionData[] = []
): ProgresQuest {
  const errorRate = totalAttempts > 0 ? errorCount / totalAttempts : 0;
  const promptLevel = hintUsed === 0 ? 0 : hintUsed === 1 ? 1 : 2;
  const bintang = hitungBintang(errorRate, promptLevel);

  const sesiIni = buatSessionBaru(errorCount, totalAttempts, avgResponseTime, hintUsed);

  return {
    selesai: true,
    bintang,
    errorRate,
    avgResponseTime,
    promptLevel,
    completionTime,
    sesi: [...sesiSebelumnya, sesiIni],
  };
}
