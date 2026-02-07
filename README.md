# 🌺 Munish Perfum - E-commerce de Fragancias

> Tienda online de perfumes premium con sistema de decants y compra flexible

[![GitHub Pages](https://img.shields.io/badge/hosted%20on-GitHub%20Pages-blue)](https://tomatitomkk.github.io/munish-perfum/)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

---

## 🚀 **Demo en Vivo**

🌐 **[Ver Tienda en Vivo](https://tomatitomkk.github.io/munish-perfum/)**

---

## ✨ **Características**

- 📱 **Diseño Responsive** - Perfecto en móvil, tablet y desktop
- 🛍️ **Carrito de Compras** - Con localStorage, persiste entre sesiones
- 🎯 **Filtrado Avanzado** - Por género, familia olfativa, precio y nombre
- 📦 **Sistema de Decants** - Opciones de 2ml, 3ml, 5ml, 10ml + botella completa
- 💳 **Checkout Integrado** - Con SINPE Móvil y WhatsApp
- 🔍 **Búsqueda en Tiempo Real** - Encuentra productos instantáneamente
- 📊 **Gestión de Inventario** - Sistema de productos dinámico en `js/products.js`
- 🎨 **UI Moderna** - Diseño limpio con Bootstrap 5

---

## 📚 **Estructura del Proyecto**

```
munish-perfum/
├── index.html              # Página principal
├── shop.html               # Catálogo de productos
├── single-product.html     # Detalles de producto
├── cart.html               # Carrito de compras
├── checkout.html           # Proceso de pago
├── tracking.html           # Seguimiento de pedidos
├── css/
│   ├── vendor.css          # Librerías CSS
│   └── mobile-responsive.css
├── js/
│   ├── products.js         # ⭐ BASE DE DATOS de productos
│   ├── shop.js             # Lógica de tienda y filtros
│   ├── product.js          # Lógica de producto individual
│   ├── cart.js             # Lógica del carrito
│   └── script.js           # Funciones globales
├── images/                 # Imágenes de productos
└── style.css               # Estilos principales
```

---

## 🛠️ **Cómo Agregar Productos**

Edita el archivo **`js/products.js`**:

```javascript
window.PRODUCTS = [
  {
    id: 'nuevo-producto',
    name: 'Nombre del Perfume',
    brand: 'Marca',
    genero: 'Hombre',  // Hombre, Mujer, Unisex
    familia_olfativa: 'Oriental Amaderado',
    descripcion: 'Descripción del producto...',
    image: 'images/producto.jpg',
    price50ml: 15000,
    full_bottle_price: 45000,
    decant_prices: {
      '2ml': 1200,
      '3ml': 1600,
      '5ml': 2100,
      '10ml': 4000
    }
  },
  // ... más productos
];
```

**Ver documentación completa:** [TIENDA_GUIA_RAPIDA.md](TIENDA_GUIA_RAPIDA.md)

---

## 🔧 **Instalación Local**

### **Opción 1: Servidor Local Sencillo**
```bash
# Si tienes Python 3
python -m http.server 8000

# Si tienes Node.js
npx serve .

# Si tienes PHP
php -S localhost:8000
```

Luego abre: `http://localhost:8000`

### **Opción 2: Live Server (VS Code)**
1. Instala la extensión "Live Server"
2. Click derecho en `index.html` → "Open with Live Server"

---

## 🚀 **Deployment en GitHub Pages**

### **1. Configurar GitHub Pages:**
1. Ve a **Settings** → **Pages**
2. En **Source**, selecciona:
   - Branch: `main`
   - Folder: `/ (root)`
3. Guarda los cambios

### **2. Tu sitio estará en:**
```
https://tomatitomkk.github.io/munish-perfum/
```

### **3. Actualizaciones Automáticas:**
Cada vez que hagas `git push` a la rama `main`, GitHub Pages actualizará tu sitio automáticamente (toma ~1-2 minutos).

---

## 🌐 **Dominio Personalizado (Opcional)**

Si quieres usar tu propio dominio (ej: `www.munishperfum.com`):

### **1. Crear archivo CNAME:**
```bash
echo "www.munishperfum.com" > CNAME
git add CNAME
git commit -m "Add custom domain"
git push
```

### **2. Configurar DNS:**
En tu proveedor de dominio (Namecheap, GoDaddy, etc.), agrega estos registros:

```
Tipo    Nombre    Valor
CNAME   www       tomatitomkk.github.io
A       @         185.199.108.153
A       @         185.199.109.153
A       @         185.199.110.153
A       @         185.199.111.153
```

### **3. En GitHub Settings → Pages:**
- Ingresa tu dominio personalizado
- Espera validación DNS (~24 horas)
- Activa "Enforce HTTPS"

---

## ⚡ **Optimización y Buenas Prácticas**

### **🖼️ Imágenes:**
- **Formato recomendado:** WebP o JPEG optimizado
- **Peso máximo:** 200KB por imagen
- **Dimensiones:** 800x800px para productos
- **Herramientas:** [TinyPNG](https://tinypng.com), [Squoosh](https://squoosh.app)

### **📦 Tamaño del Repositorio:**
- **Límite GitHub Pages:** 1GB
- **Recomendado:** < 500MB
- **Tip:** Usar servicios externos para videos/archivos grandes

### **🔒 Seguridad:**
⚠️ **NUNCA subir a Git:**
- Archivos `.env`
- Credenciales de APIs
- Bases de datos reales
- Información de clientes

---

## 📝 **Documentación Técnica**

- 📄 [Guía Rápida de la Tienda](TIENDA_GUIA_RAPIDA.md)
- 🔧 [Sistema de Variaciones (Decants)](SISTEMA_VARIACIONES.md)
- 🏪 [Sistema de Tienda Dinámica](SISTEMA_TIENDA_DINAMICA.md)

---

## 💬 **Soporte**

📧 **Email:** munishperfum@gmail.com  
📱 **WhatsApp:** +506 8445 3904  
👤 **GitHub:** [@tomatitomkk](https://github.com/tomatitomkk)

---

## 📜 **Licencia**

MIT License - Libre para uso personal y comercial

---

## ⭐ **Créditos**

Desarrollado con ❤️ para Munish Perfum  
© 2026 - Todos los derechos reservados

---

**🚀 ¡Feliz venta de perfumes!**