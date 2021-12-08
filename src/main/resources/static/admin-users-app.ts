// ###############
// ### IMPORTS ###
// ###############
import {renderEntriesTable, registerUser, updateUser} from "./functions.js";


// #################
// ### EXECUTION ###
// #################

// Prevent the page to be shown unless you are logged in as an admin:
window.onload = function() : void
{
    if 
    (
        window.localStorage.getItem("loggedIn") === "false"
        || window.localStorage.getItem("userType") !== "ADM"
    )
    {
        document.getElementById("mainBody")!.innerHTML
        = "<p>Lo sentimos. Solo puedes ver esta página si estás logueado/a como <b>Administrador/a</b>.</p>";
    }

}

// Add event listener to the "Load Users" button:
document
.getElementById("loadUsersButton")
.addEventListener(
    "click",
    function()
    {
        renderEntriesTable(
            "http://localhost:8080/api/user",
            "usersTableDiv",
            updateUser);
    }
);

// Add an event listener to the "submit" event of the Add New User form:
document
.getElementById("newUserForm")
.addEventListener(
    "submit",
    function (event : Event)
    {
        event.preventDefault();

        // Make this general:
        registerUser();
    }
);

