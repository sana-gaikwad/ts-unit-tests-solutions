type Product = {
  id: string;
  price: number;
  stock: number;
};

type Cart = Record<string, number>;

const stock: Record<string, Product> = {};
let cart: Cart = {};

/**
 * Adds a product to the store's inventory.
 * @param productId - The ID of the product.
 * @param price - The price of the product.
 * @param stockLevel - The number of items available in stock.
 */
export function addProduct(productId: string, price: number, stockLevel: number): void {
  stock[productId] = { id: productId, price, stock: stockLevel };
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
    throw new Error('Insufficient stock');
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
    throw new Error('Cannot remove more than in cart');
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
    return total + (product.price * quantity);
  }, 0);
}

/**
 * Applies a free shipping discount if the total cost exceeds a specified amount.
 * @param code - The discount code to apply.
 */
export function applyFreeShipping(code: string): void {
  const total = calculateTotal();
  if (code !== 'FREESHIP' || total < 500) {
    throw new Error('Free shipping not applicable');
  }
  // Example: Deduct $10 for shipping, but this could be implemented differently.
  // Assuming we deduct $10 as a shipping fee that is now waived.
  console.log('Free shipping applied!'); // Placeholder action for free shipping.
}
