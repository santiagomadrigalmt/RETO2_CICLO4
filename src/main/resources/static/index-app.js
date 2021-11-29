"use strict";
// ### FUNCTIONS ###
function userLogin(apiBaseUrl, userEmail, userPassword) {
    let apiVerifyEmailUrl = `${apiBaseUrl}/emailexist/${userEmail}`;
    let apiVerifyEmailPasswordUrl = `${apiBaseUrl}/${userEmail}/${userPassword}`;
    // Fetch API instead of JQuery's ajax:
    fetch(apiVerifyEmailUrl)
        .then(response => response.json())
        .then(data => {
        // IF data === true (i.e. if there IS a user in the database with the provided userEmail),
        // do a new GET fetch:
        if (data) {
            fetch(apiVerifyEmailPasswordUrl)
                .then(response => response.json())
                .then(data => {
                if (data.email === null && data.password === null) {
                    alert("La contraseña es INCORRECTA. Por favor intenta de nuevo con una contraseña diferente.");
                }
                else {
                    let typesDict = {
                        "COORD": "coordinador/a",
                        "ASE": "asesor/a",
                        "ADM": "administrador/a"
                    };
                    if (data.type === "COORD" || data.type === "ASE") {
                        alert(`La contraseña es CORRECTA. Bienvenido/a ${typesDict[data.type]} ${data.name}.`);
                    }
                    else if (data.type === "ADM") {
                        alert(`La contraseña es CORRECTA. Bienvenido/a ${typesDict[data.type]} ${data.name}. A continuación encontrará los enlaces hacia la página de Administración de Usuarios, y Administración de Productos.`);
                        let adminLinksDiv = document.getElementById("adminLinks");
                        adminLinksDiv.style.display = "block";
                        adminLinksDiv.getElementsByTagName("P")[0].innerHTML
                            = "<a href='/admin-users.html'>Entra aquí para administrar usuarios</a><br/><br/><a href='#'>Entra aquí para administrar productos.</a>";
                    }
                }
            });
        }
        else {
            alert("El email ingresado NO está registrado. Por favor intenta de nuevo con un email diferente.");
        }
    });
}
// ### EXECUTION ###
// LOCAL: http://localhost:8080/api/user
// CLOUD: http://129.151.96.203:8080/api/user
const API_BASE_URL = "http://localhost:8080/api/user";
// Hide the DIV which shows admin links when the page first loads:
document.getElementById("adminLinks").style.display = "none";
// Set up event listener to the "INGRESAR" button:
document
    .getElementById("loginForm")
    .addEventListener("submit", function (event) {
    event.preventDefault();
    let email = document.getElementById("emailLogin").value;
    let password = document.getElementById("passwordLogin").value;
    userLogin(API_BASE_URL, email, password);
});
