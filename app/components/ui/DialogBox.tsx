"use client";

// ============================================================
// KAWAN — DialogBox Component (Visual Novel Style)
// ============================================================
import { useEffect } from "react";
import { ucapkanTeks } from "@/app/lib/audioManager";
import Button from "./Button";

interface DialogBoxProps {
  karakter?: string;
  teks: string;
  onNext?: () => void;
  onComplete?: () => void;
  isLast?: boolean;
  autoSpeak?: boolean;
  kecepatan?: number;
  className?: string;
}

export default function DialogBox({
  karakter = "KAWAN",
  teks,
  onNext,
  onComplete,
  isLast = false,
  autoSpeak = true,
  kecepatan = 1,
  className = "",
}: DialogBoxProps) {
  useEffect(() => {
    if (autoSpeak && teks) {
      ucapkanTeks(teks, kecepatan);
    }
  }, [teks, autoSpeak, kecepatan]);

  const handleNext = () => {
    if (isLast) {
      onComplete?.();
    } else {
      onNext?.();
    }
  };

  return (
    <div
      className={`
        w-full max-w-2xl mx-auto
        bg-white/95 backdrop-blur-sm
        border-4 border-border rounded-3xl
        shadow-lg
        p-6
        ${className}
      `}
    >
      {/* Nama karakter */}
      <div className="mb-3">
        <span className="inline-block bg-mint text-white font-bold text-lg px-4 py-1 rounded-full">
          {karakter}
        </span>
      </div>

      {/* Teks dialog */}
      <p className="text-coklat font-semibold text-xl leading-relaxed mb-4 min-h-[3rem]">
        {teks}
      </p>

      {/* Tombol lanjut */}
      {(onNext || onComplete) && (
        <div className="flex justify-end">
          <Button
            onClick={handleNext}
            variant="primary"
            size="md"
            id="btn-dialog-next"
          >
            {isLast ? "Ayo Mulai! 🚀" : "Lanjut ▶"}
          </Button>
        </div>
      )}
    </div>
  );
}
