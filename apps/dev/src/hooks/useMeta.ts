import { useEffect } from "react";
import { useLocation } from "react-router";
import routeMeta from "../i18n/meta.json";
import {
  DEFAULT_LOCALE,
  LOCALES,
  LOCALE_TAGS,
  OG_LOCALES,
  localeFromPath,
  localizePath,
  stripLocale,
  type Locale,
} from "../i18n/locales";

interface UseMetaOptions {
  readonly title: string;
  readonly description?: string;
  /** Absolute URL to a 1200x630 social card. */
  readonly ogImage?: string;
}

interface RouteMeta {
  readonly title: string;
  readonly description: string;
}

const ORIGIN = "https://ograf.dev";
const SITE_NAME = "ograf.dev";
const DEFAULT_OG_IMAGE = `${ORIGIN}/og-image.jpg`;
const META = routeMeta as Readonly<Record<Locale, Readonly<Record<string, RouteMeta>>>>;

/** Title and description for a path in a locale, from src/i18n/meta.json. */
export function metaFor(path: string, locale: Locale): RouteMeta {
  const table = META[locale];
  return table[stripLocale(path)] ?? table["*"]!;
}

/** A path with no entry of its own is the Not Found page. */
function isKnownRoute(path: string): boolean {
  return stripLocale(path) in META[DEFAULT_LOCALE];
}

/**
 * Title, description, canonical and hreflang for the current route, in the
 * current language. The copy lives in src/i18n/meta.json, which the prerender
 * script reads too, so the HTML a crawler receives and the tags the client
 * sets after hydration can no longer disagree.
 */
export function useRouteMeta(): void {
  const { pathname } = useLocation();
  const locale = localeFromPath(pathname);
  const { title, description } = metaFor(pathname, locale);
  useMeta({ title, description });
}

/**
 * Set the document title and common meta tags for the current route.
 * Prefer useRouteMeta; this stays for pages whose title is computed.
 */
export function useMeta({ title, description, ogImage }: UseMetaOptions): void {
  const { pathname } = useLocation();

  useEffect(() => {
    const locale = localeFromPath(pathname);
    const fullTitle = title.includes(SITE_NAME) ? title : `${title} · ${SITE_NAME}`;
    document.title = fullTitle;

    const desc = description ?? metaFor("/", locale).description;
    const image = ogImage ?? DEFAULT_OG_IMAGE;

    document.documentElement.lang = LOCALE_TAGS[locale];
    setMeta("description", desc);
    setMeta("og:title", fullTitle, "property");
    setMeta("og:description", desc, "property");
    setMeta("og:image", image, "property");
    setMeta("og:type", "website", "property");
    setMeta("og:site_name", SITE_NAME, "property");
    setMeta("og:locale", OG_LOCALES[locale], "property");
    setMeta("og:url", `${ORIGIN}${pathname}`, "property");
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", fullTitle);
    setMeta("twitter:description", desc);
    setMeta("twitter:image", image);
    // The Not Found page is served for every unknown URL, so it must not claim
    // a canonical or hreflang set of its own — it is noindex.
    if (isKnownRoute(pathname)) setAlternates(pathname);
  }, [title, description, ogImage, pathname]);
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

/** Canonical plus one hreflang link per language, and x-default → English. */
function setAlternates(pathname: string): void {
  setLink('link[rel="canonical"]', { rel: "canonical", href: `${ORIGIN}${pathname}` });
  const bare = stripLocale(pathname);
  for (const locale of LOCALES) {
    setLink(`link[rel="alternate"][hreflang="${LOCALE_TAGS[locale]}"]`, {
      rel: "alternate",
      hreflang: LOCALE_TAGS[locale],
      href: `${ORIGIN}${localizePath(bare, locale)}`,
    });
  }
  setLink('link[rel="alternate"][hreflang="x-default"]', {
    rel: "alternate",
    hreflang: "x-default",
    href: `${ORIGIN}${bare}`,
  });
}

function setLink(selector: string, attrs: Readonly<Record<string, string>>): void {
  let tag = document.head.querySelector<HTMLLinkElement>(selector);
  if (!tag) {
    tag = document.createElement("link");
    document.head.appendChild(tag);
  }
  for (const [key, value] of Object.entries(attrs)) tag.setAttribute(key, value);
}
