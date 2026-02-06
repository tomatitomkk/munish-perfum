// ============================================================
// SHOP.JS - Sistema de Filtrado Completo y Funcional
// ============================================================

class ShopManager {
    constructor() {
        this.allProducts = [];
        this.filteredProducts = [];
        this.currentPage = 1;
        this.productsPerPage = 12;
        
        // Esperar a que el DOM esté listo
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    init() {
        console.log('ShopManager inicializando...');
        this.loadProducts();
        this.setupEventListeners();
        this.currentPage = 1;
        
        // Aplicar filtros iniciales (esto cargará los productos)
        this.applyFilters();
    }

    loadProducts() {
        // Carga robusta de datos
        if (typeof window !== 'undefined' && window.PRODUCTS && Array.isArray(window.PRODUCTS)) {
            this.allProducts = window.PRODUCTS;
            console.log('Productos cargados desde window.PRODUCTS:', this.allProducts.length);
        } else if (typeof PRODUCTS !== 'undefined' && Array.isArray(PRODUCTS)) {
            this.allProducts = PRODUCTS;
            console.log('Productos cargados desde PRODUCTS global:', this.allProducts.length);
        } else {
            console.warn('No se encontró PRODUCTS. Intentando localStorage...');
            try {
                const stored = localStorage.getItem('fraganze_inventory_v3');
                this.allProducts = stored ? JSON.parse(stored) : [];
                console.log('Productos cargados desde localStorage:', this.allProducts.length);
            } catch (e) {
                console.error('Error cargando desde localStorage:', e);
                this.allProducts = [];
            }
        }
        // Inicializar filtrados con una copia de todos
        this.filteredProducts = [...this.allProducts];
    }

    setupEventListeners() {
        console.log('Configurando event listeners...');
        
        // 1. Buscador (Search) - Evento 'input' para búsqueda en tiempo real
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                console.log('Buscando:', e.target.value);
                this.currentPage = 1;
                this.applyFilters();
            });
            console.log('✓ Event listener agregado al buscador');
        } else {
            console.error('✗ No se encontró #search-input');
        }

        // 2. Ordenar Por (Sort)
        const sortSelect = document.getElementById('sort-select');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                console.log('Ordenando por:', e.target.value);
                this.applySort();
                this.renderProducts();
            });
            console.log('✓ Event listener agregado al selector de orden');
        } else {
            console.error('✗ No se encontró #sort-select');
        }

        // 3. Filtros Checkbox (Género y Familia)
        const checkboxes = document.querySelectorAll('.filter-gender, .filter-family');
        console.log('Checkboxes encontrados:', checkboxes.length);
        checkboxes.forEach(cb => {
            cb.addEventListener('change', (e) => {
                console.log('Checkbox cambiado:', e.target.value, e.target.checked);
                this.currentPage = 1;
                this.applyFilters();
            });
        });

        // 4. Precios
        const priceInputs = [document.getElementById('price-min'), document.getElementById('price-max')];
        priceInputs.forEach(input => {
            if(input) {
                input.addEventListener('change', (e) => {
                    console.log('Precio cambiado:', e.target.id, e.target.value);
                    this.currentPage = 1;
                    this.applyFilters();
                });
            }
        });

        // 5. Botón Aplicar
        const btnApply = document.getElementById('btn-apply-filters');
        if (btnApply) {
            btnApply.addEventListener('click', () => {
                console.log('Aplicar filtros clickeado');
                this.currentPage = 1;
                this.applyFilters();
                document.getElementById('product-grid-main')?.scrollIntoView({ behavior: 'smooth' });
            });
        }

        // 6. Paginación
        const pagination = document.querySelector('.pagination');
        if (pagination) {
            pagination.addEventListener('click', (e) => this.handlePaginationClick(e));
        }
    }

    applyFilters() {
        console.log('=== Aplicando filtros ===');
        
        // A. Obtener valores
        const searchInput = document.getElementById('search-input');
        const term = searchInput ? searchInput.value.toLowerCase().trim() : '';
        console.log('Término de búsqueda:', term);
        
        const selectedGenders = Array.from(document.querySelectorAll('.filter-gender:checked')).map(cb => cb.value);
        console.log('Géneros seleccionados:', selectedGenders);
        
        const selectedFamilies = Array.from(document.querySelectorAll('.filter-family:checked')).map(cb => cb.value);
        console.log('Familias seleccionadas:', selectedFamilies);
        
        const minPrice = parseFloat(document.getElementById('price-min')?.value) || 0;
        const maxPrice = parseFloat(document.getElementById('price-max')?.value) || 999999;
        console.log('Rango de precio:', minPrice, '-', maxPrice);

        // B. Filtrar Array Maestro
        this.filteredProducts = this.allProducts.filter(p => {
            // Precio (Prioridad: Decant 2ml -> Precio Botella -> 0)
            let price = 0;
            if (p.decant_prices && p.decant_prices['2ml']) {
                price = p.decant_prices['2ml'];
            } else if (p.price50ml) {
                price = p.price50ml;
            }

            // 1. Search (Nombre, Marca o Descripción)
            const matchesSearch = !term || 
                (p.name && p.name.toLowerCase().includes(term)) || 
                (p.brand && p.brand.toLowerCase().includes(term)) ||
                (p.descripcion && p.descripcion.toLowerCase().includes(term));

            // 2. Género
            const matchesGender = selectedGenders.length === 0 || 
                selectedGenders.includes(p.genero) || 
                selectedGenders.includes(p.category);

            // 3. Familia
            const matchesFamily = selectedFamilies.length === 0 || 
                selectedFamilies.some(f => p.familia_olfativa && p.familia_olfativa.includes(f));

            // 4. Precio
            const matchesPrice = price >= minPrice && price <= maxPrice;

            const passes = matchesSearch && matchesGender && matchesFamily && matchesPrice;
            
            return passes;
        });

        console.log('Productos filtrados:', this.filteredProducts.length, 'de', this.allProducts.length);

        // C. Aplicar Ordenamiento
        this.applySort();

        // D. Renderizar
        this.renderProducts();
        this.updateResultCount();
    }

    applySort() {
        const sortValue = document.getElementById('sort-select')?.value || 'popularidad';
        console.log('Aplicando orden:', sortValue);
        
        const getPrice = (p) => (p.decant_prices?.['2ml'] || p.price50ml || 0);

        switch(sortValue) {
            case 'precio-ascendente':
                this.filteredProducts.sort((a, b) => getPrice(a) - getPrice(b));
                break;
            case 'precio-descendente':
                this.filteredProducts.sort((a, b) => getPrice(b) - getPrice(a));
                break;
            case 'alfabetico':
                this.filteredProducts.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
                break;
            default: // popularidad
                this.filteredProducts.sort((a, b) => {
                    const idA = String(a.id || '');
                    const idB = String(b.id || '');
                    return idA.localeCompare(idB);
                });
        }
    }

    handlePaginationClick(e) {
        const link = e.target.closest('.page-link');
        if (!link || link.parentElement.classList.contains('disabled')) return;
        
        e.preventDefault();
        
        const action = link.dataset.action;
        const page = link.dataset.page;
        const totalPages = Math.ceil(this.filteredProducts.length / this.productsPerPage);

        if (action === 'prev' && this.currentPage > 1) {
            this.currentPage--;
        } else if (action === 'next' && this.currentPage < totalPages) {
            this.currentPage++;
        } else if (page) {
            this.currentPage = parseInt(page);
        }

        this.renderProducts();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    renderProducts() {
        const grid = document.getElementById('product-grid-main');
        if (!grid) {
            console.error('No se encontró #product-grid-main');
            return;
        }
        
        grid.innerHTML = '';

        // Paginación
        const start = (this.currentPage - 1) * this.productsPerPage;
        const end = start + this.productsPerPage;
        const visibleItems = this.filteredProducts.slice(start, end);

        console.log('Renderizando productos:', visibleItems.length, 'de', this.filteredProducts.length);

        if (visibleItems.length === 0) {
            grid.innerHTML = `
                <div class="col-12 text-center py-5">
                    <h4 class="text-muted">No encontramos perfumes con esos filtros.</h4>
                    <button class="btn btn-outline-dark mt-2" onclick="window.location.reload()">Ver todos</button>
                </div>`;
            this.renderPaginationUI(0);
            return;
        }

        visibleItems.forEach(product => {
            grid.innerHTML += this.createProductCard(product);
        });

        this.renderPaginationUI(Math.ceil(this.filteredProducts.length / this.productsPerPage));
    }

    createProductCard(product) {
        const priceVal = (product.decant_prices?.['2ml'] || product.price50ml || 0);
        const price = priceVal.toLocaleString('es-CR');
        
        let img = product.image || 'images/placeholder.png';
        if (!img.startsWith('http') && !img.startsWith('images/') && !img.startsWith('/')) {
            img = 'images/' + img;
        }

        return `
        <div class="col-6 col-md-4 col-lg-3 mb-4">
            <div class="card product-card h-100 border-0 shadow-sm">
                <a href="single-product.html?id=${product.id}" class="d-block position-relative overflow-hidden">
                    <img src="${img}" class="card-img-top product-image" alt="${product.name}"
                         style="aspect-ratio: 1/1; object-fit: contain; padding: 1rem;"
                         onerror="this.src='images/placeholder.png'">
                    ${product.decant_prices ? '<span class="badge bg-dark position-absolute top-0 start-0 m-2">Decants</span>' : ''}
                </a>
                <div class="card-body p-3 text-center d-flex flex-column">
                    <p class="text-muted small mb-1 text-uppercase">${product.brand || 'Munish'}</p>
                    <h6 class="card-title text-truncate mb-2">
                        <a href="single-product.html?id=${product.id}" class="text-dark text-decoration-none fw-bold">${product.name}</a>
                    </h6>
                    <div class="mt-auto">
                        <p class="text-primary fw-bold mb-2">Desde ₡${price}</p>
                        <a href="single-product.html?id=${product.id}" class="btn btn-outline-dark btn-sm w-100">Ver Opciones</a>
                    </div>
                </div>
            </div>
        </div>`;
    }

    renderPaginationUI(totalPages) {
        const nav = document.querySelector('.pagination');
        if (!nav) return;
        
        if (totalPages <= 1) {
            nav.innerHTML = '';
            return;
        }

        let html = `
            <li class="page-item ${this.currentPage === 1 ? 'disabled' : ''}">
                <a class="page-link" href="#" data-action="prev">«</a>
            </li>
        `;

        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= this.currentPage - 1 && i <= this.currentPage + 1)) {
                html += `
                    <li class="page-item ${i === this.currentPage ? 'active' : ''}">
                        <a class="page-link" href="#" data-page="${i}">${i}</a>
                    </li>
                `;
            } else if (i === this.currentPage - 2 || i === this.currentPage + 2) {
                html += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
            }
        }

        html += `
            <li class="page-item ${this.currentPage === totalPages ? 'disabled' : ''}">
                <a class="page-link" href="#" data-action="next">»</a>
            </li>
        `;

        nav.innerHTML = html;
    }

    updateResultCount() {
        const el = document.querySelector('.shop-result-count strong');
        if (el) {
            el.textContent = this.filteredProducts.length;
            console.log('Contador actualizado:', this.filteredProducts.length);
        }
    }
}

// Iniciar sistema cuando el script se carga
console.log('shop.js cargado');
window.shopManager = new ShopManager();
console.log('ShopManager instanciado');