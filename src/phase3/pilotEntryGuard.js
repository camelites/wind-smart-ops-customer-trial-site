const PILOT_HASH = "#phase3-pilot";
const PILOT_ALLOWED_HASHES = new Set([PILOT_HASH, "#phase3-mobile-smoke"]);
const DEMO_HASHES = new Set([
  "",
  "#dashboard",
  "#assets",
  "#workbench",
  "#mobile-climb",
  "#spare-parts",
  "#turbine-history",
  "#knowledge-ai",
  "#reports",
  "#settings",
]);

export function applyPhase3PilotEntryGuard({
  root = document,
  location = globalThis.location,
} = {}) {
  const currentHash = location?.hash ?? "";
  const lockdown = isPhase3PilotLockdownEnabled({ root, location });
  const nextHash = lockdown && DEMO_HASHES.has(currentHash) ? PILOT_HASH : currentHash || "#dashboard";

  if (nextHash !== currentHash && location) {
    location.hash = nextHash;
  }

  updateActiveNavigation({ root, hash: nextHash });

  return {
    hash: nextHash,
    redirected: nextHash !== currentHash,
  };
}

export function applyPhase3PilotLockdown({
  root = document,
  location = globalThis.location,
  enabled = isPhase3PilotLockdownEnabled({ root, location }),
} = {}) {
  const navItems = Array.from(root.querySelectorAll?.(".nav-item[href]") ?? []);
  let hidden = 0;

  for (const item of navItems) {
    const isPilot = PILOT_ALLOWED_HASHES.has(item.getAttribute("href"));
    const shouldHide = Boolean(enabled && !isPilot);
    item.hidden = shouldHide;
    item.classList?.toggle?.("phase3-lockdown-hidden", shouldHide);

    if (shouldHide) {
      item.setAttribute?.("aria-hidden", "true");
      item.setAttribute?.("tabindex", "-1");
      hidden += 1;
    } else {
      item.removeAttribute?.("aria-hidden");
      item.removeAttribute?.("tabindex");
    }
  }

  return {
    locked: Boolean(enabled),
    hidden,
  };
}

export function bindPhase3PilotHashGuard({
  root = document,
  location = globalThis.location,
  window = globalThis,
} = {}) {
  if (!isPhase3PilotLockdownEnabled({ root, location }) || typeof window?.addEventListener !== "function") {
    return {
      bound: false,
    };
  }

  const enforcePilotHash = () => applyPhase3PilotEntryGuard({ root, location });
  window.addEventListener("hashchange", enforcePilotHash);

  return {
    bound: true,
  };
}

export function updateActiveNavigation({
  root = document,
  hash = globalThis.location?.hash ?? PILOT_HASH,
} = {}) {
  const targetHash = hash || PILOT_HASH;
  const navItems = Array.from(root.querySelectorAll?.(".nav-item[href]") ?? []);

  for (const item of navItems) {
    item.classList.toggle("active", item.getAttribute("href") === targetHash);
  }

  return {
    activeHash: targetHash,
    updated: navItems.length,
  };
}

function isPhase3PilotLockdownEnabled({ root = document, location = globalThis.location } = {}) {
  if (globalThis.__PHASE3_PILOT_LOCKDOWN__ === true) {
    return true;
  }

  if (location?.search) {
    try {
      const params = new URLSearchParams(location.search);
      if (params.get("phase3PilotLockdown") === "true") {
        return true;
      }
    } catch {
      // Ignore malformed search strings and fall back to explicit document flags.
    }
  }

  const datasetValue =
    root.documentElement?.dataset?.phase3PilotLockdown ??
    root.body?.dataset?.phase3PilotLockdown;

  return datasetValue === "true";
}
