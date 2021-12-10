// ###############
// ### IMPORTS ###
// ###############
import { renderEntriesTable, User } from "./functions.js";


// #################
// ### FUNCTIONS ###
// #################

// updateClone()
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


// #################
// ### EXECUTION ###
// #################

// Prevent the page to be shown unless you are logged in as an admin:
window.onload = function() : void
{
    let mainBody = document.getElementById("mainBody")!;
    let currentUserString : string = window.localStorage.getItem("currentUserInfo")!;
    
    if ( currentUserString === "" )
    {
        mainBody.innerHTML
        = "<p>Lo sentimos. Solo puedes ver esta página si estás logueado/a como <b>Administrador/a</b>.</p>";
    }
    else
    {
        let currentUserObject : User = JSON.parse( currentUserString );

        if ( currentUserObject["type"] !== "ADM" )
        {
            mainBody.innerHTML
            = "<p>Lo sentimos. Solo puedes ver esta página si estás logueado/a como <b>Administrador/a</b>.</p>";
        }
    }
}

// Adds the "renderEntriesTable" function to the Event Listener of the "loadClonesButton" button:
document
.getElementById("loadClonesButton")
.addEventListener(
    "click",
    function()
    {
        renderEntriesTable(
            "http://localhost:8080/api/clone",
            "clonesTableDiv",
            updateClone);
    }
);

// Add an event listener to the "submit" event of the Add New User form:
document
.getElementById("newCloneForm")
.addEventListener(
    "submit",
    function (event : Event)
    {
        event.preventDefault();

        // Make this general:
        registerClone();
    }
);