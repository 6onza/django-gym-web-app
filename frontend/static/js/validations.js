
document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    let username = document.getElementById('username').value;
    let password = document.getElementById('password').value;

    // verifico que le username y password sean validos y hago la peticion a la api con el token
    if (username.length > 0 && password.length > 0) {
        fetch('http://localhost:8000/api/v1/login/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.token) {
                localStorage.setItem('token', data.token);
                window.location.href = 'http://localhost:5500/frontend/index.html';
            } else {
                errorMessage("show", 'Usuario o contraseña incorrectos');

            }
        });
    } 
});

// verifico si esta logeado el usuario
if (localStorage.getItem('token')) {
    // si esta logeado lo redirijo a la pagina de productos
    document.querySelector('#login').classList.add('d-none');
    document.querySelector('#logout').classList.remove('d-none');
    // document.querySelector('#cart').classList.remove('d-none');
    // document.querySelector('#profile').classList.remove('d-none');
} else {
    // si no esta logeado lo redirijo a la pagina de login
    document.querySelector('#login').classList.remove('d-none');
    document.querySelector('#logout').classList.add('d-none');
    // document.querySelector('#cart').classList.add('d-none');
    // document.querySelector('#profile').classList.add('d-none');
}
function showLoginForm(){
    let loginForm = document.querySelector('#login-form');
    loginForm.classList.remove('d-none');
    loginForm.classList.add('animate__animated', 'animate__fadeInDown');
}

function logout() {
    localStorage.removeItem('token');
    window.location.href = 'http://localhost:5500/frontend/index.html';
}



function errorMessage(action, message){
    let error = document.querySelector('.error-message');
    let errorText = document.querySelector('#error-message');
    console.log(message)
    if (action == "show") {
        error.classList.remove('d-none');
        errorText.innerHTML = message;
    } else if (action == "hide") {
        error.classList.add('d-none');
    }    
}

function showHideContactForm(action) {
    let form = document.querySelector('#login-form');
    if(action == 'open'){
        // creo la animacion para la apertura del formulario
        form.classList.remove('d-none');
        form.classList.add('animate__animated', 'animate__fadeInDown');
    }
    if(action == 'close'){
        form.classList.add('d-none');
        form.classList.remove('animate__animated', 'animated__fadeInUp');
    }
}

function mostrarMenu(){
    let menu = document.querySelector('#menu');
    menu.classList.toggle('d-none');
}