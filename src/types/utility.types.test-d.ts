import { describe, expectTypeOf, it } from "vitest"
import type {
  AddCount,
  Count,
  ExtractPlaceholders,
  ExtractPluralKeys,
  ExtractPrefix,
  FlattenObjectKeys,
  GetObjectKeyValue,
  GetParams,
  IsPlural,
} from "./utility.types"

describe("utility types", () => {
  describe("ExtractPrefix", () => {
    it("should correctly extract the prefix from strings with a '#'", () => {
      type Test1 = ExtractPrefix<"prefix#suffix">
      type Test2 = ExtractPrefix<"user#1234">
      type Test3 = ExtractPrefix<"myPrefix#mySuffix">

      expectTypeOf<Test1>().toEqualTypeOf<"prefix">()
      expectTypeOf<Test2>().toEqualTypeOf<"user">()
      expectTypeOf<Test3>().toEqualTypeOf<"myPrefix">()
    })

    it("should return the full string if there is no '#'", () => {
      type Test4 = ExtractPrefix<"noSeparator">
      type Test5 = ExtractPrefix<"anotherExample">

      expectTypeOf<Test4>().toEqualTypeOf<"noSeparator">()
      expectTypeOf<Test5>().toEqualTypeOf<"anotherExample">()
    })

    it("should handle empty strings", () => {
      type Test6 = ExtractPrefix<"">
      expectTypeOf<Test6>().toEqualTypeOf<"">()
    })
  })

  describe("FlattenObjectKeys", () => {
    it("should flatten a simple object with no nesting", () => {
      type TestType = {
        name: string
        age: number
      }

      type Result = FlattenObjectKeys<TestType>

      expectTypeOf<Result>().toEqualTypeOf<"name" | "age">()
    })

    it("should flatten a nested object with one level of nesting", () => {
      type TestType = {
        user: {
          name: string
          age: number
        }
        active: boolean
      }

      type Result = FlattenObjectKeys<TestType>

      expectTypeOf<Result>().toEqualTypeOf<"user.name" | "user.age" | "active">()
    })

    it("should flatten a deeply nested object", () => {
      type TestType = {
        a: {
          b: {
            c: {
              d: string
            }
          }
        }
        e: number
      }

      type Result = FlattenObjectKeys<TestType>

      expectTypeOf<Result>().toEqualTypeOf<"a.b.c.d" | "e">()
    })

    it("should flatten an object with mixed nested and non-nested keys", () => {
      type TestType = {
        id: string
        info: {
          name: string
          details: {
            age: number
            address: {
              city: string
              zip: number
            }
          }
        }
      }

      type Result = FlattenObjectKeys<TestType>

      expectTypeOf<Result>().toEqualTypeOf<
        "id" | "info.name" | "info.details.age" | "info.details.address.city" | "info.details.address.zip"
      >()
    })

    it("should return `never` for an empty object", () => {
      type TestType = {}

      type Result = FlattenObjectKeys<TestType>

      expectTypeOf<Result>().toEqualTypeOf<never>()
    })

    it("should handle unions of objects with disjoint keys", () => {
      type TestType =
        | {
            a: string
          }
        | {
            b: number
          }

      type Result = FlattenObjectKeys<TestType>

      expectTypeOf<Result>().toEqualTypeOf<"a" | "b">()
    })

    it("should handle unions of objects with overlapping keys", () => {
      type TestType =
        | {
            a: string
            b: number
          }
        | {
            a: string
            c: boolean
          }

      type Result = FlattenObjectKeys<TestType>

      expectTypeOf<Result>().toEqualTypeOf<"a" | "b" | "c">()
    })

    it("should handle unions of deeply nested objects", () => {
      type TestType =
        | {
            a: {
              b: {
                c: string
              }
            }
          }
        | {
            a: {
              d: {
                e: number
              }
            }
          }

      type Result = FlattenObjectKeys<TestType>

      expectTypeOf<Result>().toEqualTypeOf<"a.b.c" | "a.d.e">()
    })

    it("should handle unions with mixed nested and non-nested keys", () => {
      type TestType =
        | {
            x: string
            y: {
              z: number
            }
          }
        | {
            w: boolean
          }

      type Result = FlattenObjectKeys<TestType>

      expectTypeOf<Result>().toEqualTypeOf<"x" | "y.z" | "w">()
    })

    it("should correctly prefix keys", () => {
      type TestType =
        | {
            a: {
              b: {
                c: string
              }
            }
          }
        | {
            a: {
              d: {
                e: number
              }
            }
          }

      type Result = FlattenObjectKeys<TestType, "myPrefix.">

      expectTypeOf<Result>().toEqualTypeOf<"myPrefix.a.b.c" | "myPrefix.a.d.e">()
    })
  })

  describe("IsPlural", () => {
    it("should return true if the string matches the pattern 'Prefix#string'", () => {
      type TestType = IsPlural<"user#name", "user">

      expectTypeOf<TestType>().toEqualTypeOf<true>()
    })

    it("should return never if no string matches the pattern 'Prefix#string'", () => {
      type TestType = IsPlural<"username" | "avatar", "username">

      expectTypeOf<TestType>().toEqualTypeOf<never>()
    })

    it("should return true if multiple strings match the pattern 'Prefix#string' including non matching strings", () => {
      type TestType = IsPlural<"order#amount" | "order#date" | "avatar", "order">

      expectTypeOf<TestType>().toEqualTypeOf<true>()
    })
  })

  describe("GetObjectKeyValue", () => {
    it("should extract value for a simple object", () => {
      type TestType = {
        name: string
        age: number
      }

      type Result = GetObjectKeyValue<TestType, "age">

      expectTypeOf<Result>().toEqualTypeOf<number>()
    })

    it("should extract value for a flattened key", () => {
      type TestType = {
        name: string
        age: {
          value: number
        }
      }

      type Result = GetObjectKeyValue<TestType, "age.value">

      expectTypeOf<Result>().toEqualTypeOf<number>()
    })

    it("should return never for non-existent keys in a simple object", () => {
      type TestType = {
        name: string
        age: number
      }

      // @ts-expect-error
      type Result = GetObjectKeyValue<TestType, "height">

      expectTypeOf<Result>().toEqualTypeOf<never>()
    })

    it("should extract value for a union of objects with the same key", () => {
      type TypeA = {
        manufacturer: string
        age: {
          value: 27
        }
      }

      type TypeB = {
        manufacturer: string
        age: {
          value: string
        }
      }

      type Result = GetObjectKeyValue<TypeA | TypeB, "age.value">

      expectTypeOf<Result>().toEqualTypeOf<string | 27>()
    })

    it("should handle union of objects with missing key in one type", () => {
      type TypeA = {
        manufacturer: string
        age: number
      }

      type TypeB = {
        manufacturer: string
        model: string
      }

      type Result = GetObjectKeyValue<TypeA | TypeB, "age">

      expectTypeOf<Result>().toEqualTypeOf<number>()
    })

    it("should handle union of objects with different key types", () => {
      type TypeA = {
        manufacturer: string
        age: number
      }

      type TypeB = {
        manufacturer: string
        age: string
      }

      type Result = GetObjectKeyValue<TypeA | TypeB, "age">

      expectTypeOf<Result>().toEqualTypeOf<number | string>()
    })

    it("should return never if key is missing in all types of union", () => {
      type TypeA = {
        manufacturer: string
      }

      type TypeB = {
        model: string
      }

      // @ts-expect-error
      type Result = GetObjectKeyValue<TypeA | TypeB, "age">

      expectTypeOf<Result>().toEqualTypeOf<never>()
    })

    it("should handle pluralized keys matching a base key", () => {
      type TestType = {
        fruit: {
          "apple#one": "Red Apple"
          "apple#two": "Green Apple"
        }
        manufacturer: string
      }

      type Result = GetObjectKeyValue<TestType, "fruit.apple">

      expectTypeOf<Result>().toEqualTypeOf<"Red Apple" | "Green Apple">()
    })

    it("should handle pluralized keys across unions", () => {
      type TypeA = {
        "apple#one": "Red Apple"
        "apple#two": "Green Apple"
        manufacturer: string
      }

      type TypeB = {
        "apple#one": "Yellow Apple"
        "apple#four": "Golden Apple"
      }

      type Result = GetObjectKeyValue<TypeA | TypeB, "apple">

      expectTypeOf<Result>().toEqualTypeOf<"Red Apple" | "Green Apple" | "Yellow Apple" | "Golden Apple">()
    })

    it("should handle partial matches for pluralized keys in unions", () => {
      type TypeA = {
        "apple#one": "Red Apple"
        "apple#two": "Green Apple"
      }

      type TypeB = {
        "apple#three": "Yellow Apple"
      }

      type TypeC = {
        "banana#one": "Small Banana"
      }

      type Result = GetObjectKeyValue<TypeA | TypeB | TypeC, "apple">

      expectTypeOf<Result>().toEqualTypeOf<"Red Apple" | "Green Apple" | "Yellow Apple">()
    })

    it("should return never if no pluralized key matches", () => {
      type TestType = {
        "banana#one": "Small Banana"
        "banana#two": "Large Banana"
      }

      // @ts-expect-error
      type Result = GetObjectKeyValue<TestType, "apple">

      expectTypeOf<Result>().toEqualTypeOf<never>()
    })
  })

  describe("ExtractPluralKeys", () => {
    it("should return the keys that match the pattern 'Prefix#string'", () => {
      type TestType = {
        "user#name": string
        "user#age": number
        "profile#picture": string
        id: number
      }

      type Result = ExtractPluralKeys<TestType, "user">

      expectTypeOf<Result>().toEqualTypeOf<"user#name" | "user#age">()
    })

    it("should return 'never' if no keys match the pattern 'Prefix#string'", () => {
      type TestType = {
        "profile#name": string
        "profile#age": number
        id: number
      }

      type Result = ExtractPluralKeys<TestType, "user">

      expectTypeOf<Result>().toEqualTypeOf<never>()
    })

    it("should return 'never' if no keys contain the '#' character", () => {
      type TestType = {
        username: string
        age: number
        id: number
      }

      type Result = ExtractPluralKeys<TestType, "user">

      expectTypeOf<Result>().toEqualTypeOf<never>()
    })
  })

  describe("ExtractPlaceholders", () => {
    it("should extract a single placeholder from a string with one placeholder", () => {
      type TestType = ExtractPlaceholders<"Hello, {name}">

      expectTypeOf<TestType>().toEqualTypeOf<"name">()
    })

    it("should extract multiple placeholders from a string with several placeholders", () => {
      type TestType = ExtractPlaceholders<"Hello, {name}. You have {count} new messages.">

      expectTypeOf<TestType>().toEqualTypeOf<"name" | "count">()
    })

    it("should handle strings with no placeholders and return 'never'", () => {
      type TestType = ExtractPlaceholders<"Hello, world">

      expectTypeOf<TestType>().toEqualTypeOf<never>()
    })

    it("should handle strings with adjacent placeholders", () => {
      type TestType = ExtractPlaceholders<"Your {first}{last} is here.">

      expectTypeOf<TestType>().toEqualTypeOf<"first" | "last">()
    })

    it("should extract placeholders from a string with complex structure", () => {
      type TestType = ExtractPlaceholders<"Order #{orderId} placed by {userName} on {date}">

      expectTypeOf<TestType>().toEqualTypeOf<"orderId" | "userName" | "date">()
    })
  })

  describe("GetParams", () => {
    it("should extract parameters", () => {
      type TestType = {
        welcomeMessage: "Welcome {firstname} {lastname}"
      }

      type Keys = FlattenObjectKeys<TestType>
      type Params = GetParams<Keys, "welcomeMessage", GetObjectKeyValue<TestType, "welcomeMessage">>
      type Expected = [{ firstname: string; lastname: string }]

      expectTypeOf<Params>().toEqualTypeOf<Expected>()
    })

    it("should extract parameters and add count", () => {
      type TestType = {
        "apple#zero": "You have no apples."
        "apple#one": "You have one apple from {origin} in {country}."
        "apple#other": "You have {count} apples."
      }

      type Keys = FlattenObjectKeys<TestType>
      type Params = GetParams<Keys, "apple", GetObjectKeyValue<TestType, "apple">>
      type Count = { count: number; ordinal?: true }
      type Expected = [Count & { origin: string; country: string }]

      expectTypeOf<Params>().toEqualTypeOf<Expected>()
    })

    it("should return an empty array when neither placeholders nor count are present", () => {
      type TestType = {
        metadata: "Metadata enEN"
        welcomeMessage: "Welcome {name}"
      }

      type Keys = FlattenObjectKeys<TestType>
      // @ts-expect-error
      type Params = GetParams<Keys, "metadata", GetObjectKeyValue<TestType, "apple">>
      type Expected = []

      expectTypeOf<Params>().toEqualTypeOf<Expected>()
    })
  })
})

