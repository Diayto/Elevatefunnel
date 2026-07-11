const DEDUP_WINDOW_MS = 5 * 60 * 1000;
const DEDUP_MAX_ENTRIES = 20_000;
const recentContacts = new Map<string, number>();

function normalizeContact(contact: string): string {
  return contact.toLowerCase().replace(/\s+/g, "").slice(0, 120);
}

export function isDuplicateLead(contact: string): boolean {
  const key = normalizeContact(contact);
  if (!key || key.length < 3) return false;

  const now = Date.now();
  const prev = recentContacts.get(key);
  if (prev && now - prev < DEDUP_WINDOW_MS) {
    return true;
  }

  recentContacts.set(key, now);

  if (recentContacts.size > DEDUP_MAX_ENTRIES) {
    for (const [k, ts] of recentContacts) {
      if (now - ts > DEDUP_WINDOW_MS) recentContacts.delete(k);
      if (recentContacts.size <= DEDUP_MAX_ENTRIES) break;
    }
  }

  return false;
}
