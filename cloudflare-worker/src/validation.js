/**
 * Input validation and security helpers for Badge Quest Worker.
 */

const USERNAME_REGEX = /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i;

const ALLOWED_SLUGS = new Set([
  "pull-shark",
  "starstruck",
  "pair-extraordinaire",
  "galaxy-brain",
  "quickdraw",
  "yolo",
  "public-sponsor",
  "finishing-touch",
  "heart-on-your-sleeve",
  "open-sourcerer",
  "arctic-code-vault-contributor",
  "mars-2020-contributor",
  "proxima-pioneer",
  "proxima-staffshipper",
  "proxima-staffuser"
]);

export function validateUsername(raw) {
  if (!raw || typeof raw !== "string") {
    return { valid: false, error: "Username is required." };
  }
  const clean = raw.trim().replace(/^@/, "");
  if (!clean) {
    return { valid: false, error: "Username cannot be empty." };
  }
  if (clean.length > 39) {
    return { valid: false, error: "Username exceeds maximum length of 39 characters." };
  }
  if (!USERNAME_REGEX.test(clean)) {
    return { valid: false, error: "Invalid GitHub username format." };
  }
  return { valid: true, username: clean };
}

export function validateSlug(raw) {
  if (!raw || typeof raw !== "string") {
    return { valid: false, error: "Achievement slug is required." };
  }
  const clean = raw.trim().toLowerCase();
  if (!ALLOWED_SLUGS.has(clean)) {
    return { valid: false, error: `Unsupported or unknown achievement slug: "${clean}".` };
  }
  return { valid: true, slug: clean };
}
