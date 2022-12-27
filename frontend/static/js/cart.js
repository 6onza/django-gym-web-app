
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
                    <span class="qty" id="qty-${product.id}">1</span>
                    <div class="btn-group radio-group" data-toggle="buttons">
                        <label class="btn btn-sm btn-secondary btn-rounded waves-effect waves-light" onclick="decreaseQuantity(${product.id}, ${product.price})">
                            <a href="#" style="text-decoration: none; color: #000">—</a>
                        </label>
                        <label class="btn btn-sm btn-secondary btn-rounded waves-effect waves-light" onclick="increaseQuantity(${product.id}, ${product.price})">
                            <a href="#" style="text-decoration: none; color: #000">+</a>
                        </label>
                    </div>
                    </td>
                    <td class="font-weight-bold mt-5" style="color: #fff;">
                        <strong id="price-${product.id}" class="product-price">${product.price}</strong>
                    </td>
                    <td>
                        <button type="button" class="btn btn-sm btn-danger waves-effect waves-light">
                            <i class="fa fa-trash"></i>
                        </button>
                    </td>
                </tr>`;
            }
        });
    })
    updateTotalCartPrice();
}

function increaseQuantity(id, price) {
    const quantity = document.querySelector(`#qty-${id}`);
    quantity.innerHTML = parseInt(quantity.innerHTML) + 1;
    const priceElement = document.querySelector(`#price-${id}`);
    priceElement.innerHTML = parseInt(priceElement.innerHTML) + price;
    updateTotalCartPrice();

}

function decreaseQuantity(id, price) {
    const quantity = document.querySelector(`#qty-${id}`);
    if (quantity.innerHTML > 1) {
        quantity.innerHTML = parseInt(quantity.innerHTML) - 1;
        const priceElement = document.querySelector(`#price-${id}`);
        priceElement.innerHTML = parseInt(priceElement.innerHTML) - price;
    }
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

