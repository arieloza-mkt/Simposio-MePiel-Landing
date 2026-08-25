import { TopNav } from "@/components/layout/TopNav";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { LogoSpin } from "@/components/features/LogoSpin";
//import { QueEs } from "@/components/sections/QueEs";
import { QueEsPreview } from "@/components/sections/QueEsPreview";
import { MepielAlianza } from "@/components/sections/MepielAlianza";
import { Laboratorios } from "@/components/sections/Laboratorios";
import { Expositores } from "@/components/sections/Expositores";
import { Registro } from "@/components/sections/Registro";
import { ScrollPinnedEditions } from "@/components/features/ScrollPinnedEditions";
import { getLandingContent } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function Home() {
  const content = await getLandingContent();

  return (
    <>
      <TopNav />
      <main id="content">
        <Hero site={content.site} hero={content.hero} />
        <MepielAlianza alianza={content.mepielAlianza} />
        <LogoSpin nextPreview={<QueEsPreview queEs={content.queEs} />} />
        {/* <QueEs queEs={content.queEs} /> */}
        <ScrollPinnedEditions
          editions={content.editions}
          speakers={content.speakers}
        />
        <Laboratorios labsList={content.labsList} />
        <Expositores speakers={content.speakers} />
        <Registro />
      </main>
      <Footer />
    </>
  );
}
