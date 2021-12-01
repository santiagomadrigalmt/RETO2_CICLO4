// #################
// ### FUNCTIONS ###
// #################
// userLogin(): Carries out the required login authentications:
export function userLogin(apiBaseUrl, userEmail, userPassword, adminLinksDivId) {
    let apiVerifyEmailUrl = `${apiBaseUrl}/emailexist/${userEmail}`;
    let apiVerifyEmailPasswordUrl = `${apiBaseUrl}/${userEmail}/${userPassword}`;
    // I use the FETCH function instead of JQuery's ajax:
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
                        // If an admin logs in, show links to pages where they can manage users and products:
                        let adminLinksDiv = document.getElementById(adminLinksDivId);
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
// ### DELETE USER ###:
export function deleteEntry(baseApiUrl, idEntryToDelete) {
    if (confirm(`¿Estás seguro/a de que deseas borrar la entrada con ID ${idEntryToDelete}?`)) {
        let fetchProperties = {
            method: "DELETE",
            headers: { "Content-Type": "application/json" }
        };
        fetch(baseApiUrl + "/" + idEntryToDelete, fetchProperties)
            .then(res => alert("La entrada ha sido eliminada exitosamente. Por favor presiona el botón verde nuevamente para ver los cambios."));
    }
}
// ### UPDATE USER ###:
export function updateUser(baseApiUrl, userObject) {
    // First, load all info into the modal's inputs:
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
                    .then(data => alert("El usuario ha sido actualizado exitosamente. Puedes hacer clic en el botón verde de cargar para ver los cambios."));
            }
        });
    });
}
// renderEntriesTable: Renders in an HTML table all the data contained in the API being fetched: 
export function renderEntriesTable(baseApiUrl, entriesHtmlTableDivId) {
    // I use the fetch function for API interactions instead of JQuery's ajax:
    fetch(baseApiUrl + "/all")
        .then(response => response.json())
        .then(data => {
        let entriesHtmlTableDiv = document.getElementById(entriesHtmlTableDivId);
        // First we empty the contents of the HTML table:
        entriesHtmlTableDiv.innerHTML = "";
        // If there are no entries in the database, render a message saying so, and return:
        if (data.length === 0) {
            entriesHtmlTableDiv.innerHTML
                = "[ Actualmente no hay entradas de este tipo registradas en el sistema. ]";
            return;
        }
        // Grab all the property names for the corresponding entries:
        let propertiesNamesList = Object.keys(data[0]);
        // Initialize a new HTML Table element:
        let htmlTable = document.createElement("table");
        htmlTable.className = "table table-dark table-striped";
        let htmlTableHeader = document.createElement("thead");
        let htmlTableHeaderRow = document.createElement("tr");
        // Fill out the header row of the HTML table:
        let htmlTableCurrentHeaderCell;
        for (let currentPropertyName of propertiesNamesList) {
            htmlTableCurrentHeaderCell = document.createElement("th");
            htmlTableCurrentHeaderCell.innerHTML = currentPropertyName;
            htmlTableHeaderRow.appendChild(htmlTableCurrentHeaderCell);
        }
        // Close the header row, leaving spaces for the Update and Delete buttons:
        htmlTableCurrentHeaderCell = document.createElement("th");
        htmlTableCurrentHeaderCell.innerHTML = "UPDATE";
        htmlTableHeaderRow.appendChild(htmlTableCurrentHeaderCell);
        htmlTableCurrentHeaderCell = document.createElement("th");
        htmlTableCurrentHeaderCell.innerHTML = "DELETE";
        htmlTableHeaderRow.appendChild(htmlTableCurrentHeaderCell);
        htmlTableHeader.appendChild(htmlTableHeaderRow);
        htmlTable.appendChild(htmlTableHeader);
        // Fill the rest of the table:
        let htmlTableBody = document.createElement("tbody");
        let htmlTableCurrentRow;
        for (let currentEntry of data) {
            // Open current row on the table:
            htmlTableCurrentRow = document.createElement("tr");
            // Fill cells with their corresponding values,
            // following the order provided by propertiesNames:
            let htmlTableCurrentCell;
            for (let currentPropertyName of propertiesNamesList) {
                // Open the current cell:
                htmlTableCurrentCell = document.createElement("td");
                // If the property is a password, REDACT IT!:
                if (currentPropertyName === "password") {
                    currentEntry["password"] = "";
                    htmlTableCurrentCell.innerHTML = "<b>[REDACTADO]</b>";
                }
                // ELSE, place in the current cell the value corresponding to the property name,
                // of the current entry:
                else {
                    htmlTableCurrentCell.innerHTML = currentEntry[currentPropertyName];
                }
                // Then we close the current cell:
                htmlTableCurrentRow.appendChild(htmlTableCurrentCell);
            }
            // Add cell with the corresponding "Update" and "Delete" buttons:
            let htmlCurrentButton;
            htmlTableCurrentCell = document.createElement("td");
            htmlCurrentButton = document.createElement("button");
            htmlCurrentButton.className = "btn btn-warning";
            htmlCurrentButton.setAttribute("data-bs-toggle", "modal");
            htmlCurrentButton.setAttribute("data-bs-target", "#modalContainer");
            htmlCurrentButton.innerHTML = "Actualizar";
            htmlCurrentButton.addEventListener("click", () => updateUser(baseApiUrl, currentEntry));
            htmlTableCurrentCell.appendChild(htmlCurrentButton);
            htmlTableCurrentRow.appendChild(htmlTableCurrentCell);
            htmlTableCurrentCell = document.createElement("td");
            htmlCurrentButton = document.createElement("button");
            htmlCurrentButton.className = "btn btn-danger";
            htmlCurrentButton.innerHTML = "Eliminar";
            htmlCurrentButton.addEventListener("click", () => deleteEntry(baseApiUrl, currentEntry["id"]));
            htmlTableCurrentCell.appendChild(htmlCurrentButton);
            htmlTableCurrentRow.appendChild(htmlTableCurrentCell);
            // Close current row on the table:
            htmlTableBody.appendChild(htmlTableCurrentRow);
        }
        // Close the HTML code for the table:
        htmlTable.appendChild(htmlTableBody);
        // Load the table HTML code in the <div> with the "entriesHtmlTableDivId":
        entriesHtmlTableDiv.appendChild(htmlTable);
    });
}
// registerUser: Once it works, try to make it a general function:
export function registerUser() {
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
                console.log(data);
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