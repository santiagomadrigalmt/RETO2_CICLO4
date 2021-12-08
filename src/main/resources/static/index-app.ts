// ###############
// ### IMPORTS ###
// ###############

import {userLogin} from "./functions.js";


// #################
// ### EXECUTION ###
// #################

const API_BASE_URL : string = "http://localhost:8080/api/user";

window.onload = function()
{
    window.localStorage.setItem("loggedIn","false");
    window.localStorage.setItem("userType","NONE");
}

// Set up event listener to the "INGRESAR" button:
document
.getElementById("loginForm")!
.addEventListener(
    "submit",
    function(event)
    {
        event.preventDefault();
        
        let email : string = document.getElementById("emailLogin")!.value;
        let password : string = document.getElementById("passwordLogin")!.value;

        userLogin(API_BASE_URL, email, password);
    }
);
