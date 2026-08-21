"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { PROFILE_OPTIONS } from "@/lib/constants";
import { Button } from "@/components/ui/Button";

interface FormData {
  nombre: string;
  email: string;
  telefono: string;
  empresa: string;
  perfil: string;
}

export function RegistrationForm() {
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = (_data: FormData) => {
    setSubmitted(true);
  };

  if (submitted) {
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
        <p className="m-0 text-muted">
          Tu registro está en proceso de revisión. Nuestro equipo te contactará
          por correo electrónico para confirmar tu asistencia. Revisa tu bandeja
          de entrada y spam.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-[var(--radius-lg)] border border-border bg-surface p-8">
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="flex flex-col gap-5">
          <Field
            label="Nombre completo *"
            error={errors.nombre?.message}
          >
            <input
              type="text"
              placeholder="Tu nombre completo"
              autoComplete="name"
              className={`input ${errors.nombre ? "border-error" : ""}`}
              {...register("nombre", {
                required: "Por favor ingresa tu nombre",
              })}
            />
          </Field>

          <Field
            label="Correo electrónico *"
            error={errors.email?.message}
          >
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

          <Field
            label="Teléfono *"
            error={errors.telefono?.message}
          >
            <input
              type="tel"
              placeholder="+52 (55) 1234-5678"
              autoComplete="tel"
              className={`input ${errors.telefono ? "border-error" : ""}`}
              {...register("telefono", {
                required: "Por favor ingresa tu teléfono",
              })}
            />
          </Field>

          <Field
            label="Empresa / Farmacia *"
            error={errors.empresa?.message}
          >
            <input
              type="text"
              placeholder="Nombre de tu empresa o farmacia"
              className={`input ${errors.empresa ? "border-error" : ""}`}
              {...register("empresa", {
                required: "Por favor ingresa tu empresa",
              })}
            />
          </Field>

          <Field
            label="Perfil profesional *"
            error={errors.perfil?.message}
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

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="mt-2 w-full justify-center"
          >
            Enviar mi registro
          </Button>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[13px] text-muted">{label}</label>
      {children}
      {error && (
        <span className="text-xs text-error">{error}</span>
      )}
    </div>
  );
}
