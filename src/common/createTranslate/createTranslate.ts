import type { ExtractPrefix, FlattenObjectKeys, GetObjectKeyValue, GetParams } from "../../types"
import type { Messages } from "../../types"
import { flattenObject, getPluralKey, replacePlaceholders } from "../../utils"

/**
 * Creates a translation function for the given messages and locale.
 *
 * @param messages - An object with locale keys e.g., `{ "de-DE": {...} as const, "en-EN": {...} as const }` and their corresponding messages.
 * **Note:** Use `as const` to ensure that message values are inferred as literal types for better type safety.
 * @param locale - BCP 47 language tag: https://www.techonthenet.com/js/language_tags.php
 * @returns A function to retrieve localized messages by key, supporting placeholders.
 *
 * @example
 * const t = createTranslate({ "en-EN": { greeting: "Hello, {name}!" } as const }, "en-EN");
 * t("greeting", { name: "Serhat" }); // "Hello, Serhat!"
 */
export function createTranslate<TMessages extends Messages, TLocale extends keyof TMessages extends string ? keyof TMessages : string>(
  messages: TMessages,
  locale: TLocale,
) {
  type LocaleMessages = TMessages[TLocale extends keyof TMessages ? TLocale : keyof TMessages] // {"en-EN": {...}, "de-DE": {...}} -> if locale defined: content from locale {...} -> if generic locale: union from locale messages: {...} | {...}
  type KeysUnfiltered = FlattenObjectKeys<LocaleMessages> // "user.firstname#one"
  type KeysPrefix = ExtractPrefix<KeysUnfiltered> // "user.firstname#one" -> "user.firstname"

  const localeMessages = messages[locale]

  if (!localeMessages) {
    throw new Error(`Cannot find messages for locale: ${locale}`)
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
    const pluralRules = new Intl.PluralRules(locale, {
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
