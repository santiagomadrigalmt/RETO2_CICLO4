"use strict";
// ###############
// ### IMPORTS ###
// ###############
// #################
// ### EXECUTION ###
// #################
// Prevent the page to be shown unless you are logged in as a seller:
window.onload = function () {
    if (window.localStorage.getItem("loggedIn") === "false"
        || window.localStorage.getItem("userType") !== "ASE") {
        document.getElementById("mainBody").innerHTML
            = "<p>Lo sentimos. Solo puedes ver esta página si estás logueado/a como <b>Asesor/a Comercial</b>.</p>";
    }
};