describe("utility helper types", () => {
  describe("AddCount", () => {
    it("should return 'Count' for an empty array", () => {
      type TestType = AddCount<[]>

      expectTypeOf<TestType>().toEqualTypeOf<Count>()
    })

    it("should return an array with 'Count' intersected with the object type for a single-element array", () => {
      type TestType = AddCount<[{ id: number }]>

      expectTypeOf<TestType>().toEqualTypeOf<[Count & { id: number }]>()
    })

    it("should return an array with 'Count' intersected with an empty object for a single-element array containing an empty object", () => {
      type TestType = AddCount<[{}]>

      expectTypeOf<TestType>().toEqualTypeOf<[Count]>()
    })

    it("should return 'never' for types other than arrays", () => {
      type TestType = AddCount<{ id: number }>

      expectTypeOf<TestType>().toEqualTypeOf<never>()
    })

    it("should handle a tuple with one object type", () => {
      type TestType = AddCount<[{ name: string }]>

      expectTypeOf<TestType>().toEqualTypeOf<[Count & { name: string }]>()
    })

    it("should return 'never' for an array with more than one object", () => {
      type TestType = AddCount<[{ id: number }, { name: string }]>

      expectTypeOf<TestType>().toEqualTypeOf<never>()
    })

    it("should return 'never' for an array with a mix of empty and non-empty objects", () => {
      type TestType = AddCount<[{}, { id: number }]>

      expectTypeOf<TestType>().toEqualTypeOf<never>()
    })
  })
})
