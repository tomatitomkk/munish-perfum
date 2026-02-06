# Script para actualizar shop.html con los nuevos filtros

$filePath = 'shop.html'
$content = [System.IO.File]::ReadAllText($filePath, [System.Text.Encoding]::UTF8)

# Reemplazar sección Categorías con Género
$oldCategories = @"
                        <!-- Categorías -->
                        <div class="filter-group">
                            <label>Categoría</label>
                            <div class="form-check">
                                <input class="form-check-input filter-category" type="checkbox" id="cat1" value="todos" checked>
                                <label class="form-check-label" for="cat1">Todos</label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input filter-category" type="checkbox" id="cat2" value="floral">
                                <label class="form-check-label" for="cat2">Floral</label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input filter-category" type="checkbox" id="cat3" value="wood">
                                <label class="form-check-label" for="cat3">Amaderada</label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input filter-category" type="checkbox" id="cat4" value="fresh">
                                <label class="form-check-label" for="cat4">Fresco</label>
                            </div>
                        </div>
"@

$newGenero = @"
                        <!-- Género -->
                        <div class="filter-group">
                            <label>Género</label>
                            <div class="form-check">
                                <input class="form-check-input filter-gender" type="checkbox" id="gen1" value="Hombre">
                                <label class="form-check-label" for="gen1">Hombre</label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input filter-gender" type="checkbox" id="gen2" value="Mujer">
                                <label class="form-check-label" for="gen2">Mujer</label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input filter-gender" type="checkbox" id="gen3" value="Unisex">
                                <label class="form-check-label" for="gen3">Unisex</label>
                            </div>
                        </div>
"@

$content = $content -replace [regex]::Escape($oldCategories), $newGenero

# Reemplazar sección Tipo con Familia Olfativa
$oldTipo = @"
                        <!-- Tipo -->
                        <div class="filter-group">
                            <label>Tipo de Fragancia</label>
                            <div class="form-check">
                                <input class="form-check-input filter-type" type="checkbox" id="type1" value="floral">
                                <label class="form-check-label" for="type1">Floral</label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input filter-type" type="checkbox" id="type2" value="wood">
                                <label class="form-check-label" for="type2">Amaderada</label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input filter-type" type="checkbox" id="type3" value="fresh">
                                <label class="form-check-label" for="type3">Cítrica</label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input filter-type" type="checkbox" id="type4" value="oriental">
                                <label class="form-check-label" for="type4">Oriental</label>
                            </div>
                        </div>
"@

$newFamilia = @"
                        <!-- Familia Olfativa -->
                        <div class="filter-group">
                            <label>Familia Olfativa</label>
                            <div class="form-check">
                                <input class="form-check-input filter-family" type="checkbox" id="fam1" value="Floral Frutal">
                                <label class="form-check-label" for="fam1">Floral Frutal</label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input filter-family" type="checkbox" id="fam2" value="Oriental Amaderado">
                                <label class="form-check-label" for="fam2">Oriental Amaderado</label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input filter-family" type="checkbox" id="fam3" value="Acuático Aromático">
                                <label class="form-check-label" for="fam3">Acuático Aromático</label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input filter-family" type="checkbox" id="fam4" value="Aromático Especiado">
                                <label class="form-check-label" for="fam4">Aromático Especiado</label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input filter-family" type="checkbox" id="fam5" value="Floral Frutal Gourmand">
                                <label class="form-check-label" for="fam5">Floral Frutal Gourmand</label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input filter-family" type="checkbox" id="fam6" value="Oriental Frutal">
                                <label class="form-check-label" for="fam6">Oriental Frutal</label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input filter-family" type="checkbox" id="fam7" value="Oriental Gourmand">
                                <label class="form-check-label" for="fam7">Oriental Gourmand</label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input filter-family" type="checkbox" id="fam8" value="Oriental Floral">
                                <label class="form-check-label" for="fam8">Oriental Floral</label>
                            </div>
                        </div>
"@

$content = $content -replace [regex]::Escape($oldTipo), $newFamilia

# Reemplazar selector de ordenamiento
$oldSort = @"
                        <select id="sort-select">
                            <option>Ordenar por popularidad</option>
                            <option>Ordenar por precio: bajo a alto</option>
                            <option>Ordenar por precio: alto a bajo</option>
                            <option>Ordenar por más recientes</option>
                        </select>
"@

$newSort = @"
                        <select id="sort-select">
                            <option value="popularidad">Ordenar por popularidad</option>
                            <option value="precio-ascendente">Ordenar por precio: bajo a alto</option>
                            <option value="precio-descendente">Ordenar por precio: alto a bajo</option>
                            <option value="alfabetico">Ordenar alfabéticamente</option>
                        </select>
"@

$content = $content -replace [regex]::Escape($oldSort), $newSort

# Agregar scripts (products.js y shop.js)
$oldScripts = @"
    <!-- Orden: 1. jquery, 2. plugins (AOS/Swiper), 3. inventory (origen datos), 4. product (motor), 5. script (efectos) -->
    <script src="js/jquery.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/js/bootstrap.bundle.min.js"></script>
    <script src="js/plugins.js"></script>
    <script src="js/inventory.js"></script>
    <script src="js/cart.js"></script>
    <script src="js/product.js"></script>
    <script src="js/script.js"></script>
"@

$newScripts = @"
    <!-- Orden: 1. jquery, 2. plugins, 3. inventory, 4. products DB, 5. cart, 6. product, 7. shop (dinámico), 8. script -->
    <script src="js/jquery.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/js/bootstrap.bundle.min.js"></script>
    <script src="js/plugins.js"></script>
    <script src="js/inventory.js"></script>
    <script src="js/products.js"></script>
    <script src="js/cart.js"></script>
    <script src="js/product.js"></script>
    <script src="js/shop.js"></script>
    <script src="js/script.js"></script>
"@

$content = $content -replace [regex]::Escape($oldScripts), $newScripts

# Guardar archivo
[System.IO.File]::WriteAllText($filePath, $content, [System.Text.Encoding]::UTF8)

Write-Host "✅ shop.html actualizado exitosamente!"
Write-Host "   ✓ Filtros de Género activados"
Write-Host "   ✓ Familia Olfativa configurada"
Write-Host "   ✓ Ordenamiento mejorado"
Write-Host "   ✓ Scripts agregados (products.js, shop.js)"
