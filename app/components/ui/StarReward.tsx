"use client";

// ============================================================
// KAWAN — StarReward Component (Animasi bintang positif)
// ============================================================
import { useEffect, useState } from "react";

interface StarRewardProps {
  show: boolean;
  count?: number; // jumlah bintang (1-3)
  message?: string;
  onComplete?: () => void;
}

export default function StarReward({ show, count = 3, message = "Bagus sekali!", onComplete }: StarRewardProps) {
  const [visible, setVisible] = useState(false);
  const [stars, setStars] = useState<{ id: number; x: number; y: number; delay: number }[]>([]);

  useEffect(() => {
    if (show) {
      setVisible(true);
      // Buat bintang-bintang acak
      setStars(
        Array.from({ length: Math.min(count * 3, 12) }, (_, i) => ({
          id: i,
          x: Math.random() * 80 + 10,
          y: Math.random() * 60 + 10,
          delay: Math.random() * 0.4,
        }))
      );
      const timer = setTimeout(() => {
        setVisible(false);
        onComplete?.();
      }, 2200);
      return () => clearTimeout(timer);
    }
  }, [show, count, onComplete]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center">
      {/* Overlay lembut */}
      <div className="absolute inset-0 bg-black/10 rounded-none" />

      {/* Bintang berterbangan */}
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute text-3xl star-float"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            animationDelay: `${star.delay}s`,
          }}
        >
          ⭐
        </div>
      ))}

      {/* Pesan sukses */}
      <div className="relative z-10 flex flex-col items-center gap-3 bg-white rounded-3xl px-8 py-6 shadow-2xl border-4 border-yellow-warm animate-bounce-in">
        <div className="flex gap-1">
          {Array.from({ length: count }).map((_, i) => (
            <span key={i} className="text-4xl" style={{ animationDelay: `${i * 0.15}s` }}>
              ⭐
            </span>
          ))}
        </div>
        <p className="text-2xl font-bold text-coklat">{message}</p>
      </div>
    </div>
  );
}
