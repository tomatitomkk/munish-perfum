<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\StoreController;

// Al entrar a la raíz, vemos la tienda
Route::get('/', [StoreController::class, 'index']);

// Ruta opcional /tienda
Route::get('/tienda', [StoreController::class, 'index'])->name('store.index');

// Detalle del producto
Route::get('/producto/{slug}', [StoreController::class, 'show'])->name('store.show');