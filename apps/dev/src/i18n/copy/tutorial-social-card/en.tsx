import { CODE_SLATE } from "../tutorial-ui/styles";

export const en = {
  title: "Build a social media card.",
  lead: "News broadcasts frequently show social media posts on screen — a tweet from a public figure, an official statement, or a viral post. This card displays the user's name, handle, and post text with an auto-generated avatar. It's positioned on the right side of the screen, leaving the anchor visible on the left.",
  demo: {
    user: "User Name",
    handle: "Handle",
    text: "Post Text",
    heading: "Social Card — OGraf Template",
  },
  diffTitle: "What's different from other graphics?",
  diffs: [
    { title: "Right-side position", body: <>Uses <code className={CODE_SLATE}>right: 48px; bottom: 80px</code> instead of <code className={CODE_SLATE}>left</code>. This keeps the anchor visible on the left side of the frame — a common broadcast convention for displayed content.</> },
    { title: "Auto-generated avatar", body: <>No image needed. The avatar circle shows the user's initials, extracted from their name with <code className={CODE_SLATE}>_getInitials()</code>. Nothing to host, nothing to break.</> },
    { title: "Two-stage entrance", body: <>The card slides in from off-screen right with a light blur over 0.7s, and the avatar pops in 0.35s later on an overshooting curve — all from CSS, keyed off one <code className={CODE_SLATE}>.visible</code> class.</> },
  ],
  initialsTitle: "The initials method",
  initialsBody: (
    <>
      Instead of requiring a profile photo URL (which may break, be low-res, or have rights issues), the social card generates an avatar from the user's name. <code className={CODE_SLATE}>_getInitials</code> splits the name on spaces, takes the first letter of each word, upper-cases them and keeps the first two: "Jane Smith" → "JS", "Dr. Martin King" → "DM", "Madonna" → "M", and an empty name → an empty avatar. <code className={CODE_SLATE}>_applyData</code> is shared by <code className={CODE_SLATE}>load()</code> and <code className={CODE_SLATE}>updateAction()</code>; it applies each field that is <code className={CODE_SLATE}>!== undefined</code>, so a partial update touches only the fields you send and an empty string clears one. It also accepts an optional <code className={CODE_SLATE}>platform</code> string for the dark badge in the header. The manifest schema doesn't declare it, so by default the badge is empty — and <code className={CODE_SLATE}>.social-platform:empty</code> hides it rather than leaving a blank capsule.
    </>
  ),
  dataFile: "graphic.mjs (key parts)",
  playBody: (
    <>
      Playing and stopping follow the OGraf step model. The first play puts the card on air at step 0 and resolves after 700ms; a second play goes past the single step, runs the stop and returns <code className={CODE_SLATE}>currentStep: undefined</code>. Every action bumps <code className={CODE_SLATE}>this._rev</code>, and the stop only removes <code className={CODE_SLATE}>.visible</code> after its 500ms if nothing newer has started — so play → stop → play sent without waiting ends on air.
    </>
  ),
  playFile: "graphic.mjs (play and stop)",
  cssTitle: "The CSS — right-side card with blue accent",
  cssBody: (
    <>
      The card slides in from the right edge: <code className={CODE_SLATE}>.social</code> starts at <code className={CODE_SLATE}>translateX(120%)</code>, transparent and blurred, and <code className={CODE_SLATE}>.social.out</code> sends it back over 0.5s. A 4px gradient bar drawn with <code className={CODE_SLATE}>::before</code> gives the white card its blue left accent, and the avatar is a solid blue circle that scales up from 40%. The reset is scoped with <code className={CODE_SLATE}>:where(.social-card-root, …)</code> so it never restyles the renderer's page.
    </>
  ),
  cssFile: "style.css (key parts)",
  tipTitle: "Design tip",
  tip: (
    <>
      The avatar circle uses the first letter of each word in the user's name — "Jane Smith" becomes "JS". This avoids the need for external image assets entirely. The solid brand-blue fill and the delayed pop-in make the circle look intentional, not like a missing image fallback.
    </>
  ),
  downloadTitle: "Social Media Card",
  done: {
    title: "Social card complete.",
    body: "Right-side positioning, auto-generated initials avatar, and a clean blue accent — ready to display social posts on air.",
  },
};

export type TutorialSocialCardCopy = typeof en;
