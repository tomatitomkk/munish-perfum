// ============================================================
// SHOP.JS - Renderizado dinámico de productos, filtros y paginación
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
        // 1. Cargar productos
        this.loadProducts();

        // 2. Configurar eventos de filtros y ordenamiento
        this.setupFilterEvents();

        // 3. Configurar eventos de paginación (Delegación de eventos)
        this.setupPaginationEvents();

        // 4. Renderizado inicial
        this.applyFilters();
    }

    loadProducts() {
        // Intentar cargar desde window.PRODUCTS (products.js)
        if (window.PRODUCTS && Array.isArray(window.PRODUCTS)) {
            this.allProducts = window.PRODUCTS;
        } else if (typeof PRODUCTS !== 'undefined' && Array.isArray(PRODUCTS)) {
            this.allProducts = PRODUCTS;
        } else {
            // Fallback a localStorage si es necesario
            try {
                const stored = localStorage.getItem('fraganze_inventory_v3');
                this.allProducts = stored ? JSON.parse(stored) : [];
            } catch (e) {
                this.allProducts = [];
            }
        }
        // Inicialmente, los filtrados son todos
        this.filteredProducts = [...this.allProducts];
    }

    setupFilterEvents() {
        // Función helper para aplicar filtros al cambiar cualquier input
        const triggerFilter = () => this.applyFilters();

        // Búsqueda
        document.getElementById('search-input')?.addEventListener('input', triggerFilter);
        
        // Checkboxes de Género
        document.querySelectorAll('.filter-gender').forEach(cb => cb.addEventListener('change', triggerFilter));
        
        // Checkboxes de Familia
        document.querySelectorAll('.filter-family').forEach(cb => cb.addEventListener('change', triggerFilter));
        
        // Precios
        document.getElementById('price-min')?.addEventListener('change', triggerFilter);
        document.getElementById('price-max')?.addEventListener('change', triggerFilter);
        
        // Botón explícito (por si acaso)
        document.getElementById('btn-apply-filters')?.addEventListener('click', triggerFilter);

        // Ordenamiento
        document.getElementById('sort-select')?.addEventListener('change', () => this.applySort());
    }

    setupPaginationEvents() {
        const paginationContainer = document.querySelector('.pagination');
        if (!paginationContainer) return;

        // Usamos delegación de eventos: escuchamos clicks en el contenedor padre
        paginationContainer.addEventListener('click', (e) => {
            // Buscar el elemento <a> más cercano al click
            const link = e.target.closest('.page-link');
            
            // Si no fue en un link o el link está deshabilitado, ignorar
            if (!link || link.parentElement.classList.contains('disabled')) {
                e.preventDefault();
                return;
            }

            e.preventDefault(); // Evitar salto de página del navegador

            const action = link.getAttribute('data-action');
            const page = link.getAttribute('data-page');
            const totalPages = Math.ceil(this.filteredProducts.length / this.productsPerPage);

            if (action === 'prev') {
                if (this.currentPage > 1) this.currentPage--;
            } else if (action === 'next') {
                if (this.currentPage < totalPages) this.currentPage++;
            } else if (page) {
                this.currentPage = parseInt(page);
            }

            // Renderizar la nueva página y subir scroll
            this.renderProducts();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    applyFilters() {
        // 1. Leer valores del DOM
        const searchTerm = (document.getElementById('search-input')?.value || '').trim().toLowerCase();
        const selectedGenders = Array.from(document.querySelectorAll('.filter-gender:checked')).map(el => el.value.toLowerCase());
        const selectedFamilies = Array.from(document.querySelectorAll('.filter-family:checked')).map(el => el.value.toLowerCase());
        const minPrice = parseFloat(document.getElementById('price-min')?.value) || 0;
        const maxPrice = parseFloat(document.getElementById('price-max')?.value) || 999999;

        // 2. Filtrar el array
        this.filteredProducts = this.allProducts.filter(product => {
            // Lógica de Precio (Fallback seguro)
            let price = 0;
            if (product.decant_prices && product.decant_prices['2ml']) price = product.decant_prices['2ml'];
            else if (product.price50ml) price = product.price50ml;

            // Preparar campos para comparación (soporte retrocompatible)
            const prodName = (product.name || '').toLowerCase();
            const prodBrand = (product.brand || '').toLowerCase();
            const prodDescripcion = (product.descripcion || '').toLowerCase();
            const prodGenero = ((product.genero || product.gender || product.category) || '').toLowerCase();
            const prodFamilia = (product.familia_olfativa || '').toLowerCase();

            // Condiciones
            const matchSearch = !searchTerm || (
                prodName.includes(searchTerm) ||
                prodBrand.includes(searchTerm) ||
                prodDescripcion.includes(searchTerm)
            );
            const matchGender = selectedGenders.length === 0 || selectedGenders.includes(prodGenero);
            const matchFamily = selectedFamilies.length === 0 || selectedFamilies.some(f => prodFamilia.includes(f));
            const matchPrice = price >= minPrice && price <= maxPrice;

            return matchSearch && matchGender && matchFamily && matchPrice;
        });

        // 3. Reiniciar a página 1 y aplicar orden actual
        this.currentPage = 1;
        this.applySort(false); // false para no re-renderizar doble
        this.renderProducts();
        this.updateResultCount();
    }

    applySort(render = true) {
        const sortValue = document.getElementById('sort-select')?.value || 'popularidad';
        
        // Helper precio
        const getPrice = p => (p.decant_prices?.['2ml'] || p.price50ml || 0);

        if (sortValue === 'precio-ascendente') {
            this.filteredProducts.sort((a, b) => getPrice(a) - getPrice(b));
        } else if (sortValue === 'precio-descendente') {
            this.filteredProducts.sort((a, b) => getPrice(b) - getPrice(a));
        } else if (sortValue === 'alfabetico') {
            this.filteredProducts.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
        }
        // Popularidad = orden por defecto del array (o id)
        
        if (render) this.renderProducts();
    }

    renderProducts() {
        const container = document.getElementById('product-grid-main');
        if (!container) return;
        
        container.innerHTML = '';

        // Paginación lógica
        const start = (this.currentPage - 1) * this.productsPerPage;
        const end = start + this.productsPerPage;
        const visibleProducts = this.filteredProducts.slice(start, end);

        // Sin resultados
        if (visibleProducts.length === 0) {
            container.innerHTML = '<div class="col-12 text-center py-5"><h3>No se encontraron productos</h3></div>';
            this.renderPaginationUI();
            return;
        }

        // Generar HTML
        visibleProducts.forEach(product => {
            container.innerHTML += this.createProductCard(product);
        });

        this.renderPaginationUI();
    }

    createProductCard(product) {
        // Determinar precio y e imagen
        const price = (product.decant_prices?.['2ml'] || product.price50ml || 0).toLocaleString('es-CR');
        let img = product.image || 'images/product-item1.jpg';
        if (!img.startsWith('http') && !img.startsWith('images/')) img = 'images/' + img;

        return `
        <div class="col-6 col-md-4 col-lg-3 mb-4">
            <div class="card product-card h-100 border-0 shadow-sm">
                <a href="product.html?id=${product.id}" class="d-block text-center position-relative">
                    <img src="${img}" class="card-img-top product-image" alt="${product.name}" 
                         style="height: 200px; object-fit: contain; padding: 10px;"
                         onerror="this.src='images/product-item1.jpg'">
                </a>
                <div class="card-body p-3 text-center">
                    <p class="text-muted small mb-1">${product.brand || 'Munish'}</p>
                    <h6 class="mb-2 text-truncate">
                        <a href="product.html?id=${product.id}" class="text-dark text-decoration-none">${product.name}</a>
                    </h6>
                    <div class="text-primary fw-bold mb-2">₡${price}</div>
                    <a href="product.html?id=${product.id}" class="btn btn-outline-dark btn-sm w-100">Ver Detalles</a>
                </div>
            </div>
        </div>`;
    }

    renderPaginationUI() {
        const pagination = document.querySelector('.pagination');
        if (!pagination) return;

        const totalPages = Math.ceil(this.filteredProducts.length / this.productsPerPage);

        // Si no hay páginas o solo hay 1, ocultar paginación o dejarla mínima
        if (totalPages <= 1) {
            pagination.innerHTML = '';
            return;
        }

        let html = '';

        // Botón Anterior
        const prevDisabled = this.currentPage === 1 ? 'disabled' : '';
        html += `<li class="page-item ${prevDisabled}">
                    <a class="page-link" href="#" data-action="prev" aria-label="Anterior">&laquo;</a>
                 </li>`;

        // Si hay 4 páginas o menos, mostrar todos los números
        if (totalPages <= 4) {
            for (let i = 1; i <= totalPages; i++) {
                const active = i === this.currentPage ? 'active' : '';
                html += `<li class="page-item ${active}">
                            <a class="page-link" href="#" data-page="${i}">${i}</a>
                         </li>`;
            }
        } else {
            // Números de Página (Lógica inteligente para no mostrar 100 números)
            // Mostramos: 1, ..., actual-1, actual, actual+1, ..., ultimo
            for (let i = 1; i <= totalPages; i++) {
                if (
                    i === 1 ||
                    i === totalPages ||
                    (i >= this.currentPage - 1 && i <= this.currentPage + 1)
                ) {
                    const active = i === this.currentPage ? 'active' : '';
                    html += `<li class="page-item ${active}">
                                <a class="page-link" href="#" data-page="${i}">${i}</a>
                             </li>`;
                } else if (
                    i === this.currentPage - 2 ||
                    i === this.currentPage + 2
                ) {
                    html += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
                }
            }
        }

        // Botón Siguiente
        const nextDisabled = this.currentPage === totalPages ? 'disabled' : '';
        html += `<li class="page-item ${nextDisabled}">
                    <a class="page-link" href="#" data-action="next" aria-label="Siguiente">&raquo;</a>
                 </li>`;

        pagination.innerHTML = html;
    }

    updateResultCount() {
        const el = document.querySelector('.shop-result-count strong');
        if (el) el.textContent = this.filteredProducts.length;
    }
}

// Iniciar
window.shopManager = new ShopManager();