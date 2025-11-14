import { describe, it, expect } from "vitest";
import { formatDate } from "./utils";

describe("formatDate", () => {
  it("should format date in en-US format", () => {
    const date = new Date("2025-11-14");
    const result = formatDate(date);
    expect(result).toBe("Nov 14, 2025");
  });

  it("should handle different months", () => {
    const date = new Date("2025-01-01");
    const result = formatDate(date);
    expect(result).toBe("Jan 1, 2025");
  });

  it("should handle end of year date", () => {
    const date = new Date("2025-12-31");
    const result = formatDate(date);
    expect(result).toBe("Dec 31, 2025");
  });
});
