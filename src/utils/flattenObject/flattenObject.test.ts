import { describe, expect, it } from "vitest"
import { flattenObject } from "./flattenObject"

describe("flattenObject", () => {
  it("flattens a simple object with no nesting", () => {
    const input = { key1: "value1", key2: "value2" }
    const result = flattenObject(input)
    expect(result).toEqual({ key1: "value1", key2: "value2" })
  })

  it("flattens a nested object", () => {
    const input = { key1: "value1", nested: { key2: "value2", key3: "value3" } }
    const result = flattenObject(input)
    expect(result).toEqual({ key1: "value1", "nested.key2": "value2", "nested.key3": "value3" })
  })

  it("flattens a deeply nested object", () => {
    const input = {
      key1: "value1",
      level1: { level2: { level3: { key2: "value2" } } },
    }
    const result = flattenObject(input)
    expect(result).toEqual({ key1: "value1", "level1.level2.level3.key2": "value2" })
  })

  it("flattens an object with a prefix", () => {
    const input = { key1: "value1", nested: { key2: "value2" } }
    const result = flattenObject(input, "prefix")
    expect(result).toEqual({ "prefix.key1": "value1", "prefix.nested.key2": "value2" })
  })

  it("flattens a deeply nested object with various data types", () => {
    const input = {
      user: {
        profile: {
          personal: {
            firstName: "Firstname",
            lastName: "Lastname",
            details: {
              age: 30,
              contact: {
                email: "person@example.com",
                phone: {
                  mobile: "+123456789",
                  home: null,
                },
              },
            },
          },
        },
        settings: {
          preferences: {
            theme: "dark",
            notifications: {
              email: true,
              sms: false,
              push: {
                enabled: true,
                sound: "chime",
              },
            },
          },
        },
      },
    }

    const result = flattenObject(input)

    expect(result).toEqual({
      "user.profile.personal.firstName": "Firstname",
      "user.profile.personal.lastName": "Lastname",
      "user.profile.personal.details.age": 30,
      "user.profile.personal.details.contact.email": "person@example.com",
      "user.profile.personal.details.contact.phone.mobile": "+123456789",
      "user.profile.personal.details.contact.phone.home": null,
      "user.settings.preferences.theme": "dark",
      "user.settings.preferences.notifications.email": true,
      "user.settings.preferences.notifications.sms": false,
      "user.settings.preferences.notifications.push.enabled": true,
      "user.settings.preferences.notifications.push.sound": "chime",
    })
  })

  it("handles an empty object", () => {
    const input = {}
    const result = flattenObject(input)
    expect(result).toEqual({})
  })
})
