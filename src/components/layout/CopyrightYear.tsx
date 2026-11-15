"use client";

import { useState, useEffect } from "react";

export function CopyrightYear({ fallback }: { fallback: number }) {
  const [year, setYear] = useState(fallback);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Date() must be read client-side, not baked into the prerender.
    setYear(new Date().getFullYear());
  }, []);

  return <>{year}</>;
}
