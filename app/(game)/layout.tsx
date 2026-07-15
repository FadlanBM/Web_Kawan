"use client";

// ============================================================
// KAWAN — Game Layout (wraps all game routes with providers)
// ============================================================
import { GameProvider } from "@/app/contexts/GameContext";
import AccessibilityPanel from "@/app/components/ui/AccessibilityPanel";

export default function GameLayout({ children }: { children: React.ReactNode }) {
  return (
    <GameProvider>
      <div className="min-h-screen flex flex-col bg-cream relative">
        {children}
        <AccessibilityPanel />
      </div>
    </GameProvider>
  );
}
