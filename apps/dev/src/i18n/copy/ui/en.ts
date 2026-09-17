/** Copy for shared UI components: RoleCards, ErrorBoundary, ConfirmDialog. */
export const en = {
  roleCards: {
    eyebrow: "Start here",
    ariaLabel: "Role-based entry points",
    heading: "Where should you start?",
    subheading: "Pick the lane that sounds most like you. Each path links to the page that gets you productive fastest.",
  },
  errorBoundary: {
    eyebrow: "Something went wrong",
    title: "We hit an unexpected error.",
    bodyBefore: "Reload the page to try again. If the problem persists,",
    openIssue: "open an issue",
    bodyAfter: "with the details below.",
    reload: "Reload the page",
    unexpected: "Unexpected error",
  },
  confirmDialog: {
    confirm: "Continue",
    cancel: "Cancel",
  },
};

export type UiCopy = typeof en;
