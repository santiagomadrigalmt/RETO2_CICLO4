// ############################
// ### INTERFACES / CLASSES ###
// ############################
export interface User
{
    id : number,
    identification : string,
    name : string,
    birthDay : Date,
    monthBirthDay : string,
    address : string,
    cellPhone : string,
    email : string,
    password : string,
    zone : string,
    type : string
}

export interface Clone
{
    id : number,
    brand : string,
    procesor : string,
    os : string,
    description : string,
    memory : string,
    hardDrive : string,
    availability : boolean,
    price : number,
    quantity : number,
    photography : string
}

export class Order
{
    private registerDay : Date;
    private status : string;
    private salesMan : User;
    private products : Object;
    private quantities : Object;

    public constructor
    (
        registerDay : Date,
        salesMan : User
    )
    {
        this.registerDay = registerDay;
        this.status = "Pendiente";
        this.salesMan = salesMan;

        this.products = new Object();
        this.quantities = new Object();
    }

    public getProducts()
    : Object
    {
        return this.products;
    }

    public addProduct(cloneToAdd : Clone)
    : void
    {
        this.products[ cloneToAdd["id"].toString() ] = cloneToAdd;
    }

    public removeProduct(cloneId : number)
    : void
    {
        delete this.products[cloneId];
    }

    public addQuantitiesObject(quantityObject : Object)
    :void
    {
        this.quantities = quantityObject;
    }

    public howManyProducts()
    : number
    {
        return Object.keys(this.products).length;
    }
}

// #################
// ### FUNCTIONS ###
// #################

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
        entriesHtmlTableDiv!.innerHTML = "";

        // If there are no entries in the database, render a message saying so, and return:
        if (data.length === 0)
        {
            entriesHtmlTableDiv!.innerHTML
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
            );
            htmlTableCurrentCell.appendChild(htmlCurrentButton);
            htmlTableCurrentRow.appendChild(htmlTableCurrentCell);
            
            htmlTableCurrentCell = document.createElement("td"); 
            htmlCurrentButton = document.createElement("button");
            htmlCurrentButton.className = "btn btn-danger";
            htmlCurrentButton.innerHTML = "Eliminar";
            htmlCurrentButton.addEventListener(
                "click",
                () => deleteEntry( baseApiUrl, currentEntry["id"] )
            );
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
