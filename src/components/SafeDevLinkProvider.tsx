"use client";

import React from "react";
import { DevLinkProvider } from "../../webflow/DevLinkProvider";

function SafeImage(props: React.ImgHTMLAttributes<HTMLImageElement>) {
  if (!props.src || props.src === "") {
    return null;
  }
  return <img {...props} />;
}

export function SafeDevLinkProvider({ children }: { children: React.ReactNode }) {
  return (
    <DevLinkProvider renderImage={SafeImage}>
      {children}
    </DevLinkProvider>
  );
}
