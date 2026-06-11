"use client";

import { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";

type AlternateUrls = Record<string, string>;

const AlternateUrlContext = createContext<{
  urls: AlternateUrls;
  setUrls: (urls: AlternateUrls) => void;
}>({ urls: {}, setUrls: () => {} });

export function AlternateUrlProvider({ children }: { children: React.ReactNode }) {
  const [urls, setUrls] = useState<AlternateUrls>({});
  const stableSetUrls = useCallback((v: AlternateUrls) => setUrls(v), []);
  const value = useMemo(() => ({ urls, setUrls: stableSetUrls }), [urls, stableSetUrls]);
  return (
    <AlternateUrlContext.Provider value={value}>
      {children}
    </AlternateUrlContext.Provider>
  );
}

export function useAlternateUrls() {
  return useContext(AlternateUrlContext);
}

/**
 * Rendered by CMS detail pages to register locale-specific URLs for the
 * language switcher. Resets when the component unmounts (page navigation).
 */
export function SetAlternateUrls({ urls }: { urls: AlternateUrls }) {
  const { setUrls } = useContext(AlternateUrlContext);
  const serialized = JSON.stringify(urls);

  useEffect(() => {
    setUrls(JSON.parse(serialized));
    return () => setUrls({});
  }, [serialized, setUrls]);

  return null;
}
