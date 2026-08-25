"use client";

import { useState, useTransition } from "react";
import { saveContentSetting } from "@/app/actions/admin/content";
import { saveLabsList } from "@/app/actions/admin/labs";
import { SectionTabs, type TabDef } from "@/components/admin/SectionTabs";
import { FieldArray } from "@/components/admin/FieldArray";
import { ImageField } from "@/components/admin/ImageField";
import { Button, Field, TextInput, TextArea } from "@/components/admin/ui";
import type {
  SiteInfo,
  HeroSettings,
  QueEsSettings,
  MepielAlianzaSettings,
  Benefit,
  AttendeeType,
  Track,
  CtaCierreSettings,
  Lab,
} from "@/lib/content";

let _id = 0;
const uid = () => String(++_id);

function SaveButton({ pending, message }: { pending: boolean; message: string | null }) {
  return (
    <div className="flex items-center gap-3">
      <Button type="submit" disabled={pending}>
        {pending ? "Guardando…" : "Guardar"}
      </Button>
      {message && (
        <p className={`text-sm ${message.includes("✓") ? "text-emerald-300" : "text-error"}`}>
          {message}
        </p>
      )}
    </div>
  );
}

function useSave(key: string) {
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const save = (values: Record<string, unknown>) => {
    setMessage(null);
    startTransition(async () => {
      const result = await saveContentSetting(key, values);
      setMessage(result.ok ? "Guardado ✓" : (result.error ?? "Error al guardar."));
    });
  };

  return { message, pending, save };
}

function SiteSection({ data }: { data: SiteInfo }) {
  const { message, pending, save } = useSave("site");
  const [form, setForm] = useState(data);

  return (
    <form onSubmit={(e) => { e.preventDefault(); save(form as unknown as Record<string, unknown>); }} className="grid gap-4 sm:grid-cols-2">
      <Field label="Nombre del evento" htmlFor="site-name">
        <TextInput id="site-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
      </Field>
      <Field label="Edición actual" htmlFor="site-edition" hint='Ej. "Octava Edición"'>
        <TextInput id="site-edition" value={form.edition} onChange={(e) => setForm({ ...form, edition: e.target.value })} />
      </Field>
      <Field label="Año" htmlFor="site-year">
        <TextInput id="site-year" type="number" value={form.year} onChange={(e) => setForm({ ...form, year: Number(e.target.value) })} />
      </Field>
      <Field label="Tagline" htmlFor="site-tagline">
        <TextInput id="site-tagline" value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} />
      </Field>
      <div className="sm:col-span-2">
        <Field label="Descripción corta" htmlFor="site-description" hint="Se usa en el hero y metadatos.">
          <TextArea id="site-description" rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </Field>
      </div>
      <SaveButton pending={pending} message={message} />
    </form>
  );
}

function HeroSection({ data }: { data: HeroSettings }) {
  const { message, pending, save } = useSave("hero");
  const [videoId, setVideoId] = useState(data.videoId);
  const [metrics, setMetrics] = useState(() =>
    data.metrics.map((m) => ({ ...m, id: uid() }))
  );

  return (
    <form onSubmit={(e) => { e.preventDefault(); save({ videoId, metrics: JSON.stringify(metrics.map(({ id, ...m }) => m)) }); }} className="grid gap-4">
      <Field label="Video de fondo (ID de YouTube)" htmlFor="hero-video">
        <TextInput id="hero-video" value={videoId} onChange={(e) => setVideoId(e.target.value)} />
      </Field>

      <div>
        <p className="mb-2 text-sm font-medium text-fg">Métricas</p>
        <FieldArray
          items={metrics}
          onChange={setMetrics}
          addLabel="Agregar métrica"
          emptyLabel="Sin métricas"
          renderItem={(item, _, onChange) => (
            <div className="grid grid-cols-2 gap-3">
              <TextInput
                placeholder="Valor"
                value={item.value}
                onChange={(e) => onChange({ ...item, value: e.target.value })}
              />
              <TextInput
                placeholder="Etiqueta"
                value={item.label}
                onChange={(e) => onChange({ ...item, label: e.target.value })}
              />
            </div>
          )}
        />
      </div>

      <SaveButton pending={pending} message={message} />
    </form>
  );
}

