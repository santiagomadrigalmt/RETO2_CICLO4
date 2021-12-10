// ###############
// ### IMPORTS ###
// ###############
import { renderEntriesTable } from "./functions.js";
// #################
// ### FUNCTIONS ###
// #################
// updateUser():
export function updateUser(baseApiUrl, userObject) {
    // First, load all info into the modal's inputs:
    // To update: Birthday information
    const propNamesToInputIds = {
        "id": "updateUserId",
        "identification": "updateUserIdentification",
        "name": "updateUserName",
        "address": "updateUserAddress",
        "cellPhone": "updateUserCellPhone",
        "email": "updateUserEmail",
        "password": "updateUserPassword",
        "zone": "updateUserZone",
        "type": "updateUserType"
    };
    // Put all data from userObject, except the password, in the modal's input fields:
    // (No idea how to edit the select elements... but whatever)
    let propsNamesList = Object.keys(userObject);
    for (let currentPropName of propsNamesList) {
        document.getElementById(propNamesToInputIds[currentPropName]).value
            = userObject[currentPropName];
    }
    document
        .getElementById("updateUserForm")
        .addEventListener("submit", function (event) {
        event.preventDefault();
        const inputIdsToPropNames = {
            "updateUserId": "id",
            "updateUserIdentification": "identification",
            "updateUserName": "name",
            "updateUserAddress": "address",
            "updateUserCellPhone": "cellPhone",
            "updateUserEmail": "email",
            "updateUserPassword": "password",
            "updateUserZone": "zone",
            "updateUserType": "type"
        };
        // Build the objectToUpload:
        let objectToUpload = new Object();
        let inputElementsInForm = document.getElementById("updateUserForm").getElementsByTagName("input");
        let selectElementsInForm = document.getElementById("updateUserForm").getElementsByTagName("select");
        for (let currentInputElement of inputElementsInForm) {
            objectToUpload[inputIdsToPropNames[currentInputElement.id]]
                = currentInputElement.value;
        }
        for (let currentSelectElement of selectElementsInForm) {
            objectToUpload[inputIdsToPropNames[currentSelectElement.id]]
                = currentSelectElement.options[currentSelectElement.selectedIndex].value;
        }
        fetch(baseApiUrl + "/emailexist/" + objectToUpload["email"])
            .then(res => res.json())
            .then(function (data) {
            // If the inputted email exists in the database, and it is different than the original user email, do this:
            if (data && objectToUpload["email"] !== userObject["email"]) {
                alert("Ya existe un usuario con el email proveído. Por favor intenta con un email diferente.");
            }
            else {
                // Do the PUT fetch:
                let fetchProperties = {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(objectToUpload)
                };
                fetch(baseApiUrl + "/update", fetchProperties)
                    .then(res => res.json())
                    .then(data => alert("El usuario ha sido actualizado exitosamente. Cierra la ventana emergente, y presiona el botón verde de cargar, para ver los cambios."));
            }
        });
    });
}
// registerUser: Once it works, try to make it a general function:
export function registerUser() {
    // TO DO: Birthday information
    const inputIdsToPropNamesDict = {
        "newUserId": "id",
        "newUserIdentification": "identification",
        "newUserName": "name",
        "newUserAddress": "address",
        "newUserCellPhone": "cellPhone",
        "newUserEmail": "email",
        "newUserPassword": "password",
        "newUserZone": "zone",
        "newUserType": "type"
    };
    // We take both the input and the select elements:
    let allInputElementsInForm = document.getElementById("newUserForm").getElementsByTagName("input");
    let allSelectElementsInForm = document.getElementById("newUserForm").getElementsByTagName("select");
    let objectToUpload = new Object();
    for (let currentInputElement of allInputElementsInForm) {
        objectToUpload[inputIdsToPropNamesDict[currentInputElement.id]]
            = currentInputElement.value;
    }
    if (allSelectElementsInForm !== null) {
        for (let currentSelectElement of allSelectElementsInForm) {
            objectToUpload[inputIdsToPropNamesDict[currentSelectElement.id]]
                = currentSelectElement.options[currentSelectElement.selectedIndex].value;
        }
    }
    // First, verify if an user with that info already exists or not:
    fetch("http://localhost:8080/api/user/" + objectToUpload["id"])
        .then(res => res.json())
        .then(function (data) {
        // If no user has the provided ID, check if any user has the provided email:
        if (data === null) {
            fetch("http://localhost:8080/api/user/emailexist/" + objectToUpload["email"])
                .then(res => res.json())
                .then(function (data) {
                if (data) {
                    alert("Ya existe un usuario con el email proveído. Por favor intenta con un email diferente.");
                }
                else {
                    let fetchProperties = {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(objectToUpload)
                    };
                    fetch("http://localhost:8080/api/user/new", fetchProperties)
                        .then(res => res.json())
                        .then(function (data) {
                        let allInputElementsInForm = document.getElementById("newUserForm").getElementsByTagName("input");
                        for (let currentInputElement of allInputElementsInForm) {
                            currentInputElement.value = "";
                        }
                        alert("El usuario ha sido agregado exitosamente. Puedes hacer clic en el botón verde de cargar para ver los cambios.");
                    });
                }
            });
        }
        else {
            alert("Ya existe un usuario con el ID proveído. Por favor intenta con un ID diferente.");
        }
    });
}
// #################
// ### EXECUTION ###
// #################
// Prevent the page to be shown unless you are logged in as an admin:
window.onload = function () {
    let mainBody = document.getElementById("mainBody");
    let currentUserString = window.localStorage.getItem("currentUserInfo");
    if (currentUserString === "") {
        mainBody.innerHTML
            = "<p>Lo sentimos. Solo puedes ver esta página si estás logueado/a como <b>Administrador/a</b>.</p>";
    }
    else {
        let currentUserObject = JSON.parse(currentUserString);
        if (currentUserObject["type"] !== "ADM") {
            mainBody.innerHTML
                = "<p>Lo sentimos. Solo puedes ver esta página si estás logueado/a como <b>Administrador/a</b>.</p>";
        }
    }
};
// Add event listener to the "Load Users" button:
document
    .getElementById("loadUsersButton")
    .addEventListener("click", function () {
    renderEntriesTable("http://localhost:8080/api/user", "usersTableDiv", updateUser);
});
// Add an event listener to the "submit" event of the Add New User form:
document
    .getElementById("newUserForm")
    .addEventListener("submit", function (event) {
    event.preventDefault();
    registerUser();
});
