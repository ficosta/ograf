import { useState, useCallback } from "react";
import { validate, type ValidationResult } from "@ograf/validator";
import { Button, Badge, Card } from "@ograf/ui";

const EXAMPLE_MANIFEST = `{
  "id": "com.example.lower-third",
  "version": "1.0.0",
  "name": "Simple Lower Third",
  "description": "A basic lower third graphic with name and title fields",
  "main": "index.html",
  "license": "MIT",
  "author": {
    "name": "Your Name"
  },
  "stepCount": 1,
  "supportsRealTime": true,
  "supportsNonRealTime": false,
  "schema": {
    "type": "object",
    "properties": {
      "name": {
        "type": "string",
        "title": "Name",
        "default": "Jane Smith"
      },
      "title": {
        "type": "string",
        "title": "Title",
        "default": "Senior Engineer"
      }
    }
  },
  "thumbnails": [
    {
      "src": "thumbnail.png",
      "width": 1920,
      "height": 1080
    }
  ]
}`;

const severityStyles = {
  error: "text-red-400 bg-red-950 border-red-800",
  warning: "text-amber-400 bg-amber-950 border-amber-800",
  info: "text-brand-400 bg-brand-950 border-brand-800",
};

const severityIcons = {
  error: "\u2716",
  warning: "\u26A0",
  info: "\u2139",
};

export function Validate() {
  const [input, setInput] = useState(EXAMPLE_MANIFEST);
  const [result, setResult] = useState<ValidationResult | null>(null);

  const handleValidate = useCallback(() => {
    const validationResult = validate(input);
    setResult(validationResult);
  }, [input]);

  const handleLoadExample = useCallback(() => {
    setInput(EXAMPLE_MANIFEST);
    setResult(null);
  }, []);

  const handleClear = useCallback(() => {
    setInput("");
    setResult(null);
  }, []);

  const errorCount = result?.issues.filter((i) => i.severity === "error").length ?? 0;
  const warningCount = result?.issues.filter((i) => i.severity === "warning").length ?? 0;
  const infoCount = result?.issues.filter((i) => i.severity === "info").length ?? 0;

  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <div className="max-w-3xl">
        <h1 className="text-4xl font-bold text-white">Package Validator</h1>
        <p className="mt-4 text-lg text-surface-300">
          Paste your <code className="text-brand-400 font-mono text-base">.ograf.json</code>{" "}
          manifest and validate it against the OGraf specification. Get instant
          feedback with errors, warnings, and links to the spec.
        </p>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        {/* Editor Panel */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-surface-300 uppercase tracking-wider">
              Manifest
            </h2>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={handleLoadExample}>
                Load Example
              </Button>
              <Button variant="ghost" size="sm" onClick={handleClear}>
                Clear
              </Button>
            </div>
          </div>
          <div className="rounded-xl border border-surface-800 bg-surface-900/50 overflow-hidden">
            <div className="flex items-center gap-2 border-b border-surface-800 px-4 py-2 bg-surface-900/80">
              <span className="text-xs text-surface-500 font-mono">
                .ograf.json
              </span>
            </div>
            <textarea
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                setResult(null);
              }}
              className="w-full h-96 bg-transparent text-surface-100 font-mono text-sm p-4 resize-none focus:outline-none placeholder:text-surface-600"
              placeholder='Paste your .ograf.json manifest here...'
              spellCheck={false}
            />
          </div>
          <div className="mt-4">
            <Button size="lg" onClick={handleValidate} className="w-full">
              Validate
            </Button>
          </div>
        </div>

        {/* Results Panel */}
        <div>
          <h2 className="text-sm font-semibold text-surface-300 uppercase tracking-wider mb-3">
            Results
          </h2>

          {!result ? (
            <Card className="flex items-center justify-center h-96">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-surface-800 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-surface-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-surface-400">
                  Click "Validate" to check your manifest
                </p>
              </div>
            </Card>
          ) : (
            <div className="space-y-4">
              {/* Summary */}
              <Card
                className={
                  result.valid
                    ? "border-emerald-800 bg-emerald-950/30"
                    : "border-red-800 bg-red-950/30"
                }
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
                      result.valid
                        ? "bg-emerald-900 text-emerald-400"
                        : "bg-red-900 text-red-400"
                    }`}
                  >
                    {result.valid ? "\u2714" : "\u2716"}
                  </div>
                  <div>
                    <p className="font-semibold text-white">
                      {result.valid ? "Valid OGraf Manifest" : "Invalid Manifest"}
                    </p>
                    <div className="flex items-center gap-3 mt-1">
                      {errorCount > 0 && (
                        <span className="text-xs text-red-400">
                          {errorCount} error{errorCount !== 1 ? "s" : ""}
                        </span>
                      )}
                      {warningCount > 0 && (
                        <span className="text-xs text-amber-400">
                          {warningCount} warning{warningCount !== 1 ? "s" : ""}
                        </span>
                      )}
                      {infoCount > 0 && (
                        <span className="text-xs text-brand-400">
                          {infoCount} info
                        </span>
                      )}
                      {result.issues.length === 0 && (
                        <span className="text-xs text-emerald-400">
                          No issues found
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Card>

              {/* Issues List */}
              {result.issues.length > 0 && (
                <div className="space-y-2">
                  {result.issues.map((issue, index) => (
                    <div
                      key={index}
                      className={`rounded-lg border p-4 ${severityStyles[issue.severity]}`}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-sm mt-0.5">
                          {severityIcons[issue.severity]}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge
                              variant={
                                issue.severity === "error"
                                  ? "warning"
                                  : issue.severity === "warning"
                                    ? "warning"
                                    : "info"
                              }
                            >
                              {issue.severity}
                            </Badge>
                            {issue.path && (
                              <code className="text-xs font-mono opacity-70">
                                {issue.path}
                              </code>
                            )}
                          </div>
                          <p className="mt-1 text-sm">{issue.message}</p>
                          {issue.specRef && (
                            <a
                              href={issue.specRef}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-block mt-2 text-xs underline underline-offset-4 opacity-70 hover:opacity-100"
                            >
                              View in spec &rarr;
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
