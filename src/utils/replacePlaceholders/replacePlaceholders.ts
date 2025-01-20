import type { ExtractPlaceholders } from "../../types"

/**
 * Replaces placeholders in a `string`.
 * Placeholders in the format `{key}` are replaced by matching `key` values from the `placeholders` object.
 * Unmatched placeholders remain unchanged.
 *
 * @param value - string containing placeholders in the {placeholder} pattern.
 * @param placeholders - An object with key-value pairs for placeholder replacement.
 * @returns A string with placeholders replaced by corresponding values.
 *
 * @example
 * replacePlaceholders("Hello, {name}! You have {count} new messages.", { name: "Joana", count: 5 })
 * // Result: "Hello, Joana! You have 5 new messages."
 */
export function replacePlaceholders<TValue extends string>(
  value: TValue,
  placeholders: Record<ExtractPlaceholders<TValue>, string>,
): string {
  return value.replace(/{(\w+)}/g, (_, key) => {
    return key in placeholders ? String(placeholders[key as keyof typeof placeholders]) : `{${key}}`
  })
}
