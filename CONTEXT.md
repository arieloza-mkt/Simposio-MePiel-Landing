# Simposio Dermocosmético — Contexto del Proyecto

## Resumen
Landing page b2b en español para un simposio de dermocosmética con panel de administración, registro de asistentes, pases QR seguros para check-in en puerta, y CMS para contenido de la landing.

## Stack Tecnológico
- **Framework**: Next.js 16.3.1 (App Router, Turbopack)
- **React**: 19.x
- **Language**: TypeScript (estricto)
- **Styling**: Tailwind CSS v4 (usa `@theme` en `globals.css`, NO Tailwind v3 config)
- **ORM**: Drizzle ORM
- **Database**: Neon Postgres (serverless)
- **Auth**: Password-only con HMAC-signed cookies (httpOnly)
- **Animaciones**: Framer Motion, CSS scroll-driven animations
- **Carousel**: Embla
- **Forms**: React Hook Form (en registro público)
- **Icons**: Lucide React
- **CDN imágenes**: Cloudinary

## Estructura de Carpetas
```
src/
├── app/
│   ├── (landing)/          # Rutas públicas
│   │   ├── page.tsx        # Landing principal
│   │   ├── entrada/[code]/ # Pase QR del asistente
│   │   └── pase/           # Pase visual
│   ├── admin/
│   │   ├── login/page.tsx  # Login admin
│   │   ├── (panel)/        # Rutas autenticadas
│   │   │   ├── layout.tsx  # Sidebar + nav
│   │   │   ├── page.tsx    # Dashboard/resumen
│   │   │   ├── asistentes/ # Registros + asistencia (tabs)
│   │   │   ├── ponentes/   # Gestión de ponentes
│   │   │   ├── cronograma/ # Agenda del evento
│   │   │   ├── ediciones/  # Ediciones pasadas
│   │   │   └── contenido/  # CMS de la landing (tabs)
│   │   └── api/asistentes/csv/ # Export CSV
│   └── actions/
│       ├── auth.ts         # Login/logout
│       └── admin/          # Server actions CRUD
│           ├── content.ts  # CMS site_settings
│           ├── registrations.ts
│           ├── speakers.ts
│           ├── editions.ts
│           ├── schedule.ts
│           ├── labs.ts
│           ├── checkins.ts
│           └── settings.ts
├── components/
│   ├── features/           # Componentes de funcionalidad
│   │   ├── LogoSpin.tsx    # Animación scroll-driven del logo
│   │   ├── ScrollPinnedEditions.tsx
│   │   ├── SpeakerCarousel.tsx
│   │   ├── LogoCarousel.tsx
│   │   └── EditionDetailModal.tsx
│   ├── sections/           # Secciones de la landing
│   │   ├── Hero.tsx
│   │   ├── MepielAlianza.tsx
│   │   ├── QueEs.tsx
│   │   ├── QueEsContent.tsx
│   │   ├── QueEsPreview.tsx
│   │   ├── Laboratorios.tsx
│   │   ├── Expositores.tsx
│   │   └── Registro.tsx
│   ├── layout/             # Layout compartido
│   │   ├── TopNav.tsx
│   │   ├── Footer.tsx
│   │   ├── Container.tsx
│   │   └── Section.tsx
│   ├── ui/                 # Componentes base
│   │   ├── AnimatedSection.tsx
│   │   └── Badge.tsx
│   └── admin/              # Componentes del admin
│       ├── AdminNav.tsx
│       ├── ui.tsx          # Primitives (Card, Field, Button, etc.)
│       ├── SectionTabs.tsx
│       ├── FieldArray.tsx
│       ├── ImageField.tsx
│       ├── ContenidoEditor.tsx
│       ├── AsistentesView.tsx
│       ├── SpeakerEditor.tsx
│       ├── CheckInButtons.tsx
│       ├── RegistrationActions.tsx
│       └── ThemeSwitcher.tsx
├── lib/
│   ├── content.ts          # Función getLandingContent() + tipos
│   ├── auth.ts             # Autenticación HMAC
│   ├── access-code.ts      # Generación de códigos QR
│   ├── constants.ts        # Constantes (PROFILE_OPTIONS, etc.)
│   └── db/
│       ├── schema.ts       # Schema Drizzle (tablas + enums)
│       ├── ddl.ts          # DDL statements (CREATE TABLE IF NOT EXISTS)
│       ├── client.ts       # Conexión Neon
│       ├── init.ts         # Init + seed + backfill
│       └── seed-data.ts    # Datos semilla
└── middleware.ts            # Rewrite API routes
```

## Base de Datos (Neon Postgres)

### Tablas
| Tabla | Propósito |
|-------|-----------|
| `site_settings` | CMS key-value (JSONB) para textos de la landing |
| `editions` | Ediciones pasadas del simposio |
| `speakers` | Ponentes/expositores |
| `labs` | Laboratorios aliados |
| `schedule_items` | Agenda/cronograma |
| `faq_items` | Preguntas frecuentes |
| `registrations` | Inscripciones de asistentes |
| `checkins` | Registros de entrada (QR) |

### Enums
- `registration_status`: pendiente, aprobado, rechazado
- `checkin_kind`: asistente, expositor

### Keys de site_settings (CMS)
`site`, `hero`, `transmision`, `benefits`, `attendeeTypes`, `tracks`, `labFeatures`, `queEs`, `mepielAlianza`, `ctaCierre`, `eventConfig`

## Theming (Bitemático)

### Tokens CSS
Definidos en `src/app/globals.css` con `@theme`:

**Light**: bg `#F5F3EF`, fg `#1C1C22`, surface `#FFFFFF`, muted `#7A7A82`, border `#DDD9D3`, accent `#82B6A0`, error `#E5484D`, live `#FF4D5E`

