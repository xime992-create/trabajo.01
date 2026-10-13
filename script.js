// 1. Array de objetos con la base de datos de productos simulada
const productos = [ // al ser const los datos no van a cambiar en cada proceso.
    { id: 1, nombre: "Chocolate Maraná", precio: 23 }, //los id son únicos.
    { id: 2, nombre: "Chocolate Cacaosuyo", precio: 22.50 }, // simula una bd.
    { id: 3, nombre: "Chocolate La Ibérica", precio: 31 },
    { id: 4, nombre: "Chocolate Bakáu", precio: 18 },
    { id: 5, nombre: "Chocolate Pumatiy", precio: 14 },
    { id: 6, nombre: "Chocolate Kuyay", precio: 22 },
    { id: 7, nombre: "Chocolate Quma", precio: 24 },
    { id: 8, nombre: "Chocolate Amedei Toscana", precio: 35 },
    { id: 9, nombre: "Chocolate La Maison du Chocolat", precio: 70 },
    { id: 10, nombre: "Chocolate Domori", precio: 40 },
    { id: 11, nombre: "Chocolate Valrhona", precio: 50 },
    { id: 12, nombre: "Chocolate To'ak", precio: 65 },
    { id: 13, nombre: "Chocolate Teuscher", precio: 85 },
    { id: 14, nombre: "Chocolate Ferrero Rocher", precio: 20 },
    { id: 15, nombre: "Chocolate Michel Cluizel", precio: 90 },
    { id: 16, nombre: "Chocolate Patchi", precio: 69 },
    { id: 17, nombre: "Chocolate Lotte Ghana", precio: 40 },
    { id: 18, nombre: "Chocolate Hershey", precio: 35 },
    { id: 19, nombre: "Chocolate Pierre Marcolini", precio: 75 },
    { id: 20, nombre: "Chocolate Bonnat", precio: 55 }
];

// 2. Estado inicial del carrito de compras (empieza vacío)
let carrito = []; // creación del array vacío.

// 3. Referencias a los elementos del DOM HTML - para la manipulación de los objetos
const productosLista = document.getElementById("productos-lista"); // busca elelemento por su ID
const carritoElementos = document.getElementById("carrito-elementos"); // se guardan todos en variable
const carritoTotal = document.getElementById("carrito-total");
const btnVaciar = document.getElementById("btn-vaciar");

// 4. FUNCIÓN: Mostrar los productos en la tienda
function renderizarProductos()
{
    const tarjetas = productosLista.querySelectorAll(".tarj-prod");

    productos.forEach((producto, index) =>
    {
        const tarjeta = tarjetas[index];
        const botonComprar = tarjeta && Array.from(tarjeta.querySelectorAll("button"))
            .find(boton => boton.textContent.trim().startsWith("Comprar"));

        if (!botonComprar) {
            throw new Error(`No se encontró el botón de compra del producto ${producto.nombre}.`);
        }

        botonComprar.onclick = () => agregarAlCarrito(producto.id);
    });
}

// 5. FUNCIÓN: Agregar un producto al carrito
function agregarAlCarrito(idProducto)
{
    // Buscamos si el producto ya existe previamente dentro del carrito
    const productoEnCarrito = carrito.find(item => item.id === idProducto); // devuelve el primer elemento que cumple la condición

    if (productoEnCarrito)
    {
        // Caso A: Si ya existe, aumentamos su propiedad 'cantidad'
        productoEnCarrito.cantidad++;
    }
    else
    {
        // Caso B: Si no existe, buscamos el producto original en la tienda
        const productoOriginal = productos.find(p => p.id === idProducto);
        // Lo insertamos agregando la propiedad 'cantidad' inicializada en 1
        carrito.push // hace que se registre en el carrito.
        ({
            ...productoOriginal, // operador spreead, copia todas las propiedades.
            cantidad: 1
        });
    }
    // Refrescamos visualmente los cambios en pantalla
    actualizarInterfazCarrito();
}

// 6. FUNCIÓN: Aumentar o disminuir la cantidad (+1 / -1) de un item en el carrito
function cambiarCantidad(idProducto, cambio)
{
    const producto = carrito.find(item => item.id === idProducto);
    
    if (producto)
    {
        producto.cantidad += cambio;
        // Validación pedagógica: Si la cantidad cae a cero o menos, se remueve automáticamente
        if (producto.cantidad <= 0)
        {
            eliminarDelCarrito(idProducto);
            return;
        }
    }
    actualizarInterfazCarrito();
}

// 7. FUNCIÓN: Eliminar por completo un elemento del carrito de compras
function eliminarDelCarrito(idProducto)
{
    // Filtramos el array, conservando únicamente los elementos que NO tengan el ID seleccionado
    carrito = carrito.filter(item => item.id !== idProducto);
    actualizarInterfazCarrito();
}

// 8. FUNCIÓN: Vaciar por completo el array del carrito
btnVaciar.addEventListener("click", () =>
{
    carrito = []; // Reestablece el arreglo a vacío
    actualizarInterfazCarrito();
});

// 9. FUNCIÓN REDRAW: Limpia la interfaz del carrito, la dibuja de nuevo y recalcula totales
function actualizarInterfazCarrito()
{
    // Borramos el contenido viejo para evitar duplicados en bucle
    carritoElementos.innerHTML = "";

    // Si el carrito no tiene elementos, mostramos un mensaje por defecto y terminamos la ejecución
    if (carrito.length === 0)
    {
        carritoElementos.innerHTML = "<p style='text-align:center; color:#7f8c8d;'>El carrito está vacío</p>";
        carritoTotal.innerText = "0.00";
        return;
    }

    let cuentaTotal = 0;

    // Recorremos los elementos activos en el carrito
    carrito.forEach(item =>
    {
        const subtotal = item.precio * item.cantidad;
        cuentaTotal += subtotal; // Sumamos al acumulador general

        const itemDiv = document.createElement("div");
        itemDiv.classList.add("item-carrito");

        itemDiv.innerHTML = `
            <div class="item-detalles">
                <h4>${item.nombre}</h4>
                <p style="font-size:12px; color:#7f8c8d;">$${item.precio} c/u</p>
            </div>
            <div>
                <!-- Botón de decremento (-1) -->
                <button class="btn-cantidad" onclick="cambiarCantidad(${item.id}, -1)">-</button>
                <span>${item.cantidad}</span>
                <!-- Botón de incremento (+1) -->
                <button class="btn-cantidad" onclick="cambiarCantidad(${item.id}, 1)">+</button>
                <!-- Botón de remoción directa -->
                <button class="btn-eliminar" onclick="eliminarDelCarrito(${item.id})">Eliminar</button>
            </div>
        `;

        carritoElementos.appendChild(itemDiv);
    });

    // Actualizamos la etiqueta del total formateando a dos decimales (.toFixed)
    carritoTotal.innerText = cuentaTotal.toFixed(2);
}

// --- APERTURA DE LA TIENDA ---
// Al terminar de leer el script, se disparan las funciones base
renderizarProductos();
actualizarInterfazCarrito();
