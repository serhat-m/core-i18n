import { describe, expect, it } from "vitest"
import { getPluralKey } from "./getPluralKey"

describe("getPluralKey", () => {
  const enPluralRules = new Intl.PluralRules("en-US")
  const dePluralRules = new Intl.PluralRules("de-DE")

  it('should return "zero" if count is 0', () => {
    expect(getPluralKey(0, enPluralRules)).toBe("zero")
  })

  it('should return "one" for singular (count = 1) in English', () => {
    expect(getPluralKey(1, enPluralRules)).toBe("one")
  })

  it('should return "other" for plural (count > 1) in English', () => {
    expect(getPluralKey(2, enPluralRules)).toBe("other")
    expect(getPluralKey(100, enPluralRules)).toBe("other")
  })

  it("should return correct plural form based on German plural rules", () => {
    expect(getPluralKey(1, dePluralRules)).toBe("one")
    expect(getPluralKey(2, dePluralRules)).toBe("other")
    expect(getPluralKey(0, dePluralRules)).toBe("zero")
  })

  it("should handle edge cases like negative numbers correctly", () => {
    expect(getPluralKey(-1, enPluralRules)).toBe("one")
    expect(getPluralKey(-5, enPluralRules)).toBe("other")
  })
})
