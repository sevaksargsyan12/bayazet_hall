"use client";

import { useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import {
  validateContactPayload,
  type ContactFieldErrors,
  type ContactPayload,
} from "@/lib/validate-contact";

const emptyValues: ContactPayload = {
  name: "",
  phone: "",
  email: "",
  message: "",
};

type Status = "idle" | "submitting" | "success" | "error";

export default function ContactForm() {
  const [values, setValues] = useState<ContactPayload>(emptyValues);
  const [fieldErrors, setFieldErrors] = useState<ContactFieldErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleChange =
    (field: keyof ContactPayload) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setValues((prev) => ({ ...prev, [field]: event.target.value }));
    };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const errors = validateContactPayload(values);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});
    setErrorMessage(null);
    setStatus("submitting");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await response.json();

      if (data.ok) {
        setStatus("success");
        setValues(emptyValues);
        return;
      }

      if (data.error === "validation" && data.fieldErrors) {
        setFieldErrors(data.fieldErrors);
        setStatus("error");
        return;
      }

      setErrorMessage("Հայտն ուղարկելիս սխալ առաջացավ։ Փորձեք կրկին։");
      setStatus("error");
    } catch {
      setErrorMessage("Կապի խնդիր առաջացավ։ Ստուգեք ինտերնետ կապը և փորձեք կրկին։");
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="flex h-full flex-col items-center justify-center rounded-2xl border border-border bg-surface p-10 text-center shadow-sm">
        <CheckCircle2 className="h-10 w-10 text-amber-500" aria-hidden="true" />
        <p className="mt-4 text-lg font-semibold">
          Շնորհակալություն, ձեր հայտն ուղարկվել է։
        </p>
        <p className="mt-2 text-sm text-foreground/60">
          Մենք կկապվենք ձեզ հետ շուտով։
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-6 rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:border-foreground/20"
        >
          Ուղարկել նոր հայտ
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="rounded-2xl border border-border bg-surface p-8 shadow-sm"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label="Անուն"
          error={fieldErrors.name}
          input={
            <input
              type="text"
              value={values.name}
              onChange={handleChange("name")}
              autoComplete="name"
              className={inputClassName(Boolean(fieldErrors.name))}
            />
          }
        />
        <Field
          label="Հեռախոս"
          error={fieldErrors.phone}
          input={
            <input
              type="tel"
              value={values.phone}
              onChange={handleChange("phone")}
              autoComplete="tel"
              className={inputClassName(Boolean(fieldErrors.phone))}
            />
          }
        />
        <div className="sm:col-span-2">
          <Field
            label="Էլ. հասցե"
            error={fieldErrors.email}
            input={
              <input
                type="email"
                value={values.email}
                onChange={handleChange("email")}
                autoComplete="email"
                className={inputClassName(Boolean(fieldErrors.email))}
              />
            }
          />
        </div>
        <div className="sm:col-span-2">
          <Field
            label="Հաղորդագրություն"
            error={fieldErrors.message}
            input={
              <textarea
                value={values.message}
                onChange={handleChange("message")}
                rows={5}
                className={inputClassName(Boolean(fieldErrors.message))}
              />
            }
          />
        </div>
      </div>

      {errorMessage && (
        <p className="mt-4 text-sm text-red-600 dark:text-red-400">
          {errorMessage}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="mt-6 inline-flex items-center gap-2 rounded-lg bg-amber-500 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-amber-600 disabled:opacity-60 dark:hover:bg-amber-400"
      >
        {status === "submitting" && (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
        )}
        Ուղարկել
      </button>
    </form>
  );
}

function Field({
  label,
  error,
  input,
}: {
  label: string;
  error?: string;
  input: React.ReactNode;
}) {
  return (
    <label className="block text-sm">
      <span className="font-medium text-foreground/80">{label}</span>
      <div className="mt-1.5">{input}</div>
      {error && (
        <span className="mt-1 block text-xs text-red-600 dark:text-red-400">
          {error}
        </span>
      )}
    </label>
  );
}

function inputClassName(hasError: boolean) {
  return `w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none transition-colors focus:ring-2 focus:ring-amber-500 ${
    hasError ? "border-red-500" : "border-border"
  }`;
}
