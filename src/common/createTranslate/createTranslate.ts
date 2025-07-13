import type { ExtractPrefix, FlattenObjectKeys, GetObjectKeyValue, GetParams, Messages } from "../../types"
import { flattenObject, getPluralKey, replacePlaceholders } from "../../utils"

/**
 * Creates a translation function that retrieves localized messages based on a specified locale. It supports placeholders in messages for dynamic content and handles plurals.
 *
 * @param messages - Object with [BCP 47 language tag](https://www.techonthenet.com/js/language_tags.php) keys and their corresponding messages: `{ "en-EN": {...}, "de-DE": {...} }`.
 *
 * **Note:** Use `as const` assertion in TypeScript to ensure message values are inferred as literal types for better type safety: `{ "en-EN": {...}, "de-DE": {...} } as const`.
 * @param locale - key of `messages`
 * @returns Translation function to retrieve localized messages.
 *
 * @example
 * const t = createTranslate({ "en-EN": { greeting: "Hello, {name}!" } } as const, "en-EN")
 * const translation = t("greeting", { name: "Serhat" }) // Result: "Hello, Serhat!"
 */
export function createTranslate<TMessages extends Messages, TLocale extends keyof TMessages>(messages: TMessages, locale: TLocale) {
  type LocaleMessages = TMessages[TLocale extends keyof TMessages ? TLocale : keyof TMessages] // {"en-EN": {...}, "de-DE": {...}} -> if locale defined: content from locale {...} -> if generic locale (e.g. to be defined by request parameters or similar): union from locale messages: {...} | {...}
  type KeysUnfiltered = FlattenObjectKeys<LocaleMessages> // "user.firstname#one"
  type KeysPrefix = ExtractPrefix<KeysUnfiltered> // "user.firstname#one" -> "user.firstname"

  const localeMessages = messages[locale]

  if (!localeMessages) {
    throw new Error(`Cannot find messages for locale: ${String(locale)}`)
  }

  const flattenedLocaleMessages = flattenObject(localeMessages)

  const pluralKeys = new Set(
    Object.keys(flattenedLocaleMessages)
      .filter((key) => key.includes("#"))
      .map((key) => key.split("#", 1)[0]),
  )

  return function translate<Key extends KeysPrefix>(
    key: Key,
    ...params: GetParams<KeysUnfiltered, Key, GetObjectKeyValue<LocaleMessages, Key>>
  ) {
    const paramsObject = params[0]
    const pluralRules = new Intl.PluralRules(String(locale), {
      type: paramsObject && "ordinal" in paramsObject && paramsObject.ordinal ? "ordinal" : "cardinal",
    })

    const isPlural = pluralKeys.has(key)

    const translationKey =
      (isPlural && paramsObject && "count" in paramsObject && `${key}#${getPluralKey(paramsObject.count, pluralRules)}`) || key

    const baseKey = translationKey.split("#", 1)[0]

    const value = `${flattenedLocaleMessages[translationKey] || (isPlural && flattenedLocaleMessages[`${baseKey}#other`]) || translationKey}`

    return paramsObject ? replacePlaceholders<string>(value, paramsObject) : value
  }
}
