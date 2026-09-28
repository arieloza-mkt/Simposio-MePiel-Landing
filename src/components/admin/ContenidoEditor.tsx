"use client";

import { useState, useTransition } from "react";
import { saveContentSetting } from "@/app/actions/admin/content";
import { saveLabsList } from "@/app/actions/admin/labs";
import { FieldArray } from "@/components/admin/FieldArray";
import { ImageField } from "@/components/admin/ImageField";
import { Button, Field, Select, TextInput, TextArea } from "@/components/admin/ui";
import { TipTapEditor } from "./TipTapEditor";
import { heroStyleKey, type HeroStyleField } from "@/lib/hero-style";
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

const isHex = (v: string) => /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(v);

/* "mono" era un alias de Montserrat (igual que "body"), así que el select
   solo ofrece las dos familias reales y normaliza el valor guardado. */
const fontFamily = (v?: string) => (v === "display" ? "display" : "body");

const WEIGHT_LABELS: Record<string, string> = {
  "": "Sin cambio (400)",
  "300": "Light (300)",
  "400": "Regular (400)",
  "500": "Medium (500)",
  "600": "Semibold (600)",
  "700": "Bold (700)",
  "900": "Black (900)",
};

/* Los estilos del título se editan por dispositivo: escritorio y móvil. El
   breakpoint lo fija globals.css (`screen and (max-width: 1000px)`). */
type Viewport = "desktop" | "mobile";

const VIEWPORTS: { value: Viewport; label: string; hint: string }[] = [
  {
    value: "desktop",
    label: "Escritorio",
    hint: "Se aplica en pantallas de más de 1000px de ancho.",
  },
  {
    value: "mobile",
    label: "Móvil",
    hint: "Se aplica en `screen and (max-width: 1000px)`. Los campos vacíos usan el valor de escritorio.",
  },
];

const STYLE_FIELDS = [
  "FontSize",
  "FontFamily",
  "FontWeight",
  "FontStyle",
  "Color",
] as const satisfies readonly HeroStyleField[];

/* h1FontSize → h1-font-size, h2ColorMobile → h2-color-mobile. */
const fieldId = (key: string) =>
  `hero-${key.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase()}`;

function ViewportTabs({
  value,
  onChange,
}: {
  value: Viewport;
  onChange: (next: Viewport) => void;
}) {
  return (
    <div
      role="tablist"
      aria-label="Dispositivo"
      className="inline-flex shrink-0 rounded-lg border border-border p-1"
    >
      {VIEWPORTS.map((viewport) => (
        <button
          key={viewport.value}
          type="button"
          role="tab"
          aria-selected={value === viewport.value}
          onClick={() => onChange(viewport.value)}
          className={`rounded-md px-4 py-1.5 text-sm font-medium transition ${
            value === viewport.value
              ? "bg-accent text-accent-foreground"
              : "text-muted-foreground hover:text-fg"
          }`}
        >
          {viewport.label}
        </button>
      ))}
    </div>
  );
}

