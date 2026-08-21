"use client";

import { TopNav } from "@/components/layout/TopNav";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { QueEs } from "@/components/sections/QueEs";
import { PorQueAsistir } from "@/components/sections/PorQueAsistir";
import { EjesTematicos } from "@/components/sections/EjesTematicos";
import { Laboratorios } from "@/components/sections/Laboratorios";
import { ParaLaboratorios } from "@/components/sections/ParaLaboratorios";
import { Expositores } from "@/components/sections/Expositores";
import { Galeria } from "@/components/sections/Galeria";
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
        <PorQueAsistir />
        <ScrollPinnedEditions />
        <EjesTematicos />
        <Laboratorios />
        <ParaLaboratorios />
        <Expositores />
        <Galeria />
        <Registro />
        <FAQ />
        <CTACierre />
      </main>
      <Footer />
    </>
  );
}
