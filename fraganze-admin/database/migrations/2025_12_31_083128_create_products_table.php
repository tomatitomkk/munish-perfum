<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();

            // Datos principales
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('description')->nullable();

            // Clasificación
            $table->string('category', 50)->nullable()->index();
            $table->string('type', 50)->nullable()->index();

            // Precios / inventario
            $table->decimal('price', 10, 2)->default(0);
            $table->decimal('sale_price', 10, 2)->nullable();
            $table->unsignedInteger('stock')->default(0);

            // Media / estado
            $table->string('image_url', 2048)->nullable();
            $table->boolean('is_active')->default(true)->index();

            // Soft deletes
            $table->softDeletes();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
