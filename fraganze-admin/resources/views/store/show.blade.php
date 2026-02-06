<!DOCTYPE html>
<html lang="es">
<head>
    <title>{{ $product->title }} - Fraganze</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" type="text/css" href="{{ asset('style.css') }}">
</head>
<body class="bg-light">
    <div class="container py-5">
        <div class="row bg-white shadow-sm p-4 rounded">
            <div class="col-md-6 text-center">
                <img src="{{ $product->image }}" class="img-fluid" style="max-height: 500px;" alt="{{ $product->title }}">
            </div>
            <div class="col-md-6">
                <nav aria-label="breadcrumb">
                    <ol class="breadcrumb">
                        <li class="breadcrumb-item"><a href="/">Tienda</a></li>
                        <li class="breadcrumb-item active">{{ $product->title }}</li>
                    </ol>
                </nav>
                <h1 class="display-4 fw-bold text-uppercase">{{ $product->title }}</h1>
                <p class="badge bg-secondary mb-4">{{ $product->category }}</p>
                
                <div class="price-section mb-4">
                    @if($product->sale_price)
                        <h2 class="text-secondary">${{ $product->sale_price }} <small class="text-muted text-decoration-line-through">${{ $product->price }}</small></h2>
                    @else
                        <h2 class="text-secondary">${{ $product->price }}</h2>
                    @endif
                </div>

                <p class="lead text-muted mb-5">{{ $product->description }}</p>
                
                <div class="d-grid gap-2">
                    <button class="btn btn-dark btn-lg rounded-0">AGREGAR AL CARRITO</button>
                    <p class="text-muted small mt-2">Stock disponible: {{ $product->stock }} unidades</p>
                </div>
            </div>
        </div>
    </div>
</body>
</html>