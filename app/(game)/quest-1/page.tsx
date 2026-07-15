"use client";

// ============================================================
// KAWAN — Quest 1: Lapak Gizi (Pilih Makanan Sehat)
// ============================================================
import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useGame } from "@/app/contexts/GameContext";
import { hitungProgresQuest } from "@/app/lib/analytics";
import { playPositiveTone, playHintTone, playCelebrationTone, ucapkanTeks } from "@/app/lib/audioManager";
import StarReward from "@/app/components/ui/StarReward";
import ProgressBar from "@/app/components/ui/ProgressBar";
import { MAKANAN_PEMULA, MAKANAN_LANJUTAN, KATEGORI_GIZI } from "@/app/lib/gameData";
import { MakananItem } from "@/app/types";

export default function Quest1Page() {
  const router = useRouter();
  const { state, dispatch, actions } = useGame();
  const jalur = state.profilAktif?.jalur ?? "pemula";
  const makananList = jalur === "pemula" ? MAKANAN_PEMULA : MAKANAN_LANJUTAN;

  const [items, setItems] = useState<MakananItem[]>(() => [...makananList].sort(() => Math.random() - 0.5));
  const [benar, setBenar] = useState<string[]>([]);
  const [salah, setSalah] = useState<string[]>([]);
  const [hint, setHint] = useState<string[]>([]);
  const [showReward, setShowReward] = useState(false);
  const [rewardBintang, setRewardBintang] = useState(1);
  const [questSelesai, setQuestSelesai] = useState(false);
  const [dragItem, setDragItem] = useState<MakananItem | null>(null);

  // Tracking
  const errorCount = useRef(0);
  const hintCount = useRef(0);
  const startTime = useRef(Date.now());
  const responseTimes = useRef<number[]>([]);
  const lastInteractionTime = useRef(Date.now());

  const totalItems = items.length;
  const selesai = benar.length;

  useEffect(() => {
    const inst = jalur === "pemula"
      ? "Quest satu. Drag makanan ke tempat yang tepat! Mana makanan sehat?"
      : "Quest satu. Kelompokkan setiap makanan ke kelompok gizinya yang benar!";
    ucapkanTeks(inst, state.aksesibilitas.kecepatanNarasi);
  }, [jalur, state.aksesibilitas.kecepatanNarasi]);

  const handleJawab = useCallback((item: MakananItem, jawaban: "sehat" | "tidak-sehat" | string) => {
    const rt = (Date.now() - lastInteractionTime.current) / 1000;
    responseTimes.current.push(rt);
    lastInteractionTime.current = Date.now();

    const isBenar =
      jalur === "pemula"
        ? item.kelompok === jawaban
        : item.kategoriGizi === jawaban;

    if (isBenar) {
      setBenar((prev) => [...prev, item.id]);
      playPositiveTone();
      ucapkanTeks("Benar! Bagus sekali!", state.aksesibilitas.kecepatanNarasi);

      if (benar.length + 1 === totalItems) {
        // Quest selesai
        setTimeout(async () => {
          playCelebrationTone();
          const completionTime = (Date.now() - startTime.current) / 1000;
          const avgRT = responseTimes.current.reduce((a, b) => a + b, 0) / responseTimes.current.length || 0;
          const progres = hitungProgresQuest(errorCount.current, totalItems + errorCount.current, avgRT, hintCount.current, completionTime);
          await actions.updateQuestProgres(1, progres);
          await actions.addStiker("chef");
          setRewardBintang(progres.bintang);
          setShowReward(true);
        }, 400);
      }
    } else {
      errorCount.current++;
      setSalah((prev) => [...prev, item.id]);
      playHintTone();
      ucapkanTeks("Coba lagi ya!", state.aksesibilitas.kecepatanNarasi);
      setTimeout(() => setSalah((prev) => prev.filter((id) => id !== item.id)), 1200);

      // Tampilkan hint setelah 2x salah pada item yang sama
      if (errorCount.current % 2 === 0) {
        hintCount.current++;
        setHint((prev) => [...prev, item.id]);
        ucapkanTeks("Petunjuk: lihat warnanya!", state.aksesibilitas.kecepatanNarasi);
        setTimeout(() => setHint((prev) => prev.filter((id) => id !== item.id)), 3000);
      }
    }
  }, [jalur, benar.length, totalItems, state.profilAktif, state.aksesibilitas.kecepatanNarasi, dispatch]);

  // Drag handlers
  const handleDragStart = (item: MakananItem) => setDragItem(item);
  const handleDragEnd = () => setDragItem(null);

  const handleDrop = (e: React.DragEvent, target: string) => {
    e.preventDefault();
    if (!dragItem) return;
    if (benar.includes(dragItem.id)) return;
    handleJawab(dragItem, target);
    setDragItem(null);
  };

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();

  // Touch drag (mobile)
  const handleTapJawab = (item: MakananItem, target: string) => {
    if (benar.includes(item.id)) return;
    handleJawab(item, target);
  };

  const itemsRemaining = items.filter((m) => !benar.includes(m.id));

  if (questSelesai) {
    return null; // router sudah redirect
  }

  return (
    <div className="min-h-screen bg-cream flex flex-col px-4 py-6">
      {/* Header */}
      <div className="max-w-2xl mx-auto w-full">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-mint rounded-2xl flex items-center justify-center text-2xl shadow-md">🥗</div>
          <div className="flex-1">
            <h1 className="text-2xl font-black text-coklat">Quest 1: Lapak Gizi</h1>
            <p className="text-coklat/60 text-sm font-semibold">
              {jalur === "pemula" ? "Pilih makanan yang sehat! 🌱" : "Kelompokkan makanan berdasarkan gizinya! 🚀"}
            </p>
          </div>
          <div className="text-right">
            <span className="text-2xl font-black text-yellow-warm">⭐ {benar.length}</span>
          </div>
        </div>
        <ProgressBar current={selesai} total={totalItems} label="Makanan dipilah" className="mb-6" />

        {/* Area narasi / instruksi */}
        <div className="bg-white rounded-2xl border-2 border-border p-4 mb-6 flex items-start gap-3">
          <span className="text-3xl flex-shrink-0">🌟</span>
          <p className="font-semibold text-coklat text-lg leading-snug">
            {jalur === "pemula"
              ? "Drag makanan ke tempat yang tepat! Mana makanan SEHAT? 🟢"
              : "Kelompokkan setiap makanan ke kelompok gizinya yang benar!"}
          </p>
        </div>

        {/* Target Zone */}
        {jalur === "pemula" ? (
          <div className="grid grid-cols-2 gap-4 mb-6">
            {[
              { id: "sehat", label: "Makanan Sehat", emoji: "🟢", color: "bg-green-50 border-green-300" },
              { id: "tidak-sehat", label: "Tidak Sehat", emoji: "🔴", color: "bg-red-50 border-red-200" },
            ].map((zone) => (
              <div
                key={zone.id}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, zone.id)}
                className={`${zone.color} border-2 rounded-3xl p-4 min-h-[120px] drop-zone transition-all`}
              >
                <p className="font-black text-center text-lg text-coklat mb-2">
                  {zone.emoji} {zone.label}
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {benar
                    .filter((id) => {
                      const m = makananList.find((mk) => mk.id === id);
                      return m?.kelompok === zone.id;
                    })
                    .map((id) => {
                      const m = makananList.find((mk) => mk.id === id);
                      return (
                        <div key={id} className="text-3xl bg-white rounded-xl border border-green-300 p-2 shadow-sm">
                          {m?.emoji}
                        </div>
                      );
                    })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 mb-6">
            {KATEGORI_GIZI.map((kg) => (
              <div
                key={kg.id}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, kg.id)}
                className="border-2 rounded-3xl p-3 min-h-[100px] drop-zone transition-all"
                style={{ backgroundColor: `${kg.warna}20`, borderColor: kg.warna }}
              >
                <p className="font-black text-sm text-coklat mb-1">{kg.emoji} {kg.nama}</p>
                <p className="text-xs text-coklat/50 mb-2">{kg.deskripsi}</p>
                <div className="flex flex-wrap gap-1.5">
                  {benar
                    .filter((id) => {
                      const m = makananList.find((mk) => mk.id === id);
                      return m?.kategoriGizi === kg.id;
                    })
                    .map((id) => {
                      const m = makananList.find((mk) => mk.id === id);
                      return (
                        <div key={id} className="text-2xl bg-white rounded-lg border p-1 shadow-sm">
                          {m?.emoji}
                        </div>
                      );
                    })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Kartu Makanan */}
        <div className="flex flex-wrap gap-3 justify-center">
          {itemsRemaining.map((item) => (
            <div
              key={item.id}
              draggable
              onDragStart={() => {
                ucapkanTeks(item.nama, state.aksesibilitas.kecepatanNarasi);
                handleDragStart(item);
              }}
              onDragEnd={handleDragEnd}
              onClick={() => ucapkanTeks(item.nama, state.aksesibilitas.kecepatanNarasi)}
              className={`
                drag-item select-none
                w-24 h-24 rounded-2xl border-4 border-border bg-white
                flex flex-col items-center justify-center gap-1
                shadow-md cursor-grab active:cursor-grabbing
                transition-all duration-200
                hover:-translate-y-1 hover:shadow-lg
                ${salah.includes(item.id) ? "border-orange-soft shake" : ""}
                ${hint.includes(item.id) ? "pulse-hint border-orange-soft" : ""}
              `}
              style={{ borderColor: hint.includes(item.id) ? "var(--orange-soft)" : undefined }}
            >
              <span className="text-4xl">{item.emoji}</span>
              <span className="text-xs font-bold text-coklat/70 text-center px-1 leading-tight">{item.nama}</span>

              {/* Mobile: tombol tap untuk jalur pemula */}
              {jalur === "pemula" && (
                <div className="flex gap-1 mt-0.5">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTapJawab(item, "sehat");
                    }}
                    className="text-xs bg-green-100 text-green-700 font-bold px-2 py-0.5 rounded-full border border-green-300 min-h-[28px]"
                  >
                    ✓
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTapJawab(item, "tidak-sehat");
                    }}
                    className="text-xs bg-red-50 text-red-500 font-bold px-2 py-0.5 rounded-full border border-red-200 min-h-[28px]"
                  >
                    ✗
                  </button>
                </div>
              )}
            </div>
          ))}

          {jalur === "lanjutan" && itemsRemaining.length > 0 && (
            <div className="w-full text-center mt-2">
              <p className="text-sm text-coklat/50 font-semibold">Tap kategori di atas setelah memilih makanan</p>
              {dragItem && (
                <div className="mt-2 inline-flex items-center gap-2 bg-mint/20 rounded-xl px-4 py-2 border border-mint">
                  <span className="text-2xl">{dragItem.emoji}</span>
                  <span className="font-bold text-coklat text-sm">Taruh ke kelompok yang tepat!</span>
                </div>
              )}
              {/* Mobile tap-to-categorize for lanjutan */}
              {!dragItem && itemsRemaining[0] && (
                <div className="mt-3 p-4 bg-white rounded-2xl border-2 border-border shadow">
                  <p className="text-sm font-bold text-coklat mb-3">
                    <span className="text-2xl">{itemsRemaining[0].emoji}</span> {itemsRemaining[0].nama} — masuk ke kelompok mana?
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {KATEGORI_GIZI.map((kg) => (
                      <button
                        key={kg.id}
                        onClick={() => handleTapJawab(itemsRemaining[0], kg.id)}
                        className="min-h-[44px] rounded-xl border-2 font-bold text-sm transition-all hover:scale-105"
                        style={{ borderColor: kg.warna, backgroundColor: `${kg.warna}20` }}
                      >
                        {kg.emoji} {kg.nama}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Star Reward */}
      <StarReward
        show={showReward}
        count={rewardBintang}
        message={`Quest 1 Selesai! ${rewardBintang} Bintang! 🎉`}
        onComplete={() => {
          setShowReward(false);
          setQuestSelesai(true);
          router.push("/quest-2");
        }}
      />
    </div>
  );
}
