export const enEN = {
  metadata: "Metadata enEN",
  welcomeMessage: "Welcome {name}",
  "apple#zero": "You have no apples.",
  "apple#one": "You have one apple from {origin}.",
  "apple#other": "You have {count} apples.",
  "book#zero": "no books",
  "book#one": "one book",
  "book#other": "some number of books",
  user: {
    email: "Email Address",
    firstname: "First Name",
    lastname: "Last Name",
    welcomeMessage: "Welcome, {firstname} {lastname}!",
  },
  duration: {
    "days#one": "{count} day {varOneEn}", // Plural cardinal (default)
    "days#other": "{count} days {varOtherEn}", // Plural cardinal (default)
    expired: "Registration period expired",
  },
  article: {
    "availability#zero": "Item currently unavailable", // Plural cardinal (default)
    "availability#one": "Only one item available", // Plural cardinal (default)
    "availability#other": "Many items available", // Plural cardinal (default)
  },
  "article#few": "hi {articleName}",
  navigation: {
    "direction#zero": "zero", // Plural ordinal
    "direction#one": "Take the {count}st right.", // Plural ordinal
    "direction#two": "Take the {count}nd right.", // Plural ordinal
    "direction#few": "Take the {count}rd right.", // Plural ordinal
    "direction#other": "Take the {count}th right.", // Plural ordinal
  },
  error: {
    unexpected: "An unexpected error occurred. Please try again.",
    minCharacters: "At least {charCount} characters",
    maxCharacters: "Maximum {charCount} characters",
  },
  "product#other": "Other product",
} as const

export const deDE = {
  metadata: "Metadata deDE",
  welcomeMessage: "Willkommen {name}",
  "apple#zero": "Du hast keine Äpfel.",
  "apple#one": "Du hast einen Apfel von {origin} aus {country}.",
  "apple#other": "Du hast {count} Äpfel.",
  user: {
    email: "E-Mail-Adresse",
    firstname: "Vorname",
    lastname: "Nachname",
    welcomeMessage: "Willkommen, {firstname} {lastname}!",
  },
  duration: {
    "days#one": "{count} Tag {varOneDe}", // Plural cardinal (default)
    "days#other": "{count} Tage", // Plural cardinal (default)
    expired: "Registrierungszeitraum abgelaufen",
  },
  article: {
    "availability#zero": "Artikel derzeit nicht verfügbar", // Plural cardinal (default)
    "availability#one": "Nur ein Artikel verfügbar", // Plural cardinal (default)
    "availability#other": "Genug Artikel verfügbar", // Plural cardinal (default)
  },
  navigation: {
    "direction#other": "Biegen Sie die {count}. rechts ab.", // Plural ordinal
  },
  error: {
    unexpected: "Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es erneut.",
    minCharacters: "Mindestens {charCount} Zeichen",
    maxCharacters: "Maximal {charCount} Zeichen",
  },
} as const

export const testLang = {
  book: "Informative book",
  cars: {
    "car#zero": "no cars",
    "car#one": "one car",
    "car#two": "two cars",
    "car#few": "a few cars",
    "car#many": "many cars",
    "car#other": "some number of cars",
  },
} as const
