// ============================================================
// KAWAN — MetricCard Component (Dashboard Guru)
// ============================================================
import { IndikatorWarna } from "@/app/types";
import TrafficLight from "./TrafficLight";

interface MetricCardProps {
  label: string;
  nilai: string | number;
  satuan?: string;
  indikator: IndikatorWarna;
  deskripsi?: string;
  icon?: string;
}

const indikatorLabel: Record<IndikatorWarna, string> = {
  hijau: "Baik 👍",
  kuning: "Perlu Perhatian ⚠️",
  merah: "Butuh Bantuan 🆘",
};

export default function MetricCard({ label, nilai, satuan, indikator, deskripsi, icon }: MetricCardProps) {
  return (
    <div className="bg-white border-2 border-border rounded-2xl p-5 shadow-md flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon && <span className="text-2xl">{icon}</span>}
          <span className="font-bold text-coklat">{label}</span>
        </div>
        <TrafficLight indikator={indikator} size="md" />
      </div>

      <div className="flex items-end gap-1">
        <span className="text-4xl font-black text-coklat">{nilai}</span>
        {satuan && <span className="text-lg text-gray-400 mb-1">{satuan}</span>}
      </div>

      <div className={`text-sm font-semibold px-3 py-1 rounded-full inline-block w-fit ${
        indikator === "hijau" ? "bg-green-100 text-green-700" :
        indikator === "kuning" ? "bg-yellow-100 text-yellow-700" :
        "bg-red-100 text-red-700"
      }`}>
        {indikatorLabel[indikator]}
      </div>

      {deskripsi && <p className="text-xs text-gray-500">{deskripsi}</p>}
    </div>
  );
}
