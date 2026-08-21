"use client";

import { TopNav } from "@/components/layout/TopNav";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { QueEs } from "@/components/sections/QueEs";
import { Laboratorios } from "@/components/sections/Laboratorios";
import { Expositores } from "@/components/sections/Expositores";
import { Transmision } from "@/components/sections/Transmision";
import { Registro } from "@/components/sections/Registro";
import { FAQ } from "@/components/sections/FAQ";
import { CTACierre } from "@/components/sections/CTACierre";
import { ScrollPinnedEditions } from "@/components/features/ScrollPinnedEditions";

export default function Home() {
  return (
    <>
      <TopNav />
      <main id="content">
        <Hero />
        <QueEs />
        <ScrollPinnedEditions />
        <Laboratorios />
        <Expositores />
        <Transmision />
        <Registro />
        <FAQ />
        <CTACierre />
      </main>
      <Footer />
    </>
  );
}
