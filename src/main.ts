import './style.css'
import {
  stock,
  cart,
  addProduct,
  addToCart,
  removeFromCart,
  calculateTotal,
  clearCart,
  applyShippingDiscount
} from './ecommerce'

// ### Add products ###
function renderProducts() {
  let content = '';
  Object.values(stock).forEach(p => {
    content += `
      <li value="${p.id}">
        <p>Product ID: ${p.id}</p>
        <p>Price: $${p.price}</p>
        <p>Quantity: ${p.stock}</p>
        <button class="add-to-cart">➕</button>
      </li>
    `
  });
  const target = document.querySelector('#products')!;
  target.innerHTML = content;

  // ### Add to cart ###
  document.querySelectorAll('.add-to-cart').forEach(e => {
    e.addEventListener('click', addItemToCart);
  });
}
function addProductAndRender() {
  const id = (document.querySelector('#product-id') as HTMLInputElement).value;
  const price = parseFloat((document.querySelector('#price') as HTMLInputElement).value);
  const qty = parseInt((document.querySelector('#qty') as HTMLInputElement).value);
  addProduct(id, price, qty);
  renderProducts();
}
function renderCart() {
  let content = '';
  Object.entries(cart).forEach(e => {
    const id = e[0];
    const qty = e[1];
    const price = stock[id].price * qty;
    content += `
      <li value="${id}">
        <p>Product ID: ${id}</p>
        <p>Qty: ${qty}</p>
        <p>Cost: $${price.toFixed(2)}</p>
        <button class="remove-from-cart">➖</button>
      </li>
    `
  });
  const target = document.querySelector('#cart')!;
  target.innerHTML = content;
  
  // ### Remove from cart ###
  document.querySelectorAll('.remove-from-cart').forEach(e => {
    e.addEventListener('click', removeItemFromCart);
  });
}
function addItemToCart(event: Event) {
  const btn = event.target as Element;
  const id = btn.parentElement?.getAttribute('value')!;
  addToCart(id, 1);
  renderCart();
}
function removeItemFromCart(event: Event) {
  const btn = event.target as Element;
  const id = btn.parentElement?.getAttribute('value')!;
  removeFromCart(id, 1);
  renderCart();
}

// ### Clear cart ###
function removeAllFromCart() {
  clearCart();
  renderCart();
}

// ### Checkout ###
function checkoutCart() {
  const total = calculateTotal();
  const code = (document.querySelector('#code') as HTMLInputElement).value;
  const grandTotal = applyShippingDiscount(code, total);
  let message = `Total cost: $${grandTotal}`;
  if (grandTotal !== total) {
    message = `Total cost: $${grandTotal} with discount applied! 🎉`;
  }
  alert(message);
}

document.querySelector('#add-product')?.addEventListener('click', addProductAndRender);
document.querySelector('#clear-cart')?.addEventListener('click', removeAllFromCart);
document.querySelector('#checkout')?.addEventListener('click', checkoutCart);
