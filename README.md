`core-i18n` provides core internationalization functionality for JavaScript. With first-class TypeScript support, it ensures type safety and simplifies managing translations across languages.

# Common Functions

## `createTranslate`

Creates a translation function that retrieves localized messages based on a specified locale. It supports placeholders in messages for dynamic content and handles plurals.

### Parameters

- **`messages`** `Record<string, Record<string, unknown>>`
    
    Object with [BCP 47 language tag](https://www.techonthenet.com/js/language_tags.php) keys and their corresponding messages:
    `{ "en-EN": {...}, "de-DE": {...} }`.
    
    **Note:** Use `as const` assertion in TypeScript to ensure message values are inferred as literal types for better type safety: `{ "en-EN": {...}, "de-DE": {...} } as const`.
    
- **`locale`** `string`
    
    key of **`messages`**
    

### Basic usage

```tsx
import { createTranslate } from "core-i18n"
// const { createTranslate } = require("core-i18n") // legacy way

// Define messages
const messages = {
  "en-EN": { email: "Email Address" },
  "de-DE": { email: "E-Mail-Adresse" }
} as const // TypeScript: as const assertion for better type safety

// Create translate function
const t = createTranslate(messages, "en-EN")

// Translate
const translation = t("email")
// Result: "Email Address"
```

### Placeholders

Placeholders are variables for content, following the pattern `{placeholder}`, where:

1. **Curly Braces** `{}`: Mark the placeholder’s start and end to distinguish it from regular text.
2. **Placeholder Name**: A descriptive name inside the braces, e.g. `{name}` for a name.

```tsx
const messages = {
  "en-EN": { farewell: "Goodbye, {city}!" },
  "de-DE": { farewell: "Auf Wiedersehen, {city}!" }
} as const // TypeScript: as const assertion for better type safety

const t = createTranslate(messages, "en-EN")

const translation = t("farewell", { city: "Berlin" })
// Result: "Goodbye, Berlin!"
```

### Cardinal plurals (default)

Plural integration uses the [`Intl.PluralRules`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/PluralRules) API:

- Check [compatibility](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/PluralRules#browser_compatibility)
- For detailed information about the rules and their usage, refer to the [Plural Rules](https://cldr.unicode.org/index/cldr-spec/plural-rules) documentation.
- For a comprehensive list of rules and their application across different languages, see the [LDML Language Plural Rules](https://www.unicode.org/cldr/charts/43/supplemental/language_plural_rules.html).

Declare plural translations by appending `#` followed by `zero`, `one`, `two`, `few`, `many`, or `other`:

```tsx
const messages = {
  "en-EN": {
    "availability#zero": "Item currently unavailable",
    "availability#one": "Only one item available",
    "availability#other": "Many items available"
  }
} as const // TypeScript: as const assertion for better type safety

const t = createTranslate(messages, "en-EN")

const translation = t("availability", { count: 1 })
// Result: "Only one item available"
```

Special translations for `{ count: 0 }` are allowed to enable more natural language. If a `#zero` entry exists, it replaces the default plural form:

```tsx
const messages = {
  "en-EN": {
    "apple#zero": "You have no apples.",
    "apple#other": "You have {count} apples."
  }
} as const // TypeScript: as const assertion for better type safety

const t = createTranslate(messages, "en-EN")

const translation = t("apple", { count: 0 })
// Result: "You have no apples."
```

### Ordinal plurals

Ordinal numbers are also supported (e.g. “1st”, “2nd”, “3rd” in English). The `ordinal` option ensures the correct plural key is selected based on the ordinal value.

```tsx
const messages = {
  "en-EN": {
    "direction#zero": "zero",
    "direction#one": "Take the {count}st right.",
    "direction#two": "Take the {count}nd right.",
    "direction#few": "Take the {count}rd right.",
    "direction#other": "Take the {count}th right."
  }
} as const // TypeScript: as const assertion for better type safety

const t = createTranslate(messages, "en-EN")

const translation = t("direction", { count: 3, ordinal: true })
// Result: "Take the 3rd right."
```

### Type safety

Type safety in i18n ensures that only valid translation keys are used, catching errors like missing keys or wrong placeholders during development. This improves developer productivity, reduces runtime bugs, and ensures a consistent, error-free user experience across all languages.

#### Locale

Locale validation ensures only predefined language keys, like `en-EN` or `de-DE`, are used to maintain consistency.

![autocomplete-locale](https://github.com/user-attachments/assets/7c34350e-8d11-4f7d-948d-6f094ff1353a)

#### Translation keys

Strict key validation ensures only valid translation keys are used.

![autocomplete-key](https://github.com/user-attachments/assets/02c29ddf-8dbf-4279-a27d-7f667515c752)

#### Placeholders & Pluralization

Supports placeholders and pluralization with type-safe suggestions for required properties.

![autocomplete-placeholder](https://github.com/user-attachments/assets/8634930c-0a79-4d8e-ad77-f359359bc1cf)

![autocomplete-plural](https://github.com/user-attachments/assets/17a55b12-76a3-4e2d-97f3-5d1c70c87efc)

# Utility Functions

## `flattenObject`

Flattens a nested object into a single-level object with dot-separated keys.

### Parameters

- **`obj`** `Record<string, unknown>`
    
    object to flatten
    
- **`prefix`** `string`
    
    optional key prefix
    

### Example

```tsx
import { flattenObject } from "core-i18n"
// const { flattenObject } = require("core-i18n") // legacy way

const nestedObject = {
  car: {
    brand: "BMW",
    model: "M5",
    features: { autopilot: true, color: "red" }
  }
}

const flattenedObject = flattenObject(nestedObject)
// Result: { "car.brand": "BMW", "car.model": "M5", "car.features.autopilot": true, "car.features.color": "red" }
```

```tsx
// Example with prefix

const nestedObject = {
  car: {
    brand: "BMW"
  }
}

const flattenedObject = flattenObject(nestedObject, "myPrefix")
// Result: { "myPrefix.car.brand": "BMW" }
```

## `getPluralKey`

Returns the appropriate plural key including support for `zero` based on the `count` using the [`Intl.PluralRules`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/PluralRules) API.

For detailed information about the rules and their usage, refer to the [Plural Rules](https://cldr.unicode.org/index/cldr-spec/plural-rules) documentation. For a comprehensive list of rules and their application across different languages, see the [LDML Language Plural Rules](https://www.unicode.org/cldr/charts/43/supplemental/language_plural_rules.html).

### Parameters

- **`count`** `number`
    
    used to determine the plural form key
    
- **`pluralRules`** [`Intl.PluralRules`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/PluralRules)
    
    pluralization rules for a specific locale
    

### Example

```tsx
import { getPluralKey } from "core-i18n"
// const { getPluralKey } = require("core-i18n") // legacy way

const pluralRulesEnUS = new Intl.PluralRules("en-US")

const pluralKey = getPluralKey(0, pluralRulesEnUS)
// Result: "zero"

const pluralKey = getPluralKey(2, pluralRulesEnUS)
// Result: "other"
```

## `replacePlaceholders`

Replaces placeholders in a string.

### Parameters

- **`value`** `string`
    
    string containing placeholders in the `{placeholder}` pattern, where:
    
    1. **Curly Braces** `{}`: Mark the placeholder’s start and end to distinguish it from regular text.
    2. **Placeholder Name**: A descriptive name inside the braces, e.g. `{name}` for a name.
- **`placeholders`** `Record<string, string>`
    
    object with key-value pairs for placeholder replacement
    

### Example

```tsx
import { replacePlaceholders } from "core-i18n"
// const { replacePlaceholders } = require("core-i18n") // legacy way

const message = replacePlaceholders("ID: {id}, Price: {price}", {
  id: 123,
  price: 19.99
})
// Result: "ID: 123, Price: 19.99"
```

# Utility Types

## **`ExtractPrefix<Value extends string>`**

Extracts the prefix from a string separated by `#`. If no `#` is present, the entire string is returned:

```tsx
import type { ExtractPrefix } from "core-i18n"

ExtractPrefix<"prefix#suffix">
// Type Result: "prefix"

ExtractPrefix<"noSeparator">
// Type Result: "noSeparator"
```

## `FlattenObjectKeys<Obj, Prefix extends string = "">`

Flattens object keys into dot notation, supporting union objects.

```tsx
import type { FlattenObjectKeys } from "core-i18n"

type Account = {
  user: {
    name: string
    age: number
  }
  active: boolean
}

FlattenObjectKeys<Account>
// Type Result: "user.name" | "user.age" | "active"

FlattenObjectKeys<Account, "myPrefix.">
// Type Result: "myPrefix.user.name" | "myPrefix.user.age" | "myPrefix.active"
```

```tsx
// Union object example

type FailedState = {
  state: "failed"
  code: number
}

type SuccessState = {
  state: "success"
  response: {
    title: string
  }
}

FlattenObjectKeys<FailedState | SuccessState>
// Type Result: "state" | "code" | "response.title"
```

## `GetObjectKeyValue<Obj, Key extends ExtractPrefix<FlattenObjectKeys<Obj>>>`

Retrieves the type of a value for a flattened key in an object. Supports union objects and pluralized keys separated by a `#`.

```tsx
import type { GetObjectKeyValue } from "core-i18n"

type TestType = {
  car: {
    manufacturer: "BMW"
  }
}

GetObjectKeyValue<TestType, "car.manufacturer">
// Type Result: "BMW"
```

```tsx
// Example with pluralized key

type TestType = {
  "apple#zero": "You have no apples."
  "apple#other": "You have {count} apples."
}

GetObjectKeyValue<TestType, "apple">
// Type Result: "You have no apples." | "You have {count} apples."
```

## `IsPlural<Value extends string, Prefix extends ExtractPrefix<Value>>`

Checks if a string matches the pattern `Prefix#Suffix`.

```tsx
import type { IsPlural } from "core-i18n"

IsPlural<"user#name" | "user#age", "user">
// Type Result: true -> "user" is plural

// multiple strings match the pattern 'Prefix#Suffix' including non matching strings
IsPlural<"order#amount" | "order#date" | "avatar", "order">
// Type Result: true -> "order" is plural

// no string matches the pattern 'Prefix#string'
IsPlural<"username" | "avatar", "username">
// Type Result: never
```

## `ExtractPlaceholders<Value>`

Extracts placeholders from a string that match the `{placeholder}` pattern.

```tsx
import type { ExtractPlaceholders } from "core-i18n"

ExtractPlaceholders<"Hello, {firstname} {lastname}">
// Type Result: "firstname" | "lastname"
```