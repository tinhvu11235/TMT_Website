import { describe, expect, it } from "vitest";
import { slugify } from "@/lib/utils/slug";

describe("slugify", () => {
  it("normalizes Vietnamese titles", () => {
    expect(slugify("Công trình Giao thông Sóc Trăng")).toBe("cong-trinh-giao-thong-soc-trang");
  });
});
