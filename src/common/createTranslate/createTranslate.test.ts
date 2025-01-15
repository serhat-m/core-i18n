import { describe, expect, it } from "vitest"
import { deDE, enEN, testLang } from "../../__tests__/locales.mock"
import { createTranslate } from "./createTranslate"

const messages = { "de-DE": deDE, "en-EN": enEN, testLang }

const tEN = createTranslate(messages, "en-EN")

describe("createTranslate", () => {
  describe("t()", () => {
    describe("error handling", () => {
      it("should return translation key, if translation is not available", () => {
        // @ts-expect-error
        const result = tEN("missingKey")
        expect(result).toBe("missingKey")
      })
    })

    describe("translation key: default", () => {
      describe("first level", () => {
        it("should correctly translate", () => {
          const result = tEN("metadata")
          expect(result).toBe("Metadata enEN")
        })

        it("should correctly translate including variables", () => {
          const result = tEN("welcomeMessage", { name: "Test" })
          expect(result).toBe("Welcome Test")
        })
      })

      describe("nested", () => {
        it("should correctly translate", () => {
          const result = tEN("user.email")
          expect(result).toBe("Email Address")
        })

        it("should correctly translate including variables", () => {
          const result = tEN("user.welcomeMessage", { firstname: "Firstname", lastname: "Lastname" })
          expect(result).toBe("Welcome, Firstname Lastname!")
        })
      })
    })

    describe("translation key: pluralized", () => {
      describe("first level", () => {
        it("should correctly translate", () => {
          const result = tEN("apple", { count: 0, origin: "Germany" })
          expect(result).toBe("You have no apples.")
        })

        it("should correctly translate including variables", () => {
          const result = tEN("apple", { count: 1, origin: "Germany" })
          expect(result).toBe("You have one apple from Germany.")
        })
      })

      describe("nested", () => {
        it("should correctly translate", () => {
          const result = tEN("article.availability", { count: 2 })
          expect(result).toBe("Many items available")
        })

        it("should correctly translate including variables", () => {
          const result = tEN("duration.days", { count: 1, varOneEn: "one", varOtherEn: "other" })
          expect(result).toBe("1 day one")
        })
      })

      describe("ordinal", () => {
        it("should correctly translate", () => {
          const result0 = tEN("navigation.direction", { count: 0, ordinal: true })
          expect(result0).toBe("zero")

          const result1 = tEN("navigation.direction", { count: 1, ordinal: true })
          const result11 = tEN("navigation.direction", { count: 21, ordinal: true })
          expect(result1).toBe("Take the 1st right.")
          expect(result11).toBe("Take the 21st right.")

          const result2 = tEN("navigation.direction", { count: 2, ordinal: true })
          const result22 = tEN("navigation.direction", { count: 32, ordinal: true })
          expect(result2).toBe("Take the 2nd right.")
          expect(result22).toBe("Take the 32nd right.")

          const result3 = tEN("navigation.direction", { count: 3, ordinal: true })
          const result33 = tEN("navigation.direction", { count: 33, ordinal: true })
          expect(result3).toBe("Take the 3rd right.")
          expect(result33).toBe("Take the 33rd right.")

          const result4 = tEN("navigation.direction", { count: 4, ordinal: true })
          const result15 = tEN("navigation.direction", { count: 15, ordinal: true })
          expect(result4).toBe("Take the 4th right.")
          expect(result15).toBe("Take the 15th right.")
        })
      })

      describe("error handling", () => {
        it("should fallback to #other plural form if selected plural form is missing", () => {
          const result = tEN("product", { count: 0 })
          expect(result).toBe("Other product")
        })

        it("should fallback to translation key if #other plural form fallback is also missing", () => {
          // @ts-expect-error
          const result = tEN("missingKey", { count: 1 })
          expect(result).toBe("missingKey")
        })
      })
    })
  })
})
