import { CodeBlock } from "./CodeBlock";
import { TemplateDownload } from "./TemplateDownload";

interface TutorialManifestProps {
  readonly slug: string;
  readonly title: string;
  readonly manifest: string;
  readonly intro?: string;
}

export function TutorialManifest({ slug, title, manifest, intro }: TutorialManifestProps) {
  return (
    <div>
      <h2 className="font-display text-2xl tracking-tight text-slate-900 mb-4">The manifest</h2>
      {intro && <p className="text-base text-slate-700 mb-4">{intro}</p>}
      <CodeBlock filename={`${slug}.ograf.json`} language="JSON" code={manifest} />
      <div className="mt-6">
        <TemplateDownload slug={slug} title={title} />
      </div>
    </div>
  );
}
