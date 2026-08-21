import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/lib/theme-provider";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Simposio Dermocosmético - 3a Edición - Registro Abierto",
  description:
    "El encuentro comercial más relevante de la industria dermocosmética en México. Farmacias, laboratorios, distribuidores y especialistas conectan para impulsar la categoría.",
  metadataBase: new URL("https://simposiodermocosmetico.com"),
  openGraph: {
    title: "Simposio Dermocosmético - 3a Edición",
    description:
      "El encuentro comercial más relevante de la industria dermocosmética en México.",
    type: "website",
    locale: "es_MX",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${poppins.variable}`} suppressHydrationWarning>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
