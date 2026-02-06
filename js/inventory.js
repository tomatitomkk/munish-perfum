/* INVENTORY.JS - La base de datos de Fraganze
   Aquí controlas TODO lo que se ve en la web.
*/

const INVENTORY_SEED = [
    {
        id: "1",
        name: "Aura Bloom Premium",
        category: "floral",
        type: "Eau de Parfum",
        brand: "Fraganze Premium",
        price50ml: 85,
        price100ml: 125,
        stock: 12,
        image: "images/product-item1.jpg",
        description: "Una esencia celestial que evoca jardines primaverales en flor.",
        longDescription: "Aura Bloom es nuestra fragancia insignia. Combina notas altas de bergamota con un corazón de jazmín blanco y un fondo sutil de vainilla. Perfecta para quienes buscan frescura y elegancia duradera.",
        rating: 5,
        featured: true,
        tag: "Nuevo"
    },
    {
        id: "2",
        name: "Sándalo Esencial",
        category: "wood",
        type: "Eau de Toilette",
        brand: "Dark Collection",
        price50ml: 40,
        price100ml: 65,
        stock: 8,
        image: "images/product-item2.jpg",
        description: "Madera cálida y acogedora para el día a día.",
        longDescription: "Una fragancia amaderada accesible. Notas de sándalo y cedro con un toque suave de vainilla. Ideal para probar el filtro de precio mínimo.",
        rating: 4,
        featured: false,
        tag: "Sale"
    },
    {
        id: "3",
        name: "Ocean Breeze Elite",
        category: "fresh",
        type: "Eau de Parfum",
        brand: "Fresh Series",
        price50ml: 200,
        price100ml: 280,
        stock: 15,
        image: "images/product-item3.jpg",
        description: "Frescura premium de larga duración.",
        longDescription: "Nuestra fragancia fresca más exclusiva. Notas cítricas y marinas de alta concentración. Perfecta para verificar el filtro de precio máximo.",
        rating: 5,
        featured: true,
        tag: "Hot"
    },
    {
        id: "4",
        name: "Mística Oriental",
        category: "oriental",
        type: "Eau de Parfum",
        brand: "Fraganze Premium",
        price50ml: 95,
        price100ml: 140,
        stock: 10,
        image: "images/product-item1.jpg",
        description: "Especias y ámbar en una composición envolvente.",
        longDescription: "Mística Oriental combina cardamomo, ámbar y vainilla en un bouquet oriental. Diseñada para quienes buscan presencia y calidez.",
        rating: 5,
        featured: true,
        tag: ""
    },
    {
        id: "5",
        name: "Ámbar Nocturno",
        category: "oriental",
        type: "Extracto de Perfume",
        brand: "Dark Collection",
        price50ml: 110,
        price100ml: 160,
        stock: 6,
        image: "images/product-item2.jpg",
        description: "Oriental intenso con notas de ámbar y cuero.",
        longDescription: "Ámbar Nocturno es la segunda fragancia oriental de la colección. Más intensa que Mística Oriental, con un fondo de cuero y tabaco. Ideal para comparar búsquedas por categoría oriental.",
        rating: 4,
        featured: false,
        tag: ""
    },
    {
        id: "6",
        name: "Velvet Rose",
        category: "floral",
        type: "Eau de Parfum",
        brand: "Fraganze Premium",
        price50ml: 90,
        price100ml: 130,
        stock: 0,
        image: "images/product-item1.jpg",
        description: "Rosa y peonía en una fragancia aterciopelada.",
        longDescription: "Velvet Rose ofrece una explosión de rosas y peonías con fondo de musk blanco. Producto con stock cero para probar el comportamiento en página de detalle cuando no hay existencias.",
        rating: 5,
        featured: false,
        tag: ""
    },
    {
        id: "7",
        name: "Citrus Blast",
        category: "fresh",
        type: "Eau de Toilette",
        brand: "Fresh Series",
        price50ml: 55,
        price100ml: 85,
        stock: 22,
        image: "images/product-item2.jpg",
        description: "Explosión cítrica de limón, bergamota y pomelo.",
        longDescription: "La opción fresca más vibrante. Notas de salida muy cítricas que evolucionan hacia un corazón verde y limpio. Dos variantes de precio para pruebas.",
        rating: 4,
        featured: true,
        tag: ""
    },
    {
        id: "8",
        name: "Midnight Musk",
        category: "wood",
        type: "Extracto de Perfume",
        brand: "Dark Collection",
        price50ml: 98,
        price100ml: 148,
        stock: 5,
        image: "images/product-item1.jpg",
        description: "Intenso, misterioso y profundamente cautivador.",
        longDescription: "Diseñado para la noche. Sus notas de sándalo y almizcle se entrelazan con toques de especias exóticas. Variantes 50ml y 100ml con precios distintos.",
        rating: 4,
        featured: false,
        tag: ""
    }
];

// Lógica de ayuda para encontrar productos
const Inventory = {
    getAll: () => INVENTORY_SEED,
    getById: (id) => INVENTORY_SEED.find(p => p.id === String(id)),
    getFeatured: () => INVENTORY_SEED.filter(p => p.featured)
};