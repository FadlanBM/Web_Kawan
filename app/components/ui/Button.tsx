// ============================================================
// KAWAN — Button Component (Ramah ASD: min 44x44px)
// ============================================================
import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg" | "xl";
  disabled?: boolean;
  className?: string;
  id?: string;
  type?: "button" | "submit" | "reset";
  fullWidth?: boolean;
}

const variantStyles: Record<string, string> = {
  primary: "bg-mint text-white border-2 border-mint-dark shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0",
  secondary: "bg-lavender text-coklat border-2 border-lavender-dark shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0",
  danger: "bg-orange-soft text-white border-2 border-orange-600 shadow-md hover:shadow-lg hover:-translate-y-0.5",
  ghost: "bg-transparent text-coklat border-2 border-border hover:bg-cream-dark",
};

const sizeStyles: Record<string, string> = {
  sm: "px-4 py-2 text-base min-h-[44px] min-w-[44px]",
  md: "px-6 py-3 text-lg min-h-[52px]",
  lg: "px-8 py-4 text-xl min-h-[60px]",
  xl: "px-10 py-5 text-2xl min-h-[70px]",
};

export default function Button({
  children,
  onClick,
  variant = "primary",
  size = "md",
  disabled = false,
  className = "",
  id,
  type = "button",
  fullWidth = false,
}: ButtonProps) {
  return (
    <button
      id={id}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        inline-flex items-center justify-center gap-2
        rounded-2xl font-bold transition-all duration-200
        select-none cursor-pointer
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${fullWidth ? "w-full" : ""}
        ${disabled ? "opacity-50 cursor-not-allowed pointer-events-none" : ""}
        ${className}
      `}
    >
      {children}
    </button>
  );
}
