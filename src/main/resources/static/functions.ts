// #################
// ### FUNCTIONS ###
// #################


// ###### UTILITY FUNCTIONS ######

// renderLoginModal(): Assigns the corresponding text content in the loginModal and shows it:
function renderLoginModal(
    modalTitle : string,
    modalBody : string
)
: void
{
    document.getElementById("loginModalTitle")!.innerHTML
    = modalTitle;
    
    document.getElementById("loginModalBody")!.innerHTML = "";
    document.getElementById("loginModalBody")!.innerHTML = modalBody;

    let myModal = new bootstrap.Modal(document.getElementById("loginModal"), {});
    myModal.show();
}


// ###### FUNCTIONS FOR USERS ######
// NOTE: Try to turn them into general/modular functions

// userLogin(): Carries out the required login authentications:
export function userLogin(
    apiBaseUrl : string,
    userEmail : string,
    userPassword : string)
    : void
{   
    let apiVerifyEmailUrl : string = `${apiBaseUrl}/emailexist/${userEmail}`;
    let apiVerifyEmailPasswordUrl : string = `${apiBaseUrl}/${userEmail}/${userPassword}`;

    // I use the FETCH function instead of JQuery's ajax:
    fetch(apiVerifyEmailUrl)
    .then( response => response.json() )
    .then( data => {
        // IF data === true (i.e. if there IS a user in the database with the provided userEmail),
        // do a new GET fetch:
        if (data)
        {   
        fetch(apiVerifyEmailPasswordUrl)
        .then( response => response.json() )
        .then( data => {
            if (data.email === null && data.password === null)
            {
                renderLoginModal(
                    "&#x274C; ¡Atención!",
                    "La contraseña es INCORRECTA. Por favor intenta de nuevo con una contraseña diferente."
                );               
            }
            else
            {
                let propsToSpanishNames : Object
                =
                {
                    "identification" : "Identificación",
                    "name" : "Nombre",
                    "email" : "E-mail",
                    "type" : "Perfil de usuario",
                    "zone" : "Zona"
                };

                let typesToSpanishNames : Object
                = 
                {
                    "COORD" : "Coordinador/a",
                    "ASE" : "Asesor/a",
                    "ADM" : "Administrador/a"
                };
                
                let userInfoHtmlTable : HTMLElement = document.createElement("table");
                userInfoHtmlTable.setAttribute("width","100%");

                let htmlTableCurrentRow : HTMLElement, 
                htmlTableCurrentCellAttributeName : HTMLElement,
                htmlTableCurrentCellAttributeValue : HTMLElement;

                for (let currentProp in propsToSpanishNames )
                {
                    htmlTableCurrentRow = document.createElement("tr");        
                    htmlTableCurrentCellAttributeName = document.createElement("td");
                    htmlTableCurrentCellAttributeName.innerHTML = `<b>${ propsToSpanishNames[currentProp] }:</b>`;
                    htmlTableCurrentCellAttributeValue = document.createElement("td");
                    
                    if ( currentProp === "type" )
                    {
                        htmlTableCurrentCellAttributeValue.innerHTML = typesToSpanishNames[ data["type"] ];
                    }
                    else
                    {
                        htmlTableCurrentCellAttributeValue.innerHTML = data[currentProp];
                    }   

                    htmlTableCurrentRow.appendChild( htmlTableCurrentCellAttributeName );
                    htmlTableCurrentRow.appendChild( htmlTableCurrentCellAttributeValue );
                    userInfoHtmlTable.appendChild( htmlTableCurrentRow );
                }
                
                document.getElementById("loginModalTitle")!.innerHTML = "&#9989; Inicio de sesión exitoso";    
                document.getElementById("loginModalBody")!.innerHTML = "";  
                document.getElementById("loginModalBody")!.appendChild(userInfoHtmlTable);
                let myModal = new bootstrap.Modal(document.getElementById("loginModal"), {});
                myModal.show();

                // Aquí meter lo de mostrar/quitar enlaces dependiendo del tipo de usuario logueado:
                window.localStorage.setItem( "loggedIn", "true" );
                window.localStorage.setItem( "userType", data["type"] );
            }
            });
        }
        else
        {
            renderLoginModal(
                "&#x274C; ¡Atención!",
                "El email ingresado NO está registrado. Por favor intenta de nuevo con un email diferente."
            );
        }
    });
}

