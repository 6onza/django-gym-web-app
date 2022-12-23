function addToCart(productId) {
    // Obtener el valor actual de la cookie del carrito
    var cart = getCookie("cart");
  
    // si esta logeado y tiene una cookie de carrito
    if (cart != "") {
      // Si el carrito no está vacío, añadir el nuevo producto al final del array
      cart += "," + productId;
    }
    else {
      // Si el carrito está vacío, añadir el nuevo producto al array
      cart = productId;
    }
}
 
function setCookie(name, value, days) {
    // Establecer el valor de la cookie con el nombre y el valor especificados
    var date = new Date();
    date.setTime(date.getTime() + (days*24*60*60*1000));
    var expires = "expires="+ date.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

function deleteCookie(name) {
    // Eliminar la cookie con el nombre especificado
    document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

function deleteCart() {
    // Eliminar la cookie del carrito
    deleteCookie("cart");
}

function getCart() {
    // Obtener el valor de la cookie del carrito
    var cart = getCookie("cart");
  
    // Si la cookie del carrito está vacía, devolver un array vacío
    if (cart == "") {
      return [];
    }
  
    // Si la cookie del carrito no está vacía, devolver un array con los IDs de los productos
    return cart.split(",");
}


function getCartTotal() {
    // Obtener el valor de la cookie del carrito
    var cart = getCookie("cart");
  
    // Si la cookie del carrito está vacía, devolver 0
    if (cart == "") {
      return 0;
    }
  
    // Si la cookie del carrito no está vacía, devolver el número de IDs de productos
    return cart.split(",").length;
}
