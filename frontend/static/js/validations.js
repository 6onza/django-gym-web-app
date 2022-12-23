
document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    let username = document.getElementById('username').value;
    let password = document.getElementById('password').value;

    // verifico que le username y password sean validos y hago la peticion a la api con el token
    if (username.length > 0 && password.length > 0) {
        fetch('http://localhost:3000/api/v1/login', {
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
                window.location.href = 'http://localhost:5500/index.html';
            } else {
                alert('Usuario o contraseña incorrectos');
            }
        });
    } else {
        alert('Usuario o contraseña incorrectos');
    }
});

    