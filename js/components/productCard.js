export function productCard(product, options = {}) {
  const { compact = false } = options;
  const card = document.createElement("article");
  card.className = "product-card";
  card.innerHTML = `
    <div class="product-image">
      <div class="product-placeholder" role="img" aria-label="${product.name}" style="--tone1:${product.tone1};--tone2:${product.tone2}">
        <span aria-hidden="true">${product.emoji}</span>
      </div>
      ${product.label ? `<span class="product-badge">${product.label}</span>` : ""}
    </div>
    <div class="product-info">
      <div class="product-meta">
        <div><h3>${product.name}</h3><p>${product.category}</p></div>
        <span class="price">${formatPrice(product.price)}</span>
      </div>
      ${compact ? "" : `<p class="product-description" style="margin-top:8px;line-height:1.5">${product.description}</p>`}
      <div class="product-actions">
        <button class="small-button" type="button" data-action="add" data-id="${product.id}">Add to bag +</button>
        <button class="small-button" type="button" data-action="details" data-id="${product.id}">Details ↗</button>
      </div>
    </div>`;
  return card;
}

export function formatPrice(value) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value);
}
