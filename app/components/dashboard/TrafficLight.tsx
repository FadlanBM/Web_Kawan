// ============================================================
// KAWAN — TrafficLight Component (Dashboard Guru)
// ============================================================
import { IndikatorWarna } from "@/app/types";

interface TrafficLightProps {
  indikator: IndikatorWarna;
  label?: string;
  size?: "sm" | "md" | "lg";
}

const colors: Record<IndikatorWarna, { bg: string; ring: string; label: string }> = {
  hijau: { bg: "bg-green-400", ring: "ring-green-200", label: "Baik" },
  kuning: { bg: "bg-yellow-400", ring: "ring-yellow-200", label: "Perlu Perhatian" },
  merah: { bg: "bg-red-400", ring: "ring-red-200", label: "Butuh Bantuan" },
};

const sizes: Record<string, string> = {
  sm: "w-6 h-6",
  md: "w-10 h-10",
  lg: "w-14 h-14",
};

export default function TrafficLight({ indikator, label, size = "md" }: TrafficLightProps) {
  const c = colors[indikator];
  return (
    <div className="flex items-center gap-2">
      <div
        className={`${sizes[size]} ${c.bg} rounded-full ring-4 ${c.ring} shadow-md transition-all`}
        title={c.label}
      />
      {label && (
        <span className="text-sm font-semibold text-coklat">{label}</span>
      )}
    </div>
  );
}
