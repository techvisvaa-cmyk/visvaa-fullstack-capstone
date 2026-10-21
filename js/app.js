import { products } from "./data/products.js";
import { productCard, formatPrice } from "./components/productCard.js";

const app = document.querySelector("#app");
const cartCount = document.querySelector("#cart-count");
const toastRegion = document.querySelector("#toast-region");
const searchToggle = document.querySelector("#search-toggle");
const menuToggle = document.querySelector("#menu-toggle");
const mobileNav = document.querySelector("#mobile-nav");
const CART_KEY = "nova.capstone.cart.v1";
let cart = loadCart();

function loadCart() {
  try {
    const value = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
    return Array.isArray(value) ? value.filter(item => products.some(p => p.id === item.id) && Number.isInteger(item.quantity) && item.quantity > 0) : [];
  } catch { return []; }
}
function saveCart() {
  try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch { showToast("Cart could not be saved in this browser."); }
  updateCartCount();
}
function updateCartCount() { cartCount.textContent = String(cart.reduce((sum, item) => sum + item.quantity, 0)); }
function showToast(message) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  toastRegion.append(toast);
  window.setTimeout(() => toast.remove(), 2800);
}
function addToCart(id) {
  const product = products.find(item => item.id === id);
  if (!product) return;
  const existing = cart.find(item => item.id === id);
  if (existing) existing.quantity += 1; else cart.push({ id, quantity: 1 });
  saveCart();
  showToast(`${product.name} added to your bag.`);
}
function setActiveNav() {
  const route = location.hash.replace(/^#\/?/, "").split("?")[0] || "home";
  document.querySelectorAll("[data-nav]").forEach(link => {
    if (link.dataset.nav === route) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });
}
function renderHome() {
  app.innerHTML = `
    <section class="hero">
      <div class="hero-copy">
        <p class="eyebrow">Thoughtful goods for everyday life</p>
        <h1>Less, but <em>better.</em></h1>
        <p class="hero-description">A considered collection of useful objects, made to bring a little more ease and beauty to your daily routine.</p>
        <a class="button" href="#/shop">Explore the collection <span aria-hidden="true">↗</span></a>
      </div>
      <div class="hero-art" role="img" aria-label="Minimalist NOVA product illustration"><div class="hero-product"></div><div class="art-tag">GOOD<br>THINGS<br>DAILY</div></div>
    </section>
    <section class="section">
      <div class="section-heading"><div><p class="eyebrow">Find your kind of useful</p><h2>Shop by mood</h2></div><a class="text-link" href="#/shop">View all products ↗</a></div>
      <div class="category-row">
        <a class="category-card" href="#/shop?category=Home"><span>01 / Home</span><strong>Make room for calm</strong><span class="category-arrow">↗</span></a>
        <a class="category-card" href="#/shop?category=Accessories"><span>02 / Accessories</span><strong>Everyday, upgraded</strong><span class="category-arrow">↗</span></a>
        <a class="category-card" href="#/shop?category=Stationery"><span>03 / Stationery</span><strong>Ideas start here</strong><span class="category-arrow">↗</span></a>
      </div>
      <div class="section-heading"><div><p class="eyebrow">A few good things</p><h2>Customer favourites</h2><p>Simple pieces, chosen with care.</p></div><a class="text-link" href="#/shop">Shop all ↗</a></div>
      <div class="product-grid" id="featured-products"></div>
    </section>
    <section class="promo-band"><div><p class="eyebrow" style="color:var(--accent)">A little less clutter</p><h2>Keep the things that make every day better.</h2><p>Explore practical pieces with thoughtful details.</p></div><a class="button button-accent" href="#/shop">Find your favourite ↗</a></section>`;
  const grid = app.querySelector("#featured-products");
  products.slice(0, 4).forEach(product => grid.append(productCard(product, { compact: true })));
}
function renderShop() {
  const params = new URLSearchParams(location.hash.split("?")[1] || "");
  const category = params.get("category") || "All";
  app.innerHTML = `
    <section class="page-wrap">
      <div class="page-heading"><p class="eyebrow">The NOVA collection</p><h1>Good things,<br>well chosen.</h1><p>Explore useful, well-considered pieces for your home, work, and everyday adventures.</p></div>
      <div class="shop-toolbar">
        <input class="search-input" id="product-search" type="search" placeholder="Search the collection…" aria-label="Search products">
        <div class="shop-controls"><label class="shop-count" for="category-filter">Category</label><select class="select-input" id="category-filter" aria-label="Filter by category">
          ${["All","Home","Accessories","Stationery","Tech"].map(value => `<option ${value === category ? "selected" : ""}>${value}</option>`).join("")}
        </select><select class="select-input" id="sort-filter" aria-label="Sort products"><option value="featured">Featured</option><option value="low">Price: low to high</option><option value="high">Price: high to low</option><option value="name">Name: A–Z</option></select></div>
      </div>
      <p class="shop-count" id="result-count" aria-live="polite"></p>
      <div class="product-grid" id="shop-products"></div>
      <div class="empty-results" id="no-results" hidden><strong>No products found</strong>Try another search or category.</div>
    </section>`;
  const search = app.querySelector("#product-search");
  const categoryFilter = app.querySelector("#category-filter");
  const sort = app.querySelector("#sort-filter");
  const grid = app.querySelector("#shop-products");
  const noResults = app.querySelector("#no-results");
  function update() {
    let result = products.filter(p => (categoryFilter.value === "All" || p.category === categoryFilter.value) && `${p.name} ${p.category} ${p.description}`.toLowerCase().includes(search.value.toLowerCase().trim()));
    if (sort.value === "low") result.sort((a,b) => a.price - b.price);
    if (sort.value === "high") result.sort((a,b) => b.price - a.price);
    if (sort.value === "name") result.sort((a,b) => a.name.localeCompare(b.name));
    grid.replaceChildren(...result.map(p => productCard(p)));
    noResults.hidden = result.length !== 0;
    grid.hidden = result.length === 0;
    app.querySelector("#result-count").textContent = `${result.length} product${result.length === 1 ? "" : "s"} found`;
  }
  search.addEventListener("input", update);
  categoryFilter.addEventListener("change", update);
  sort.addEventListener("change", update);
  update();
}
function renderAbout() {
  app.innerHTML = `
    <section class="page-wrap">
      <div class="about-layout">
        <div class="about-copy"><p class="eyebrow">A little about NOVA</p><h1 class="content-heading" style="font-size:clamp(2.8rem,5vw,5rem)">Useful things.<br>Better days.</h1>
          <p>NOVA began with a simple idea: the objects we use every day should be useful, thoughtfully made, and a pleasure to live with.</p>
          <p>We believe good design doesn't need to shout. It shows up in the comfortable shape of a favourite mug, the details of a well-made bag, and the small routines that make a day feel a little lighter.</p>
          <a class="button" href="#/shop">Explore the collection ↗</a>
        </div>
        <div class="about-art" role="img" aria-label="Minimalist product illustration"><div class="hero-product"></div></div>
      </div>
      <div class="values">
        <article class="value-card"><span aria-hidden="true">✳</span><h3>Considered design</h3><p>Simple forms and useful details that earn their place in your day.</p></article>
        <article class="value-card"><span aria-hidden="true">↻</span><h3>Made to be used</h3><p>Products chosen for everyday routines, not just for display.</p></article>
        <article class="value-card"><span aria-hidden="true">♡</span><h3>Less, but better</h3><p>A focused collection that makes choosing feel easy.</p></article>
      </div>
    </section>`;
}
function renderCart() {
  const items = cart.map(entry => ({ ...entry, product: products.find(p => p.id === entry.id) })).filter(entry => entry.product);
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  app.innerHTML = `
    <section class="page-wrap">
      <div class="page-heading"><p class="eyebrow">Your selections</p><h1>Your bag.</h1><p>A few good things, ready when you are.</p></div>
      ${items.length ? `<div class="cart-layout"><div class="cart-items" id="cart-items"></div><aside class="cart-summary"><h2>Order summary</h2><div class="summary-line"><span>Subtotal</span><strong>${formatPrice(subtotal)}</strong></div><div class="summary-line"><span>Shipping</span><span>${subtotal >= 2000 ? "Free" : formatPrice(99)}</span></div><div class="summary-line summary-total"><span>Total</span><strong>${formatPrice(subtotal + (subtotal >= 2000 ? 0 : 99))}</strong></div><button class="button button-accent" id="checkout-button" type="button">Continue to checkout ↗</button><p class="note">Demo checkout only — no payment will be collected.</p><a class="text-link" href="#/shop" style="display:inline-block;margin-top:22px">Continue shopping</a></aside></div>` : `<div class="empty-cart"><h2>Your bag is taking a little break.</h2><p>Add something useful and it will show up here.</p><a class="button" href="#/shop" style="margin-top:15px">Explore the collection ↗</a></div>`}
    </section>`;
  const cartItems = app.querySelector("#cart-items");
  if (cartItems) items.forEach(({product, quantity}) => {
    const row = document.createElement("article");
    row.className = "cart-row";
    row.innerHTML = `<div class="cart-thumb" style="background:linear-gradient(145deg,${product.tone1},${product.tone2})" aria-hidden="true">${product.emoji}</div><div><h3>${product.name}</h3><p>${product.category} · ${formatPrice(product.price)}</p><div class="quantity-control"><button type="button" data-cart-action="minus" data-id="${product.id}" aria-label="Decrease quantity">−</button><span>${quantity}</span><button type="button" data-cart-action="plus" data-id="${product.id}" aria-label="Increase quantity">+</button></div><button type="button" class="remove-button" data-cart-action="remove" data-id="${product.id}">Remove</button></div><strong>${formatPrice(product.price * quantity)}</strong>`;
    cartItems.append(row);
  });
  app.querySelector("#checkout-button")?.addEventListener("click", () => showToast("This is a demo storefront; checkout is not connected to payments."));
}
function renderNotFound() {
  app.innerHTML = `<section class="not-found"><p class="eyebrow">404 / Page not found</p><h1>Looks like a wrong turn.</h1><p>The page you're looking for isn't here.</p><a class="button" href="#/">Back to home ↗</a></section>`;
}
function renderRoute() {
  const route = (location.hash.replace(/^#\/?/, "").split("?")[0] || "home").toLowerCase();
  if (route === "home") renderHome();
  else if (route === "shop") renderShop();
  else if (route === "about") renderAbout();
  else if (route === "cart") renderCart();
  else renderNotFound();
  setActiveNav();
  updateCartCount();
  mobileNav.hidden = true;
  menuToggle.setAttribute("aria-expanded", "false");
  window.scrollTo({ top: 0, behavior: "smooth" });
}
app.addEventListener("click", event => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;
  const { action, id } = button.dataset;
  if (action === "add") addToCart(id);
  if (action === "details") {
    const product = products.find(p => p.id === id);
    if (product) showToast(`${product.name} — ${product.description}`);
  }
});
app.addEventListener("click", event => {
  const button = event.target.closest("button[data-cart-action]");
  if (!button) return;
  const item = cart.find(entry => entry.id === button.dataset.id);
  if (!item) return;
  if (button.dataset.cartAction === "plus") item.quantity += 1;
  if (button.dataset.cartAction === "minus") item.quantity -= 1;
  if (button.dataset.cartAction === "remove" || item.quantity <= 0) cart = cart.filter(entry => entry.id !== button.dataset.id);
  saveCart();
  renderCart();
});
window.addEventListener("hashchange", renderRoute);
searchToggle.addEventListener("click", () => {
  if (!location.hash.startsWith("#/shop")) location.hash = "/shop";
  window.setTimeout(() => document.querySelector("#product-search")?.focus(), 80);
});
menuToggle.addEventListener("click", () => {
  const open = mobileNav.hidden;
  mobileNav.hidden = !open;
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
});
mobileNav.addEventListener("click", event => {
  if (event.target.closest("a")) mobileNav.hidden = true;
});
document.querySelector("#year").textContent = new Date().getFullYear();
updateCartCount();
renderRoute();
