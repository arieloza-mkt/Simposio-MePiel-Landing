import { TopNav } from "@/components/layout/TopNav";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { LogoSpin } from "@/components/features/LogoSpin";
import { CifrasPreview } from "@/components/sections/CifrasPreview";
import { SimposioDermocosmetico } from "@/components/sections/SimposioDermocosmetico";
import { ProgramaLauncher } from "@/components/programa/ProgramaLauncher";
import { ScrollPinnedEditions } from "@/components/features/ScrollPinnedEditions";
import { getLandingContent } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function Home() {
  const content = await getLandingContent();

  return (
    <>
      <TopNav editions={content.editions} />
      <main id="content">
        <Hero hero={content.hero} />
        <SimposioDermocosmetico alianza={content.mepielAlianza} />
        <LogoSpin
          logoUrl={content.logoSpin.logoUrl}
          nextPreview={
            <CifrasPreview
              queEs={content.queEs}
              speakers={content.speakers}
              labsList={content.labsList}
              labsTitle={content.labsSection.title}
            />
          }
        />
       <ScrollPinnedEditions
          editions={content.editions}
          speakers={content.speakers}
          eventConfig={content.eventConfig}
          viewMoreText={content.editionsPanel.viewMoreText}
          modalSettings={content.editionsModal}
        />
      </main>
      <ProgramaLauncher />
      <Footer settings={content.footer} />
    </>
  );
}
