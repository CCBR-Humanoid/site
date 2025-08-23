/**
 * Return the singular or plural form based on count.
 * If `many` is omitted, appends 's' to the singular.
 */
export function pluralize(count: number, one: string, many?: string): string {
  if (count === 1) return one
  return many ?? `${one}s`
}
