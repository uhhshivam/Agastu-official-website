// AGASTU product catalogue
// Image filenames must match the files in your repository exactly.

const products = [
  {
    id: 1,
    name: "Alex Pereira Collector Set",
    price: 25,
    image: "alex-pereira.png",
    category: "fighters",
    description: "A collectible set inspired by Alex Pereira."
  },
  {
    id: 2,
    name: "Charles Oliveira Collector Set",
    price: 25,
    image: "charles-oliveira.png",
    category: "fighters",
    description: "A themed collectible set inspired by Charles Oliveira."
  },
  {
    id: 3,
    name: "Justin Gaethje Collector Set",
    price: 25,
    image: "justin-gaethje.png",
    category: "fighters",
    description: "A themed collectible set inspired by Justin Gaethje."
  },
  {
    id: 4,
    name: "Khabib Collector Set",
    price: 25,
    image: "khabib.png",
    category: "fighters",
    description: "A themed collectible set inspired by Khabib."
  },
  {
    id: 5,
    name: "Islam Makhachev Collector Set",
    price: 25,
    image: "islam.png",
    category: "fighters",
    description: "A themed collectible set inspired by Islam Makhachev."
  },
  {
    id: 6,
    name: "Ilia Topuria Collector Set",
    price: 25,
    image: "ilia-topuria.png",
    category: "fighters",
    description: "A themed collectible set inspired by Ilia Topuria."
  },
  {
    id: 7,
    name: "Conor McGregor Collector Set",
    price: 25,
    image: "conor-mcgregor.png",
    category: "fighters",
    description: "A themed collectible set inspired by Conor McGregor."
  },
  {
    id: 8,
    name: "Max Holloway Collector Set",
    price: 25,
    image: "max-holloway.png",
    category: "fighters",
    description: "A themed collectible set inspired by Max Holloway."
  },
  {
    id: 9,
    name: "Complete Collector Set",
    price: 50,
    image: "complete-set.png",
    category: "sets",
    description: "A collection featuring multiple fighter-themed sets."
  }
];

// These example prices are in USD. Change them to your real prices
// and currency before accepting orders.
const CURRENCY = "USD";
const money = amount => new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: CURRENCY,
  maximumFractionDigits: 2
}).format(amount);

const grid = document.getElementById("product-grid");
const searchInput = document.getElementById("search-input");
const categoryFilter = document.getElementById("category-filter");
const sortFilter = document.getElementById("sort-filter");
const productCount = document.getElementById("product-count");
const emptyMessage = document.getElementById("empty-message");

const cartPanel = document.getElementById("cart-panel");
const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const cartCount = document.getElementById("cart-count");
const overlay = document.getElementById("overlay");

const productDialog = document.getElementById("product-dialog");
const productDetails = document.getElementById("product-details");

let cart = [];

function renderProducts() {
  const query = searchInput.value.trim().toLowerCase();
  const category = categoryFilter.value;
  const sort = sortFilter.value;

  let filtered = products.filter(product => {
    const matchesSearch =
      product.name.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query);

    const matchesCategory =
      category === "all" || product.category === category;

    return matchesSearch && matchesCategory;
  });

  if (sort === "low") filtered.sort((a, b) => a.price - b.price);
  if (sort === "high") filtered.sort((a, b) => b.price - a.price);
  if (sort === "name") filtered.sort((a, b) => a.name.localeCompare(b.name));

  grid.innerHTML = filtered.map(product => `
    <article class="product-card">
      <div class="product-image-wrap">
        <span class="product-tag">
          ${product.category === "sets" ? "COMPLETE SET" : "COLLECTOR SERIES"}
        </span>
        <img
          class="product-image"
          src="${product.image}"
          alt="${product.name}"
          loading="lazy"
          onerror="this.onerror=null;this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22400%22 viewBox=%220 0 400 400%22%3E%3Crect width=%22400%22 height=%22400%22 fill=%22%23191919%22/%3E%3Ctext x=%22200%22 y=%22190%22 text-anchor=%22middle%22 fill=%22%23d8ad57%22 font-size=%2224%22%3EAGASTU%3C/text%3E%3Ctext x=%22200%22 y=%22225%22 text-anchor=%22middle%22 fill=%22%23aaaaaa%22 font-size=%2214%22%3EImage unavailable%3C/text%3E%3C/svg%3E'">
      </div>
      <div class="product-info">
        <h3>${product.name}</h3>
        <p class="product-description">${product.description}</p>
        <div class="product-bottom">
          <span class="product-price">${money(product.price)}</span>
        </div>
        <div class="product-actions">
          <button class="small-button"
            data-action="details" data-id="${product.id}">
            View Details
          </button>
          <button class="small-button primary"
            data-action="add" data-id="${product.id}">
            Add to Cart +
          </button>
        </div>
      </div>
    </article>
  `).join("");

  productCount.textContent =
    `${filtered.length} product${filtered.length === 1 ? "" : "s"} found`;

  emptyMessage.hidden = filtered.length !== 0;
}

