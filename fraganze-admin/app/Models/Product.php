<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * Los atributos que se pueden asignar masivamente.
     * Esto permite que Filament y tus controladores guarden datos.
     */
    protected $fillable = [
        'title',
        'slug',
        'description',
        'category',
        'type',
        'price',
        'sale_price',
        'stock',
        'image_url',
        'is_active'
    ];

    /**
     * Conversión de tipos automática.
     * Garantiza que los precios sean decimales y el stock entero.
     */
    protected $casts = [
        'is_active' => 'boolean',
        'price' => 'decimal:2',
        'sale_price' => 'decimal:2',
        'stock' => 'integer',
    ];

    /**
     * ACCESSOR PARA LA IMAGEN (MAGIA)
     * Cuando en tu HTML pongas $product->image, Laravel ejecutará esto.
     * Prioridad: 
     * 1. Imagen subida en Storage (Filament)
     * 2. Imagen estática en public/images (por si acaso)
     */
    public function getImageAttribute()
    {
        if ($this->image_url) {
            // Verifica si la URL es externa o local de Filament
            return str_contains($this->image_url, 'http') 
                ? $this->image_url 
                : asset('storage/' . $this->image_url);
        }

        // Placeholder por defecto si no hay imagen
        return asset('images/product-item1.jpg');
    }

    /**
     * SCOPE PARA PRODUCTOS ACTIVOS
     * Permite hacer: Product::active()->get();
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}