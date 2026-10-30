import { describe, expect, it } from "vitest";
import { contactSchema } from "@/lib/validation/contact";

describe("contactSchema", () => {
  it("accepts a valid contact request", () => {
    const result = contactSchema.safeParse({
      name: "Nguyen Van A",
      phone: "0900000000",
      email: "a@example.com",
      company: "ABC",
      service: "Tu van",
      message: "Can tu van du an moi",
      privacy: true,
      website: ""
    });

    expect(result.success).toBe(true);
  });

  it("rejects short messages", () => {
    expect(
      contactSchema.safeParse({
        name: "A",
        phone: "1",
        message: "x",
        privacy: true,
        website: ""
      }).success
    ).toBe(false);
  });
});
