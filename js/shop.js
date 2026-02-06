// ============================================================
// SHOP.JS - VERSIÓN REFACTORIZADA Y GARANTIZADA
// ============================================================

(function() {
    'use strict';
    
    // Variables globales del sistema
    let allProducts = [];
    let filteredProducts = [];
    let currentPage = 1;
    const productsPerPage = 12;
    
    // ====================
    // INICIALIZACIÓN
    // ====================
    function init() {
        console.log('%c=== SHOP SYSTEM INICIANDO ===', 'color: blue; font-weight: bold');
        
        // Cargar productos
        loadProducts();
        
        // Esperar a que DOM esté listo
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', setupSystem);
        } else {
            setupSystem();
        }
    }
    
    function setupSystem() {
        console.log('DOM listo, configurando sistema...');
        setupEventListeners();
        renderAllProducts();
    }
    
    // ====================
    // CARGA DE PRODUCTOS
    // ====================
    function loadProducts() {
        if (window.PRODUCTS && Array.isArray(window.PRODUCTS)) {
            allProducts = window.PRODUCTS;
            filteredProducts = [...allProducts];
            console.log('%c✓ Productos cargados:', 'color: green', allProducts.length);
        } else {
            console.error('%c✗ NO SE ENCONTRARON PRODUCTOS', 'color: red');
            allProducts = [];
            filteredProducts = [];
        }
    }
    
    // ====================
    // EVENT LISTENERS
    // ====================
    function setupEventListeners() {
        console.log('Configurando event listeners...');
        
        // 1. BUSCADOR - Input en tiempo real
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.addEventListener('input', function(e) {
                const searchTerm = e.target.value.trim();
                console.log('%cBuscando: "' + searchTerm + '"', 'color: purple');
                currentPage = 1;
                applyFiltersAndRender();
            });
            console.log('%c✓ Buscador conectado', 'color: green');
        } else {
            console.error('%c✗ NO se encontró #search-input', 'color: red');
        }
        
        // 2. ORDENAR - Change event
        const sortSelect = document.getElementById('sort-select');
        if (sortSelect) {
            sortSelect.addEventListener('change', function(e) {
                const sortValue = e.target.value;
                console.log('%cOrdenando por: ' + sortValue, 'color: orange');
                applySortAndRender();
            });
            console.log('%c✓ Selector de orden conectado', 'color: green');
        } else {
            console.error('%c✗ NO se encontró #sort-select', 'color: red');
        }
        
        // 3. FILTROS CHECKBOX - Género
        const genderCheckboxes = document.querySelectorAll('.filter-gender');
        console.log('Checkboxes de género encontrados:', genderCheckboxes.length);
        genderCheckboxes.forEach(cb => {
            cb.addEventListener('change', function() {
                console.log('Género cambiado:', this.value, this.checked);
                currentPage = 1;
                applyFiltersAndRender();
            });
        });
        
        // 4. FILTROS CHECKBOX - Familia
        const familyCheckboxes = document.querySelectorAll('.filter-family');
        console.log('Checkboxes de familia encontrados:', familyCheckboxes.length);
        familyCheckboxes.forEach(cb => {
            cb.addEventListener('change', function() {
                console.log('Familia cambiada:', this.value, this.checked);
                currentPage = 1;
                applyFiltersAndRender();
            });
        });
        
        // 5. PRECIOS
        const priceMin = document.getElementById('price-min');
        const priceMax = document.getElementById('price-max');
        if (priceMin && priceMax) {
            priceMin.addEventListener('change', function() {
                console.log('Precio mínimo:', this.value);
                currentPage = 1;
                applyFiltersAndRender();
            });
            priceMax.addEventListener('change', function() {
                console.log('Precio máximo:', this.value);
                currentPage = 1;
                applyFiltersAndRender();
            });
        }
        
        // 6. BOTÓN APLICAR
        const btnApply = document.getElementById('btn-apply-filters');
        if (btnApply) {
            btnApply.addEventListener('click', function() {
                console.log('Botón aplicar clickeado');
                currentPage = 1;
                applyFiltersAndRender();
            });
        }
        
        // 7. PAGINACIÓN
        const pagination = document.querySelector('.pagination');
        if (pagination) {
            pagination.addEventListener('click', handlePaginationClick);
        }
    }
    
    // ====================
    // FILTRADO
    // ====================
    function applyFiltersAndRender() {
        console.log('%c=== APLICANDO FILTROS ===', 'color: blue; font-weight: bold');
        
        // Obtener valores de filtros
        const searchTerm = (document.getElementById('search-input')?.value || '').toLowerCase().trim();
        
        const selectedGenders = Array.from(document.querySelectorAll('.filter-gender:checked')).map(cb => cb.value);
        const selectedFamilies = Array.from(document.querySelectorAll('.filter-family:checked')).map(cb => cb.value);
        
        const minPrice = parseFloat(document.getElementById('price-min')?.value) || 0;
        const maxPrice = parseFloat(document.getElementById('price-max')?.value) || 999999;
        
        console.log('Búsqueda:', searchTerm);
        console.log('Géneros:', selectedGenders);
        console.log('Familias:', selectedFamilies);
        console.log('Rango precio:', minPrice, '-', maxPrice);
        
        // Filtrar productos
        filteredProducts = allProducts.filter(product => {
            // Obtener precio del producto
            let price = 0;
            if (product.decant_prices && product.decant_prices['2ml']) {
                price = product.decant_prices['2ml'];
            } else if (product.price50ml) {
                price = product.price50ml;
            }
            
            // 1. Filtro de BÚsqueda (nombre, marca, descripción)
            let matchesSearch = true;
            if (searchTerm) {
                const name = (product.name || '').toLowerCase();
                const brand = (product.brand || '').toLowerCase();
                const desc = (product.descripcion || '').toLowerCase();
                matchesSearch = name.includes(searchTerm) || 
                               brand.includes(searchTerm) || 
                               desc.includes(searchTerm);
            }
            
            // 2. Filtro de Género
            let matchesGender = true;
            if (selectedGenders.length > 0) {
                matchesGender = selectedGenders.includes(product.genero) || 
                               selectedGenders.includes(product.category);
            }
            
            // 3. Filtro de Familia
            let matchesFamily = true;
            if (selectedFamilies.length > 0) {
                matchesFamily = selectedFamilies.some(fam => {
                    return product.familia_olfativa && product.familia_olfativa.includes(fam);
                });
            }
            
            // 4. Filtro de Precio
            const matchesPrice = price >= minPrice && price <= maxPrice;
            
            // Retornar si pasa TODOS los filtros
            return matchesSearch && matchesGender && matchesFamily && matchesPrice;
        });
        
        console.log('%cProductos filtrados: ' + filteredProducts.length + ' de ' + allProducts.length, 'color: green; font-weight: bold');
        
        // Aplicar ordenamiento
        applySort();
        
        // Renderizar
        renderProducts();
        updateResultCount();
    }
    
    // ====================
    // ORDENAMIENTO
    // ====================
    function applySort() {
        const sortValue = document.getElementById('sort-select')?.value || 'popularidad';
        console.log('Aplicando orden:', sortValue);
        
        const getPrice = (p) => (p.decant_prices?.['2ml'] || p.price50ml || 0);
        
        switch(sortValue) {
            case 'precio-ascendente':
                filteredProducts.sort((a, b) => getPrice(a) - getPrice(b));
                console.log('Ordenado por precio ascendente');
                break;
            case 'precio-descendente':
                filteredProducts.sort((a, b) => getPrice(b) - getPrice(a));
                console.log('Ordenado por precio descendente');
                break;
            case 'alfabetico':
                filteredProducts.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
                console.log('Ordenado alfabéticamente');
                break;
            default: // popularidad
                filteredProducts.sort((a, b) => String(a.id || '').localeCompare(String(b.id || '')));
                console.log('Ordenado por popularidad (ID)');
        }
    }
    
    function applySortAndRender() {
        applySort();
        renderProducts();
    }
    
    // ====================
    // RENDERIZADO
    // ====================
    function renderAllProducts() {
        console.log('Renderizando todos los productos inicialmente...');
        filteredProducts = [...allProducts];
        applySort();
        renderProducts();
        updateResultCount();
    }
    
    function renderProducts() {
        const grid = document.getElementById('product-grid-main');
        if (!grid) {
            console.error('%c✗ NO se encontró #product-grid-main', 'color: red');
            return;
        }
        
        // Limpiar grid
        grid.innerHTML = '';
        
        // Calcular paginación
        const start = (currentPage - 1) * productsPerPage;
        const end = start + productsPerPage;
        const visibleProducts = filteredProducts.slice(start, end);
        
        console.log('Renderizando página', currentPage, ':', visibleProducts.length, 'productos');
        
        // Si no hay productos
        if (visibleProducts.length === 0) {
            grid.innerHTML = `
                <div class="col-12 text-center py-5">
                    <h4 class="text-muted">No se encontraron productos con esos filtros.</h4>
                    <button class="btn btn-outline-dark mt-2" onclick="location.reload()">Ver todos</button>
                </div>`;
            renderPagination(0);
            return;
        }
        
        // Renderizar productos
        visibleProducts.forEach(product => {
            grid.innerHTML += createProductCard(product);
        });
        
        // Renderizar paginación
        const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
        renderPagination(totalPages);
    }
    
    function createProductCard(product) {
        const price = (product.decant_prices?.['2ml'] || product.price50ml || 0).toLocaleString('es-CR');
        
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
    
    // ====================
    // PAGINACIÓN
    // ====================
    function renderPagination(totalPages) {
        const nav = document.querySelector('.pagination');
        if (!nav) return;
        
        if (totalPages <= 1) {
            nav.innerHTML = '';
            return;
        }
        
        let html = `<li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
                        <a class="page-link" href="#" data-action="prev">«</a>
                    </li>`;
        
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
                html += `<li class="page-item ${i === currentPage ? 'active' : ''}">
                            <a class="page-link" href="#" data-page="${i}">${i}</a>
                         </li>`;
            } else if (i === currentPage - 2 || i === currentPage + 2) {
                html += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
            }
        }
        
        html += `<li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
                    <a class="page-link" href="#" data-action="next">»</a>
                 </li>`;
        
        nav.innerHTML = html;
    }
    
    function handlePaginationClick(e) {
        const link = e.target.closest('.page-link');
        if (!link || link.parentElement.classList.contains('disabled')) return;
        
        e.preventDefault();
        
        const action = link.dataset.action;
        const page = link.dataset.page;
        const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
        
        if (action === 'prev' && currentPage > 1) {
            currentPage--;
        } else if (action === 'next' && currentPage < totalPages) {
            currentPage++;
        } else if (page) {
            currentPage = parseInt(page);
        }
        
        renderProducts();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    // ====================
    // UTILIDADES
    // ====================
    function updateResultCount() {
        const el = document.querySelector('.shop-result-count strong');
        if (el) {
            el.textContent = filteredProducts.length;
        }
    }
    
    // ====================
    // INICIAR SISTEMA
    // ====================
    console.log('%cshop.js cargado', 'color: blue');
    init();
    
})();