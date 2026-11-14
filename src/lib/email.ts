/** Joins an address at runtime so the full string never sits in the HTML. */
export function joinEmail(user: string, domain: string) {
  return [user, domain].join(String.fromCharCode(64));
}
