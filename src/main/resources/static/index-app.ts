// ###############
// ### IMPORTS ###
// ###############

import {userLogin} from "./functions.js";


// #################
// ### EXECUTION ###
// #################

// LOCAL: http://localhost:8080/api/user
// CLOUD: http://129.151.96.203:8080/api/user
const API_BASE_URL : string = "http://localhost:8080/api/user";

// Hide the DIV which shows admin links when the page first loads:
document.getElementById("adminLinks").style.display = "none";

// Set up event listener to the "INGRESAR" button:
document
.getElementById("loginForm")
.addEventListener(
    "submit",
    function(event)
    {
        event.preventDefault();
        
        let email : string = document.getElementById("emailLogin").value;
        let password : string = document.getElementById("passwordLogin").value;
        
        userLogin(API_BASE_URL, email, password, "adminLinks");
    }
);