function QueEsSection({ data }: { data: QueEsSettings }) {
  const { message, pending, save } = useSave("queEs");
  const [form, setForm] = useState({
    title: data.title,
    highlight: data.highlight,
    intro: data.intro,
    experienceIntro: data.experienceIntro,
  });
  const [experienceItems, setExperienceItems] = useState(() =>
    data.experienceItems.map((text) => ({ id: uid(), text }))
  );

  return (
    <form onSubmit={(e) => { e.preventDefault(); save({ ...form, experienceItems: JSON.stringify(experienceItems.map(({ id, ...i }) => i.text)) }); }} className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Título" htmlFor="queEs-title">
          <TextInput id="queEs-title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        </Field>
        <Field label="Palabra resaltada" htmlFor="queEs-highlight" hint="Debe estar en el título">
          <TextInput id="queEs-highlight" value={form.highlight} onChange={(e) => setForm({ ...form, highlight: e.target.value })} />
        </Field>
      </div>
      <Field label="Introducción" htmlFor="queEs-intro">
        <TextArea id="queEs-intro" rows={3} value={form.intro} onChange={(e) => setForm({ ...form, intro: e.target.value })} />
      </Field>
      <Field label="Intro de experiencia" htmlFor="queEs-expIntro">
        <TextInput id="queEs-expIntro" value={form.experienceIntro} onChange={(e) => setForm({ ...form, experienceIntro: e.target.value })} />
      </Field>

      <div>
        <p className="mb-2 text-sm font-medium text-fg">Elementos de experiencia</p>
        <FieldArray
          items={experienceItems}
          onChange={setExperienceItems}
          addLabel="Agregar elemento"
          renderItem={(item, _, onChange) => (
            <TextInput
              placeholder="Texto del elemento"
              value={item.text}
              onChange={(e) => onChange({ ...item, text: e.target.value })}
            />
          )}
        />
      </div>

      <SaveButton pending={pending} message={message} />
    </form>
  );
}

function AlianzaSection({ data }: { data: MepielAlianzaSettings }) {
  const { message, pending, save } = useSave("mepielAlianza");
  const [form, setForm] = useState({
    eyebrow: data.eyebrow,
    title: data.title,
    highlight: data.highlight,
    imageUrl: data.imageUrl,
  });
  const [paragraphs, setParagraphs] = useState(() =>
    data.paragraphs.map((text) => ({ id: uid(), text }))
  );

  return (
    <form onSubmit={(e) => { e.preventDefault(); save({ ...form, paragraphs: JSON.stringify(paragraphs.map(({ id, ...p }) => p.text)) }); }} className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Antetítulo" htmlFor="alianza-eyebrow">
          <TextInput id="alianza-eyebrow" value={form.eyebrow} onChange={(e) => setForm({ ...form, eyebrow: e.target.value })} />
        </Field>
        <Field label="Título" htmlFor="alianza-title">
          <TextInput id="alianza-title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        </Field>
        <Field label="Palabra resaltada" htmlFor="alianza-highlight" hint="Debe estar en el título">
          <TextInput id="alianza-highlight" value={form.highlight} onChange={(e) => setForm({ ...form, highlight: e.target.value })} />
        </Field>
      </div>

      <div>
        <p className="mb-2 text-sm font-medium text-fg">Párrafos</p>
        <FieldArray
          items={paragraphs}
          onChange={setParagraphs}
          addLabel="Agregar párrafo"
          renderItem={(item, _, onChange) => (
            <TextArea
              rows={2}
              placeholder="Texto del párrafo"
              value={item.text}
              onChange={(e) => onChange({ ...item, text: e.target.value })}
            />
          )}
        />
      </div>

      <ImageField
        name="imageUrl"
        label="Imagen (URL Cloudinary)"
        defaultValue={form.imageUrl}
      />

      <SaveButton pending={pending} message={message} />
    </form>
  );
}

function BenefitsSection({ data, title, settingKey }: { data: Benefit[]; title: string; settingKey: string }) {
  const { message, pending, save } = useSave(settingKey);
  const [items, setItems] = useState(() =>
    data.map((b) => ({ ...b, id: uid() }))
  );

  return (
    <form onSubmit={(e) => { e.preventDefault(); save({ items: JSON.stringify(items.map(({ id, ...b }) => b)) }); }} className="grid gap-4">
      <p className="text-sm text-muted">{title}</p>
      <FieldArray
        items={items}
        onChange={setItems}
        addLabel="Agregar elemento"
        renderItem={(item, _, onChange) => (
          <div className="grid gap-3 sm:grid-cols-3">
            <TextInput
              placeholder="Emoji"
              value={item.icon}
              onChange={(e) => onChange({ ...item, icon: e.target.value })}
            />
            <TextInput
              placeholder="Título"
              value={item.title}
              onChange={(e) => onChange({ ...item, title: e.target.value })}
            />
            <TextInput
              placeholder="Descripción"
              value={item.description}
              onChange={(e) => onChange({ ...item, description: e.target.value })}
            />
          </div>
        )}
      />
      <SaveButton pending={pending} message={message} />
    </form>
  );
}

function AttendeeTypesSection({ data }: { data: AttendeeType[] }) {
  const { message, pending, save } = useSave("attendeeTypes");
  const [items, setItems] = useState(() =>
    data.map((a) => ({ ...a, id: uid() }))
  );

  return (
    <form onSubmit={(e) => { e.preventDefault(); save({ items: JSON.stringify(items.map(({ id, ...a }) => a)) }); }} className="grid gap-4">
      <FieldArray
        items={items}
        onChange={setItems}
        addLabel="Agregar perfil"
        renderItem={(item, _, onChange) => (
          <div className="grid grid-cols-2 gap-3">
            <TextInput
              placeholder="Emoji"
              value={item.icon}
              onChange={(e) => onChange({ ...item, icon: e.target.value })}
            />
            <TextInput
              placeholder="Etiqueta"
              value={item.label}
              onChange={(e) => onChange({ ...item, label: e.target.value })}
            />
          </div>
        )}
      />
      <SaveButton pending={pending} message={message} />
    </form>
  );
}

