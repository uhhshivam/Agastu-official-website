
const products = [
  {
    id: 1,
    name: "Alex Pereira Collector Set",
    price: 25,
    image: "images/alex-pereira.png",
    category: "fighters"
  },
  {
    id: 2,
    name: "Charles Oliveira Collector Set",
    price: 25,
    image: "images/charles-oliveira.png",
    category: "fighters"
  },
  {
    id: 3,
    name: "Justin Gaethje Collector Set",
    price: 25,
    image: "images/justin-gaethje.png",
    category: "fighters"
  },
  {
    id: 4,
    name: "Khabib Nurmagomedov Collector Set",
    price: 25,
    image: "images/khabib.png",
    category: "fighters"
  },
  {
    id: 5,
    name: "Islam Makhachev Collector Set",
    price: 25,
    image: "images/islam.png",
    category: "fighters"
  },
  {
    id: 6,
    name: "Ilia Topuria Collector Set",
    price: 25,
    image: "images/ilia-topuria.png",
    category: "fighters"
  },
  {
    id: 7,
    name: "Conor McGregor Collector Set",
    price: 25,
    image: "images/conor-mcgregor.png",
    category: "fighters"
  },
  {
    id: 8,
    name: "Max Holloway Collector Set",
    price: 25,
    image: "images/max-holloway.png",
    category: "fighters"
  },
  {
    id: 9,
    name: "Complete 8-Fighter Collection",
    price: 50,
    image: "images/complete-set.png",
    category: "collection"
  }
];

let cart = [];

const grid = document.getElementById("product-grid");
const cartPanel = document.getElementById("cart-panel");
const cartItems = document.getElementById("cart-items");

function displayProducts(filter = "all") {
  if (!grid) return;

  const filtered = filter === "all"
    ? products
    : products.filter(p => p.category === filter);

  grid.innerHTML = filtered.map(product => `
    <article class="product-card">
      <img src="${product.image}" alt="${product.name}" loading="lazy">
      <div class="product-info">
        <h3>${product.name}</h3>
        <p>AGASTU Collectible Fighter Edition</p>
        <p class="product-price">$${product.price.toFixed(2)}</p>
        <button data-add="${product.id}">ADD TO BAG +</button>
      </div>
    </article>
  `).join("");
}

function addToCart(id) {
  const product = products.find(p => p.id === id);
  if (!product) return;

  const item = cart.find(p => p.id === id);

  if (item) {
    item.quantity++;
  } else {
    cart.push({...product, quantity: 1});
  }

  updateCart();
  openCart();
}

function updateCart() {
  const count = cart.reduce((sum, p) => sum + p.quantity, 0);
  const total = cart.reduce(
    (sum, p) => sum + p.price * p.quantity, 0
  );

  document.getElementById("cart-count").textContent = count;
  document.getElementById("cart-total").textContent =
    "$" + total.toFixed(2);

  cartItems.innerHTML = cart.length
    ? cart.map(item => `
        <div class="cart-item">
          <strong>${item.name}</strong>
          <p>$${item.price} × ${item.quantity}</p>
          <button data-remove="${item.id}">Remove one</button>
        </div>
      `).join("")
    : "<p>Your bag is empty.</p>";
}

function openCart() {
  cartPanel.classList.add("open");
  document.body.classList.add("cart-open");
}

function closeCart() {
  cartPanel.classList.remove("open");
  document.body.classList.remove("cart-open");
}

document.addEventListener("click", event => {
  const add = event.target.closest("[data-add]");
  const remove = event.target.closest("[data-remove]");

  if (add) {
    addToCart(Number(add.dataset.add));
  }

  if (remove) {
    const id = Number(remove.dataset.remove);
    const item = cart.find(p => p.id === id);

    if (item) {
      item.quantity--;
      if (item.quantity <= 0) {
        cart = cart.filter(p => p.id !== id);
      }
    }
    updateCart();
  }
});

document.querySelectorAll("[data-filter]").forEach(button => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    displayProducts(filter);

    document.querySelectorAll("[data-filter]").forEach(b => {
      b.classList.toggle("active", b === button);
    });
  });
});

document.getElementById("cart-toggle")
  ?.addEventListener("click", openCart);

document.getElementById("cart-close")
  ?.addEventListener("click", closeCart);

document.getElementById("cart-backdrop")
  ?.addEventListener("click", closeCart);

document.getElementById("checkout")
  ?.addEventListener("click", () => {
    if (!cart.length) {
      alert("Your bag is empty.");
      return;
    }

    const summary = cart.map(item =>
      `${item.name} x ${item.quantity}`
    ).join("\n");

    const total = cart.reduce(
      (sum, p) => sum + p.price * p.quantity, 0
    );

    const message =
      `Hello AGASTU, I would like to enquire about:\n${summary}\nEstimated subtotal: $${total.toFixed(2)}`;

    navigator.clipboard?.writeText(message)
      .then(() => alert("Order enquiry copied. Please send it to AGASTU."))
      .catch(() => alert(message));
  });

document.getElementById("year").textContent =
  new Date().getFullYear();

displayProducts();
updateCart();