// updateUser():
export function updateUser
(
    baseApiUrl : string,
    userObject : Object
)
: void
{
    // First, load all info into the modal's inputs:
    const propNamesToInputIds : Object
    =
    {
        "id" : "updateUserId",
        "identification" : "updateUserIdentification",
        "name" : "updateUserName",
        "address" : "updateUserAddress",
        "cellPhone" : "updateUserCellPhone",
        "email" : "updateUserEmail",
        "password" : "updateUserPassword",
        "zone" : "updateUserZone",
        "type" : "updateUserType"
    };

    // Put all data from userObject, except the password, in the modal's input fields:
    // (No idea how to edit the select elements... but whatever)
    let propsNamesList : string[] = Object.keys( userObject );
    for (let currentPropName of propsNamesList)
    {
        document.getElementById( propNamesToInputIds[ currentPropName ] )!.value
        = userObject[currentPropName];
    }

    document
    .getElementById("updateUserForm")!
    .addEventListener(
        "submit",
        function (event)
        {
            event.preventDefault();
            const inputIdsToPropNames : Object
            =
            {
                "updateUserId" : "id",
                "updateUserIdentification" : "identification",
                "updateUserName" : "name",
                "updateUserAddress" : "address",
                "updateUserCellPhone" : "cellPhone",
                "updateUserEmail" : "email",
                "updateUserPassword" : "password",
                "updateUserZone" : "zone",
                "updateUserType" : "type" 
            };

            // Build the objectToUpload:
            let objectToUpload : Object
            = new Object();

            let inputElementsInForm : HTMLCollectionOf<HTMLInputElement>
            = document.getElementById("updateUserForm")!.getElementsByTagName("input");
            
            let selectElementsInForm : HTMLCollectionOf<HTMLSelectElement>
            = document.getElementById("updateUserForm")!.getElementsByTagName("select");
            
            for (let currentInputElement of inputElementsInForm)
            {
                objectToUpload[ inputIdsToPropNames[ currentInputElement.id ] ]
                = currentInputElement.value;
            }

            for (let currentSelectElement of selectElementsInForm)
            {
                objectToUpload[ inputIdsToPropNames[ currentSelectElement.id ] ]
                = currentSelectElement.options[ currentSelectElement.selectedIndex ].value;
            }

            fetch(baseApiUrl + "/emailexist/" + objectToUpload["email"])
            .then(res => res.json())
            .then( function (data) {
                    
                // If the inputted email exists in the database, and it is different than the original user email, do this:
                if (data && objectToUpload["email"] !== userObject["email"])
                {
                    alert("Ya existe un usuario con el email proveído. Por favor intenta con un email diferente.");
                }
                else
                {
                    // Do the PUT fetch:
                    let fetchProperties : Object
                    = 
                    {
                        method: "PUT",
                        headers: { "Content-Type" : "application/json"},
                        body : JSON.stringify(objectToUpload)
                    }

                    fetch( baseApiUrl + "/update", fetchProperties )
                    .then(res => res.json())
                    .then(data => alert("El usuario ha sido actualizado exitosamente. Cierra la ventana emergente, y presiona el botón verde de cargar, para ver los cambios.") );
                }
            });
        }
    );
}

