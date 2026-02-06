/* Clean product renderer + global functions - FIXED VERSION */

(function () {
  'use strict';

  const CART_STORAGE_KEY = 'fraganze_cart_v3';
  const STORAGE_KEYS = {
    PRODUCTS: 'fraganze_inventory_v3'
  };

  // Precios estándar de decants en colones (CRC)
  const DECANT_PRICES = {
    'decant-2ml': 1200,
    'decant-3ml': 1600,
    'decant-5ml': 2100,
    'decant-10ml': 4000
  };

  function normalizeProduct(p){
    if(!p) return null;
    return {
      id: p.id,
      name: p.name || p.title || '',
      category: p.category,
      categoryDisplay: (p.category || '').toString(),
      tag: p.tag || '',
      description: p.description || '',
      image: (function(){
        const img = p.image || (p.images && p.images[0]) || 'images/product-item1.jpg';
        if(!img) return 'images/product-item1.jpg';
        if(img.indexOf('http')===0) return img;
        if(img.indexOf('images/')===0 || img.indexOf('/images/')===0) return img.replace(/^\//,'');
        if(img.indexOf('/')===-1 && img.indexOf('product-item')!==-1) return 'images/'+img;
        return img;
      })(),
      price50ml: p.price50ml || 0,
      price100ml: p.price100ml || 0,
      variants: [ { label: '50ml', price: p.price50ml||0 }, { label: '100ml', price: p.price100ml||0 } ],
      stock: p.stock != null ? p.stock : 0
    };
  }

  // CORREGIDO: Prioriza window.PRODUCTS (products.js) sobre todo lo demás
  function getSourceProducts(){
    // 1. Intentar cargar desde la variable global definida en products.js
    if(typeof window.PRODUCTS !== 'undefined' && Array.isArray(window.PRODUCTS)){
      return window.PRODUCTS;
    }
    // 2. Fallback: Intentar leer de LocalStorage si la variable global falla
    try { 
      const s = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS)); 
      return Array.isArray(s) ? s : []; 
    } catch(e){ return []; }
  }

  const DB = {
    read(k){ try{ return JSON.parse(localStorage.getItem(k)); }catch(e){return null;} },
    write(k,v){ try{ localStorage.setItem(k, JSON.stringify(v)); }catch(e){} },
    
    // CORREGIDO: Inicializa usando window.PRODUCTS
    init(){ 
      // Iniciar carrito si no existe
      if(!this.read(CART_STORAGE_KEY)) this.write(CART_STORAGE_KEY,[]); 
      
      // Sincronizar productos nuevos al LocalStorage
      if(typeof window.PRODUCTS !== 'undefined' && Array.isArray(window.PRODUCTS)){
        this.write(STORAGE_KEYS.PRODUCTS, window.PRODUCTS);
      }
    },
    
    getProducts(){ return getSourceProducts().map(normalizeProduct).filter(Boolean); },
    
    // CORREGIDO: Busca directamente en la lista de productos normalizada
    getProductById(id){ 
      return this.getProducts().find(x => String(x.id) === String(id)) || null; 
    }
  };

  const UI = {
    formatMoney(a){ try{ return new Intl.NumberFormat('es-CR',{style:'currency',currency:'CRC'}).format(a); }catch(e){ return '₡'+(a||0).toLocaleString(); } },
    updateElement(sel,val,html=false){ const el=document.querySelector(sel); if(el) el[html?'innerHTML':'textContent']=val; }
  };

  function renderGlobalGrids(productsOpt){ const grid = document.querySelector('.product-grid-dynamic'); if(!grid) return; const products = productsOpt!==undefined?productsOpt:DB.getProducts(); const countEl = document.querySelector('.shop-result-count strong'); if(countEl) countEl.textContent = products.length; if(!products.length){ grid.innerHTML = '<div class="col-12 text-center py-5">No hay productos</div>'; return; } const html = products.map(p=>{
    const link = 'single-product.html?id='+encodeURIComponent(p.id);
    return `<div class="col-6 col-md-4 col-lg-3 mb-4"><div class="card product-card h-100"><a href="${link}" class="d-block text-center p-3"><img src="${p.image}" class="img-fluid product-image" alt="${p.name}"></a><div class="p-3 text-center"><h3 class="fs-6 text-truncate"><a href="${link}" class="text-decoration-none text-dark">${p.name}</a></h3><div class="text-muted">${UI.formatMoney(p.price50ml)} - ${UI.formatMoney(p.price100ml)}</div><div class="mt-2"><button class="btn btn-dark btn-add-to-cart" data-product-id="${p.id}" data-size="50ml" data-quantity="1">Agregar al Carrito</button></div></div></div></div>`;
  }).join(''); grid.innerHTML = `<div class="row g-3">${html}</div>`; }

  function applyFilters(){
    const all = DB.getProducts();
    const search = (document.getElementById('search-input')||{}).value||'';
    const term = search.trim().toLowerCase();
    const min = parseFloat((document.getElementById('price-min')||{}).value) || 0;
    const max = parseFloat((document.getElementById('price-max')||{}).value) || Infinity;

    // categories - read labels of checked boxes
    const catChecks = Array.from(document.querySelectorAll('.filter-category:checked')).map(ch => (ch.value||'').toString().trim().toLowerCase()).filter(Boolean);
    // remove 'todos' as it means no filtering by category
    const effectiveCatChecks = catChecks.filter(c => c !== 'todos');

    let filtered = all.filter(p=>{
      // search
      if(term){ const hay = ((p.name||'')+' '+(p.description||'')).toLowerCase(); if(!hay.includes(term)) return false; }
      // price (use lowest available price)
      const price = Math.min(Number(p.price50ml||Infinity), Number(p.price100ml||Infinity));
      if(price < min || price > max) return false;
      // categories: if 'todos' checked or nothing checked -> ignore category filter
      const hasCatChecks = effectiveCatChecks.length > 0;
      if(hasCatChecks){
        const matches = effectiveCatChecks.some(c=> {
          if(!c) return false; const fields = [p.category||'', p.type||'', p.brand||'', p.name||'']; return fields.join(' ').toLowerCase().includes(c);
        });
        if(!matches) return false;
      }

      // type filters (separate group)
      const typeChecks = Array.from(document.querySelectorAll('.filter-type:checked')).map(ch => (ch.value||'').toString().trim().toLowerCase()).filter(Boolean);
      if(typeChecks.length > 0){
        const tmatch = typeChecks.some(tc => {
          const fields = [p.type||'', p.category||'', p.tag||'', p.name||''];
          return fields.join(' ').toLowerCase().includes(tc);
        });
        if(!tmatch) return false;
      }
      return true;
    });

    // sort
    const sortEl = document.getElementById('sort-select');
    if(sortEl){ const idx = sortEl.selectedIndex; if(idx===1) filtered.sort((a,b)=> Math.min(a.price50ml||0,a.price100ml||0) - Math.min(b.price50ml||0,b.price100ml||0)); else if(idx===2) filtered.sort((a,b)=> Math.min(b.price50ml||0,b.price100ml||0) - Math.min(a.price50ml||0,a.price100ml||0)); else if(idx===3) filtered.sort((a,b)=> Number(b.id)-Number(a.id)); }

    renderGlobalGrids(filtered);
  }

  function renderProductDetail(){ 
    const id = (new URLSearchParams(window.location.search)).get('id'); 
    if(!id) return; 
    const p=DB.getProductById(id); 
    if(!p) return; 
    UI.updateElement('.product-title',p.name||''); 
    UI.updateElement('.current-price', UI.formatMoney(p.price50ml||0)); 
    UI.updateElement('.product-description', p.description||''); 
    const main = document.getElementById('mainImage'); 
    if(main && p.image) main.src = p.image;
    
    // Inicializar evento para cambios de tamaño
    initializeSizeSelector(p);
  }

  function initializeSizeSelector(product) {
    const sizeInputs = document.querySelectorAll('input[name="size-option"]');
    sizeInputs.forEach(input => {
      input.addEventListener('change', function() {
        updatePriceDisplay(product, this.value);
      });
    });
  }

  function updatePriceDisplay(product, selectedSize) {
    let price = product.price50ml || 0; // Default price
    
    if (selectedSize === 'botella-completa') {
      price = product.price50ml || 0;
    } else if (DECANT_PRICES[selectedSize]) {
      price = DECANT_PRICES[selectedSize];
    }
    
    UI.updateElement('.current-price', UI.formatMoney(price));
  }

  function getSelectedSize() {
    const sizeInput = document.querySelector('input[name="size-option"]:checked');
    return sizeInput ? sizeInput.value : 'botella-completa';
  }

  function getSizeLabel(sizeValue) {
    const labels = {
      'botella-completa': 'Botella Completa',
      'decant-2ml': 'Decant 2ml',
      'decant-3ml': 'Decant 3ml',
      'decant-5ml': 'Decant 5ml',
      'decant-10ml': 'Decant 10ml'
    };
    return labels[sizeValue] || sizeValue;
  }

  function getSizePrice(sizeValue, product) {
    if (sizeValue === 'botella-completa') {
      return product.price50ml || 0;
    }
    return DECANT_PRICES[sizeValue] || 0;
  }

  function bindShopFilters(){ const grid=document.querySelector('.product-grid-dynamic'); if(!grid) return; const s=document.getElementById('search-input'); if(s){ s.addEventListener('input', applyFilters); s.addEventListener('keyup', applyFilters);} const btn=document.getElementById('btn-apply-filters'); if(btn) btn.addEventListener('click', applyFilters);
    // price inputs
    const pmin = document.getElementById('price-min'); const pmax = document.getElementById('price-max'); if(pmin) pmin.addEventListener('change', applyFilters); if(pmax) pmax.addEventListener('change', applyFilters);
    // category and type checkboxes
    Array.from(document.querySelectorAll('.filter-category, .filter-type')).forEach(ch=> ch.addEventListener('change', applyFilters));
    // sort select
    const sortEl = document.getElementById('sort-select'); if(sortEl) sortEl.addEventListener('change', applyFilters);
}

  // expose
  window.STORAGE_KEYS = STORAGE_KEYS; 
  window.DB = DB; 
  window.UI = UI; 
  window.DECANT_PRICES = DECANT_PRICES;
  window.renderGlobalGrids = renderGlobalGrids; 
  window.applyFilters = applyFilters; 
  window.bindShopFilters = bindShopFilters; 
  window.renderProductDetail = renderProductDetail;
  window.getSelectedSize = getSelectedSize;
  window.getSizeLabel = getSizeLabel;
  window.getSizePrice = getSizePrice;

})();

