
function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
        let c = ca[i];
    while (c.charAt(0) == ' ') {
        c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
    }
  }
    return "";
}

async function removeFromCart(item) {
    let token = localStorage.getItem('token');
    if (token == null) {
        window.location.href = "http://localhost:8000/login";
    }

    fetch("http://localhost:8000/api/v1/cart-delete-item/", {
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
    .then(data => {
        if (data.status == "success") {
            alert("Producto eliminado del carrito");
        }
        else {
            alert("Error al eliminar el producto al carrito");
        }
    })
    .catch(error => console.log(error))
    .finally(() => {
        // Obtén el valor actual de la cookie
        let cart = getCookie("cart");

        if (cart.includes(productId)) {
            // Si el producto ya está en el carrito, elimínalo
            cart = cart.replace(productId + ",", "").replace("," + productId, "").replace(productId, "");
            // Actualiza la cookie
            document.cookie = "cart=" + cart + "; path=/";
            // Elimina el producto de la tabla
            document.querySelector(`#cart-table-body tr td button[onclick="removeFromCart(${productId})"]`).parentElement.parentElement.remove();
        }
        updateTotalCartPrice();
})
}


window.onload = async () => {
    const cart = getCookie("cart");
    let products = [];

    if (cart == "") {
        document.querySelector('#cart-empty').classList.remove('d-none');
        document.querySelector('#cart-buy').classList.add('d-none');
    } else {
        document.querySelector('#cart-empty').classList.add('d-none');
        document.querySelector('#cart-buy').classList.remove('d-none');
    }
    await

    fetch("http://localhost:8000/api/v1/products", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
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
        const productsContainer = document.querySelector('#cart-table-body');
        products.forEach(product => {
            if (cart.includes(product.id)) {
                productsContainer.innerHTML += `
                <tr>
                    <td style="color:#fff;">
                        <img src="public/products/${product.name}.png" width="100px" alt="${product.name}" class="img-fluid z-depth-0">
                    </td>
                    <td style="color: #fff;" class="mt-5">${product.price}</td>
                    <td style="color: #fff;" class="mt-5">
                    <span class="qty text-center ms-4" id="qty-${product.id}">1</span>
                    </td>
                    <td class="font-weight-bold mt-5" style="color: #fff;">
                        <strong id="price-${product.id}" class="product-price">${product.price}</strong>
                    </td>
                    <td>
                        <button type="button" class="btn btn-sm btn-danger waves-effect waves-light" onclick="removeFromCart(${product.id})">
                            <i class="fa fa-trash"></i>
                        </button>
                    </td>
                </tr>`;
            }
        });
    })
    updateTotalCartPrice();
}


function updateTotalCartPrice() {
    const prices = document.querySelectorAll('.product-price');
    let total = 0;
    prices.forEach(price => {
        total += parseInt(price.innerHTML);
    });
    document.querySelector('#total-cart-price').innerHTML = total;
}

function buy(){
    // obtengo el token que se encuentra en el local storage
    let token = localStorage.getItem("token");

    fetch("http://localhost:8000/api/v1/verify-auth/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": token
    }
    })
    .then(response => {
    if (response.status === 200) {
        // El usuario está autenticado
        let buyButton = document.querySelector('#cart-buy');
        buyButton.innerHTML = "Comprando...";
        buyButton.disabled = true;
        // obtengo los valores de la cookie y los envio al endpoint 
        let cart = getCookie("cart");
        let products = cart.split(",");
        let data = {
            products: products
        }
        fetch("http://localhost:8000/api/v1/buy/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            },
            body: JSON.stringify(data)
        })
        

    } else {
        // El usuario no está autenticado o el token es inválido
        errorMessage("show", 'No iniciaste sesion');
        showHideContactForm('close');
    }
    })
    .catch(error => {
        // Hubo un error al realizar la solicitud
        console.error(error)
        errorMessage()
    });
}
