"use client";

type QuillLeaf = {
  domNode?: HTMLElement | null;
};

type QuillEditorLike = {
  root: HTMLElement;
  getSelection: () => { index: number; length: number } | null;
  getLeaf: (index: number) => QuillLeaf[];
  getContents: () => { ops?: Array<{ insert?: string | { image?: string } }> };
  deleteText: (index: number, length: number) => void;
};

let registered = false;
export async function registerImageWidthFormat() {
  if (registered || typeof window === "undefined") return;
  const { default: Quill } = await import("quill");
  const Parchment = Quill.import("parchment");
  const ImageWidthStyle = new Parchment.StyleAttributor("width", "width", {
    scope: Parchment.Scope.INLINE,
  });
  Quill.register(ImageWidthStyle, true);
  registered = true;
  console.log("[QUILL] Width format registered successfully");
}

function getImageAtCursor(quill: QuillEditorLike | null, savedIndex: number | null = null, imageElement: HTMLImageElement | null = null): HTMLImageElement | null {
  if (!quill) return null;
  try {
    if (imageElement && imageElement.isConnected) {
      return imageElement;
    }

    const range = quill.getSelection();
    if (range) {
      const [leaf] = quill.getLeaf(range.index);
      if (leaf && leaf.domNode && (leaf.domNode as HTMLElement).tagName === "IMG") {
        return leaf.domNode as HTMLImageElement;
      }
    }

    if (savedIndex != null) {
      const [leaf] = quill.getLeaf(savedIndex);
      if (leaf && leaf.domNode && (leaf.domNode as HTMLElement).tagName === "IMG") {
        return leaf.domNode as HTMLImageElement;
      }
    }

    const editorEl = quill.root as HTMLElement | null;
    if (editorEl) {
      return editorEl.querySelector("img") as HTMLImageElement | null;
    }
  } catch {}
  return null;
}

export function findImageIndex(quill: QuillEditorLike | null, imageElement: HTMLImageElement | null): number | null {
  if (!quill) return null;

  try {
    const delta = quill.getContents();
    const imageSrc = imageElement?.getAttribute("src") || "";
    let index = 0;

    for (const op of delta.ops || []) {
      if (op.insert && typeof op.insert === "object" && op.insert.image) {
        if (!imageSrc || op.insert.image === imageSrc) {
          return index;
        }
        index += 1;
      } else if (typeof op.insert === "string") {
        index += op.insert.length;
      }
    }
  } catch {}

  return null;
}

export function applyImageWidthToContent(htmlContent: string, imageSrc: string | null, widthPercent: string): string {
  if (!htmlContent) return htmlContent;

  if (typeof window === "undefined") return htmlContent;

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, "text/html");
    const images = Array.from(doc.querySelectorAll("img"));
    const targetImage = images.find((img) => !imageSrc || img.getAttribute("src") === imageSrc) || images[0];

    if (!targetImage) return htmlContent;

    const style = targetImage.getAttribute("style") || "";
    const styleParts = style
      .split(";")
      .map((part) => part.trim())
      .filter(Boolean)
      .filter((part) => !part.toLowerCase().startsWith("width:") && !part.toLowerCase().startsWith("height:"));

    styleParts.push(`width:${widthPercent}`, "height:auto");
    targetImage.setAttribute("style", styleParts.join("; "));

    return doc.body.innerHTML;
  } catch {
    return htmlContent;
  }
}

export function applyImageWidthAtIndex(quill: any, index: number, widthPercent: string) {
  if (!quill || index == null) return;
  quill.formatText(index, 1, "width", widthPercent, "user");
}

export function deleteImageAtIndex(quill: QuillEditorLike | null, savedIndex: number | null, imageElement: HTMLImageElement | null = null): boolean {
  if (!quill) return false;

  try {
    const targetImage = getImageAtCursor(quill, savedIndex, imageElement);
    const imageIndex = findImageIndex(quill, targetImage);

    if (imageIndex != null) {
      quill.deleteText(imageIndex, 1);
      return true;
    }

    if (savedIndex != null) {
      quill.deleteText(savedIndex, 1);
      return true;
    }
  } catch {}

  return false;
}
