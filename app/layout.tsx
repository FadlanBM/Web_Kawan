import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "KAWAN — Game Pembelajaran Adaptif untuk Anak ASD",
  description:
    "KAWAN (Keterampilan Adaptif Warga Autisme Nusantara) adalah game visual novel interaktif 2D berbasis web yang dirancang inklusif sebagai media pembelajaran untuk anak-anak penyandang ASD.",
  keywords: ["ASD", "autisme", "game edukasi", "visual novel", "pembelajaran adaptif", "SLB"],
  authors: [{ name: "Tim KAWAN — Universitas Gadjah Mada" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${nunito.variable} h-full`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
