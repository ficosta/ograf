import { useEffect } from "react";

interface UseMetaOptions {
  readonly title: string;
  readonly description?: string;
  /** Absolute URL to a 1200x630 social card. */
  readonly ogImage?: string;
}

const SITE_NAME = "ograf.dev";
const DEFAULT_DESCRIPTION =
  "Community hub for the OGraf open broadcast graphics standard. Tutorials, ecosystem directory, specification guide, and live interactive demos.";
const DEFAULT_OG_IMAGE = "https://ograf.dev/og-image.png";

/**
 * Set the document title and common meta tags for the current route.
 *
 * The SPA has no server-side rendering, so search crawlers that do execute
 * JavaScript (Google, Bing) will see these dynamic tags. Basic crawlers still
 * see the defaults in index.html, which point at the homepage.
 */
export function useMeta({ title, description, ogImage }: UseMetaOptions): void {
  useEffect(() => {
    const fullTitle = title.includes(SITE_NAME) ? title : `${title} · ${SITE_NAME}`;
    document.title = fullTitle;

    const desc = description ?? DEFAULT_DESCRIPTION;
    const image = ogImage ?? DEFAULT_OG_IMAGE;

    setMeta("description", desc);
    setMeta("og:title", fullTitle, "property");
    setMeta("og:description", desc, "property");
    setMeta("og:image", image, "property");
    setMeta("og:type", "website", "property");
    setMeta("og:site_name", SITE_NAME, "property");
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", fullTitle);
    setMeta("twitter:description", desc);
    setMeta("twitter:image", image);
  }, [title, description, ogImage]);
}

function setMeta(name: string, content: string, attr: "name" | "property" = "name"): void {
  const selector = `meta[${attr}="${name}"]`;
  let tag = document.head.querySelector<HTMLMetaElement>(selector);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attr, name);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
}
