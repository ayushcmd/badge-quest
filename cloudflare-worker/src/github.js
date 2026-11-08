/**
 * Outbound GitHub HTTP fetch client.
 * Connects directly to public GitHub pages with proper browser headers and timeout handling.
 */

const USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

export async function fetchUserAchievementsPage(username) {
  const url = `https://github.com/${encodeURIComponent(username)}?tab=achievements`;
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": USER_AGENT,
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9"
      }
    });
    clearTimeout(timeoutId);

    const html = await res.text();
    return {
      ok: res.ok,
      status: res.status,
      html,
      url
    };
  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === "AbortError") {
      return { ok: false, status: 504, error: "GitHub request timed out.", html: "" };
    }
    return { ok: false, status: 500, error: err.message || "Failed to connect to GitHub.", html: "" };
  }
}

export async function fetchAchievementDetail(username, slug) {
  const url = `https://github.com/users/${encodeURIComponent(username)}/achievements/${encodeURIComponent(slug)}/detail?hovercard=1`;
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": USER_AGENT,
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "X-Requested-With": "XMLHttpRequest",
        "Accept-Language": "en-US,en;q=0.9"
      }
    });
    clearTimeout(timeoutId);

    const html = await res.text();
    return {
      ok: res.ok,
      status: res.status,
      html,
      url
    };
  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === "AbortError") {
      return { ok: false, status: 504, error: "GitHub detail request timed out.", html: "" };
    }
    return { ok: false, status: 500, error: err.message || "Failed to connect to GitHub.", html: "" };
  }
}
