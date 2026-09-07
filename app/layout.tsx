import type { Metadata } from "next";
import { SITE_ORIGIN } from "../lib/site";
import "./globals.css";
const title = "Wi‑Fi Doktor | Opravte si domácí Wi‑Fi krok za krokem";
const description = "Interaktivní průvodce pro běžné problémy domácí Wi‑Fi. Bez technických znalostí, krok za krokem.";
export const metadata: Metadata = {
  title, description, icons: { icon: "/favicon.svg" },
  openGraph: { title, description, images: [SITE_ORIGIN + "/og.png"] },
  twitter: { card: "summary_large_image", title, description, images: [SITE_ORIGIN + "/og.png"] },
};
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){return <html lang="cs"><body>{children}</body></html>}
