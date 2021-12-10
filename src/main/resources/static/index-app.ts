// ###############
// ### IMPORTS ###
// ###############

// (No imports for now)


// #################
// ### FUNCTIONS ###
// #################

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

// userLogin(): Carries out the required login authentications:
function userLogin(
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

                // Put into the "currentUserInfo" holder all the data of the current logged-in user:
                window.localStorage.setItem( "currentUserInfo", JSON.stringify(data) );
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


// #################
// ### EXECUTION ###
// #################

const API_BASE_URL : string = "http://localhost:8080/api/user";

window.onload = function()
{
    window.localStorage.setItem("currentUserInfo","");
    console.log(window.localStorage.getItem("currentUserInfo"));
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
