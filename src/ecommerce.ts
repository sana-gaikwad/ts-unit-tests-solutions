type Product = {
  id: string;
  price: number;
  stock: number;
};

const stock: Record<string, Product> = {};
let cart: Record<string, number> = {};

/**
 * Adds a product to the store's inventory.
 * @param productId - The ID of the product.
 * @param price - The price of the product.
 * @param stockCount- The number of items available in stock.
 */
export function addProduct(
  productId: string,
  price: number,
  stockCount: number
): void {
  stock[productId] = { id: productId, price, stock: stockCount };
}

/**
 * Updates the quantity of a product in the cart.
 * @param productId - The ID of the product.
 * @param quantity - The quantity to add (positive) or remove (negative) from the cart.
 */
function updateCart(productId: string, quantity: number): void {
  cart[productId] = (cart[productId] || 0) + quantity;
  if (cart[productId] <= 0) {
    delete cart[productId];
  }
}

/**
 * Adds a specified quantity of a product to the cart.
 * @param productId - The ID of the product.
 * @param quantity - The quantity of the product to add.
 */
export function addToCart(productId: string, quantity: number): void {
  const product = stock[productId];
  if (!product || product.stock < quantity) {
    throw new Error("Insufficient stock");
  }
  updateCart(productId, quantity);
}

/**
 * Removes a specified quantity of a product from the cart.
 * @param productId - The ID of the product.
 * @param quantity - The quantity of the product to remove.
 */
export function removeFromCart(productId: string, quantity: number): void {
  if (!cart[productId] || cart[productId] < quantity) {
    throw new Error("Cannot remove item from cart");
  }
  updateCart(productId, -quantity);
}

/**
 * Calculates the total cost of all items in the cart.
 * @returns The total cost of the items in the cart.
 */
export function calculateTotal(): number {
  return Object.entries(cart).reduce((total, [productId, quantity]) => {
    const product = stock[productId];
    return total + product.price * quantity;
  }, 0);
}
/**
 * Clears the shopping cart by removing all items.
 *
 * @return {void} No return value.
 */
export function clearCart(): void {
  cart = {};
}

/**
 * Applies a shipping discount to the total cost if the provided code matches the predefined discount code and the total cost exceeds a certain threshold.
 *
 * @param {string} code - The discount code to apply.
 * @param {number} total - The total cost to apply the discount to.
 * @return {number} The total cost with the discount applied, or the original total cost if the discount is not applicable.
 */
export function applyShippingDiscount(code: string, total: number): number {
  const DISCOUNT_CODE = "SHIP10";
  const DISCOUNT_AMOUNT = 10;

  if (total > 500 && code === DISCOUNT_CODE) {
    return total - DISCOUNT_AMOUNT;
  }

  return total;
}
