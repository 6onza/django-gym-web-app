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
select.value = "todos";
let productos = document.querySelectorAll('.product');
showFourProducts(select.value);

select.addEventListener('change', function() {
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
                "Authorization": "Basic " + btoa("gonza:gonza")
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
            <div class="col-12 col-md-6 col-lg-2 ms-4 me-4 mt-5 ms-5 product d-none" style="width:15em;">
                <div class="product-card" >
                    <img src="public/products/${product.name}.png" width="100em" height="100em"  alt="...">
                    <div class="card-body" style="width:15em;">
                      <h5 class="card-title" style="text-align:left ;">${product.name}</h5>
                        <p class="card-text ">${product.description}</p>
                        <p class="card-text ">$${product.price}</p>
                        
                        <button class="btn btn-dark ms-5" onclick="mostrarInfoProduct('proteina')">Comprar</button>
                    </div>
                </div>
            </div>
            `;
            productsContainer.appendChild(productDiv);
        });
        showFourProducts();

})
}
loadProducts();

function showHideContactForm(action) {
    // blurreo el resto de la pagina
    let body = document.querySelector('body');
    let contactForm = document.querySelector('#contact-form');

    if (action == 'open') {
        // body.classList.add('blurred');
        contactForm.classList.remove('d-none');
    }
    if (action == 'close') {
        // body.classList.remove('blurred');
        contactForm.classList.add('d-none');
    }

}