// Global functions (outside IIFE)
window.increaseQuantity = function(){ 
  const q=document.getElementById('quantity'); 
  if(!q) return; 
  let v=parseInt(q.value||'1',10)||1; 
  v++; 
  const id=(new URLSearchParams(window.location.search)).get('id'); 
  if(id && window.DB){ 
    const p=window.DB.getProductById(id); 
    if(p && p.stock!=null) v=Math.min(v,p.stock); 
  } 
  q.value=v; 
};

window.decreaseQuantity = function(){ 
  const q=document.getElementById('quantity'); 
  if(!q) return; 
  let v=parseInt(q.value||'1',10)||1; 
  v=Math.max(1,v-1); 
  q.value=v; 
};

window.addToCart = function(idArg){ 
  const pid = idArg || (new URLSearchParams(window.location.search)).get('id'); 
  if(!pid) return; 
  const p = window.DB ? window.DB.getProductById(pid) : null; 
  if(!p){ 
    alert('Producto no encontrado.'); 
    return; 
  } 
  
  const q = document.getElementById('quantity'); 
  const qty = parseInt(q && q.value ? q.value : 1, 10) || 1;
  
  // Obtener el tamaño seleccionado
  const selectedSize = window.getSelectedSize ? window.getSelectedSize() : 'botella-completa';
  const sizeLabel = window.getSizeLabel ? window.getSizeLabel(selectedSize) : selectedSize;
  const size = sizeLabel; // Use the label for cart display
  
  // Obtener el precio correcto según el tamaño seleccionado
  const price = window.getSizePrice ? window.getSizePrice(selectedSize, p) : (p.price50ml || 0);
  
  if(window.Cart && typeof window.Cart.addItem === 'function'){ 
    window.Cart.addItem(p.id, size, qty); 
  } else if(window.DB){ 
    const cart = window.DB.read(CART_STORAGE_KEY) || []; 
    
    // Verificar si el producto con el mismo tamaño ya existe
    const existingIndex = cart.findIndex(item => String(item.id) === String(p.id) && item.size === size);
    
    if (existingIndex > -1) {
      // Actualizar cantidad si ya existe
      cart[existingIndex].quantity += qty;
    } else {
      // Agregar nuevo item
      cart.push({ 
        id: p.id, 
        name: p.name, 
        price: price,
        size: size, 
        quantity: qty, 
        image: p.image 
      });
    }
    
    window.DB.write(CART_STORAGE_KEY, cart); 
    try{ 
      document.dispatchEvent(new CustomEvent('cartUpdated', {
        detail: {
          items: cart.reduce((s, it) => s + (it.quantity || 0), 0), 
          total: cart.reduce((s, it) => s + (it.price || 0) * (it.quantity || 0), 0)
        }
      })); 
    } catch(e){} 
  }
  alert('¡' + p.name + ' (' + size + ') añadido al carrito!'); 
};

// =========================================================
// CORRECCIÓN CRÍTICA AQUÍ ABAJO
// =========================================================
window.addEventListener('load', function(){ 
  try{ if(window.DB && typeof window.DB.init==='function') window.DB.init(); }catch(e){} 
  try{ if(typeof window.updateCartBadge==='function') window.updateCartBadge(); }catch(e){} 

  // SOLO ejecutar el renderizado de product.js si NO estamos en la tienda
  const isShopPage = window.location.pathname.includes('shop.html');
  if (!isShopPage) {
      try{ 
          if(document.querySelector('.product-grid-dynamic')) { 
              if(typeof window.applyFilters==='function') window.applyFilters(); 
              else window.renderGlobalGrids && window.renderGlobalGrids(); 
          } 
      }catch(e){} 
  }

  try{ window.bindShopFilters && window.bindShopFilters(); }catch(e){} 
  try{ window.renderProductDetail && window.renderProductDetail(); }catch(e){} 
});