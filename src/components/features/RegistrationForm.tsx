"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { PROFILE_OPTIONS } from "@/lib/constants";
import { Button } from "@/components/ui/Button";
import { registerAttendee } from "@/app/actions/registration";

interface FormData {
  nombre: string;
  email: string;
  telefono: string;
  empresa: string;
  perfil: string;
}

export function RegistrationForm({ submitButtonText = "Enviar mi registro" }: { submitButtonText?: string }) {
  const [result, setResult] = useState<{
    folio?: string;
    qrDataUrl?: string;
    error?: string;
  } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
    setResult(null);
    try {
      const response = await registerAttendee(data);
      if (response.ok) {
        setResult({ folio: response.folio, qrDataUrl: response.qrDataUrl });
      } else {
        setResult({ error: response.error });
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (result?.folio) {
    return (
      <div className="rounded-[var(--radius-lg)] border border-accent bg-accent/12 p-8 text-center">
        <svg
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth={1.6}
          className="mx-auto mb-5"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M8 12l3 3 5-5" />
        </svg>
        <h3
          className="m-0 mb-3 font-display text-[22px]"
          style={{ color: "var(--color-accent)" }}
        >
          Registro recibido
        </h3>
        <p className="m-0 mb-5 text-muted">
          Tu registro está en proceso de revisión. Nuestro equipo te contactará
          por correo electrónico para confirmar tu asistencia. Revisa tu bandeja
          de entrada y spam.
        </p>

        {result.qrDataUrl && (
          <div className="mb-5 inline-flex flex-col items-center rounded-[var(--radius-lg)] bg-light p-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={result.qrDataUrl}
              alt="Código QR de entrada al evento"
              width={168}
              height={168}
              className="block h-auto w-[168px] max-w-full"
            />
            <span className="mt-2 font-mono text-[10px] uppercase tracking-widest text-dark/70">
              Tu pase de acceso
            </span>
          </div>
        )}

        <p className="m-0 mb-2 max-w-[38ch] mx-auto text-sm leading-relaxed text-muted">
          Guarda o captura este QR: al escanearlo en el acceso del evento se
          registrará tu asistencia automáticamente.
        </p>
        <p className="m-0 font-mono text-xs uppercase tracking-widest text-muted">
          Tu folio de registro
        </p>
        <p className="mb-0 mt-1 font-mono text-sm font-semibold break-all text-fg select-all">
          {result.folio}
        </p>
        <p className="m-0 mt-3 text-center text-xs text-muted">
          ¿Perdiste tu QR? Recupéralo en{" "}
          <a href="/pase" className="text-accent underline-offset-2 hover:underline">
            /pase
          </a>{" "}
          con tu correo.
        </p>
      </div>
    );
  }

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field label="Nombre completo *" error={errors.nombre?.message}>
            <input
              type="text"
              placeholder="Tu nombre completo"
              autoComplete="name"
              className={`input ${errors.nombre ? "border-error" : ""}`}
              {...register("nombre", {
                required: "Por favor ingresa tu nombre",
                minLength: { value: 3, message: "Ingresa tu nombre completo" },
              })}
            />
          </Field>

          <Field label="Correo electrónico *" error={errors.email?.message}>
            <input
              type="email"
              placeholder="correo@empresa.com"
              autoComplete="email"
              className={`input ${errors.email ? "border-error" : ""}`}
              {...register("email", {
                required: "Por favor ingresa un correo válido",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Por favor ingresa un correo válido",
                },
              })}
            />
          </Field>

          <Field label="Teléfono *" error={errors.telefono?.message}>
            <input
              type="tel"
              placeholder="+52 (55) 1234-5678"
              autoComplete="tel"
              className={`input ${errors.telefono ? "border-error" : ""}`}
              {...register("telefono", {
                required: "Por favor ingresa tu teléfono",
                minLength: { value: 7, message: "Teléfono incompleto" },
              })}
            />
          </Field>

          <Field label="Empresa / Farmacia *" error={errors.empresa?.message}>
            <input
              type="text"
              placeholder="Nombre de tu empresa o farmacia"
              autoComplete="organization"
              className={`input ${errors.empresa ? "border-error" : ""}`}
              {...register("empresa", {
                required: "Por favor ingresa tu empresa",
              })}
            />
          </Field>

          <Field
            label="Perfil profesional *"
            error={errors.perfil?.message}
            className="sm:col-span-2"
          >
            <select
              className={`select ${errors.perfil ? "border-error" : ""}`}
              {...register("perfil", {
                required: "Por favor selecciona tu perfil",
              })}
            >
              {PROFILE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </Field>

          {result?.error ? (
            <p
              role="alert"
              className="mb-0 mt-1 rounded-[12px] border border-error/40 bg-error/10 px-4 py-3 text-sm text-error sm:col-span-2"
            >
              {result.error}
            </p>
          ) : null}

          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={submitting}
            className="mt-2 w-full justify-center sm:col-span-2"
          >
            {submitting ? "Enviando…" : submitButtonText}
          </Button>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  error,
  className,
  children,
}: {
  label: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`flex flex-col gap-1.5 ${className ?? ""}`}>
      <label className="text-[13px] text-muted">{label}</label>
      {children}
      {error && (
        <span className="text-xs text-error">{error}</span>
      )}
    </div>
  );
}
