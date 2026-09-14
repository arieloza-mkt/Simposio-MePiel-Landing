import { TopNav } from "@/components/layout/TopNav";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { LogoSpin } from "@/components/features/LogoSpin";
import { QueEsPreview } from "@/components/sections/QueEsPreview";
import { SimposioDermocosmetico } from "@/components/sections/SimposioDermocosmetico";
import { Laboratorios } from "@/components/sections/Laboratorios";
import { Expositores } from "@/components/sections/Expositores";
import { Programa } from "@/components/sections/Programa";
import { ScrollPinnedEditions } from "@/components/features/ScrollPinnedEditions";
import { getLandingContent } from "@/lib/content";
import { getProgramaData } from "@/lib/programa-store";

export const dynamic = "force-dynamic";

export default async function Home() {
  const content = await getLandingContent();
  const programa = await getProgramaData();

  return (
    <>
      <TopNav editions={content.editions} />
      <main id="content">
        <Hero site={content.site} hero={content.hero} />
        <SimposioDermocosmetico alianza={content.mepielAlianza} />
        <LogoSpin
          logoUrl={content.logoSpin.logoUrl}
          nextPreview={<QueEsPreview queEs={content.queEs} />}
        />
        <ScrollPinnedEditions
          editions={content.editions}
          speakers={content.speakers}
          viewMoreText={content.editionsPanel.viewMoreText}
          modalSettings={content.editionsModal}
        />
        <Programa items={programa.items} />
        <Laboratorios
          labsList={content.labsList}
          eyebrow={content.labsSection.eyebrow}
          title={content.labsSection.title}
        />
        <Expositores
          speakers={content.speakers}
          eyebrow={content.expositoresSection.eyebrow}
          title={content.expositoresSection.title}
        />
      </main>
      <Footer settings={content.footer} />
    </>
  );
}
