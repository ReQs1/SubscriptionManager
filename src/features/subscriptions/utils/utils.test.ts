import { describe, it, expect } from "vitest";
import { formatPrice } from "./utils";

describe("formatPrice", () => {
  it("should format USD with dollar sign prefix", () => {
    const result = formatPrice(123, "USD");
    expect(result).toBe("$123");
  });

  it("should format EUR with euro sign suffix", () => {
    const result = formatPrice(456, "EUR");
    expect(result).toBe("456€");
  });

  it("should format PLN with currency code suffix", () => {
    const result = formatPrice(789, "PLN");
    expect(result).toBe("789 PLN");
  });

  it("should handle lowercase currency codes", () => {
    expect(formatPrice(100, "usd")).toBe("$100");
    expect(formatPrice(200, "eur")).toBe("200€");
    expect(formatPrice(300, "pln")).toBe("300 PLN");
  });

  it("should format unknown currency with code suffix", () => {
    const result = formatPrice(999, "GBP");
    expect(result).toBe("999 GBP");
  });

  it("should handle decimal prices", () => {
    expect(formatPrice(12.99, "USD")).toBe("$12.99");
    expect(formatPrice(19.99, "EUR")).toBe("19.99€");
  });
});
