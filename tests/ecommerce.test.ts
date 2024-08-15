import { describe, it, expect, beforeEach } from "vitest";
import {
  addProduct,
  addToCart,
  removeFromCart,
  calculateTotal,
  clearCart,
  applyShippingDiscount,
} from "../src/ecommerce";

describe("E-Commerce System", () => {
  beforeEach(() => {
    // Set up products before each test
    addProduct("product1", 100, 10);
    addProduct("product2", 200, 5);
    clearCart();
  });

  it("should add products to the cart and calculate the total", () => {
    addToCart("product1", 2); // $200
    addToCart("product2", 1); // $200
    expect(calculateTotal()).toBe(400);
  });

  it("should remove products from the cart and update the total", () => {
    addToCart("product1", 2); // $200
    addToCart("product2", 1); // $200
    removeFromCart("product1", 1); // -$100
    expect(calculateTotal()).toBe(300);
  });

  it("should not allow adding more products than are in stock", () => {
    expect(() => addToCart("product2", 10)).toThrow("Insufficient stock");
  });

  it("should not allow removing more products than are in the cart", () => {
    addToCart("product1", 1);
    expect(() => removeFromCart("product1", 2)).toThrow(
      "Cannot remove item from cart"
    );
  });

  it("should apply free shipping if the total cost is above $500", () => {
    addToCart("product1", 3); // $300
    addToCart("product2", 2); // $400
    expect(applyShippingDiscount("SHIP10", 700)).toBe(690);
  });

  it("should not apply free shipping for totals under $500", () => {
    addToCart("product1", 3); // $300
    expect(applyShippingDiscount("SHIP10", 300)).toBe(300);
  });
});