function HeadlineStyleFields({
  level,
  viewport,
  form,
  setForm,
}: {
  level: 1 | 2;
  viewport: Viewport;
  form: Record<string, string>;
  setForm: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}) {
  const mobile = viewport === "mobile";
  const key = (field: HeroStyleField) =>
    heroStyleKey(level, field, mobile);
  const value = (field: HeroStyleField) => form[key(field)] ?? "";
  const update = (field: HeroStyleField, next: string) =>
    setForm((prev) => ({ ...prev, [key(field)]: next }));

  const inheritHint = "Vacío = tamaño responsive actual.";
  const mobileHint = "Vacío = se usa el valor de escritorio.";

  return (
    <fieldset className="grid gap-4 rounded-lg border border-border p-4">
      <legend className="px-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        Estilo del H{level} · {mobile ? "móvil" : "escritorio"}
      </legend>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Field
          label="Tamaño"
          htmlFor={fieldId(key("FontSize"))}
          hint={mobile ? mobileHint : inheritHint}
        >
          <TextInput
            id={fieldId(key("FontSize"))}
            placeholder={mobile ? "40px" : "clamp(48px, 7vw, 88px)"}
            value={value("FontSize")}
            onChange={(e) => update("FontSize", e.target.value)}
          />
        </Field>
        <Field label="Tipografía" htmlFor={fieldId(key("FontFamily"))}>
          <Select
            id={fieldId(key("FontFamily"))}
            value={value("FontFamily")}
            onChange={(e) => update("FontFamily", e.target.value)}
          >
            {mobile && <option value="">Igual que escritorio</option>}
            <option value="display">Bebas Neue</option>
            <option value="body">Montserrat</option>
          </Select>
        </Field>
        <Field
          label="Peso"
          htmlFor={fieldId(key("FontWeight"))}
          hint="Bebas Neue solo tiene 400; el navegador sintetiza el resto."
        >
          <Select
            id={fieldId(key("FontWeight"))}
            value={value("FontWeight")}
            onChange={(e) => update("FontWeight", e.target.value)}
          >
            {Object.entries(WEIGHT_LABELS).map(([weight, label]) => (
              <option key={weight} value={weight}>
                {mobile && weight === "" ? "Igual que escritorio" : label}
              </option>
            ))}
          </Select>
        </Field>
        <Field
          label="Estilo"
          htmlFor={fieldId(key("FontStyle"))}
          hint="Ninguna fuente carga cursiva real; se sintetiza."
        >
          <Select
            id={fieldId(key("FontStyle"))}
            value={value("FontStyle")}
            onChange={(e) => update("FontStyle", e.target.value)}
          >
            <option value="">{mobile ? "Igual que escritorio" : "Sin cambio (normal)"}</option>
            <option value="normal">Normal</option>
            <option value="italic">Cursiva (italic)</option>
          </Select>
        </Field>
        <Field
          label="Color"
          htmlFor={fieldId(key("Color"))}
          hint={mobile ? mobileHint : "Vacío = blanco."}
        >
          <div className="flex items-center gap-2">
            <input
              type="color"
              aria-label={`Color del H${level} (${viewport})`}
              className="h-9 w-11 shrink-0 cursor-pointer rounded-md border border-input bg-transparent p-1"
              value={isHex(value("Color")) ? value("Color") : "#ffffff"}
              onChange={(e) => update("Color", e.target.value)}
            />
            <TextInput
              id={fieldId(key("Color"))}
              placeholder="#ffffff"
              value={value("Color")}
              onChange={(e) => update("Color", e.target.value)}
            />
          </div>
        </Field>
      </div>
    </fieldset>
  );
}

