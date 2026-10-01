"use client";

import { useEffect, useRef } from "react";

/** Records when the form was first shown (used by the server-side spam timing check). */
export function useStartedAt() {
  const startedAt = useRef<number | undefined>(undefined);
  useEffect(() => {
    startedAt.current = Date.now();
  }, []);
  return startedAt;
}
