/**
 * Flattens a nested object, converting nested keys into dot-separated keys.
 *
 * @param obj - The object to flatten.
 * @param prefix - A prefix for the keys.
 * @returns A flattened object with dot-separated keys.
 */
export function flattenObject(obj: Record<string, unknown>, prefix = ""): Record<string, unknown> {
  const result: Record<string, unknown> = {}

  for (const key in obj) {
    const value = obj[key]
    const newKey = prefix ? `${prefix}.${key}` : key

    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      Object.assign(result, flattenObject(value as Record<string, unknown>, newKey))
    } else {
      result[newKey] = value
    }
  }

  return result
}
