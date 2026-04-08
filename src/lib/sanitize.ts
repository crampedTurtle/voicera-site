import DOMPurify from "dompurify";

const ALLOWED_TAGS = [
  "p", "h1", "h2", "h3", "h4", "h5", "h6",
  "ul", "ol", "li", "strong", "em", "b", "i", "u", "s",
  "a", "img", "blockquote", "code", "pre", "br", "hr",
  "figure", "figcaption", "table", "thead", "tbody", "tr", "th", "td",
  "span", "div", "sub", "sup",
];

const ALLOWED_ATTR = [
  "href", "src", "alt", "title", "class", "style",
  "width", "height", "target", "rel",
  "colspan", "rowspan", "data-youtube-video",
];

/** Sanitize rich HTML content — strips scripts, iframes, event handlers */
export function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ALLOW_DATA_ATTR: false,
    FORBID_TAGS: ["script", "iframe", "object", "embed", "form", "style", "svg"],
    FORBID_ATTR: ["onerror", "onload", "onclick", "onmouseover", "onfocus", "onblur"],
  });
}

/** Strip ALL HTML from a plain text field */
export function stripHtml(text: string): string {
  return DOMPurify.sanitize(text, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
}

/** Sanitize a slug: lowercase, alphanumeric + hyphens only */
export function sanitizeSlug(slug: string): string {
  return slug
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Validate slug has no path traversal */
export function isValidSlug(slug: string): boolean {
  if (slug.includes("..") || slug.includes("./") || slug.includes("%2F") || slug.includes("%2f")) {
    return false;
  }
  return /^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug);
}

// Magic bytes for file type validation
const MAGIC_BYTES: Record<string, number[][]> = {
  "image/jpeg": [[0xFF, 0xD8, 0xFF]],
  "image/png": [[0x89, 0x50, 0x4E, 0x47]],
  "image/gif": [[0x47, 0x49, 0x46, 0x38]],
  "image/webp": [[0x52, 0x49, 0x46, 0x46]], // RIFF header, WebP follows at byte 8
  "image/svg+xml": [], // validated by content inspection
  "video/mp4": [[0x00, 0x00, 0x00]], // ftyp box
  "audio/mpeg": [[0xFF, 0xFB], [0xFF, 0xF3], [0xFF, 0xF2], [0x49, 0x44, 0x33]], // MP3 / ID3
  "application/pdf": [[0x25, 0x50, 0x44, 0x46]], // %PDF
};

const SIZE_LIMITS: Record<string, number> = {
  image: 10 * 1024 * 1024,    // 10MB
  video: 200 * 1024 * 1024,   // 200MB
  audio: 50 * 1024 * 1024,    // 50MB
  pdf: 20 * 1024 * 1024,      // 20MB
};

function getFileCategory(mime: string): string {
  if (mime.startsWith("image/")) return "image";
  if (mime.startsWith("video/")) return "video";
  if (mime.startsWith("audio/")) return "audio";
  if (mime === "application/pdf") return "pdf";
  return "unknown";
}

/** Validate file by reading magic bytes from its header */
export async function validateFileUpload(file: File): Promise<{ valid: boolean; error?: string }> {
  const category = getFileCategory(file.type);
  const maxSize = SIZE_LIMITS[category];

  if (!maxSize) {
    return { valid: false, error: "File type not allowed." };
  }

  if (file.size > maxSize) {
    const maxMB = Math.round(maxSize / (1024 * 1024));
    return { valid: false, error: `File too large. Max ${maxMB}MB for ${category} files.` };
  }

  // SVG: content-based validation
  if (file.type === "image/svg+xml") {
    const text = await file.text();
    if (/<script/i.test(text) || /on[a-z]+\s*=/i.test(text)) {
      return { valid: false, error: "SVG contains potentially dangerous content." };
    }
    return { valid: true };
  }

  // Magic byte validation
  const signatures = MAGIC_BYTES[file.type];
  if (!signatures || signatures.length === 0) {
    // Allow if mime is in our accepted list but has no magic bytes to check
    const acceptedMimes = Object.keys(MAGIC_BYTES);
    if (!acceptedMimes.includes(file.type)) {
      return { valid: false, error: "File type not allowed." };
    }
    return { valid: true };
  }

  const header = new Uint8Array(await file.slice(0, 12).arrayBuffer());
  const matches = signatures.some(sig =>
    sig.every((byte, i) => header[i] === byte)
  );

  if (!matches) {
    return { valid: false, error: "File content does not match its declared type." };
  }

  return { valid: true };
}

/** Generate a UUID-style filename */
export function generateSafeFilename(originalName: string): string {
  const ext = originalName.split(".").pop()?.toLowerCase() || "bin";
  return `${crypto.randomUUID()}.${ext}`;
}
