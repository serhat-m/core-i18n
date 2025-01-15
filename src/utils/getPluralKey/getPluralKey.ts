/**
 * Returns the plural form key for a given count, based on the provided plural rules.
 *
 * @param count - The number used to determine the plural form key.
 * @param pluralRules - An `Intl.PluralRules` object that defines pluralization rules for a specific locale.
 * @returns - Returns "zero" if `count` is 0, otherwise the plural form key, such as "one", "two", or "other" (depending on the plural rules).
 */
export function getPluralKey(count: number, pluralRules: Intl.PluralRules): string {
  if (count === 0) return "zero"
  return pluralRules.select(count)
}