// registerUser: Once it works, try to make it a general function:
export function registerUser() : void
{
    const inputIdsToPropNamesDict : Object
    =
    {
        "newUserId" : "id",
        "newUserIdentification" : "identification",
        "newUserName" : "name",
        "newUserAddress" : "address",
        "newUserCellPhone" : "cellPhone",
        "newUserEmail" : "email",
        "newUserPassword" : "password",
        "newUserZone" : "zone",
        "newUserType" : "type" 
    };

    // We take both the input and the select elements:

    let allInputElementsInForm : HTMLCollectionOf<HTMLInputElement>
    = document.getElementById("newUserForm")!.getElementsByTagName("input");
    
    let allSelectElementsInForm : HTMLCollectionOf<HTMLSelectElement>
    = document.getElementById("newUserForm")!.getElementsByTagName("select");

    let objectToUpload : Object
    = new Object();

    for (let currentInputElement of allInputElementsInForm)
    {
        objectToUpload[ inputIdsToPropNamesDict[ currentInputElement.id ] ]
        = currentInputElement.value;
    }

    if (allSelectElementsInForm !== null)
    {
        for (let currentSelectElement of allSelectElementsInForm)
        {
            objectToUpload[ inputIdsToPropNamesDict[ currentSelectElement.id ] ]
            = currentSelectElement.options[ currentSelectElement.selectedIndex ].value;
        }
    }

    // First, verify if an user with that info already exists or not:
    fetch( "http://localhost:8080/api/user/" + objectToUpload["id"] )
    .then(res => res.json())
    .then(
        function (data)
        {
            // If no user has the provided ID, check if any user has the provided email:
            if (data === null)
            {
                fetch( "http://localhost:8080/api/user/emailexist/" + objectToUpload["email"] )
                .then(res => res.json())
                .then(
                    function (data)
                    {
                        if ( data )
                        { 
                            alert("Ya existe un usuario con el email proveído. Por favor intenta con un email diferente.");
                        }
                        else
                        {
                            let fetchProperties : Object
                            = 
                            {
                                method: "POST",
                                headers: { "Content-Type" : "application/json"},
                                body : JSON.stringify(objectToUpload)
                            }
                        
                            fetch("http://localhost:8080/api/user/new",fetchProperties)
                            .then(res => res.json())
                            .then(
                                function (data)
                                {
                                    let allInputElementsInForm : HTMLCollectionOf<HTMLInputElement>
                                    = document.getElementById("newUserForm")!.getElementsByTagName("input");

                                    for (let currentInputElement of allInputElementsInForm)
                                    {
                                        currentInputElement.value = "";
                                    }

                                    alert("El usuario ha sido agregado exitosamente. Puedes hacer clic en el botón verde de cargar para ver los cambios.")
                                } );
                        }
                    }
                );
            }
            else
            {
                alert("Ya existe un usuario con el ID proveído. Por favor intenta con un ID diferente.");
            }
        }
    );
}


// ###### FUNCTIONS FOR CLONES / PREBUILTS ######
// NOTE: Try to turn them into general/modular functions

// updateClone(): WORK IN PROGRESS
export function updateClone
(
    baseApiUrl : string,
    cloneObject : Object
)
: void
{
    const propNamesToInputIds : Object
    =
    {
        "id" : "updateCloneId",
        "brand" : "updateCloneBrand",
        "procesor" : "updateCloneProcessor",
        "os" : "updateCloneOperatingSystem",
        "description" : "updateCloneDescription",
        "memory" : "updateCloneMemory",
        "hardDrive" : "updateCloneHardDrive",
        "price" : "updateClonePrice",
        "quantity" : "updateCloneQuantity",
        "photography" : "updateClonePhotoUrl",
        "availability" : "updateCloneAvailability"
    };

    // Put all data from userObject, except the password, in the modal's input fields:
    // (No idea how to edit the select elements... but whatever)
    let propsNamesList : string[] = Object.keys( cloneObject );
    for (let currentPropName of propsNamesList)
    {
        if (currentPropName === "availability")
        {
            continue
        }
        else
        {
            console.log(currentPropName);
            document.getElementById( propNamesToInputIds[ currentPropName ] )!.value = cloneObject[currentPropName];
        }
    }
    
    document
    .getElementById("updateCloneForm")!
    .addEventListener(
        "submit",
        function (event)
        {
            event.preventDefault();
            const inputIdsToPropNames : Object
            =
            {
                "updateCloneId" : "id",
                "updateCloneBrand" : "brand",
                "updateCloneProcessor" : "procesor",
                "updateCloneOperatingSystem" : "os",
                "updateCloneDescription" : "description",
                "updateCloneMemory" : "memory",
                "updateCloneHardDrive" : "hardDrive",
                "updateClonePrice" : "price",
                "updateCloneQuantity" : "quantity",
                "updateClonePhotoUrl" : "photography",
                "updateCloneAvailability" : "availability"
            };

            // Build the objectToUpload:
            let objectToUpload : Object
            = new Object();

            let inputElementsInForm : HTMLCollectionOf<HTMLInputElement>
            = document.getElementById("updateCloneForm")!.getElementsByTagName("input");
            
            
            for (let currentInputElement of inputElementsInForm)
            {
                objectToUpload[ inputIdsToPropNames[ currentInputElement.id ] ]
                = currentInputElement.value;
            }

            // Get only select element in the cloneForm: Availability
            let avaElement = document.getElementById("updateCloneAvailability");

            if ( avaElement.options[avaElement.selectedIndex].value === "YES" )
            {
                objectToUpload["availability"] = true;
            }
            else
            {
                objectToUpload["availability"] = false;
            }

            // Do the PUT fetch:
            let fetchProperties : Object
            = 
            {
                method: "PUT",
                headers: { "Content-Type" : "application/json"},
                body : JSON.stringify(objectToUpload)
            }

            fetch( baseApiUrl + "/update", fetchProperties )
            .then(res => res.json())
            .then(data => alert("El clon ha sido actualizado exitosamente. Cierra la ventana emergente, y presiona el botón verde de cargar para ver los cambios.") );
        }
    );
}

