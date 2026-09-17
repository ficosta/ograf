export const en = {
  eyebrow: "404 · Page not found",
  title: "That page isn't here.",
  lead: "It might have moved, been renamed, or never existed. Try one of these entry points:",
  links: [
    { to: "/", title: "Home", desc: "The short pitch and the ecosystem at a glance." },
    { to: "/tutorials", title: "Tutorials", desc: "Eleven broadcast graphics you can build today." },
    { to: "/spec", title: "Specification", desc: "How OGraf works, explained plainly." },
    { to: "/ecosystem", title: "Ecosystem", desc: "Every tool, editor, and renderer worth knowing." },
  ],
  stuck: "Still stuck?",
  openIssue: "open an issue on GitHub",
  stuckEnd: ".",
};

export type NotFoundCopy = typeof en;
