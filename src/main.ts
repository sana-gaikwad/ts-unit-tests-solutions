import { addProduct } from './ecommerce';
import './style.css'

export {
  addProduct,
  addToCart,
  removeFromCart,
  calculateTotal,
  clearCart,
  applyShippingDiscount
} from './ecommerce'

document.getElementById('product-form')!.addEventListener("submit", (event) => {
  event.preventDefault();
  console.log(event.target)
  addProduct("a", 1.0, 1)
});