/**
 * Internal representation of a temporary value stored in sessionStorage.
 */
type TemporarySessionValue = {
  value: string;
  expires: number;
};

/**
 * Checks whether a value matches the temporary session record format.
 *
 * @param value - Candidate value loaded from sessionStorage.
 * @returns True when the value has the expected shape and types.
 */
function isTemporarySessionValue(
  value: unknown,
): value is TemporarySessionValue {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const obj = value as Record<string, unknown>;

  return typeof obj.value === 'string' && typeof obj.expires === 'number';
}

/**
 * Stores a temporary string value in sessionStorage with an expiry timestamp.
 *
 * @param key - Storage key used to retrieve the value later.
 * @param value - Value to save.
 * @param lifetimeMs - How long the value remains valid before expiration.
 */
function setTemporarySessionValue(
  key: string,
  value: string,
  lifetimeMs: number,
): void {
  sessionStorage.setItem(
    key,
    JSON.stringify({
      value,
      expires: Date.now() + lifetimeMs,
    }),
  );
}

/**
 * Reads and validates a temporary session value if it has not expired.
 *
 * @param key - Storage key to look up.
 * @returns The stored value when it is still valid, otherwise null.
 */
function getTemporarySessionValue(key: string): string | null {
  const stored = sessionStorage.getItem(key);

  if (!stored) {
    return null;
  }

  let parsed: unknown;

  try {
    parsed = JSON.parse(stored);
  } catch {
    sessionStorage.removeItem(key);
    return null;
  }

  if (!isTemporarySessionValue(parsed)) {
    sessionStorage.removeItem(key);
    return null;
  }

  if (Date.now() >= parsed.expires) {
    sessionStorage.removeItem(key);
    return null;
  }

  sessionStorage.removeItem(key);
  return parsed.value;
}

/**
 * Saves the current page URL so the app can return to the menu later.
 */
export function storeMenuPage(): void {
  setTemporarySessionValue('menuPage', location.href, 5 * 60 * 60 * 1000); // Store for 5 hours
}

/**
 * Retrieves the previously stored menu page URL or falls back to the default index page.
 *
 * @returns The menu page URL to navigate back to.
 */
export function getMenuPage(): string {
  const menuPage = getTemporarySessionValue('menuPage');

  if (menuPage) return menuPage;
  else return 'index.html';
}
