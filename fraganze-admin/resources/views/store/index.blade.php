<!DOCTYPE html>
<html lang="es">
<head>
    <title>Tienda - Fraganze</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" type="text/css" href="{{ asset('css/vendor.css') }}">
    <link rel="stylesheet" type="text/css" href="{{ asset('style.css') }}">
    <link href="https://fonts.googleapis.com/css2?family=Josefin+Sans:wght@300;400;600&family=Jost:wght@300;400&display=swap" rel="stylesheet">
</head>
<body>
    <header class="py-3 border-bottom bg-white">
        <div class="container d-flex justify-content-between align-items-center">
            <a href="/" class="text-decoration-none text-dark h3 mb-0 fw-bold">FRAGANZE</a>
            <a href="/admin" class="btn btn-outline-secondary btn-sm">Panel Admin</a>
        </div>
    </header>

    <div class="container py-5">
        <div class="row">
            <div class="col-12 text-center mb-5">
                <h1 class="display-5 fw-light text-uppercase">Nuestra Colección</h1>
                <div class="border-bottom w-25 mx-auto"></div>
            </div>

            @forelse($products as $product)
                <div class="col-md-4 mb-5">
                    <div class="product-card text-center shadow-sm p-3 bg-white h-100">
                        <div class="image-holder mb-3">
                            <a href="{{ route('store.show', $product->slug) }}">
                                <img src="{{ $product->image }}" alt="{{ $product->title }}" class="img-fluid" style="height: 300px; object-fit: contain;">
                            </a>
                        </div>
                        <div class="product-detail">
                            <h3 class="fs-5 fw-bold text-uppercase mb-2">
                                <a href="{{ route('store.show', $product->slug) }}" class="text-decoration-none text-dark">{{ $product->title }}</a>
                            </h3>
                            <p class="text-muted small mb-3">{{ $product->category }}</p>
                            <div class="price mb-3">
                                @if($product->sale_price)
                                    <span class="text-muted text-decoration-line-through me-2">${{ $product->price }}</span>
                                    <span class="text-secondary fs-4">${{ $product->sale_price }}</span>
                                @else
                                    <span class="text-secondary fs-4">${{ $product->price }}</span>
                                @endif
                            </div>
                            <a href="{{ route('store.show', $product->slug) }}" class="btn btn-dark rounded-0 w-100">VER DETALLES</a>
                        </div>
                    </div>
                </div>
            @empty
                <div class="col-12 text-center py-5">
                    <p class="lead">No hay productos disponibles en este momento.</p>
                </div>
            @endforelse
        </div>
    </div>

    <footer class="bg-light py-4 text-center border-top">
        <p class="mb-0 text-muted">© 2025 Fraganze Admin System</p>
    </footer>

    <script src="{{ asset('js/jquery.min.js') }}"></script>
    <script src="{{ asset('js/script.js') }}"></script>
</body>
</html>