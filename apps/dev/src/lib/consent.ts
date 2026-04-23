import * as CookieConsent from "vanilla-cookieconsent";
import "vanilla-cookieconsent/dist/cookieconsent.css";

/**
 * Cookie consent + GA4 Consent Mode v2 wiring.
 *
 * The GA4 loader in index.html defaults every consent bucket to "denied"
 * and pins `anonymize_ip: true` on the GA config. Until the visitor
 * accepts analytics cookies, gtag sends cookieless pings only and never
 * writes `_ga*`.
 *
 * On accept/reject/change we push the updated state via
 * `gtag('consent', 'update', …)` which GA4 picks up on the next event.
 */

type ConsentCookie = { categories?: readonly string[] };

type GtagConsentBucket = "granted" | "denied";

function pushConsent(granted: boolean): void {
  const value: GtagConsentBucket = granted ? "granted" : "denied";
  // The gtag inline script in index.html defined window.gtag already.
  const w = window as typeof window & { gtag?: (...args: unknown[]) => void };
  w.gtag?.("consent", "update", {
    analytics_storage: value,
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });
}

function applyFromCookie(cookie: ConsentCookie): void {
  const granted = cookie?.categories?.includes("analytics") ?? false;
  pushConsent(granted);
}

export function initConsent(): void {
  void CookieConsent.run({
    guiOptions: {
      consentModal: { layout: "box", position: "bottom right" },
      preferencesModal: { layout: "box", position: "right" },
    },
    categories: {
      necessary: { enabled: true, readOnly: true },
      analytics: {
        autoClear: {
          cookies: [{ name: /^_ga/ }, { name: "_gid" }],
        },
      },
    },
    onFirstConsent: ({ cookie }) => applyFromCookie(cookie),
    onConsent: ({ cookie }) => applyFromCookie(cookie),
    onChange: ({ cookie }) => applyFromCookie(cookie),
    language: {
      default: "en",
      translations: {
        en: {
          consentModal: {
            title: "Cookies on ograf.dev",
            description:
              "We use analytics cookies to measure how the site is used. No ads, no personalization, no cross-site tracking. You can change your choice any time from the footer.",
            acceptAllBtn: "Accept all",
            acceptNecessaryBtn: "Reject",
            showPreferencesBtn: "Manage preferences",
          },
          preferencesModal: {
            title: "Cookie preferences",
            acceptAllBtn: "Accept all",
            acceptNecessaryBtn: "Reject all",
            savePreferencesBtn: "Save preferences",
            closeIconLabel: "Close",
            sections: [
              {
                title: "Your choices matter",
                description:
                  "ograf.dev is a community project. We only collect analytics cookies if you opt in — they help us understand which tutorials and tools are useful.",
              },
              {
                title: "Strictly necessary",
                description:
                  "These cookies are required for the site to function (e.g. remembering your cookie preference).",
                linkedCategory: "necessary",
              },
              {
                title: "Analytics (Google Analytics 4)",
                description:
                  "Used by Google Analytics to measure page views and basic usage. IP addresses are anonymized; no ad or personalization cookies are set.",
                linkedCategory: "analytics",
              },
            ],
          },
        },
      },
    },
  });
}

export function openConsentPreferences(): void {
  CookieConsent.showPreferences();
}
