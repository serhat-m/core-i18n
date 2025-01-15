import { describe, expect, it } from "vitest"
import { replacePlaceholders } from "./replacePlaceholders"

describe("replacePlaceholders", () => {
  it("replaces a single placeholder", () => {
    const result = replacePlaceholders("Hello, {name}!", { name: "World" })
    expect(result).toBe("Hello, World!")
  })

  it("replaces multiple placeholders", () => {
    const result = replacePlaceholders("Hello, {name}! Today is {day}.", { name: "Test", day: "Monday" })
    expect(result).toBe("Hello, Test! Today is Monday.")
  })

  it("keeps placeholders that are not defined in values", () => {
    // @ts-expect-error
    const result = replacePlaceholders("Hello, {name}! Today is {day}.", { name: "Test" })
    expect(result).toBe("Hello, Test! Today is {day}.")
  })

  it("converts different data types to strings", () => {
    const result = replacePlaceholders("ID: {id}, Price: {price}, Active: {active}", {
      id: "123",
      price: "19.99",
      active: "true",
    })
    expect(result).toBe("ID: 123, Price: 19.99, Active: true")
  })

  it("returns the original string if there are no placeholders", () => {
    const result = replacePlaceholders("No placeholders here.", { name: "World" })
    expect(result).toBe("No placeholders here.")
  })

  it("handles empty values as empty strings", () => {
    const result = replacePlaceholders("Hello, {name}!", { name: "" })
    expect(result).toBe("Hello, !")
  })

  it("handles similarly named keys correctly", () => {
    const result = replacePlaceholders("Size: {size}, Size in inches: {sizeInInches}", {
      size: "L",
      sizeInInches: "42",
    })
    expect(result).toBe("Size: L, Size in inches: 42")
  })
})
