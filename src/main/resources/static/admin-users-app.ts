// ###############
// ### IMPORTS ###
// ###############
import {deleteUser} from "./functions.js";
import {renderEntriesTable} from "./functions.js";
import {registerUser} from "./functions.js";

// #################
// ### EXECUTION ###
// #################

// Add event listener to the "Load Users" button:
document
.getElementById("loadUsersButton")
.addEventListener(
    "click",
    function()
    {
        renderEntriesTable("http://localhost:8080/api/user","usersTableDiv");
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

