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
  SeoSettings,
  HeroSettings,
  QueEsSettings,
  MepielAlianzaSettings,
  LogoSpinSettings,
  EditionsModalSettings,
  EditionsPanelSettings,
  SectionHeader,
  RegistroSettings,
  FooterSettings,
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

function SeoSection({ data }: { data: SeoSettings }) {
  const { message, pending, save } = useSave("seo");
  const [form, setForm] = useState(data);

  return (
    <form onSubmit={(e) => { e.preventDefault(); save(form as unknown as Record<string, unknown>); }} className="grid gap-4">
      <Field label="Título de página (title tag)" htmlFor="seo-title">
        <TextInput id="seo-title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
      </Field>
      <Field label="Nombre del sitio" htmlFor="seo-siteName">
        <TextInput id="seo-siteName" value={form.siteName} onChange={(e) => setForm({ ...form, siteName: e.target.value })} />
      </Field>
      <Field label="Keywords" htmlFor="seo-keywords" hint="Separadas por comas">
        <TextArea id="seo-keywords" rows={2} value={form.keywords} onChange={(e) => setForm({ ...form, keywords: e.target.value })} />
      </Field>
      <Field label="Descripción (meta description)" htmlFor="seo-description">
        <TextArea id="seo-description" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
      </Field>
      <SaveButton pending={pending} message={message} />
    </form>
  );
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
  const [form, setForm] = useState(data);
  const [metrics, setMetrics] = useState(() =>
    data.metrics.map((m) => ({ ...m, id: uid() }))
  );

  return (
    <form onSubmit={(e) => { e.preventDefault(); save({ headline: form.headline, videoId: form.videoId, metrics: JSON.stringify(metrics.map(({ id, ...m }) => m)) }); }} className="grid gap-4">
      <Field label="Headline (H1)" htmlFor="hero-headline" hint="Título principal del hero">
        <TextArea id="hero-headline" rows={3} value={form.headline} onChange={(e) => setForm({ ...form, headline: e.target.value })} />
      </Field>
      <Field label="Video de fondo (ID de YouTube)" htmlFor="hero-video">
        <TextInput id="hero-video" value={form.videoId} onChange={(e) => setForm({ ...form, videoId: e.target.value })} />
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

function AlianzaSection({ data }: { data: MepielAlianzaSettings }) {
  const { message, pending, save } = useSave("mepielAlianza");
  const [form, setForm] = useState({
    eyebrow: data.eyebrow,
    title: data.title,
    highlight: data.highlight,
    imageUrl: data.imageUrl,
    imageAlt: data.imageAlt,
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
        <Field label="Alt de imagen" htmlFor="alianza-imageAlt">
          <TextInput id="alianza-imageAlt" value={form.imageAlt} onChange={(e) => setForm({ ...form, imageAlt: e.target.value })} />
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

function LogoSpinSection({ data }: { data: LogoSpinSettings }) {
  const { message, pending, save } = useSave("logoSpin");
  const [form, setForm] = useState(data);

  return (
    <form onSubmit={(e) => { e.preventDefault(); save(form as unknown as Record<string, unknown>); }} className="grid gap-4">
      <ImageField
        name="logoUrl"
        label="Logo del spinner"
        defaultValue={form.logoUrl}
      />
      <SaveButton pending={pending} message={message} />
    </form>
  );
}

function QueEsSection({ data }: { data: QueEsSettings }) {
  const { message, pending, save } = useSave("queEs");
  const [form, setForm] = useState({
    eyebrow: data.eyebrow,
    title: data.title,
    highlight: data.highlight,
    intro: data.intro,
    experienceIntro: data.experienceIntro,
    imageUrl: data.imageUrl,
    imageAlt: data.imageAlt,
  });
  const [experienceItems, setExperienceItems] = useState(() =>
    data.experienceItems.map((text) => ({ id: uid(), text }))
  );

  return (
    <form onSubmit={(e) => { e.preventDefault(); save({ ...form, experienceItems: JSON.stringify(experienceItems.map(({ id, ...i }) => i.text)) }); }} className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Eyebrow" htmlFor="queEs-eyebrow">
          <TextInput id="queEs-eyebrow" value={form.eyebrow} onChange={(e) => setForm({ ...form, eyebrow: e.target.value })} />
        </Field>
        <Field label="Título" htmlFor="queEs-title">
          <TextInput id="queEs-title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        </Field>
        <Field label="Palabra resaltada" htmlFor="queEs-highlight" hint="Debe estar en el título">
          <TextInput id="queEs-highlight" value={form.highlight} onChange={(e) => setForm({ ...form, highlight: e.target.value })} />
        </Field>
        <Field label="Alt de imagen" htmlFor="queEs-imageAlt">
          <TextInput id="queEs-imageAlt" value={form.imageAlt} onChange={(e) => setForm({ ...form, imageAlt: e.target.value })} />
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

      <ImageField
        name="imageUrl"
        label="Imagen de la sección"
        defaultValue={form.imageUrl}
      />

      <SaveButton pending={pending} message={message} />
    </form>
  );
}

function EditionsSection({
  modalData,
  panelData,
}: {
  modalData: EditionsModalSettings;
  panelData: EditionsPanelSettings;
}) {
  const modalSave = useSave("editionsModal");
  const panelSave = useSave("editionsPanel");
  const [modal, setModal] = useState(modalData);
  const [panel, setPanel] = useState(panelData);

  return (
    <div className="grid gap-6">
      <form onSubmit={(e) => { e.preventDefault(); modalSave.save(modal as unknown as Record<string, unknown>); }} className="grid gap-4 rounded-xl border border-border bg-surface/20 p-4">
        <p className="text-sm font-semibold text-fg">Modal de detalle</p>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Título ponentes" htmlFor="modal-speakersTitle">
            <TextInput id="modal-speakersTitle" value={modal.speakersTitle} onChange={(e) => setModal({ ...modal, speakersTitle: e.target.value })} />
          </Field>
          <Field label="Descripción ponentes" htmlFor="modal-speakersDesc">
            <TextInput id="modal-speakersDesc" value={modal.speakersDescription} onChange={(e) => setModal({ ...modal, speakersDescription: e.target.value })} />
          </Field>
          <Field label="Título laboratorios" htmlFor="modal-labsTitle">
            <TextInput id="modal-labsTitle" value={modal.labsTitle} onChange={(e) => setModal({ ...modal, labsTitle: e.target.value })} />
          </Field>
          <Field label="Descripción laboratorios" htmlFor="modal-labsDesc">
            <TextInput id="modal-labsDesc" value={modal.labsDescription} onChange={(e) => setModal({ ...modal, labsDescription: e.target.value })} />
          </Field>
        </div>
        <SaveButton pending={modalSave.pending} message={modalSave.message} />
      </form>

      <form onSubmit={(e) => { e.preventDefault(); panelSave.save(panel as unknown as Record<string, unknown>); }} className="grid gap-4 rounded-xl border border-border bg-surface/20 p-4">
        <p className="text-sm font-semibold text-fg">Botón de panel</p>
        <Field label="Texto del botón 'Ver más'" htmlFor="panel-viewMoreText">
          <TextInput id="panel-viewMoreText" value={panel.viewMoreText} onChange={(e) => setPanel({ ...panel, viewMoreText: e.target.value })} />
        </Field>
        <SaveButton pending={panelSave.pending} message={panelSave.message} />
      </form>
    </div>
  );
}

function SectionHeaderEditor({ data, settingKey }: { data: SectionHeader; settingKey: string }) {
  const { message, pending, save } = useSave(settingKey);
  const [form, setForm] = useState(data);

  return (
    <form onSubmit={(e) => { e.preventDefault(); save(form as unknown as Record<string, unknown>); }} className="grid gap-4 sm:grid-cols-2">
      <Field label="Eyebrow" htmlFor={`${settingKey}-eyebrow`}>
        <TextInput id={`${settingKey}-eyebrow`} value={form.eyebrow} onChange={(e) => setForm({ ...form, eyebrow: e.target.value })} />
      </Field>
      <Field label="Título (H2)" htmlFor={`${settingKey}-title`}>
        <TextInput id={`${settingKey}-title`} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
      </Field>
      <SaveButton pending={pending} message={message} />
    </form>
  );
}

function RegistroSection({ data }: { data: RegistroSettings }) {
  const { message, pending, save } = useSave("registroSection");
  const [form, setForm] = useState(data);

  return (
    <form onSubmit={(e) => { e.preventDefault(); save(form as unknown as Record<string, unknown>); }} className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Eyebrow" htmlFor="reg-eyebrow">
          <TextInput id="reg-eyebrow" value={form.eyebrow} onChange={(e) => setForm({ ...form, eyebrow: e.target.value })} />
        </Field>
        <Field label="Título (H2)" htmlFor="reg-title">
          <TextInput id="reg-title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        </Field>
      </div>
      <Field label="Descripción" htmlFor="reg-desc">
        <TextArea id="reg-desc" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
      </Field>
      <Field label="Texto de validación" htmlFor="reg-validation">
        <TextArea id="reg-validation" rows={3} value={form.validationText} onChange={(e) => setForm({ ...form, validationText: e.target.value })} />
      </Field>
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Label '¿Tienes dudas?'" htmlFor="reg-dudasLabel">
          <TextInput id="reg-dudasLabel" value={form.dudasLabel} onChange={(e) => setForm({ ...form, dudasLabel: e.target.value })} />
        </Field>
        <Field label="Texto del link" htmlFor="reg-dudasLink">
          <TextInput id="reg-dudasLink" value={form.dudasLinkText} onChange={(e) => setForm({ ...form, dudasLinkText: e.target.value })} />
        </Field>
        <Field label="Texto del botón" htmlFor="reg-submitBtn">
          <TextInput id="reg-submitBtn" value={form.submitButtonText} onChange={(e) => setForm({ ...form, submitButtonText: e.target.value })} />
        </Field>
      </div>
      <SaveButton pending={pending} message={message} />
    </form>
  );
}

function FooterSection({ data }: { data: FooterSettings }) {
  const { message, pending, save } = useSave("footer");
  const [form, setForm] = useState({
    description: data.description,
    copyright: data.copyright,
    logoUrl: data.logoUrl,
    privacyLinkText: data.privacyLinkText,
    privacyLinkUrl: data.privacyLinkUrl,
  });
  const [eventLinks, setEventLinks] = useState(() =>
    data.eventLinks.map((l) => ({ ...l, id: uid() }))
  );
  const [participateLinks, setParticipateLinks] = useState(() =>
    data.participateLinks.map((l) => ({ ...l, id: uid() }))
  );
  const [contactLinks, setContactLinks] = useState(() =>
    data.contactLinks.map((l) => ({ ...l, id: uid() }))
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    save({
      ...form,
      eventLinks: JSON.stringify(eventLinks.map(({ id, ...l }) => l)),
      participateLinks: JSON.stringify(participateLinks.map(({ id, ...l }) => l)),
      contactLinks: JSON.stringify(contactLinks.map(({ id, ...l }) => l)),
    } as unknown as Record<string, unknown>);
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <ImageField name="logoUrl" label="Logo del footer" defaultValue={form.logoUrl} />
      <Field label="Descripción" htmlFor="footer-desc">
        <TextArea id="footer-desc" rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Copyright" htmlFor="footer-copyright">
          <TextInput id="footer-copyright" value={form.copyright} onChange={(e) => setForm({ ...form, copyright: e.target.value })} />
        </Field>
        <Field label="Texto link privacidad" htmlFor="footer-privacyText">
          <TextInput id="footer-privacyText" value={form.privacyLinkText} onChange={(e) => setForm({ ...form, privacyLinkText: e.target.value })} />
        </Field>
        <Field label="URL link privacidad" htmlFor="footer-privacyUrl">
          <TextInput id="footer-privacyUrl" value={form.privacyLinkUrl} onChange={(e) => setForm({ ...form, privacyLinkUrl: e.target.value })} />
        </Field>
      </div>

      <div>
        <p className="mb-2 text-sm font-medium text-fg">Links de evento</p>
        <FieldArray
          items={eventLinks}
          onChange={setEventLinks}
          addLabel="Agregar link"
          renderItem={(item, _, onChange) => (
            <div className="grid grid-cols-2 gap-3">
              <TextInput placeholder="Label" value={item.label} onChange={(e) => onChange({ ...item, label: e.target.value })} />
              <TextInput placeholder="Href" value={item.href} onChange={(e) => onChange({ ...item, href: e.target.value })} />
            </div>
          )}
        />
      </div>

      <div>
        <p className="mb-2 text-sm font-medium text-fg">Links de participación</p>
        <FieldArray
          items={participateLinks}
          onChange={setParticipateLinks}
          addLabel="Agregar link"
          renderItem={(item, _, onChange) => (
            <div className="grid grid-cols-2 gap-3">
              <TextInput placeholder="Label" value={item.label} onChange={(e) => onChange({ ...item, label: e.target.value })} />
              <TextInput placeholder="Href" value={item.href} onChange={(e) => onChange({ ...item, href: e.target.value })} />
            </div>
          )}
        />
      </div>

      <div>
        <p className="mb-2 text-sm font-medium text-fg">Links de contacto</p>
        <FieldArray
          items={contactLinks}
          onChange={setContactLinks}
          addLabel="Agregar link"
          renderItem={(item, _, onChange) => (
            <div className="grid grid-cols-2 gap-3">
              <TextInput placeholder="Label" value={item.label} onChange={(e) => onChange({ ...item, label: e.target.value })} />
              <TextInput placeholder="Href" value={item.href} onChange={(e) => onChange({ ...item, href: e.target.value })} />
            </div>
          )}
        />
      </div>

      <SaveButton pending={pending} message={message} />
    </form>
  );
}

function LabsListSection({ data }: { data: Lab[] }) {
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
              onChange={(url) => onChange({ ...item, imageUrl: url })}
            />
          </div>
        )}
      />
      <SaveButton pending={pending} message={message} />
    </form>
  );
}

const TABS: TabDef[] = [
  { key: "seo", label: "SEO" },
  { key: "sitio", label: "Sitio" },
  { key: "hero", label: "Hero" },
  { key: "alianza", label: "Alianza" },
  { key: "logoSpin", label: "Logo Spinner" },
  { key: "queEs", label: "Acerca de" },
  { key: "ediciones", label: "Ediciones" },
  { key: "labsSection", label: "Laboratorios" },
  { key: "expositores", label: "Ponentes" },
  { key: "registro", label: "Registro" },
  { key: "footer", label: "Footer" },
  { key: "labsList", label: "Lista Labs" },
];

export function ContenidoEditor({
  seo,
  site,
  hero,
  queEs,
  mepielAlianza,
  logoSpin,
  editionsModal,
  editionsPanel,
  labsSection,
  expositoresSection,
  registroSection,
  footer,
  labsList,
}: {
  seo: SeoSettings;
  site: SiteInfo;
  hero: HeroSettings;
  queEs: QueEsSettings;
  mepielAlianza: MepielAlianzaSettings;
  logoSpin: LogoSpinSettings;
  editionsModal: EditionsModalSettings;
  editionsPanel: EditionsPanelSettings;
  labsSection: SectionHeader;
  expositoresSection: SectionHeader;
  registroSection: RegistroSettings;
  footer: FooterSettings;
  labsList: Lab[];
}) {
  return (
    <SectionTabs tabs={TABS}>
      {(active) => (
        <div className="rounded-2xl border border-border bg-surface/20 p-6">
          {active === "seo" && <SeoSection data={seo} />}
          {active === "sitio" && <SiteSection data={site} />}
          {active === "hero" && <HeroSection data={hero} />}
          {active === "alianza" && <AlianzaSection data={mepielAlianza} />}
          {active === "logoSpin" && <LogoSpinSection data={logoSpin} />}
          {active === "queEs" && <QueEsSection data={queEs} />}
          {active === "ediciones" && <EditionsSection modalData={editionsModal} panelData={editionsPanel} />}
          {active === "labsSection" && <SectionHeaderEditor data={labsSection} settingKey="labsSection" />}
          {active === "expositores" && <SectionHeaderEditor data={expositoresSection} settingKey="expositoresSection" />}
          {active === "registro" && <RegistroSection data={registroSection} />}
          {active === "footer" && <FooterSection data={footer} />}
          {active === "labsList" && <LabsListSection data={labsList} />}
        </div>
      )}
    </SectionTabs>
  );
}