// registerClone():
export function registerClone() : void
{
    const inputIdsToPropNamesDict : Object
    =
    {
        "newCloneId" : "id",
        "newCloneBrand" : "brand",
        "newCloneProcessor" : "procesor",
        "newCloneOperatingSystem" : "os",
        "newCloneDescription" : "description",
        "newCloneMemory" : "memory",
        "newCloneHardDrive" : "hardDrive",
        "newClonePrice" : "price",
        "newCloneQuantity" : "quantity",
        "newClonePhotoUrl" : "photography"
    };

    // We take both the input and the select elements:

    let allInputElementsInForm : HTMLCollectionOf<HTMLInputElement>
    = document.getElementById("newCloneForm")!.getElementsByTagName("input");

    let objectToUpload : Object
    = new Object();

    for (let currentInputElement of allInputElementsInForm)
    {
        objectToUpload[ inputIdsToPropNamesDict[ currentInputElement.id ] ]
        = currentInputElement.value;
    }

    // Get only select element in the cloneForm: Availability
    let availabilityElement = document.getElementById("newCloneAvailability");

    if ( availabilityElement.options[availabilityElement.selectedIndex].value === "YES" )
    {
        objectToUpload["availability"] = true;
    }
    else
    {
        objectToUpload["availability"] = false;
    }

    // First, verify if a clone with that info already exists or not:
    fetch( "http://localhost:8080/api/clone/" + objectToUpload["id"] )
    .then(res => res.json())
    .then(
        function (data)
        {
            // If there is no Clone with the given ID, register it:
            if (data === null)
            {
                let fetchProperties : Object
                = 
                {
                    method: "POST",
                    headers: { "Content-Type" : "application/json"},
                    body : JSON.stringify(objectToUpload)
                }
            
                fetch("http://localhost:8080/api/clone/new",fetchProperties)
                .then(res => res.json())
                .then(
                    function (data)
                    {
                        let allInputElementsInForm : HTMLCollectionOf<HTMLInputElement>
                        = document.getElementById("newCloneForm")!.getElementsByTagName("input");

                        for (let currentInputElement of allInputElementsInForm)
                        {
                            currentInputElement.value = "";
                        }

                        alert("El clon ha sido agregado exitosamente. Puedes hacer clic en el botón verde de cargar para ver los cambios.")
                    } );
            }
            else
            {
                alert("Ya existe un clon con el ID proveído. Por favor intenta con un ID diferente.");
            }
        }
    );
}


// ###### GENERAL/MODULAR FUNCTIONS ######

// deleteEntry():
export function deleteEntry
(
    baseApiUrl : string,
    idEntryToDelete : number
)
: void
{
    if ( confirm(`¿Estás seguro/a de que deseas borrar la entrada con ID ${idEntryToDelete}?`) )
    {
        let fetchProperties : Object
        = 
        {
            method: "DELETE",
            headers: { "Content-Type" : "application/json"}
        }
    
        fetch( baseApiUrl + "/" + idEntryToDelete, fetchProperties )
        .then( res => alert("La entrada ha sido eliminada exitosamente. Por favor presiona nuevamente el botón verde que dice 'CARGAR' para ver los cambios.") );
    }
}

