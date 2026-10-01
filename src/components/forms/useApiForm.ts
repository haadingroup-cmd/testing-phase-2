"use client";

import { useCallback, useState } from "react";
import type { FieldValues, Path, UseFormSetError } from "react-hook-form";
import type { ApiResponse } from "@/types";

export type FormStatus = "idle" | "submitting" | "success" | "error";

/**
 * Posts JSON to an API route and maps server-side validation errors back
 * onto React Hook Form fields. The server always re-validates.
 */
export function useApiForm<TValues extends FieldValues, TResult>(endpoint: string, setError?: UseFormSetError<TValues>) {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [result, setResult] = useState<TResult | null>(null);

  const submit = useCallback(
    async (payload: unknown): Promise<TResult | null> => {
      setStatus("submitting");
      setMessage(null);
      try {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const json = (await response.json().catch(() => null)) as ApiResponse<TResult> | null;
        if (!json) throw new Error("Unexpected response");
        if (!json.ok) {
          if (json.fieldErrors && setError) {
            for (const [field, errors] of Object.entries(json.fieldErrors)) {
              if (errors?.[0]) setError(field as Path<TValues>, { type: "server", message: errors[0] });
            }
          }
          setStatus("error");
          setMessage(json.error);
          return null;
        }
        setResult(json.data);
        setStatus("success");
        return json.data;
      } catch {
        setStatus("error");
        setMessage("We couldn't reach the server. Check your connection and try again, or message us on WhatsApp.");
        return null;
      }
    },
    [endpoint, setError],
  );

  const reset = useCallback(() => {
    setStatus("idle");
    setMessage(null);
    setResult(null);
  }, []);

  return { status, message, result, submit, reset };
}