function addToCart(id) {
  const product = products.find(item => item.id === id);
  if (!product) return;

  const existing = cart.find(item => item.id === id);

  if (existing) existing.quantity += 1;
  else cart.push({ ...product, quantity: 1 });

  renderCart();
}

function changeQuantity(id, amount) {
  const item = cart.find(product => product.id === id);
  if (!item) return;

  item.quantity += amount;
  if (item.quantity <= 0) {
    cart = cart.filter(product => product.id !== id);
  }

  renderCart();
}

function renderCart() {
  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  cartCount.textContent = totalQuantity;
  cartTotal.textContent = money(total);

  if (cart.length === 0) {
    cartItems.innerHTML = '<p class="muted">Your cart is empty. Explore the collection!</p>';
    return;
  }

  cartItems.innerHTML = cart.map(item => `
    <div class="cart-item">
      <img src="${item.image}" alt="">
      <div>
        <h3>${item.name}</h3>
        <p>${money(item.price * item.quantity)}</p>
        <div class="quantity-controls">
          <button data-action="minus" data-id="${item.id}" aria-label="Decrease quantity">−</button>
          <span>${item.quantity}</span>
          <button data-action="plus" data-id="${item.id}" aria-label="Increase quantity">+</button>
        </div>
      </div>
      <button class="remove-item" data-action="remove" data-id="${item.id}">Remove</button>
    </div>
  `).join("");
}

function openCart() {
  cartPanel.hidden = false;
  overlay.hidden = false;
}

function closeCart() {
  cartPanel.hidden = true;
  overlay.hidden = true;
}

function showDetails(id) {
  const product = products.find(item => item.id === id);
  if (!product) return;

  productDetails.innerHTML = `
    <div class="detail-layout">
      <img class="detail-image" src="${product.image}" alt="${product.name}">
      <div>
        <p class="eyebrow">AGASTU COLLECTOR SERIES</p>
        <h2>${product.name}</h2>
        <p class="detail-price">${money(product.price)}</p>
        <p class="muted">${product.description}</p>
        <p class="muted small">
          Product availability, final price and delivery details must be confirmed.
        </p>
        <button class="button button-gold" data-action="add" data-id="${product.id}">
          Add to Cart
        </button>
      </div>
    </div>
  `;

  productDialog.showModal();
}

grid.addEventListener("click", event => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;

  const id = Number(button.dataset.id);

  if (button.dataset.action === "add") addToCart(id);
  if (button.dataset.action === "details") showDetails(id);
});

cartItems.addEventListener("click", event => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;

  const id = Number(button.dataset.id);

  if (button.dataset.action === "minus") changeQuantity(id, -1);
  if (button.dataset.action === "plus") changeQuantity(id, 1);
  if (button.dataset.action === "remove") {
    cart = cart.filter(item => item.id !== id);
    renderCart();
  }
});

productDetails.addEventListener("click", event => {
  const button = event.target.closest("button[data-action='add']");
  if (!button) return;

  addToCart(Number(button.dataset.id));
  productDialog.close();
  openCart();
});

searchInput.addEventListener("input", renderProducts);
categoryFilter.addEventListener("change", renderProducts);
sortFilter.addEventListener("change", renderProducts);

document.getElementById("cart-toggle").addEventListener("click", openCart);
document.getElementById("cart-close").addEventListener("click", closeCart);
overlay.addEventListener("click", closeCart);

document.getElementById("dialog-close").addEventListener("click", () => {
  productDialog.close();
});

document.getElementById("clear-cart").addEventListener("click", () => {
  cart = [];
  renderCart();
});

document.getElementById("checkout-button").addEventListener("click", () => {
  if (cart.length === 0) {
    alert("Your cart is empty. Add a product first.");
    return;
  }

  const lines = cart.map(item =>
    `${item.name} x ${item.quantity} = ${money(item.price * item.quantity)}`
  );

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const message = [
    "Hello AGASTU, I would like to enquire about this order:",
    "",
    ...lines,
    "",
    `Subtotal: ${money(total)}`,
    "",
    "Please confirm availability, final price, shipping and payment options."
  ].join("\n");

  const email = "shivamparmar28shivam@gmail.com";
  const url = `mailto:${email}?subject=${encodeURIComponent("AGASTU Order Enquiry")}&body=${encodeURIComponent(message)}`;

  window.location.href = url;
});

document.getElementById("year").textContent = new Date().getFullYear();

renderProducts();
renderCart();
    
