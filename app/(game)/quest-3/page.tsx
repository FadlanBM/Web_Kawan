"use client";

// ============================================================
// KAWAN — Quest 3: Jalan Keluar Pasar (Pilah Sampah)
// ============================================================
import { useState, useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGame } from "@/app/contexts/GameContext";
import { hitungProgresQuest } from "@/app/lib/analytics";
import { playPositiveTone, playHintTone, playCelebrationTone, ucapkanTeks } from "@/app/lib/audioManager";
import StarReward from "@/app/components/ui/StarReward";
import ProgressBar from "@/app/components/ui/ProgressBar";
import { SAMPAH_PEMULA, SAMPAH_LANJUTAN } from "@/app/lib/gameData";
import { SampahItem } from "@/app/types";

export default function Quest3Page() {
  const router = useRouter();
  const { state, actions } = useGame();
  const jalur = state.profilAktif?.jalur ?? "pemula";
  const sampahList = jalur === "pemula" ? SAMPAH_PEMULA : SAMPAH_LANJUTAN;

  const [items] = useState<SampahItem[]>(() => [...sampahList].sort(() => Math.random() - 0.5));
  const [benar, setBenar] = useState<string[]>([]);
  const [salah, setSalah] = useState<string[]>([]);
  const [hint, setHint] = useState<string[]>([]);
  const [dragItem, setDragItem] = useState<SampahItem | null>(null);
  const [showReward, setShowReward] = useState(false);
  const [rewardBintang, setRewardBintang] = useState(1);
  const [showInfo, setShowInfo] = useState<SampahItem | null>(null);

  const errorCount = useRef(0);
  const hintCount = useRef(0);
  const startTime = useRef(Date.now());
  const responseTimes = useRef<number[]>([]);
  const lastInteractionTime = useRef(Date.now());

  useEffect(() => {
    const inst = jalur === "pemula"
      ? "Quest tiga. Taruh sampah ke tempat sampah yang warnanya cocok!"
      : "Quest tiga. Kelompokkan sampah: organik atau anorganik!";
    ucapkanTeks(inst, state.aksesibilitas.kecepatanNarasi);
  }, [jalur, state.aksesibilitas.kecepatanNarasi]);

  const handleJawab = useCallback((item: SampahItem, jenisTempat: "organik" | "anorganik") => {
    const rt = (Date.now() - lastInteractionTime.current) / 1000;
    responseTimes.current.push(rt);
    lastInteractionTime.current = Date.now();

    const isBenar = item.jenis === jenisTempat;

    if (isBenar) {
      setBenar((prev) => [...prev, item.id]);
      playPositiveTone();
      ucapkanTeks("Benar! Pintar sekali!", state.aksesibilitas.kecepatanNarasi);

      // Tampilkan info (Jalur Lanjutan)
      if (jalur === "lanjutan" && item.deskripsi) {
        setShowInfo(item);
        setTimeout(() => setShowInfo(null), 3000);
      }

      if (benar.length + 1 === items.length) {
        setTimeout(async () => {
          playCelebrationTone();
          const completionTime = (Date.now() - startTime.current) / 1000;
          const totalAttempts = items.length + errorCount.current;
          const avgRT = responseTimes.current.length > 0
            ? responseTimes.current.reduce((a, b) => a + b, 0) / responseTimes.current.length
            : 10;
          const progres = hitungProgresQuest(errorCount.current, totalAttempts, avgRT, hintCount.current, completionTime);

          await actions.updateQuestProgres(3, progres);
          await actions.addStiker("pejuang-lingkungan");
          setRewardBintang(progres.bintang);
          setShowReward(true);
        }, 400);
      }
    } else {
      errorCount.current++;
      setSalah((prev) => [...prev, item.id]);
      playHintTone();
      ucapkanTeks("Coba lagi! Perhatikan warna tempat sampahnya!", state.aksesibilitas.kecepatanNarasi);
      setTimeout(() => setSalah((prev) => prev.filter((id) => id !== item.id)), 1200);

      if (errorCount.current % 2 === 0) {
        hintCount.current++;
        setHint((prev) => [...prev, item.id]);
        setTimeout(() => setHint((prev) => prev.filter((id) => id !== item.id)), 3000);
      }
    }
  }, [benar.length, items, jalur, state.profilAktif, state.aksesibilitas.kecepatanNarasi, actions]);

  const handleDrop = (e: React.DragEvent, jenis: "organik" | "anorganik") => {
    e.preventDefault();
    if (!dragItem) return;
    if (benar.includes(dragItem.id)) return;
    handleJawab(dragItem, jenis);
    setDragItem(null);
  };

  const itemsRemaining = items.filter((s) => !benar.includes(s.id));

  return (
    <div className="min-h-screen bg-cream px-4 py-6 flex flex-col">
      <div className="max-w-2xl mx-auto w-full">
        {/* Header */}
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center text-2xl shadow-md">🗑️</div>
          <div className="flex-1">
            <h1 className="text-2xl font-black text-coklat">Quest 3: Jalan Keluar</h1>
            <p className="text-coklat/60 text-sm font-semibold">Pilah sampah ke tempat yang benar!</p>
          </div>
          <span className="text-2xl font-black text-yellow-warm">⭐ {benar.length}</span>
        </div>

        <ProgressBar current={benar.length} total={items.length} label="Sampah dipilah" className="mb-5" />

        {/* Instruksi */}
        <div className="bg-white rounded-2xl border-2 border-border p-4 mb-5 flex items-start gap-3">
          <span className="text-3xl flex-shrink-0">🌟</span>
          <div>
            <p className="font-semibold text-coklat text-lg leading-snug">
              {jalur === "pemula"
                ? "Taruh sampah ke tempat sampah yang warnanya cocok!"
                : "Kelompokkan sampah: organik (hijau) atau anorganik (kuning)!"}
            </p>
            {jalur === "pemula" && (
              <p className="text-sm text-coklat/60 mt-1">🟢 Hijau = Organik | 🟡 Kuning = Anorganik</p>
            )}
          </div>
        </div>

        {/* Info popup (jalur lanjutan) */}
        {showInfo && (
          <div className="bg-mint/20 border-2 border-mint rounded-2xl p-3 mb-4 animate-fade-in">
            <p className="font-bold text-coklat">💡 {showInfo.nama}: {showInfo.deskripsi}</p>
          </div>
        )}

        {/* Drop Zones */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {[
            { id: "organik" as const, label: "Organik", emoji: "🌿", color: "bg-green-50 border-green-400", textColor: "text-green-700", desc: "Dapat terurai oleh alam" },
            { id: "anorganik" as const, label: "Anorganik", emoji: "♻️", color: "bg-yellow-50 border-yellow-400", textColor: "text-yellow-700", desc: "Perlu didaur ulang" },
          ].map((zone) => (
            <div
              key={zone.id}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleDrop(e, zone.id)}
              className={`${zone.color} border-4 rounded-3xl p-4 min-h-[160px] drop-zone transition-all`}
            >
              <div className="text-center mb-3">
                <span className="text-4xl">{zone.emoji}</span>
                <p className={`font-black text-xl ${zone.textColor}`}>{zone.label}</p>
                <p className="text-xs text-coklat/50">{zone.desc}</p>
              </div>
              {/* Items yang sudah benar */}
              <div className="flex flex-wrap gap-2 justify-center">
                {benar
                  .filter((id) => items.find((s) => s.id === id)?.jenis === zone.id)
                  .map((id) => {
                    const s = items.find((item) => item.id === id);
                    return (
                      <div key={id} className="bg-white rounded-xl border-2 border-green-300 p-2 shadow-sm text-center">
                        <div className="text-2xl">{s?.emoji}</div>
                        <div className="text-xs font-bold text-coklat/70">{s?.nama}</div>
                      </div>
                    );
                  })}
              </div>
            </div>
          ))}
        </div>

        {/* Kartu Sampah */}
        <div>
          <p className="font-bold text-coklat/60 text-sm mb-3">Sampah yang perlu dipilah:</p>
          <div className="flex flex-wrap gap-3 justify-center">
            {itemsRemaining.map((item) => (
              <div key={item.id} className="flex flex-col items-center gap-2">
                <div
                  draggable
                  onDragStart={() => {
                    ucapkanTeks(item.nama, state.aksesibilitas.kecepatanNarasi);
                    setDragItem(item);
                  }}
                  onDragEnd={() => setDragItem(null)}
                  onClick={() => ucapkanTeks(item.nama, state.aksesibilitas.kecepatanNarasi)}
                  className={`
                    drag-item w-24 h-24 rounded-2xl border-4 border-border bg-white
                    flex flex-col items-center justify-center gap-1
                    shadow-md cursor-grab active:cursor-grabbing
                    transition-all duration-200 hover:-translate-y-1 hover:shadow-lg
                    ${salah.includes(item.id) ? "border-orange-soft" : ""}
                    ${hint.includes(item.id) ? "pulse-hint border-orange-soft" : ""}
                  `}
                >
                  <span className="text-4xl">{item.emoji}</span>
                  <span className="text-xs font-bold text-coklat/70 text-center px-1">{item.nama}</span>
                </div>
                {/* Tombol tap untuk mobile */}
                <div className="flex gap-1">
                  <button
                    onClick={() => handleJawab(item, "organik")}
                    className="text-xs bg-green-100 text-green-700 font-bold px-3 py-1 rounded-full border border-green-300 min-h-[36px] hover:bg-green-200 transition-colors"
                    id={`btn-organik-${item.id}`}
                  >
                    🟢
                  </button>
                  <button
                    onClick={() => handleJawab(item, "anorganik")}
                    className="text-xs bg-yellow-100 text-yellow-700 font-bold px-3 py-1 rounded-full border border-yellow-300 min-h-[36px] hover:bg-yellow-200 transition-colors"
                    id={`btn-anorganik-${item.id}`}
                  >
                    🟡
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <StarReward
        show={showReward}
        count={rewardBintang}
        message={`Quest 3 Selesai! ${rewardBintang} Bintang! 🎉`}
        onComplete={() => {
          setShowReward(false);
          router.push("/selesai");
        }}
      />
    </div>
  );
}