**Dark**: bg `#080E1A`, fg `#E8E4DF`, surface `#0F1A2E`, muted `#8891A0`, border `#1A2540`, accent `#82B6A0`, error `#FF6369`, live `#FF4D5E`

### Anti-FOUC
Script en `layout.tsx` lee `localStorage("admin-theme")` y aplica clase `dark`/`light` al `<html>` antes del paint. En landing siempre respeta localStorage. En admin, force dark por defecto si no hay preferencia.

### ThemeSwitcher
Componente admin con 3 opciones: Light, Dark, Auto (switch automático 19:00-07:00).

## Orden de Secciones (Landing)
1. Hero (video fondo + métricas + flecha scroll)
2. MepielAlianza (alianza con Mepiel)
3. LogoSpin (animación scroll-driven 170vh, iris wipe, nextPreview de QueEs)
4. QueEs (qué es el simposio)
5. ScrollPinnedEditions (ediciones pasadas, scroll-pinned 300vh)
6. Laboratorios (carousel de logos)
7. Expositores (carousel de ponentes)
8. Registro (formulario de inscripción)

## Componentes Clave

### LogoSpin (`src/components/features/LogoSpin.tsx`)
- Wrapper de 170vh con `position: sticky`
- Círculo blanco que rota 1440° y se escala para hacer "iris wipe"
- Logo fade-out a 50% del progreso
- `nextPreview`: contenido que aparece dentro del círculo cuando el logo desaparece (fade-in entre 42%-58%)
- Merge del círculo blanco al fondo de la sección siguiente a partir de 68%
- Colores: NAVY `rgb(8,16,32)` → NEXT_BG `rgb(11,20,38)`

### Section (`src/components/layout/Section.tsx`)
- Prop `fullHeight`: agrega `min-h-screen flex flex-col justify-center`
- Secciones con fullHeight: MepielAlianza, QueEs, Laboratorios, Expositores, Registro

### AnimatedSection (`src/components/ui/AnimatedSection.tsx`)
- Wrapper con intersection observer
- viewport.amount = 0.2 (requiere 20% visible para activar)
- Animaciones: fade-up, fade-right

## Admin Panel

### Autenticación
- Password-only (una sola contraseña compartida)
- Token HMAC firmado en cookie httpOnly (`simposio_admin`)
- Duración: 7 días
- Env var: `ADMIN_PASSWORD` + `AUTH_SECRET` (64 hex)

### Navegación Admin
- Resumen (dashboard con stats)
- Asistentes (tabs: Registros + Asistencia)
- Ponentes (CRUD con bio, linkedin, website)
- Cronograma (agenda del evento)
- Ediciones (ediciones pasadas)
- Contenido (CMS de la landing con tabs por sección)

### Contenido Editor
- Tabs horizontales por sección de la landing
- Campos estructurados (no pipe-delimited)
- `FieldArray`: listas de items con drag-to-reorder
- `ImageField`: input URL + preview de imagen
- `SectionTabs`: contenedor de tabs horizontales
- Cada sección se guarda independientemente

### Asistentes (Registros + Asistencia)
- Página unificada con dos tabs
- Tab Registros: listado paginado, filtro por status, acciones (aprobar/rechazar/regenerar QR/eliminar)
- Tab Asistencia: búsqueda por nombre/email, toggle check-in
- Export CSV disponible

## Assets Cloudinary
Base: `https://res.cloudinary.com/cc4tium7/image/upload/`

| Asset | URL |
|-------|-----|
| Logo animación | `v1787606525/Logo.png` |
| Logo light | `v1787681794/logo-color.svg` |
| Logo dark | `v1787612015/logo-white.svg` |
| Logo sidebar admin | `v1787612014/logo-color-white.svg` |
| Hero decor | `v1787611636/hero-bg-decor.svg` (opacity 0.05) |
| BG decor ponentes | `v1787613330/bg-decor-1.svg` |
| BG decor labs | `v1787613326/bg-decor-2.svg` |
| BG footer | `v1787613333/bg-footer-decor.svg` |
| BG alianza | `v1787608569/bg-elemnts-01.png` |
| Edición 1 | `v1787610069/logo-primera-edicion.png` |
| Edición 2 | `v1787610069/logo-segunda-edicion.png` |

## Convenciones de Código

### Respuestas
- Responder al usuario **en español**
- NO hacer commit ni push sin preguntar primero

### Componentes
- Client components: `"use client"` al inicio
- Server components: por defecto
- Tokens CSS para todos los colores (nunca hardcoded `#fff`, `bg-white`, etc.)
- Excepción: colores de merge en LogoSpin (NAVY, NEXT_BG) que son valores de transición

### Forms
- Server actions para CRUD (`"use server"`)
- Zod para validación
- `revalidatePath` después de cada operación
- JSON para datos estructurados en site_settings

### Estilos
- Tailwind v4 con `@theme` (NO config file)
- `color-mix()` para hover states y gradientes
- `clamp()` para tipografía responsiva
- `var(--radius-lg)` para border-radius

## Para Recrear en Otro Proyecto

1. **Next.js 16+** con App Router y Turbopack
2. **Neon Postgres** con DDL auto-ejecutado (CREATE TABLE IF NOT EXISTS)
3. **Drizzle ORM** para schema y queries
4. **Cloudinary** para assets de imagen
5. **Bitemático**: definir tokens CSS con `@theme`, script anti-FOUC en layout
6. **Scroll-driven animations**: usar `position: sticky` + scroll progress (NO scroll-snap)
7. **Admin panel**: server actions + Zod validation + revalidatePath
8. **CMS**: key-value en PostgreSQL con JSONB (site_settings table)
9. **Auth**: HMAC-signed cookies (no JWT, no sessions table)
10. **Icons**: Lucide React
