import {
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

export const registrationStatus = pgEnum("registration_status", [
  "pendiente",
  "aprobado",
  "rechazado",
]);

export const checkinKind = pgEnum("checkin_kind", [
  "asistente",
  "expositor",
]);

export const siteSettings = pgTable("site_settings", {
  key: text("key").primaryKey(),
  value: jsonb("value").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const editions = pgTable("editions", {
  id: uuid("id").primaryKey().defaultRandom(),
  ordinal: text("ordinal").notNull(),
  year: integer("year").notNull(),
  eyebrow: text("eyebrow").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  stats: jsonb("stats")
    .$type<{ value: string; label: string }[]>()
    .notNull()
    .default([]),
  videoId: text("video_id"),
  backdropUrl: text("backdrop_url"),
  logoUrl: text("logo_url"),
  images: jsonb("images")
    .$type<{ src: string; alt: string }[]>()
    .notNull()
    .default([]),
  labs: jsonb("labs")
    .$type<{ name: string; image: string }[]>()
    .notNull()
    .default([]),
  speakerIds: jsonb("speaker_ids").$type<string[]>().notNull().default([]),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const speakers = pgTable("speakers", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  role: text("role"),
  company: text("company"),
  imageUrl: text("image_url"),
  bio: text("bio"),
  linkedinUrl: text("linkedin_url"),
  websiteUrl: text("website_url"),
  checkedInAt: timestamp("checked_in_at", { withTimezone: true }),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const labs = pgTable("labs", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  imageUrl: text("image_url").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const scheduleItems = pgTable("schedule_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  day: integer("day").notNull().default(1),
  time: text("time").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  tag: text("tag").notNull().default("Conferencia"),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const programaItems = pgTable("programa_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  day: integer("day").notNull().default(2),
  start: text("start_time").notNull().default(""),
  end: text("end_time").notNull().default(""),
  title: text("title").notNull(),
  speakers: jsonb("speakers").$type<string[]>().notNull().default([]),
  salon: text("salon"),
  nota: text("nota"),
  kind: text("kind").notNull().default("conferencia"),
  modo: text("modo"),
  icon: text("icon").notNull().default(""),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const faqItems = pgTable("faq_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const registrations = pgTable(
  "registrations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    nombre: text("nombre").notNull(),
    email: text("email").notNull(),
    telefono: text("telefono").notNull(),
    empresa: text("empresa").notNull(),
    perfil: text("perfil").notNull(),
    extras: jsonb("extras").$type<Record<string, string>>().notNull().default({}),
    status: registrationStatus("status").notNull().default("pendiente"),
    accessCode: text("access_code"),
    reviewedAt: timestamp("reviewed_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [uniqueIndex("registrations_email_unique").on(table.email)],
);

export const checkins = pgTable("checkins", {
  id: uuid("id").primaryKey().defaultRandom(),
  kind: checkinKind("kind").notNull(),
  registrationId: uuid("registration_id").references(() => registrations.id, {
    onDelete: "cascade",
  }),
  speakerId: uuid("speaker_id").references(() => speakers.id, {
    onDelete: "cascade",
  }),
  note: text("note"),
  checkedInAt: timestamp("checked_in_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});