function SaveButton({ pending, message }: { pending: boolean; message: string | null }) {
  return (
    <div className="flex items-center gap-3">
      <Button type="submit" disabled={pending}>
        {pending ? "Guardando…" : "Guardar"}
      </Button>
      {message && (
        <p className={`text-sm ${message.includes("✓") ? "text-emerald-600 dark:text-emerald-400" : "text-error"}`}>
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

export function SeoEditor({ data }: { data: SeoSettings }) {
  const { message, pending, save } = useSave("seo");
  const [form, setForm] = useState({
    title: data.title ?? "",
    siteName: data.siteName ?? "",
    keywords: data.keywords ?? "",
    description: data.description ?? "",
  });

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

export function SiteEditor({ data }: { data: SiteInfo }) {
  const { message, pending, save } = useSave("site");
  const [form, setForm] = useState({
    name: data.name ?? "",
    edition: data.edition ?? "",
    year: Number(data.year) || 0,
    tagline: data.tagline ?? "",
    description: data.description ?? "",
  });

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

export function HeroEditor({ data }: { data: HeroSettings }) {
  const { message, pending, save } = useSave("hero");
  const [viewport, setViewport] = useState<Viewport>("desktop");
  const [form, setForm] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {
      h1: data.h1 ?? "",
      h2: data.h2 ?? "",
      subtitle: data.subtitle ?? "",
      videoId: data.videoId ?? "",
    };
    for (const level of [1, 2] as const) {
      for (const mobile of [false, true]) {
        for (const field of STYLE_FIELDS) {
          const key = heroStyleKey(level, field, mobile);
          const value = data[key] ?? "";
          // La tipografía de escritorio siempre tiene valor: el select no
          // admite "" y se normaliza a Bebas si el dato guardado falta.
          initial[key] =
            field === "FontFamily" && !mobile ? fontFamily(value) : value;
        }
      }
    }
    return initial;
  });
  const [metrics, setMetrics] = useState(() =>
    (data.metrics ?? []).map((m) => ({ ...m, id: uid() }))
  );
  const viewportMeta = VIEWPORTS.find((v) => v.value === viewport);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        save({
          ...form,
          metrics: JSON.stringify(metrics.map(({ id, ...m }) => m)),
        });
      }}
      className="grid gap-4"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Título H1" htmlFor="hero-h1" hint="Texto plano. Es el encabezado principal de la página.">
          <TextInput
            id="hero-h1"
            value={form.h1}
            maxLength={120}
            placeholder="Una alianza que impulsa tu práctica."
            onChange={(e) => setForm((prev) => ({ ...prev, h1: e.target.value }))}
          />
        </Field>
        <Field label="Subtítulo H2" htmlFor="hero-h2" hint="Segunda línea. Si lo dejas vacío no se muestra.">
          <TextInput
            id="hero-h2"
            value={form.h2}
            maxLength={160}
            placeholder="Una experiencia que reconoce tu confianza."
            onChange={(e) => setForm((prev) => ({ ...prev, h2: e.target.value }))}
          />
        </Field>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <ViewportTabs value={viewport} onChange={setViewport} />
        {viewportMeta && (
          <p className="text-xs text-muted-foreground">{viewportMeta.hint}</p>
        )}
      </div>

      <HeadlineStyleFields
        level={1}
        viewport={viewport}
        form={form}
        setForm={setForm}
      />
      <HeadlineStyleFields
        level={2}
        viewport={viewport}
        form={form}
        setForm={setForm}
      />

      <Field label="Subtítulo" htmlFor="hero-subtitle" hint="Texto de apoyo debajo del título. Antes se tomaba de la descripción del sitio.">
        <TipTapEditor
          value={form.subtitle}
          onChange={(html) => setForm((prev) => ({ ...prev, subtitle: html }))}
          placeholder="Escribe el subtítulo…"
        />
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

export function AlianzaEditor({ data }: { data: MepielAlianzaSettings }) {
  const { message, pending, save } = useSave("mepielAlianza");
  const [form, setForm] = useState({
    eyebrow: data.eyebrow ?? "",
    title: data.title ?? "",
    highlight: data.highlight ?? "",
    imageUrl: data.imageUrl ?? "",
    imageAlt: data.imageAlt ?? "",
  });
  const [titleLines, setTitleLines] = useState(() =>
    [0, 1, 2, 3].map(
      (i) =>
        (Array.isArray(data.titleLines)
          ? data.titleLines
          : [data.title])[i] ?? "",
    ),
  );
  const [paragraphs, setParagraphs] = useState(() =>
    (data.paragraphs ?? []).map((text) => ({ id: uid(), text }))
  );
  const [images, setImages] = useState(() =>
    (data.images?.length ? data.images : data.imageUrl ? [data.imageUrl] : []).map(
      (url) => ({ id: uid(), url }),
    )
  );

  return (
    <form onSubmit={(e) => { e.preventDefault(); save({ ...form, titleLines: JSON.stringify(titleLines), paragraphs: JSON.stringify(paragraphs.map(({ id, ...p }) => p.text)), images: JSON.stringify(images.map(({ id, ...i }) => i.url)) }); }} className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Antetítulo" htmlFor="alianza-eyebrow">
          <TextInput id="alianza-eyebrow" value={form.eyebrow} onChange={(e) => setForm({ ...form, eyebrow: e.target.value })} />
        </Field>
        <Field label="Alt de imagen" htmlFor="alianza-imageAlt">
          <TextInput id="alianza-imageAlt" value={form.imageAlt} onChange={(e) => setForm({ ...form, imageAlt: e.target.value })} />
        </Field>
      </div>

      <div className="rounded-xl border border-border bg-surface/20 p-4">
        <p className="mb-3 text-sm font-semibold text-fg">Título por líneas (estilo de sección)</p>
        <div className="grid gap-3">
          <Field label="Línea 1 · Montserrat Bold" htmlFor="alianza-line-0">
            <TextInput id="alianza-line-0" value={titleLines[0]} onChange={(e) => setTitleLines([e.target.value, titleLines[1], titleLines[2], titleLines[3]])} />
          </Field>
          <Field label="Línea 2 · Montserrat Bold" htmlFor="alianza-line-1" hint="Va junto a la línea 3">
            <TextInput id="alianza-line-1" value={titleLines[1]} onChange={(e) => setTitleLines([titleLines[0], e.target.value, titleLines[2], titleLines[3]])} />
          </Field>
          <Field label="Línea 3 · Bebas rosa, más grande" htmlFor="alianza-line-2" hint="Va junto a la línea 2">
            <TextInput id="alianza-line-2" value={titleLines[2]} onChange={(e) => setTitleLines([titleLines[0], titleLines[1], e.target.value, titleLines[3]])} />
          </Field>
          <Field label="Línea 4 · Montserrat Light" htmlFor="alianza-line-3">
            <TextInput id="alianza-line-3" value={titleLines[3]} onChange={(e) => setTitleLines([titleLines[0], titleLines[1], titleLines[2], e.target.value])} />
          </Field>
        </div>
        <p className="mt-3 text-xs text-muted">Campos de fallback (se usan si no hay líneas):</p>
        <div className="mt-2 grid gap-3 sm:grid-cols-2">
          <Field label="Título completo" htmlFor="alianza-title">
            <TextInput id="alianza-title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </Field>
          <Field label="Palabra resaltada" htmlFor="alianza-highlight" hint="Debe estar en el título">
            <TextInput id="alianza-highlight" value={form.highlight} onChange={(e) => setForm({ ...form, highlight: e.target.value })} />
          </Field>
        </div>
      </div>

      <div>
        <p className="mb-2 text-sm font-medium text-fg">Párrafos</p>
        <FieldArray
          items={paragraphs}
          onChange={setParagraphs}
          addLabel="Agregar párrafo"
          renderItem={(item, _, onChange) => (
            <TipTapEditor
              value={item.text}
              onChange={(html) => onChange({ ...item, text: html })}
              placeholder="Texto del párrafo"
            />
          )}
        />
      </div>

      <div>
        <p className="mb-2 text-sm font-medium text-fg">Imágenes del slider (6 slides, se muestran 3 por vista y avanza de uno en uno)</p>
        <FieldArray
          items={images}
          onChange={setImages}
          addLabel="Agregar imagen"
          renderItem={(item, _, onChange) => (
            <ImageField
              name={`alianza-slide-${item.id}`}
              label="Slide"
              defaultValue={item.url}
              onChange={(url) => onChange({ ...item, url })}
            />
          )}
        />
      </div>

      <ImageField
        name="imageUrl"
        label="Imagen principal (URL Cloudinary, fallback)"
        defaultValue={form.imageUrl}
        onChange={(url) => setForm({ ...form, imageUrl: url })}
      />

      <SaveButton pending={pending} message={message} />
    </form>
  );
}

export function LogoSpinEditor({ data }: { data: LogoSpinSettings }) {
  const { message, pending, save } = useSave("logoSpin");
  const [form, setForm] = useState({ logoUrl: data.logoUrl ?? "" });

  return (
    <form onSubmit={(e) => { e.preventDefault(); save(form as unknown as Record<string, unknown>); }} className="grid gap-4">
      <ImageField
        name="logoUrl"
        label="Logo del spinner"
        defaultValue={form.logoUrl}
        onChange={(url) => setForm({ ...form, logoUrl: url })}
      />
      <SaveButton pending={pending} message={message} />
    </form>
  );
}

export function QueEsEditor({ data }: { data: QueEsSettings }) {
  const { message, pending, save } = useSave("queEs");
  const [form, setForm] = useState({
    eyebrow: data.eyebrow ?? "",
    title: data.title ?? "",
    highlight: data.highlight ?? "",
    intro: data.intro ?? "",
    experienceIntro: data.experienceIntro ?? "",
    imageUrl: data.imageUrl ?? "",
    imageAlt: data.imageAlt ?? "",
  });
  const [experienceItems, setExperienceItems] = useState(() =>
    (data.experienceItems ?? []).map((text) => ({ id: uid(), text }))
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
        <TipTapEditor
          value={form.intro}
          onChange={(html) => setForm({ ...form, intro: html })}
          placeholder="Texto de introducción"
        />
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
            <TipTapEditor
              value={item.text}
              onChange={(html) => onChange({ ...item, text: html })}
              placeholder="Texto del elemento"
            />
          )}
        />
      </div>

      <ImageField
        name="imageUrl"
        label="Imagen de la sección"
        defaultValue={form.imageUrl}
        onChange={(url) => setForm({ ...form, imageUrl: url })}
      />

      <SaveButton pending={pending} message={message} />
    </form>
  );
}

export function EditionsEditor({
  modalData,
  panelData,
}: {
  modalData: EditionsModalSettings;
  panelData: EditionsPanelSettings;
}) {
  const modalSave = useSave("editionsModal");
  const panelSave = useSave("editionsPanel");
  const [modal, setModal] = useState({
    speakersTitle: modalData.speakersTitle ?? "",
    speakersDescription: modalData.speakersDescription ?? "",
    labsTitle: modalData.labsTitle ?? "",
    labsDescription: modalData.labsDescription ?? "",
  });
  const [panel, setPanel] = useState({ viewMoreText: panelData.viewMoreText ?? "" });

  return (
    <div className="grid gap-6">
      <form onSubmit={(e) => { e.preventDefault(); modalSave.save(modal as unknown as Record<string, unknown>); }} className="grid gap-4 rounded-xl border border-border bg-surface/20 p-4">
        <p className="text-sm font-semibold text-fg">Modal de detalle</p>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Título ponentes" htmlFor="modal-speakersTitle">
            <TextInput id="modal-speakersTitle" value={modal.speakersTitle} onChange={(e) => setModal({ ...modal, speakersTitle: e.target.value })} />
          </Field>
          <Field label="Descripción ponentes" htmlFor="modal-speakersDesc">
            <TipTapEditor
              value={modal.speakersDescription}
              onChange={(html) => setModal({ ...modal, speakersDescription: html })}
              placeholder="Descripción de ponentes"
            />
          </Field>
          <Field label="Título laboratorios" htmlFor="modal-labsTitle">
            <TextInput id="modal-labsTitle" value={modal.labsTitle} onChange={(e) => setModal({ ...modal, labsTitle: e.target.value })} />
          </Field>
          <Field label="Descripción laboratorios" htmlFor="modal-labsDesc">
            <TipTapEditor
              value={modal.labsDescription}
              onChange={(html) => setModal({ ...modal, labsDescription: html })}
              placeholder="Descripción de laboratorios"
            />
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

export function SectionHeaderEditor({ data, settingKey }: { data: SectionHeader; settingKey: string }) {
  const { message, pending, save } = useSave(settingKey);
  const [form, setForm] = useState({
    eyebrow: data.eyebrow ?? "",
    title: data.title ?? "",
  });

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

export function RegistroEditor({ data }: { data: RegistroSettings }) {
  const { message, pending, save } = useSave("registroSection");
  const [form, setForm] = useState({
    eyebrow: data.eyebrow ?? "",
    title: data.title ?? "",
    description: data.description ?? "",
    validationText: data.validationText ?? "",
    dudasLabel: data.dudasLabel ?? "",
    dudasLinkText: data.dudasLinkText ?? "",
    submitButtonText: data.submitButtonText ?? "",
  });

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
        <TipTapEditor
          value={form.description}
          onChange={(html) => setForm({ ...form, description: html })}
          placeholder="Descripción del registro"
        />
      </Field>
      <Field label="Texto de validación" htmlFor="reg-validation">
        <TipTapEditor
          value={form.validationText}
          onChange={(html) => setForm({ ...form, validationText: html })}
          placeholder="Texto de validación"
        />
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

export function FooterEditor({ data }: { data: FooterSettings }) {
  const { message, pending, save } = useSave("footer");
  const [form, setForm] = useState({
    description: data.description ?? "",
    copyright: data.copyright ?? "",
    logoUrl: data.logoUrl ?? "",
    privacyLinkText: data.privacyLinkText ?? "",
    privacyLinkUrl: data.privacyLinkUrl ?? "",
  });
  const [eventLinks, setEventLinks] = useState(() =>
    (data.eventLinks ?? []).map((l) => ({ ...l, id: uid() }))
  );
  const [participateLinks, setParticipateLinks] = useState(() =>
    (data.participateLinks ?? []).map((l) => ({ ...l, id: uid() }))
  );
  const [contactLinks, setContactLinks] = useState(() =>
    (data.contactLinks ?? []).map((l) => ({ ...l, id: uid() }))
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
      <ImageField name="logoUrl" label="Logo del footer" defaultValue={form.logoUrl} onChange={(url) => setForm({ ...form, logoUrl: url })} />
      <Field label="Descripción" htmlFor="footer-desc">
        <TipTapEditor
          value={form.description}
          onChange={(html) => setForm({ ...form, description: html })}
          placeholder="Descripción del footer"
        />
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

export function LabsListEditor({ data }: { data: Lab[] }) {
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

export function ContenidoSectionEditor({
  slug,
  content,
}: {
  slug: string;
  content: {
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
  };
}) {
  return (
    <div className="rounded-2xl border border-border bg-surface/20 p-6">
      {slug === "seo" && <SeoEditor data={content.seo} />}
      {slug === "sitio" && <SiteEditor data={content.site} />}
      {slug === "hero" && <HeroEditor data={content.hero} />}
      {slug === "alianza" && <AlianzaEditor data={content.mepielAlianza} />}
      {slug === "logoSpin" && <LogoSpinEditor data={content.logoSpin} />}
      {slug === "queEs" && <QueEsEditor data={content.queEs} />}
      {slug === "ediciones" && <EditionsEditor modalData={content.editionsModal} panelData={content.editionsPanel} />}
      {slug === "labsSection" && <SectionHeaderEditor data={content.labsSection} settingKey="labsSection" />}
      {slug === "expositores" && <SectionHeaderEditor data={content.expositoresSection} settingKey="expositoresSection" />}
      {slug === "registro" && <RegistroEditor data={content.registroSection} />}
      {slug === "footer" && <FooterEditor data={content.footer} />}
      {slug === "labsList" && <LabsListEditor data={content.labsList} />}
    </div>
  );
}
