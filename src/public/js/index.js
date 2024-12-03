const socket = io()

const title = document.getElementById("nombreProducto");
const price = document.getElementById("precioProducto");
const description = document.getElementById("descripcionProducto");
const submit = document.getElementById("submit");
const list = document.getElementById("listado");

submit.addEventListener("click", e=>{
    if(e){
        if (title.value.length == 0 || price.value.length == 0 || description.value.length == 0) {
            alert("por favor completar todos los campos")
        }else{        
            socket.emit("mensaje", {
            title: title.value,
            price: price.value,
            description: description.value
        })
        formulario.reset()}

    }
})

socket.on("productos" , data=>{
    let productos = ""
    data.productos.forEach((producto) => {
        productos += `
            <div class="card">
            <div class="card-body">
            <h5 class="card-title">Producto: </h5>
            <p class="card-text">${producto.title}</p>
            <h5 class="card-title">Precio: </h5>
            <p class="card-text">$${producto.price}</p>
            <h5 class="card-title">Descripción de producto: </h5>
            <p class="card-text">${producto.description}</p>
            </div>
            </div>
            `
    });

    list.innerHTML = productos
})

socket.on("productosAct" , data=> {
    let productos = ""
    console.log(data)
    data.productos.forEach(producto => {
        productos += `
            <div class="card">
            <div class="card-body">
            <h5 class="card-title">${producto.title}</h5>
            <p class="card-text">$${producto.price}</p>
            <p class="card-text">${producto.description}</p>
            </div>
            </div>`
    });
    list.innerHTML = 
    list.innerHTML = productos
})
