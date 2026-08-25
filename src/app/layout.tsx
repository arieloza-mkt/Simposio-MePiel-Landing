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
    <html
      lang="es"
      className={`${poppins.variable}`}
      data-theme="dark"
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var h=document.documentElement;var s=localStorage.getItem("admin-theme");if(s==="light"||s==="dark"){h.setAttribute("data-theme",s);return}var p=new Intl.DateTimeFormat("en-GB",{timeZone:"America/Mexico_City",hour:"2-digit",hourCycle:"h23"}).format(new Date());var hour=parseInt(p,10);var dark=hour>=19||hour<7;h.setAttribute("data-theme",dark?"dark":"light")}catch(e){}})();`,
          }}
        />
      </head>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
