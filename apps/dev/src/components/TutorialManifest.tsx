import type { ReactNode } from "react";
import { CodeBlock } from "./CodeBlock";
import { useCopy } from "../i18n/useLocale";
import { TUTORIAL_UI_COPY } from "../i18n/copy/tutorial-ui";
import { TemplateDownload } from "./TemplateDownload";

interface TutorialManifestProps {
  readonly slug: string;
  readonly title: string;
  readonly manifest: string;
  readonly intro?: ReactNode;
}

/**
 * Renders the manifest JSON for a tutorial package alongside a download
 * card pointing at /downloads/<slug>.zip. Used near the end of each
 * tutorial page so a reader who just learned the pattern can grab the
 * ready-to-ship version in one click.
 */
export function TutorialManifest({ slug, title, manifest, intro }: TutorialManifestProps) {
  const c = useCopy(TUTORIAL_UI_COPY);
  return (
    <div>
      <h2 className="font-display text-2xl tracking-tight text-slate-900 mb-4">{c.manifestHeading}</h2>
      {intro && <p className="text-base text-slate-700 mb-4">{intro}</p>}
      <CodeBlock filename={`${slug}.ograf.json`} language="JSON" code={manifest} />
      <div className="mt-6">
        <TemplateDownload slug={slug} title={title} />
      </div>
    </div>
  );
}
