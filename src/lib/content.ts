import { asc, eq } from "drizzle-orm";
import { getDbReady } from "./db/client";
import { ensureDb } from "./db/init";
import * as schema from "./db/schema";
import {
  EDITION_SEED,
  FAQ_SEED,
  LAB_SEED,
  SCHEDULE_SEED,
  SETTINGS_SEED,
  SPEAKER_SEED,
} from "./db/seed-data";
import type {
  editions,
  faqItems,
  labs,
  scheduleItems,
  speakers,
} from "./db/schema";

export type Edition = typeof editions.$inferSelect;
export type Speaker = typeof speakers.$inferSelect;
export type Lab = typeof labs.$inferSelect;
export type ScheduleItem = typeof scheduleItems.$inferSelect;
export type FaqItem = typeof faqItems.$inferSelect;

export interface SiteInfo {
  name: string;
  edition: string;
  year: number;
  tagline: string;
  description: string;
}

export interface SeoSettings {
  title: string;
  siteName: string;
  keywords: string;
  description: string;
}

export interface HeroSettings {
  headline: string;
  metrics: { value: string; label: string }[];
  videoId: string;
}

export interface TransmisionSettings {
  title: string;
  description: string;
  videoId: string | null;
  isLive: boolean;
  backdropUrl: string | null;
}

export interface Benefit {
  title: string;
  description: string;
  icon: string;
}

export interface AttendeeType {
  label: string;
  icon: string;
}

export interface Track {
  num: string;
  title: string;
  description: string;
}

export interface QueEsSettings {
  eyebrow: string;
  title: string;
  highlight: string;
  intro: string;
  experienceIntro: string;
  experienceItems: string[];
  imageUrl: string;
  imageAlt: string;
  images?: string[];
}

export interface MepielAlianzaSettings {
  eyebrow: string;
  title: string;
  highlight: string;
  titleLines?: string[];
  paragraphs: string[];
  imageUrl: string;
  imageAlt: string;
  images?: string[];
}

export interface CtaCierreSettings {
  description: string;
}

export interface EventConfig {
  startsAt: string;
  endsAt: string;
  timezone: string;
  dateLabel: string;
  venueLabel: string;
}

export interface LogoSpinSettings {
  logoUrl: string;
}

export interface EditionsModalSettings {
  speakersTitle: string;
  speakersDescription: string;
  labsTitle: string;
  labsDescription: string;
}

export interface EditionsPanelSettings {
  viewMoreText: string;
}

export interface SectionHeader {
  eyebrow: string;
  title: string;
}

export interface RegistroSettings {
  eyebrow: string;
  title: string;
  description: string;
  validationText: string;
  dudasLabel: string;
  dudasLinkText: string;
  submitButtonText: string;
}

export interface FooterSettings {
  description: string;
  copyright: string;
  logoUrl: string;
  privacyLinkText: string;
  privacyLinkUrl: string;
  eventLinks: { label: string; href: string }[];
  participateLinks: { label: string; href: string }[];
  contactLinks: { label: string; href: string }[];
}

export interface LandingContent {
  QueEsPreview: QueEsSettings;
  site: SiteInfo;
  seo: SeoSettings;
  hero: HeroSettings;
  transmision: TransmisionSettings;
  benefits: Benefit[];
  attendeeTypes: AttendeeType[];
  tracks: Track[];
  labFeatures: Benefit[];
  queEs: QueEsSettings;
  mepielAlianza: MepielAlianzaSettings;
  ctaCierre: CtaCierreSettings;
  eventConfig: EventConfig;
  logoSpin: LogoSpinSettings;
  editionsModal: EditionsModalSettings;
  editionsPanel: EditionsPanelSettings;
  labsSection: SectionHeader;
  expositoresSection: SectionHeader;
  registroSection: RegistroSettings;
  footer: FooterSettings;
  editions: Edition[];
  speakers: Speaker[];
  labsList: Lab[];
  schedule: ScheduleItem[];
  faq: FaqItem[];
}

