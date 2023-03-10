
window.addEventListener('scroll', function() {
    let nav = document.querySelector('nav');
    let navContact = document.querySelector('.nav-contacto');  
    let navHeight = nav.offsetHeight;
    let scrollPosition = window.scrollY;

    // si se escrolleo mas de 300px
    let botonVolverArriba = document.querySelector('.volver-arriba');
    if (scrollPosition > 1) {
        nav.classList.add('nav--scrolled');
        navContact.classList.add('nav-contacto--scrolled');
        botonVolverArriba.classList.remove('d-none');
    } else {
        nav.classList.remove('nav--scrolled');
        navContact.classList.remove('nav-contacto--scrolled');
        botonVolverArriba.classList.add('d-none');
    }
});

function showFourProducts() {
    let category = document.querySelector('#inputGroupSelect01').value;
    
    if (category != 'todos') {
        category = '.' + category;
    }else{
        category = '.product';
    }

    let productos = document.querySelectorAll(category);
    let i = 0;
    productos.forEach(producto => {
        if (i < 4) {
            if (producto.classList.contains('d-none')) {
                producto.classList.remove('d-none');
                i++;
            }
        }
    });
}

// cuando carga la pagina el valor del select con id "inputGroupSelect01" es "todos"
let select = document.querySelector('#inputGroupSelect01');
let productos = document.querySelectorAll('.product');

select.addEventListener('change', function() {
    let productos = document.querySelectorAll('.product'); 
    productos.forEach(producto => {
        producto.classList.add('d-none');
    });
    showFourProducts(select.value);
});


const loadProducts = async () => {
    const products = []

    fetch("http://localhost:8000/api/v1/products", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        })
        .then(response => response.json())
        .then(data => {
            data.forEach(product => {
                products.push(product)
            });
        }
    )
    .catch(error => console.log(error))
    .finally(() => {
        const productsContainer = document.querySelector('#products');
        products.forEach(product => {
            let productDiv = document.createElement('div');
            productDiv.innerHTML = `
            <div class="col-12 col-md-6 col-lg-2 ms-4 me-4  mt-5 ms-5 product ${product.category}  d-none" style="width:15em;">
                <div class="product-card" >
                    <img src="public/products/${product.name}.png" width="100em" height="100em"  alt="...">
                    <div class="card-body" style="width:15em;">
                      <h5 class="card-title" style="text-align:left ;">${product.name}</h5>
                        <p class="card-text ">${product.description}</p>
                        <p class="card-text ">$${product.price}</p>
                        
                        <button class="btn btn-dark ms-5" onclick="addToCart(${product.id})">Comprar</button>
                    </div
                </div>
            </div>
            `;
            productsContainer.appendChild(productDiv);
        });
        showFourProducts();

})
}
loadProducts();


function loadCardAnimation() {
    let card = document.querySelector('.card');
    card.classList.add('animate__animated', 'animate__fadeInDown');
}




function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
    while (c.charAt(0) == ' ') {
        c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
    }
  }
    return "";
}

// funcion para actualizar el icono del carrito
function updateCartIcon() {
    let cartCounter = document.querySelector('#cart-badge-count');
    let cartCounterIcon = document.querySelector('#cart-badge');
    let cart = getCookie("cart");
    if (cart == "") {
        cart = [];
    }
    else {
        cart = JSON.parse(cart);
    }
    cartCounter.innerHTML = cart.length;

}
updateCartIcon();

async function addToCart(item) {
    let token = localStorage.getItem('token');
    if (token == null) {
        window.location.href = "http://localhost:8000/login";
    }

    fetch("http://localhost:8000/api/v1/cart-add-item/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Token " + token
        },
        body: JSON.stringify({
            "product_id": item
        })
    })
    .then(response => response.json())
    .catch(error => console.log(error))
    .finally(() => {
        // Obt??n el valor actual de la cookie
        var cart = getCookie("cart");

        // Si la cookie est?? vac??a, inicializa el carrito como una lista vac??a
        if (cart == "") {
            cart = [];
        } else {
            // Si no est?? vac??a, convierte el valor de la cookie en una lista
            cart = JSON.parse(cart);
        }

        // A??ade el elemento a la lista si no existe en el carrito
        if (cart.indexOf(item) == -1) {
            cart.push(item);
        }
        

        // Guarda la lista actualizada en la cookie
        setCookie("cart", JSON.stringify(cart), 7);
        updateCartIcon();
    })
    
    
}

