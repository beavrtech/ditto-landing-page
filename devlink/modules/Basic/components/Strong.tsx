"use client";
import * as React from "react";
import type { Props } from "../../types";

const Strong = React.forwardRef<HTMLElement, Props<"strong">>(function Strong(
  props,
  ref
) {
  return React.createElement("strong", {
    ...props,
    ref,
  });
});

export default Strong;
