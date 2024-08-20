import "./style.css";
import {
  stock,
  cart,
  addProduct,
  addToCart,
  removeFromCart,
  calculateTotal,
  clearCart,
} from "./ecommerce";

// ### Add products ###
function renderProducts() {
  let content = "";
  Object.values(stock).forEach((p) => {
    content += `
      <li value="${p.id}">
        <p>ID: ${p.id}</p>
        <p>Price: $${p.price}</p>
        <p>Qty: ${p.stock}</p>
        <button class="add-to-cart">➕</button>
      </li>
    `;
  });
  const target = document.querySelector("#products")!;
  target.innerHTML = content;

  // ### Add to cart ###
  document.querySelectorAll(".add-to-cart").forEach((e) => {
    e.addEventListener("click", addItemToCart);
  });
}
function addProductAndRender() {
  const id = (document.querySelector("#product-id") as HTMLInputElement).value;
  const price = parseFloat(
    (document.querySelector("#price") as HTMLInputElement).value
  );
  const qty = parseInt(
    (document.querySelector("#qty") as HTMLInputElement).value
  );
  addProduct(id, price, qty);
  renderProducts();
}
function renderCart() {
  let content = "";
  Object.entries(cart).forEach((e) => {
    const id = e[0];
    const qty = e[1];
    const price = stock[id].price * qty;
    content += `
      <li value="${id}">
        <p>ID: ${id}</p>
        <p>Qty: ${qty}</p>
        <p>Cost: $${price.toFixed(2)}</p>
        <button class="remove-from-cart">➖</button>
      </li>
    `;
  });
  const target = document.querySelector("#cart")!;
  target.innerHTML = content;

  // ### Remove from cart ###
  document.querySelectorAll(".remove-from-cart").forEach((e) => {
    e.addEventListener("click", removeItemFromCart);
  });
}
function addItemToCart(event: Event) {
  const btn = event.target as Element;
  const id = btn.parentElement?.getAttribute("value")!;
  addToCart(id, 1);
  renderCart();
}
function removeItemFromCart(event: Event) {
  const btn = event.target as Element;
  const id = btn.parentElement?.getAttribute("value")!;
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
  let message = "";
  if (total < 490) message = `Total cost: $${total}`;
  else {
    message = `Total cost: $${total} with discount applied! 🎉`;
  }
  alert(message);
}

document
  .querySelector("#add-product")
  ?.addEventListener("click", addProductAndRender);
document
  .querySelector("#clear-cart")
  ?.addEventListener("click", removeAllFromCart);
document.querySelector("#checkout")?.addEventListener("click", checkoutCart);
