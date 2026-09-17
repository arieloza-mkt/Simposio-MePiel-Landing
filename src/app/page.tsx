import { TopNav } from "@/components/layout/TopNav";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { LogoSpin } from "@/components/features/LogoSpin";
import { CifrasPreview } from "@/components/sections/CifrasPreview";
import { SimposioDermocosmetico } from "@/components/sections/SimposioDermocosmetico";
import { Laboratorios } from "@/components/sections/Laboratorios";
// import { Expositores } from "@/components/sections/Expositores";
import { ProgramaLauncher } from "@/components/programa/ProgramaLauncher";
import { ScrollPinnedEditions } from "@/components/features/ScrollPinnedEditions";
import { CategoriaHero } from "@/components/sections/CategoriaHero";
import { getLandingContent } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function Home() {
  const content = await getLandingContent();

  return (
    <>
      <TopNav editions={content.editions} />
      <main id="content">
        <Hero site={content.site} hero={content.hero} />
        <SimposioDermocosmetico alianza={content.mepielAlianza} />
        <LogoSpin
          logoUrl={content.logoSpin.logoUrl}
          nextPreview={<CifrasPreview queEs={content.queEs} speakers={content.speakers} />}
        />
        {/* <Expositores speakers={content.speakers} /> */}
        <Laboratorios
          labsList={content.labsList}
          title={content.labsSection.title}
        />
        <ScrollPinnedEditions
          editions={content.editions}
          speakers={content.speakers}
          viewMoreText={content.editionsPanel.viewMoreText}
          modalSettings={content.editionsModal}
        />
        <CategoriaHero />
      </main>
      <ProgramaLauncher />
      <Footer settings={content.footer} />
    </>
  );
}
