// ############################
// ### INTERFACES / CLASSES ###
// ############################
class Order {
    constructor(registerDay, salesMan) {
        this.registerDay = registerDay;
        this.status = "Pendiente";
        this.salesMan = salesMan;
        this.products = new Object();
        this.quantities = new Object();
    }
    getProducts() {
        return this.products;
    }
    addProduct(cloneToAdd) {
        this.products[cloneToAdd["id"].toString()] = cloneToAdd;
    }
    removeProduct(cloneId) {
        delete this.products[cloneId];
    }
    addQuantitiesObject(quantityObject) {
        this.quantities = quantityObject;
    }
    addQuantityOfProduct(productId, quantity) {
        this.quantities[productId.toString()] = quantity;
    }
    howManyProducts() {
        return Object.keys(this.products).length;
    }
}
// ###############
// ### GLOBALS ###
// ###############
// (Because I don't know how to do this otherwise.)
var allClonesList;
var globalUserObject;
var globalOrder;
// #################
// ### FUNCTIONS ###
// #################
function renderOrderTable() {
    let tableBody = document
        .getElementById("orderTable")
        .getElementsByTagName("tbody")[0];
    // First, empty the table's body:
    tableBody.innerHTML = "";
    if (globalOrder.howManyProducts() === 0) {
        tableBody.innerHTML = "[ Aún no hay productos registrados en la orden actual. ]";
    }
    else {
        let currentRow, currentCell, currentInputElement;
        let currentClone;
        let clonesList = Object.values(globalOrder.getProducts());
        for (currentClone of clonesList) {
            // Open/Create the current row:
            currentRow = document.createElement("tr");
            // First cell: id + brand + procesor
            currentCell = document.createElement("td");
            currentCell.innerHTML
                = `ID: ${currentClone["id"]} | ${currentClone["brand"]} ${currentClone["procesor"]}`;
            currentRow.appendChild(currentCell);
            // Second cell: Quantity to add - input element
            currentInputElement = document.createElement("input");
            currentInputElement.setAttribute("cloneId", currentClone["id"].toString());
            currentInputElement.className = "form-control";
            currentInputElement.type = "number";
            currentInputElement.min = "0";
            currentInputElement.max = currentClone["quantity"].toString();
            currentInputElement.value = "1";
            currentInputElement.required = true;
            // disabled IF product not available
            if (currentClone["availability"] === false) {
                currentInputElement.disabled = true;
            }
            currentCell = document.createElement("td");
            currentCell.appendChild(currentInputElement);
            currentRow.appendChild(currentCell);
            // Third cell: Button to remove entry from order
            let currentRemoveButton = document.createElement("button");
            currentRemoveButton.setAttribute("buttonType", "removeCloneFromOrder");
            currentRemoveButton.setAttribute("cloneId", currentClone["id"].toString());
            currentRemoveButton.className = "btn btn-danger";
            currentRemoveButton.innerHTML = "Quitar";
            currentCell = document.createElement("td");
            currentCell.appendChild(currentRemoveButton);
            currentRow.appendChild(currentCell);
            // Insert row in the table body:
            tableBody.appendChild(currentRow);
        }
    }
}
function renderClonesTable(baseApiUrl, entriesHtmlTableDivId) {
    // I use the fetch function for API interactions instead of JQuery's ajax:
    fetch(baseApiUrl + "/all")
        .then(response => response.json())
        .then(data => {
        // Add the list of all clones to our global variable allClonesList:
        allClonesList = data;
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
        htmlTableCurrentHeaderCell.innerHTML = "Añadir?";
        htmlTableHeaderRow.appendChild(htmlTableCurrentHeaderCell);
        htmlTableHeader.appendChild(htmlTableHeaderRow);
        htmlTable.appendChild(htmlTableHeader);
        // Fill the rest of the table:
        let htmlTableBody = document.createElement("tbody");
        let htmlTableCurrentRow;
        for (let currentClone of data) {
            // Open current row on the table:
            htmlTableCurrentRow = document.createElement("tr");
            // Fill cells with their corresponding values,
            // following the order provided by propertiesNames:
            let htmlTableCurrentCell;
            for (let currentPropertyName of propertiesNamesList) {
                // Open the current cell:
                htmlTableCurrentCell = document.createElement("td");
                // Input info in the current cell:
                htmlTableCurrentCell.innerHTML = currentClone[currentPropertyName];
                // Then we close the current cell:
                htmlTableCurrentRow.appendChild(htmlTableCurrentCell);
            }
            // Add cells with the corresponding buttons/inputs we need:
            let htmlCurrentButton;
            htmlTableCurrentCell = document.createElement("td");
            htmlCurrentButton = document.createElement("button");
            // Cannot add the product to the order if the product isn't available!
            if (currentClone["availability"] === false) {
                htmlCurrentButton.disabled = true;
                htmlCurrentButton.className = "btn btn-secondary";
                htmlCurrentButton.innerHTML = "No está disponible";
            }
            else {
                htmlCurrentButton.className = "btn btn-success";
                htmlCurrentButton.innerHTML = "Añadir a la orden";
            }
            // This Event Listener adds the current clone to the currentOrder global,
            // and updates the Order table:
            htmlCurrentButton.addEventListener("click", function () {
                globalOrder.addProduct(currentClone);
                renderOrderTable();
            });
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
// #################
// ### EXECUTION ###
// #################
// Prevent the page to be shown unless you are logged in as a seller:
window.onload = function () {
    let mainBody = document.getElementById("mainBody");
    let currentUserString = window.localStorage.getItem("currentUserInfo");
    if (currentUserString === "") {
        mainBody.innerHTML
            = "<p>Lo sentimos. Solo puedes ver esta página si estás logueado/a como <b>Asesor/a Comercial</b>.</p>";
    }
    else {
        globalUserObject = JSON.parse(currentUserString);
        if (globalUserObject["type"] !== "ASE") {
            mainBody.innerHTML
                = "<p>Lo sentimos. Solo puedes ver esta página si estás logueado/a como <b>Asesor/a Comercial</b>.</p>";
        }
        else {
            globalOrder = new Order(new Date(), globalUserObject);
            renderClonesTable("http://localhost:8080/api/clone", "clonesTableDiv");
            let orderForm = document.getElementById("orderForm");
            // Event Bubbling: With one event we can control the functionality of all
            // dynamically created buttons in the orderForm:
            orderForm.addEventListener("click", function (event) {
                if (event.target.getAttribute("buttonType") === "removeCloneFromOrder") {
                    let currentButton = event.target;
                    globalOrder.removeProduct(currentButton.getAttribute("cloneId"));
                    renderOrderTable();
                }
            });
            orderForm.addEventListener("submit", function (event) {
                event.preventDefault();
                let inputsList = document
                    .getElementById("orderForm")
                    .getElementsByTagName("input");
                let quantitiesObject = new Object();
                for (let currentInput of inputsList) {
                    quantitiesObject[currentInput.getAttribute("cloneId")]
                        = currentInput.value;
                }
                globalOrder.addQuantitiesObject(quantitiesObject);
                console.log(globalOrder);
                let fetchProperties = {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(globalOrder)
                };
                fetch("http://localhost:8080/api/order/new", fetchProperties)
                    .then(res => res.json())
                    .then(function (data) {
                    document
                        .getElementById("orderTable")
                        .getElementsByTagName("tbody")[0]
                        .innerHTML = "";
                    alert("La orden ha sido agregada exitosamente. Tu coordinador/a de zona la revisará pronto.");
                });
            });
        }
    }
};
export {};