export async function getLandingContent(): Promise<LandingContent> {
  let settingRows: (typeof schema.siteSettings.$inferSelect)[];
  let editionRows: Edition[];
  let speakerRows: Speaker[];
  let labRows: Lab[];
  let scheduleRows: ScheduleItem[];
  let faqRows: FaqItem[];

  try {
    await ensureDb();
    const db = await getDbReady();

    [
      settingRows,
      editionRows,
      speakerRows,
      labRows,
      scheduleRows,
      faqRows,
    ] = await Promise.all([
      db.select().from(schema.siteSettings),
      db.select().from(schema.editions).orderBy(asc(schema.editions.sortOrder)),
      db.select().from(schema.speakers).orderBy(asc(schema.speakers.sortOrder)),
      db.select().from(schema.labs).orderBy(asc(schema.labs.sortOrder)),
      db
        .select()
        .from(schema.scheduleItems)
        .orderBy(asc(schema.scheduleItems.sortOrder)),
      db.select().from(schema.faqItems).orderBy(asc(schema.faqItems.sortOrder)),
    ]);
  } catch (error) {
    // Ante un fallo transitorio de la base de datos servimos el contenido
    // semilla en lugar de tumbar la landing.
    console.error(
      "[content] DB no disponible, sirviendo contenido de reserva:",
      error instanceof Error ? error.message : String(error),
    );
    return {
      site: SETTINGS_SEED.site as SiteInfo,
      seo: SETTINGS_SEED.seo as SeoSettings,
      hero: SETTINGS_SEED.hero as HeroSettings,
      transmision: SETTINGS_SEED.transmision as TransmisionSettings,
      benefits: SETTINGS_SEED.benefits as Benefit[],
      attendeeTypes: SETTINGS_SEED.attendeeTypes as AttendeeType[],
      tracks: SETTINGS_SEED.tracks as Track[],
      labFeatures: SETTINGS_SEED.labFeatures as Benefit[],
      queEs: SETTINGS_SEED.queEs as QueEsSettings,
      QueEsPreview: SETTINGS_SEED.QueEsPreview as QueEsSettings,
      mepielAlianza: SETTINGS_SEED.mepielAlianza as MepielAlianzaSettings,
      ctaCierre: SETTINGS_SEED.ctaCierre as CtaCierreSettings,
      eventConfig: SETTINGS_SEED.eventConfig as EventConfig,
      logoSpin: SETTINGS_SEED.logoSpin as LogoSpinSettings,
      editionsModal: SETTINGS_SEED.editionsModal as EditionsModalSettings,
      editionsPanel: SETTINGS_SEED.editionsPanel as EditionsPanelSettings,
      labsSection: SETTINGS_SEED.labsSection as SectionHeader,
      expositoresSection: SETTINGS_SEED.expositoresSection as SectionHeader,
      registroSection: SETTINGS_SEED.registroSection as RegistroSettings,
      footer: SETTINGS_SEED.footer as FooterSettings,
      editions: EDITION_SEED as unknown as Edition[],
      speakers: SPEAKER_SEED as unknown as Speaker[],
      labsList: LAB_SEED as unknown as Lab[],
      schedule: SCHEDULE_SEED as unknown as ScheduleItem[],
      faq: FAQ_SEED as unknown as FaqItem[],
    };
  }

  const settings = new Map(settingRows.map((row) => [row.key, row.value]));
  const s = <T>(key: string): T =>
    (settings.has(key) ? settings.get(key) : SETTINGS_SEED[key]) as T;

  return {
    site: s<SiteInfo>("site"),
    seo: s<SeoSettings>("seo"),
    hero: s<HeroSettings>("hero"),
    transmision: s<TransmisionSettings>("transmision"),
    benefits: s<Benefit[]>("benefits"),
    attendeeTypes: s<AttendeeType[]>("attendeeTypes"),
    tracks: s<Track[]>("tracks"),
    labFeatures: s<Benefit[]>("labFeatures"),
    queEs: s<QueEsSettings>("queEs"),
    QueEsPreview: s<QueEsSettings>("QueEsPreview"),
    mepielAlianza: s<MepielAlianzaSettings>("mepielAlianza"),
    ctaCierre: s<CtaCierreSettings>("ctaCierre"),
    eventConfig: s<EventConfig>("eventConfig"),
    logoSpin: s<LogoSpinSettings>("logoSpin"),
    editionsModal: s<EditionsModalSettings>("editionsModal"),
    editionsPanel: s<EditionsPanelSettings>("editionsPanel"),
    labsSection: s<SectionHeader>("labsSection"),
    expositoresSection: s<SectionHeader>("expositoresSection"),
    registroSection: s<RegistroSettings>("registroSection"),
    footer: s<FooterSettings>("footer"),
    editions: editionRows,
    speakers: speakerRows,
    labsList: labRows,
    schedule: scheduleRows,
    faq: faqRows,
  };
}

export async function getSeoSettings(): Promise<SeoSettings> {
  const seed = SETTINGS_SEED.seo as SeoSettings;
  try {
    await ensureDb();
    const db = await getDbReady();
    const rows = await db
      .select({ value: schema.siteSettings.value })
      .from(schema.siteSettings)
      .where(eq(schema.siteSettings.key, "seo"))
      .limit(1);
    if (rows[0]?.value) return rows[0].value as SeoSettings;
  } catch {}
  return seed;
}
