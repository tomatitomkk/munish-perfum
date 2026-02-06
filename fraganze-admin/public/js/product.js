/* product.js (v2) - Base para tienda + futuro panel admin (CRUD en localStorage) */
(function () {
  "use strict";

  // =========================
  // Keys / utilidades
  // =========================
  const STORAGE = {
    PRODUCTS: "fraganze_products_v1",
    CART: "fraganze_cart_v1",
    WISHLIST: "fraganze_wishlist_v1",
  };

  function readJSON(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  }

  function writeJSON(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function getQueryParam(name) {
    return new URLSearchParams(window.location.search).get(name);
  }

  function money(n) {
    const num = Number(n);
    if (Number.isNaN(num)) return "0";
    return String(num);
  }

  // =========================
  // ProductStore (CRUD)
  // =========================
  const ProductStore = {
    seedIfEmpty() {
      const existing = readJSON(STORAGE.PRODUCTS, null);
      if (existing && Array.isArray(existing) && existing.length) return;

      const seed = [
        {
          id: "1",
          title: "Esencia Premium",
          description:
            "Una fragancia cautivadora que combina notas florales y amaderadas, creando una experiencia sensorial única.",
          images: [
            "images/product-item1.jpg",
            "images/product-item2.jpg",
            "images/product-item3.jpg",
            "images/product-item1.jpg",
          ],
          variants: [
            { label: "50ml", price: 290 },
            { label: "100ml", price: 450 },
          ],
          stock: 15,
          ratingAvg: 5,
          ratingCount: 24,
          shippingNote: "Entrega en 3-5 días hábiles. Envío gratis en compras sobre $100.",
        },
      ];

      writeJSON(STORAGE.PRODUCTS, seed);
    },

    list() {
      this.seedIfEmpty();
      return readJSON(STORAGE.PRODUCTS, []);
    },

    getById(id) {
      return this.list().find((p) => p.id === String(id)) || null;
    },

    upsert(product) {
      // Para el admin: si existe lo actualiza, si no existe lo crea
      const items = this.list();
      const p = { ...product, id: String(product.id) };
      const idx = items.findIndex((x) => x.id === p.id);
      if (idx >= 0) items[idx] = p;
      else items.push(p);
      writeJSON(STORAGE.PRODUCTS, items);
      return p;
    },

    remove(id) {
      const items = this.list().filter((p) => p.id !== String(id));
      writeJSON(STORAGE.PRODUCTS, items);
    },
  };

  // =========================
  // CartStore (base)
  // =========================
  const CartStore = {
    list() {
      return readJSON(STORAGE.CART, []);
    },
    add(item) {
      const cart = this.list();
      cart.push(item);
      writeJSON(STORAGE.CART, cart);
    },
  };

  // =========================
  // WishlistStore (base)
  // =========================
  const WishlistStore = {
    list() {
      return readJSON(STORAGE.WISHLIST, []);
    },
    has(productId) {
      return this.list().includes(String(productId));
    },
    toggle(productId) {
      const id = String(productId);
      const list = this.list();
      const next = list.includes(id) ? list.filter((x) => x !== id) : [...list, id];
      writeJSON(STORAGE.WISHLIST, next);
      return next.includes(id);
    },
  };

  // =========================
  // Estado de la página
  // =========================
  const state = {
    productId: null,
    product: null,
    variantIndex: 0,
    quantity: 1,
    selectedRating: 0,
  };

  // =========================
  // Render helpers (usa tu HTML actual)
  // =========================
  function setText(selector, text) {
    const el = document.querySelector(selector);
    if (el) el.textContent = text;
  }

  function setHTML(selector, html) {
    const el = document.querySelector(selector);
    if (el) el.innerHTML = html;
  }

  function renderProduct() {
    const p = state.product;
    if (!p) return;

    // Title
    const titleEl = document.querySelector(".product-title");
    if (titleEl) titleEl.textContent = p.title || "";

    // Description (agarra el <p class="my-4 fs-5"> que ya tienes)
    const descEl = document.querySelector(".product-info p.my-4");
    if (descEl) descEl.textContent = p.description || "";

    // Rating (si quieres que sea dinámico)
    const ratingText = document.querySelector(".product-rating .text-muted");
    if (ratingText) ratingText.textContent = `(${p.ratingCount || 0} reseñas)`;

    // Stock
    const stockEl = document.querySelector(".stock-status");
    if (stockEl) stockEl.textContent = `En Stock - ${p.stock ?? 0} unidades disponibles`;

    // Quantity max
    const qtyInput = document.getElementById("quantity");
    if (qtyInput) {
      qtyInput.value = String(state.quantity);
      qtyInput.max = String(p.stock ?? 9999);
    }

    // Shipping note
    const shipEl = document.querySelector(".alert.alert-info");
    if (shipEl && p.shippingNote) {
      shipEl.innerHTML = `<strong>Envío:</strong> ${p.shippingNote}`;
    }

    // Images
    const main = document.getElementById("mainImage");
    if (main && p.images?.length) main.src = p.images[0];

    const thumbsWrap = document.querySelector(".thumbnail-images");
    if (thumbsWrap && Array.isArray(p.images) && p.images.length) {
      thumbsWrap.innerHTML = p.images
        .map(
          (src, i) => `
          <div class="thumbnail ${i === 0 ? "active" : ""}" data-src="${src}">
            <img src="${src}" alt="Vista ${i + 1}">
          </div>
        `
        )
        .join("");
    }

    // Variants / sizes
    const sizeWrap = document.querySelector(".size-selector");
    if (sizeWrap && Array.isArray(p.variants) && p.variants.length) {
      sizeWrap.innerHTML = p.variants
        .map(
          (v, i) => `
          <button type="button" class="size-option ${i === state.variantIndex ? "active" : ""}"
            data-variant-index="${i}">
            ${v.label} - $${money(v.price)}
          </button>
        `
        )
        .join("");
    }

    // Price
    const currentVariant = p.variants?.[state.variantIndex] || p.variants?.[0];
    const price = currentVariant?.price ?? 0;
    setText("#currentPrice", money(price));
  }

  // =========================
  // Eventos (sin depender de onclick)
  // =========================
  function bindEvents() {
    // Thumbnails click
    document.addEventListener("click", (e) => {
      const thumb = e.target.closest(".thumbnail");
      if (!thumb) return;
      const src = thumb.getAttribute("data-src");
      if (!src) return;
      changeImage(src, thumb);
    });

    // Size click
    document.addEventListener("click", (e) => {
      const btn = e.target.closest(".size-option");
      if (!btn) return;
      const idx = btn.getAttribute("data-variant-index");
      if (idx === null) return;
      selectVariantByIndex(Number(idx));
    });
  }

  // =========================
  // API pública (compatibilidad con tu HTML actual)
  // =========================
  function getCurrentVariant() {
    const p = state.product;
    if (!p || !Array.isArray(p.variants) || !p.variants.length) return null;
    return p.variants[state.variantIndex] || p.variants[0];
  }

  function selectVariantByIndex(index) {
    const p = state.product;
    if (!p?.variants?.length) return;
    if (index < 0 || index >= p.variants.length) return;
    state.variantIndex = index;
    renderProduct();
  }

  // Mantengo tus funciones globales (por si aún existen onclicks en el HTML)
  window.changeImage = function (src, element) {
    const main = document.getElementById("mainImage");
    if (main) main.src = src;

    const thumbs = document.querySelectorAll(".thumbnail");
    thumbs.forEach((t) => t.classList.remove("active"));
    if (element) element.classList.add("active");
  };

  window.increaseQuantity = function () {
    const qtyInput = document.getElementById("quantity");
    if (!qtyInput) return;
    const max = parseInt(qtyInput.max || "9999", 10);
    const currentValue = parseInt(qtyInput.value || "1", 10);
    if (currentValue < max) {
      state.quantity = currentValue + 1;
      qtyInput.value = String(state.quantity);
    }
  };

  window.decreaseQuantity = function () {
    const qtyInput = document.getElementById("quantity");
    if (!qtyInput) return;
    const currentValue = parseInt(qtyInput.value || "1", 10);
    if (currentValue > 1) {
      state.quantity = currentValue - 1;
      qtyInput.value = String(state.quantity);
    }
  };

  // Conserva tu firma (element, size, price) pero ya no la dependemos:
  window.selectSize = function (element, size, price) {
    // Si por algún motivo siguen existiendo botones viejos con onclick:
    // buscamos el índice por label.
    const p = state.product;
    if (!p?.variants?.length) return;
    const idx = p.variants.findIndex((v) => v.label === String(size));
    if (idx >= 0) state.variantIndex = idx;
    renderProduct();
  };

  window.addToCart = function () {
    const p = state.product;
    if (!p) return;

    const v = getCurrentVariant();
    const qtyInput = document.getElementById("quantity");
    const quantity = parseInt(qtyInput?.value || String(state.quantity || 1), 10);

    CartStore.add({
      productId: p.id,
      title: p.title,
      variant: v?.label || null,
      unitPrice: v?.price ?? 0,
      quantity,
      addedAt: new Date().toISOString(),
    });

    alert("¡Producto agregado al carrito!");
  };

  window.buyNow = function () {
    // Por ahora, mismo comportamiento: guarda en carrito y luego redirige (en el futuro)
    window.addToCart();
    alert("Redirigiendo a checkout...");
    // window.location.href = "checkout.html";
  };

  window.toggleWishlist = function () {
    const p = state.product;
    if (!p) return;

    const active = WishlistStore.toggle(p.id);

    const btn = document.querySelector(".wishlist-btn");
    if (btn) {
      btn.classList.toggle("active", active);
      btn.style.background = active ? "#74909B" : "white";
      btn.style.color = active ? "white" : "inherit";
    }
  };

  window.rate = function (stars) {
    state.selectedRating = Number(stars) || 0;
    const starElements = document.querySelectorAll("#ratingStars span");
    starElements.forEach((star, index) => {
      star.style.color = index < state.selectedRating ? "#FFD700" : "#ddd";
    });
  };

  window.submitReview = function (event) {
    event.preventDefault();
    if (state.selectedRating === 0) {
      alert("Por favor selecciona una calificación");
      return;
    }
    alert("¡Gracias por tu reseña!");
    event.target.reset();
    state.selectedRating = 0;
    window.rate(0);
  };

  // =========================
  // Init
  // =========================
  document.addEventListener("DOMContentLoaded", () => {
    ProductStore.seedIfEmpty();

    state.productId = getQueryParam("id") || "1";
    state.product = ProductStore.getById(state.productId);

    if (!state.product) {
      return;
    }

    // Inicializa wishlist visual
    const btn = document.querySelector(".wishlist-btn");
    if (btn) {
      const active = WishlistStore.has(state.product.id);
      btn.classList.toggle("active", active);
      btn.style.background = active ? "#74909B" : "white";
      btn.style.color = active ? "white" : "inherit";
    }

    bindEvents();
    renderProduct();
  });

  // Export opcional para el futuro admin (si lo quieres usar desde otra página)
  window.Fraganze = window.Fraganze || {};
  window.Fraganze.ProductStore = ProductStore;
})();
