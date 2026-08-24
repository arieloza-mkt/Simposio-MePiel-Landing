import { asc } from "drizzle-orm";
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

export interface HeroSettings {
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
  title: string;
  highlight: string;
  intro: string;
  experienceIntro: string;
  experienceItems: string[];
}

export interface MepielAlianzaSettings {
  eyebrow: string;
  title: string;
  highlight: string;
  paragraphs: string[];
  imageUrl: string;
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

export interface LandingContent {
  site: SiteInfo;
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
    console.error("[content] DB no disponible, sirviendo contenido de reserva");
    void error;
    return {
      site: SETTINGS_SEED.site as SiteInfo,
      hero: SETTINGS_SEED.hero as HeroSettings,
      transmision: SETTINGS_SEED.transmision as TransmisionSettings,
      benefits: SETTINGS_SEED.benefits as Benefit[],
      attendeeTypes: SETTINGS_SEED.attendeeTypes as AttendeeType[],
      tracks: SETTINGS_SEED.tracks as Track[],
      labFeatures: SETTINGS_SEED.labFeatures as Benefit[],
      queEs: SETTINGS_SEED.queEs as QueEsSettings,
      mepielAlianza: SETTINGS_SEED.mepielAlianza as MepielAlianzaSettings,
      ctaCierre: SETTINGS_SEED.ctaCierre as CtaCierreSettings,
      eventConfig: SETTINGS_SEED.eventConfig as EventConfig,
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
    hero: s<HeroSettings>("hero"),
    transmision: s<TransmisionSettings>("transmision"),
    benefits: s<Benefit[]>("benefits"),
    attendeeTypes: s<AttendeeType[]>("attendeeTypes"),
    tracks: s<Track[]>("tracks"),
    labFeatures: s<Benefit[]>("labFeatures"),
    queEs: s<QueEsSettings>("queEs"),
    mepielAlianza: s<MepielAlianzaSettings>("mepielAlianza"),
    ctaCierre: s<CtaCierreSettings>("ctaCierre"),
    eventConfig: s<EventConfig>("eventConfig"),
    editions: editionRows,
    speakers: speakerRows,
    labsList: labRows,
    schedule: scheduleRows,
    faq: faqRows,
  };
}