function TracksSection({ data }: { data: Track[] }) {
  const { message, pending, save } = useSave("tracks");
  const [items, setItems] = useState(() =>
    data.map((t) => ({ ...t, id: uid() }))
  );

  return (
    <form onSubmit={(e) => { e.preventDefault(); save({ items: JSON.stringify(items.map(({ id, ...t }) => t)) }); }} className="grid gap-4">
      <FieldArray
        items={items}
        onChange={setItems}
        addLabel="Agregar eje"
        renderItem={(item, _, onChange) => (
          <div className="grid gap-3 sm:grid-cols-3">
            <TextInput
              placeholder="Número"
              value={item.num}
              onChange={(e) => onChange({ ...item, num: e.target.value })}
            />
            <TextInput
              placeholder="Título"
              value={item.title}
              onChange={(e) => onChange({ ...item, title: e.target.value })}
            />
            <TextInput
              placeholder="Descripción"
              value={item.description}
              onChange={(e) => onChange({ ...item, description: e.target.value })}
            />
          </div>
        )}
      />
      <SaveButton pending={pending} message={message} />
    </form>
  );
}

function LabsSection({ data }: { data: Lab[] }) {
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [items, setItems] = useState(() =>
    data.map((l) => ({ ...l, clientId: uid() }))
  );

  const handleItemsChange = (newItems: typeof items) => {
    setItems(newItems.map((item) =>
      item.clientId ? item : { ...item, clientId: uid() }
    ));
  };

  const save = () => {
    setMessage(null);
    startTransition(async () => {
      const result = await saveLabsList(
        items.map((item) => ({ id: item.id, name: item.name, imageUrl: item.imageUrl }))
      );
      setMessage(result.ok ? "Guardado ✓" : (result.error ?? "Error al guardar."));
    });
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); save(); }} className="grid gap-4">
      <FieldArray
        items={items}
        onChange={handleItemsChange}
        addLabel="Agregar laboratorio"
        renderItem={(item, _, onChange) => (
          <div className="grid gap-3">
            <TextInput
              placeholder="Nombre"
              value={item.name}
              onChange={(e) => onChange({ ...item, name: e.target.value })}
            />
            <ImageField
              name={`lab-${item.clientId}`}
              label="Logo"
              defaultValue={item.imageUrl}
            />
          </div>
        )}
      />
      <SaveButton pending={pending} message={message} />
    </form>
  );
}

function CtaSection({ data }: { data: CtaCierreSettings }) {
  const { message, pending, save } = useSave("ctaCierre");
  const [description, setDescription] = useState(data.description);

  return (
    <form onSubmit={(e) => { e.preventDefault(); save({ description }); }} className="grid gap-4">
      <Field label="Texto del cierre" htmlFor="cta-desc">
        <TextArea id="cta-desc" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
      </Field>
      <SaveButton pending={pending} message={message} />
    </form>
  );
}

const TABS: TabDef[] = [
  { key: "sitio", label: "Sitio" },
  { key: "hero", label: "Hero" },
  { key: "alianza", label: "Alianza" },
  { key: "queEs", label: "Qué es" },
  { key: "benefits", label: "Beneficios" },
  { key: "attendees", label: "Perfiles" },
  { key: "tracks", label: "Ejes" },
  { key: "labs", label: "Laboratorios" },
  { key: "cta", label: "CTA cierre" },
];

export function ContenidoEditor({
  site,
  hero,
  queEs,
  mepielAlianza,
  benefits,
  attendeeTypes,
  tracks,
  labFeatures,
  ctaCierre,
  labsList,
}: {
  site: SiteInfo;
  hero: HeroSettings;
  queEs: QueEsSettings;
  mepielAlianza: MepielAlianzaSettings;
  benefits: Benefit[];
  attendeeTypes: AttendeeType[];
  tracks: Track[];
  labFeatures: Benefit[];
  ctaCierre: CtaCierreSettings;
  labsList: Lab[];
}) {
  return (
    <SectionTabs tabs={TABS}>
      {(active) => (
        <div className="rounded-2xl border border-border bg-surface/20 p-6">
          {active === "sitio" && <SiteSection data={site} />}
          {active === "hero" && <HeroSection data={hero} />}
          {active === "alianza" && <AlianzaSection data={mepielAlianza} />}
          {active === "queEs" && <QueEsSection data={queEs} />}
          {active === "benefits" && (
            <BenefitsSection
              data={benefits}
              title="Por qué asistir"
              settingKey="benefits"
            />
          )}
          {active === "attendees" && <AttendeeTypesSection data={attendeeTypes} />}
          {active === "tracks" && <TracksSection data={tracks} />}
          {active === "labs" && <LabsSection data={labsList} />}
          {active === "cta" && <CtaSection data={ctaCierre} />}
        </div>
      )}
    </SectionTabs>
  );
}