// renderEntriesTable(): Renders in an HTML table all the data contained in the API being fetched: 
export function renderEntriesTable
(
    baseApiUrl : string,
    entriesHtmlTableDivId : string,
    updateEntryFunction : Function
)
: void
{
    // I use the fetch function for API interactions instead of JQuery's ajax:
    fetch( baseApiUrl + "/all" )
    .then( response => response.json() )
    .then( data => {
        
        let entriesHtmlTableDiv : HTMLElement | null = document.getElementById(entriesHtmlTableDivId);

        // First we empty the contents of the HTML table:
        entriesHtmlTableDiv.innerHTML = "";

        // If there are no entries in the database, render a message saying so, and return:
        if (data.length === 0)
        {
            entriesHtmlTableDiv.innerHTML
            = "[ Actualmente no hay entradas de este tipo registradas en el sistema. ]";

            return;
        }

        // Grab all the property names for the corresponding entries:
        let propertiesNamesList : string[] = Object.keys( data[0] );

        // Initialize a new HTML Table element:
        let htmlTable : HTMLElement = document.createElement("table");
        htmlTable.className = "table table-dark table-striped";

        let htmlTableHeader : HTMLElement = document.createElement("thead");
        let htmlTableHeaderRow : HTMLElement = document.createElement("tr");
        
        // Fill out the header row of the HTML table:
        let htmlTableCurrentHeaderCell : HTMLElement;
        for (let currentPropertyName of propertiesNamesList )
        {	
            htmlTableCurrentHeaderCell = document.createElement("th");
            htmlTableCurrentHeaderCell.innerHTML = currentPropertyName;
            htmlTableHeaderRow.appendChild( htmlTableCurrentHeaderCell );
        }
        
        // Close the header row, leaving spaces for the Update and Delete buttons:
        htmlTableCurrentHeaderCell = document.createElement("th");
        htmlTableCurrentHeaderCell.innerHTML = "UPDATE";
        htmlTableHeaderRow.appendChild( htmlTableCurrentHeaderCell );
        
        htmlTableCurrentHeaderCell = document.createElement("th");
        htmlTableCurrentHeaderCell.innerHTML = "DELETE";
        htmlTableHeaderRow.appendChild( htmlTableCurrentHeaderCell );        
        
        htmlTableHeader.appendChild(htmlTableHeaderRow);
        htmlTable.appendChild(htmlTableHeader);

        // Fill the rest of the table:
        let htmlTableBody : HTMLTableSectionElement = document.createElement("tbody");
        let htmlTableCurrentRow : HTMLTableRowElement;
        for (let currentEntry of data)
        {
            // Open current row on the table:
            htmlTableCurrentRow = document.createElement("tr");

            // Fill cells with their corresponding values,
            // following the order provided by propertiesNames:
            let htmlTableCurrentCell : HTMLTableCellElement;
            for (let currentPropertyName of propertiesNamesList)
            {
                // Open the current cell:
                htmlTableCurrentCell = document.createElement("td");
                
                // If the property is a password, REDACT IT!:
                if ( currentPropertyName === "password")
                {
                    currentEntry["password"] = "";
                    htmlTableCurrentCell.innerHTML = "<b>[REDACTADO]</b>"; 
                }
                // ELSE, place in the current cell the value corresponding to the property name,
                // of the current entry:
                else
                {
                    htmlTableCurrentCell.innerHTML = currentEntry[currentPropertyName];
                }

                // Then we close the current cell:
                htmlTableCurrentRow.appendChild(htmlTableCurrentCell);
            }

            // Add cell with the corresponding "Update" and "Delete" buttons:
            let htmlCurrentButton : HTMLButtonElement;

            htmlTableCurrentCell = document.createElement("td"); 
            htmlCurrentButton = document.createElement("button");
            htmlCurrentButton.className = "btn btn-warning";
            htmlCurrentButton.setAttribute("data-bs-toggle","modal");
            htmlCurrentButton.setAttribute("data-bs-target","#modalContainer");
            htmlCurrentButton.innerHTML = "Actualizar";
            htmlCurrentButton.addEventListener(
                "click",
                () => updateEntryFunction( baseApiUrl, currentEntry )
            )
            htmlTableCurrentCell.appendChild(htmlCurrentButton);
            htmlTableCurrentRow.appendChild(htmlTableCurrentCell);
            
            htmlTableCurrentCell = document.createElement("td"); 
            htmlCurrentButton = document.createElement("button");
            htmlCurrentButton.className = "btn btn-danger";
            htmlCurrentButton.innerHTML = "Eliminar";
            htmlCurrentButton.addEventListener(
                "click",
                () => deleteEntry( baseApiUrl, currentEntry["id"] )
            )
            htmlTableCurrentCell.appendChild(htmlCurrentButton);
            htmlTableCurrentRow.appendChild(htmlTableCurrentCell);

            // Close current row on the table:
            htmlTableBody.appendChild(htmlTableCurrentRow);
        }

        // Close the HTML code for the table:
        htmlTable.appendChild(htmlTableBody);

        // Load the table HTML code in the <div> with the "entriesHtmlTableDivId":
        entriesHtmlTableDiv!.appendChild(htmlTable);
    } );
}
