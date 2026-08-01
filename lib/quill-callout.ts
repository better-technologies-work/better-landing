"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

let registered = false;

export const CALLOUT_STYLES = [
  { value: "gradient", label: "Gradiente" },
  { value: "blue", label: "Azul (Nota)" },
  { value: "yellow", label: "Amarillo (Alerta)" },
  { value: "green", label: "Verde (Éxito)" },
  { value: "dark", label: "Oscuro" },
] as const;

export type CalloutStyle = (typeof CALLOUT_STYLES)[number]["value"];

export async function registerCalloutFormat() {
  if (registered || typeof window === "undefined") return;
  const { default: Quill } = await import("quill");
  const Block: any = Quill.import("blots/block");
  const Parchment: any = Quill.import("parchment");

  class CalloutBlot extends Block {
    static blotName = "callout";
    static tagName = "div";
    static className = "ql-callout";
  }

  // Adds a second class (ql-callout-gradient, ql-callout-blue, etc.)
  // on top of the base .ql-callout class, to control color/style.
  const CalloutStyleAttributor = new Parchment.ClassAttributor(
    "calloutStyle",
    "ql-callout",
    {
      scope: Parchment.Scope.BLOCK,
      whitelist: CALLOUT_STYLES.map((s) => s.value),
    }
  );

  Quill.register(CalloutBlot, true);
  Quill.register(CalloutStyleAttributor, true);
  registered = true;
  console.log("[QUILL] Callout format registered successfully");
}

// Wraps the current line/selection in a callout box with the given style.
// Calling it again with a different style just swaps the color.
export function applyCallout(quill: any, style: CalloutStyle) {
  if (!quill) return;
  quill.focus();
  const range = quill.getSelection(true);
  if (!range) return;
  quill.format("callout", true, "user");
  quill.format("calloutStyle", style, "user");
}

export function removeCallout(quill: any) {
  if (!quill) return;
  quill.focus();
  const range = quill.getSelection(true);
  if (!range) return;
  quill.format("callout", false, "user");
  quill.format("calloutStyle", false, "user");
}