import { describe, expectTypeOf, it } from "vitest"
import { deDE, enEN, testLang } from "../../__tests__/locales.mock"
import type { Messages } from "../../types"
import { createTranslate } from "./createTranslate"

const messages = { "de-DE": deDE, "en-EN": enEN, testLang }

// messages are defined but locale is generic -> to be defined by request parameters or similar
function createTranslateGeneric<TMessages extends Messages>(messages: TMessages) {
  const locale: string = "en-EN"

  return createTranslate(messages, locale)
}

const tGeneric = createTranslateGeneric(messages)

const t = createTranslate(messages, "en-EN")

describe("createTranslate", () => {
  describe("function parameter types", () => {
    describe("t(): generic locale", () => {
      it("should suggest translation keys", () => {
        type TranslationKeys = Parameters<typeof tGeneric>[0]

        type ExpectedTranslationKeys =
          | "metadata"
          | "article"
          | "user.email"
          | "user.firstname"
          | "user.lastname"
          | "user.welcomeMessage"
          | "duration.days"
          | "duration.expired"
          | "error.unexpected"
          | "error.minCharacters"
          | "error.maxCharacters"
          | "apple"
          | "article.availability"
          | "navigation.direction"
          | "cars.car"
          | "book"
          | "welcomeMessage"
          | "product"

        expectTypeOf<TranslationKeys>().toEqualTypeOf<ExpectedTranslationKeys>()
      })

      describe("translation key: default", () => {
        describe("first level", () => {
          it("should handle translation key with no variables, ensuring no second parameter is present", () => {
            type Params = Parameters<typeof tGeneric<"metadata">>

            expectTypeOf<Params>().toEqualTypeOf<[key: "metadata"]>()
          })

          it("should require variables", () => {
            type Vars = keyof Parameters<typeof tGeneric<"welcomeMessage">>[1]

            expectTypeOf<Vars>().toEqualTypeOf<"name">()
          })
        })

        describe("nested", () => {
          it("should handle translation key with no variables, ensuring no second parameter is present", () => {
            type Params = Parameters<typeof tGeneric<"duration.expired">>

            expectTypeOf<Params>().toEqualTypeOf<[key: "duration.expired"]>()
          })

          it("should require variables", () => {
            type Vars = keyof Parameters<typeof tGeneric<"error.maxCharacters">>[1]

            expectTypeOf<Vars>().toEqualTypeOf<"charCount">()
          })
        })
      })

      describe("translation key: pluralized", () => {
        describe("first level", () => {
          it("should require count property without variables", () => {
            type Vars = keyof Parameters<typeof tGeneric<"book">>[1]

            expectTypeOf<Vars>().toEqualTypeOf<"count" | "ordinal">()
          })

          it("should require count property and variables", () => {
            type Vars = keyof Parameters<typeof tGeneric<"apple">>[1]

            expectTypeOf<Vars>().toEqualTypeOf<"count" | "ordinal" | "origin" | "country">()
          })
        })

        describe("nested", () => {
          it("should require count property without variables", () => {
            type Vars = keyof Parameters<typeof tGeneric<"article.availability">>[1]

            expectTypeOf<Vars>().toEqualTypeOf<"count" | "ordinal">()
          })

          it("should require count property and variables", () => {
            type Vars = keyof Parameters<typeof tGeneric<"duration.days">>[1]

            expectTypeOf<Vars>().toEqualTypeOf<"count" | "ordinal" | "varOneDe" | "varOneEn" | "varOtherEn">()
          })
        })
      })
    })

    describe("t(): defined locale", () => {
      it("should suggest translation keys only for defined locale", () => {
        type TranslationKeys = Parameters<typeof t>[0]

        type ExpectedTranslationKeys =
          | "metadata"
          | "welcomeMessage"
          | "apple"
          | "book"
          | "user.email"
          | "user.firstname"
          | "user.lastname"
          | "user.welcomeMessage"
          | "duration.days"
          | "duration.expired"
          | "article.availability"
          | "article"
          | "navigation.direction"
          | "error.unexpected"
          | "error.minCharacters"
          | "error.maxCharacters"
          | "product"

        expectTypeOf<TranslationKeys>().toEqualTypeOf<ExpectedTranslationKeys>()
      })

      it("should require count property and variables only for defined locale", () => {
        type Vars = keyof Parameters<typeof t<"apple">>[1]

        expectTypeOf<Vars>().toEqualTypeOf<"count" | "ordinal" | "origin">()
      })
    })
  })
})
