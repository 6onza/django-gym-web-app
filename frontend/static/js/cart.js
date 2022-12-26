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

function addToCart(item) {
    // Obtén el valor actual de la cookie
    var cart = getCookie("cart");

    // Si la cookie está vacía, inicializa el carrito como una lista vacía
    if (cart == "") {
        cart = [];
    } else {
        // Si no está vacía, convierte el valor de la cookie en una lista
        cart = JSON.parse(cart);
    }

    // Añade el elemento a la lista
    cart.push(item);

    // Guarda la lista actualizada en la cookie
    setCookie("cart", JSON.stringify(cart), 7);
}

function removeFromCart(item) {
    // Obtén el valor actual de la cookie
    var cart = getCookie("cart");

    // Si la cookie está vacía, inicializa el carrito como una lista vacía
    if (cart == "") {
        cart = [];
    } else {
        // Si no está vacía, convierte el valor de la cookie en una lista
        cart = JSON.parse(cart);
    }

    // Encuentra el índice del elemento a eliminar
    var index = cart.indexOf(item);

    // Si el elemento existe en el carrito, elimínalo
    if (index > -1) {
        cart.splice(index, 1);
    }

    // Guarda la lista actualizada en la cookie
    setCookie("cart", JSON.stringify(cart), 7);
}
