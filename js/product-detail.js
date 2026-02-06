// js/product-detail.js
document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    const productDetail = document.getElementById('product-detail');
    const notFound = document.getElementById('product-not-found');

    if (!id || typeof PRODUCTS === 'undefined') {
        notFound.classList.remove('d-none');
        return;
    }

    const product = PRODUCTS.find(p => p.id === id);
    if (!product) {
        notFound.classList.remove('d-none');
        return;
    }

    // ============ DOM Elements ============
    const imgEl = document.getElementById('product-image');
    const nameEl = document.getElementById('product-name');
    const brandEl = document.getElementById('product-brand');
    const familyEl = document.getElementById('product-family');
    const priceEl = document.getElementById('price-display');
    const buyNowBtn = document.getElementById('buy-now');

    // Notes elements
    const notasSalidaEl = document.getElementById('notas-salida');
    const notasCorazonEl = document.getElementById('notas-corazon');
    const notasFondoEl = document.getElementById('notas-fondo');

    // Description tab
    const fullDescEl = document.getElementById('product-full-description');

    // Technical tab
    const techFamilyEl = document.getElementById('tech-family');
    const techDurationEl = document.getElementById('tech-duration');
    const techEstacionEl = document.getElementById('tech-estacion');
    const techOcasionEl = document.getElementById('tech-ocasion');

    // Reviews tab
    const reviewsListEl = document.getElementById('reviews-list');

    // Recommendations
    const recommendationsEl = document.getElementById('recommendations');

    // Decant buttons
    const decantBtns = document.querySelectorAll('.decant-btn');

    // ============ Populate Header ============
    imgEl.src = product.image || `images/${product.name}.png`;
    imgEl.alt = product.name;
    nameEl.textContent = product.name;
    brandEl.textContent = product.brand;
    familyEl.textContent = product.familia_olfativa || '';

    // ============ Helper: Fill List ============
    function fillList(el, arr) {
        el.innerHTML = '';
        if (!Array.isArray(arr)) return;
        arr.forEach(note => {
            const li = document.createElement('li');
            li.textContent = note;
            el.appendChild(li);
        });
    }

    // ============ Helper: Format Price ============
    function formatPrice(price) {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    // ============ Helper: Get Price for Size ============
    function getPriceForSize(sizeKey) {
        if (!product.decant_prices) return 0;
        return product.decant_prices[sizeKey] || 0;
    }

    // ============ Initialize Decant Buttons ============
    let selectedSize = '2ml';

    function setupDecantButtons() {
        decantBtns.forEach(btn => {
            const size = btn.getAttribute('data-size');
            const priceSpan = btn.querySelector('.price');
            const price = getPriceForSize(size);
            priceSpan.textContent = `₡${formatPrice(price)}`;

            btn.addEventListener('click', () => {
                decantBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                selectedSize = size;
                updatePriceDisplay();
            });
        });
        updatePriceDisplay();
    }

    function updatePriceDisplay() {
        const price = getPriceForSize(selectedSize);
        priceEl.textContent = `Desde ₡${formatPrice(price)}`;
    }

    setupDecantButtons();

    // ============ Populate Description Tab ============
    fullDescEl.textContent = product.descripcion || '';
    fillList(notasSalidaEl, product.notas_salida);
    fillList(notasCorazonEl, product.notas_corazon);
    fillList(notasFondoEl, product.notas_fondo);

    // ============ Populate Technical Tab ============
    techFamilyEl.textContent = product.familia_olfativa || 'N/A';
    techDurationEl.textContent = product.duracion || 'N/A';

    // Estación badges
    if (Array.isArray(product.estacion)) {
        techEstacionEl.innerHTML = product.estacion
            .map(e => `<span class="badge bg-secondary">${e}</span>`)
            .join('');
    } else {
        techEstacionEl.innerHTML = '<span class="text-muted small">N/A</span>';
    }

    // Ocasión badges
    if (Array.isArray(product.ocasion)) {
        techOcasionEl.innerHTML = product.ocasion
            .map(o => `<span class="badge bg-info">${o}</span>`)
            .join('');
    } else {
        techOcasionEl.innerHTML = '<span class="text-muted small">N/A</span>';
    }

    // ============ Populate Reviews Tab ============
    function generateSampleReviews() {
        const reviews = [
            {
                name: 'Maria García',
                stars: 5,
                text: 'Excelente perfume, la durabilidad es muy buena. Recomendado 100%.'
            },
            {
                name: 'Juan López',
                stars: 5,
                text: 'Muy buen aroma, perfecto para el día. Llegó rápido y bien empacado.'
            },
            {
                name: 'Ana Rodríguez',
                stars: 4,
                text: 'Buena calidad, aunque el decant es un poco pequeño para el precio.'
            }
        ];

        reviewsListEl.innerHTML = reviews.map(review => `
            <div class="card mb-3">
                <div class="card-body">
                    <h6 class="card-title fw-bold">${review.name}</h6>
                    <div class="text-warning mb-2">
                        ${'★'.repeat(review.stars)}${'☆'.repeat(5 - review.stars)}
                    </div>
                    <p class="card-text text-muted">${review.text}</p>
                </div>
            </div>
        `).join('');
    }

    generateSampleReviews();

    // ============ Recommendations ============
    function getRecommendations() {
        // Filter out current product and get similar ones by family
        let similar = PRODUCTS.filter(p => 
            p.id !== id && p.familia_olfativa === product.familia_olfativa
        );

        // If not enough similar, get random from same gender
        if (similar.length < 4) {
            const sameGender = PRODUCTS.filter(p =>
                p.id !== id && p.genero === product.genero && !similar.includes(p)
            );
            similar = similar.concat(sameGender);
        }

        // If still not enough, get random
        if (similar.length < 4) {
            const random = PRODUCTS.filter(p => !similar.includes(p) && p.id !== id);
            similar = similar.concat(random);
        }

        // Shuffle and take 4
        return similar.sort(() => Math.random() - 0.5).slice(0, 4);
    }

    function renderRecommendations() {
        const recs = getRecommendations();
        recommendationsEl.innerHTML = recs.map(p => `
            <div class="col-md-6 col-lg-3">
                <div class="card recommendation-card h-100">
                    <img src="${p.image || 'images/placeholder.png'}" alt="${p.name}" class="card-img-top" style="height: 250px; object-fit: cover;">
                    <div class="card-body">
                        <h6 class="card-title fw-bold">${p.name}</h6>
                        <p class="card-text small text-muted">${p.brand}</p>
                        <p class="card-text small">${p.familia_olfativa}</p>
                        <div class="d-grid">
                            <a href="product.html?id=${p.id}" class="btn btn-sm btn-outline-dark">Ver Detalles</a>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    renderRecommendations();

    // ============ Add to Cart (Comprar Ya) ============
    buyNowBtn.addEventListener('click', () => {
        const size = selectedSize;
        const price = getPriceForSize(size);

        const cartKey = 'fraganze_cart_v3';
        const raw = localStorage.getItem(cartKey);
        let cart = [];
        try { cart = raw ? JSON.parse(raw) : []; } catch (e) { cart = []; }

        // Check if same product+size exists
        const existing = cart.find(item => item.id === product.id && item.size === size);
        if (existing) {
            existing.quantity = (existing.quantity || 1) + 1;
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                size: size,
                price: price,
                image: product.image,
                quantity: 1
            });
        }

        localStorage.setItem(cartKey, JSON.stringify(cart));
        buyNowBtn.textContent = 'Redirigiendo a Checkout...';
        buyNowBtn.disabled = true;
        try { updateCartBadge(); } catch (e) {}
        
        // Redirigir a checkout.html después de 500ms
        setTimeout(() => {
            window.location.href = 'checkout.html';
        }, 500);
    });

    // ============ Show Detail ============
    productDetail.classList.remove('d-none');
});
