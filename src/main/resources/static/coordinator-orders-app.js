// ###############
// ### GLOBALS ###
// ###############
// (Because I don't know how to do this otherwise.)
var globalUserObject;
var globalOrdersList;
// #################
// ### FUNCTIONS ###
// #################
function renderOrdersTable() {
    // Get orders from the user's zone:
    fetch("http://localhost:8080/api/order/zona/" + globalUserObject.zone)
        .then(response => response.json())
        .then(function (ordersList) {
        console.log(ordersList);
        globalOrdersList = ordersList;
        console.log(globalOrdersList);
        let ordersTableBodyElement = document.getElementById("ordersTableBody");
        ordersTableBodyElement.innerHTML = "";
        let currentRow;
        let currentCell;
        let currentMoreInfoButton, currentApproveOrderButton, currentRejectOrderButton;
        // If there are no entries in the database, render a message saying so, and return:
        if (ordersList.length === 0) {
            ordersTableBodyElement.innerHTML = "[ Actualmente no hay ordenes registradas en el sistema. ]";
            return;
        }
        // Fill the table with BAD PRACTICES:
        for (let i = 0; i < ordersList.length; i++) {
            // Open current row on the table:
            currentRow = document.createElement("tr");
            // ID:
            currentCell = document.createElement("td");
            currentCell.innerHTML = ordersList[i]["id"];
            currentRow.append(currentCell);
            // Name:
            currentCell = document.createElement("td");
            currentCell.innerHTML = ordersList[i]["salesMan"]["name"];
            currentRow.append(currentCell);
            // Email:
            currentCell = document.createElement("td");
            currentCell.innerHTML = ordersList[i]["salesMan"]["email"];
            ;
            currentRow.append(currentCell);
            // Register Day:
            currentCell = document.createElement("td");
            currentCell.innerHTML = ordersList[i]["registerDay"];
            currentRow.append(currentCell);
            // Status:
            currentCell = document.createElement("td");
            if (ordersList[i]["status"] === "Aprobada")
                currentCell.setAttribute("style", "color:yellow");
            else if (ordersList[i]["status"] === "Rechazada")
                currentCell.setAttribute("style", "color:red");
            currentCell.innerHTML = ordersList[i]["status"];
            currentRow.append(currentCell);
            // More Info Button:
            currentCell = document.createElement("td");
            currentMoreInfoButton = document.createElement("button");
            currentMoreInfoButton.className = "btn btn-success";
            currentMoreInfoButton.setAttribute("data-bs-toggle", "modal");
            currentMoreInfoButton.setAttribute("data-bs-target", "#orderMoreInfoModal");
            currentMoreInfoButton.setAttribute("buttonType", "showProductsOfOrder");
            currentMoreInfoButton.setAttribute("orderIndex", i.toString());
            currentMoreInfoButton.innerHTML = "Ver Clones";
            currentCell.appendChild(currentMoreInfoButton);
            currentRow.appendChild(currentCell);
            // Approve order button: 
            currentCell = document.createElement("td");
            currentApproveOrderButton = document.createElement("button");
            currentApproveOrderButton.className = "btn btn-primary";
            currentApproveOrderButton.setAttribute("buttonType", "approveOrder");
            currentApproveOrderButton.setAttribute("orderIndex", i.toString());
            currentApproveOrderButton.innerHTML = "Aprobar Orden";
            currentCell.appendChild(currentApproveOrderButton);
            currentRow.appendChild(currentCell);
            // Reject order button:
            currentCell = document.createElement("td");
            currentRejectOrderButton = document.createElement("button");
            currentRejectOrderButton.className = "btn btn-danger";
            currentRejectOrderButton.setAttribute("buttonType", "rejectOrder");
            currentRejectOrderButton.setAttribute("orderIndex", i.toString());
            currentRejectOrderButton.innerHTML = "Rechazar Orden";
            currentCell.appendChild(currentRejectOrderButton);
            currentRow.appendChild(currentCell);
            // Append the current row to the table body:
            ordersTableBodyElement.appendChild(currentRow);
        }
    });
}
// #################
// ### EXECUTION ###
// #################
// Prevent the page to be shown unless you are logged in as a coordinator:
window.onload = function () {
    let mainBody = document.getElementById("mainBody");
    let currentUserString = window.localStorage.getItem("currentUserInfo");
    if (currentUserString === "") {
        mainBody.innerHTML
            = "<p>Lo sentimos. Solo puedes ver esta página si estás logueado/a como <b>Coordinador/a</b>.</p>";
    }
    else {
        globalUserObject = JSON.parse(currentUserString);
        if (globalUserObject["type"] !== "COORD") {
            mainBody.innerHTML
                = "<p>Lo sentimos. Solo puedes ver esta página si estás logueado/a como <b>Coordinador/a</b>.</p>";
        }
        else {
            // If logged in as a COORD, render the Orders Table and set up the event listener for the "More Info" buttons:
            renderOrdersTable();
            document.getElementById("ordersTable").addEventListener("click", function (event) {
                let currentButton = event.target;
                if (currentButton.getAttribute("buttonType") === "showProductsOfOrder") {
                    let currentOrder = globalOrdersList[parseInt(currentButton.getAttribute("orderIndex"))];
                    document
                        .getElementById("orderMoreInfoModalTitle")
                        .innerHTML
                        = `Productos de la orden #${currentOrder["id"]}`;
                    let modalBody = document.getElementById("orderMoreInfoModalBody");
                    modalBody.innerHTML = "";
                    let productsObject = currentOrder["products"];
                    for (let currentProductObject of Object.values(productsObject)) {
                        let propsToSpanishNames = {
                            "id": "id",
                            "brand": "Marca",
                            "procesor": "Procesador",
                            "os": "Sistema Operativo",
                            "memory": "Memoria RAM",
                            "hardDrive": "Disco Duro",
                            "availability": "Disponible",
                            "price": "Precio",
                            "quantity": "Cantidad en stock",
                            "photography": "Foto",
                            "description": "Descripción"
                        };
                        let currentProductInfoTable = document.createElement("table");
                        currentProductInfoTable.setAttribute("width", "100%");
                        let currentRow, currentCellAttributeName, currentCellAttributeValue;
                        for (let currentProp in propsToSpanishNames) {
                            currentRow = document.createElement("tr");
                            currentCellAttributeName = document.createElement("td");
                            currentCellAttributeName.innerHTML = `<b>${propsToSpanishNames[currentProp]}:</b>`;
                            currentCellAttributeValue = document.createElement("td");
                            if (currentProp === "availability") {
                                if (currentProductObject["availability"])
                                    currentCellAttributeValue.innerHTML = "SÍ";
                                else
                                    currentCellAttributeValue.innerHTML = "NO";
                            }
                            else {
                                currentCellAttributeValue.innerHTML = currentProductObject[currentProp];
                            }
                            currentRow.appendChild(currentCellAttributeName);
                            currentRow.appendChild(currentCellAttributeValue);
                            currentProductInfoTable.appendChild(currentRow);
                        }
                        // Add the asked-for quantity for the product: globalOrdersList currentProductObject
                        currentRow = document.createElement("tr");
                        currentRow.setAttribute("style", "color:yellow");
                        currentCellAttributeName = document.createElement("td");
                        currentCellAttributeName.innerHTML
                            = `<b>Cantidad para esta orden:</b>`;
                        currentCellAttributeValue = document.createElement("td");
                        currentCellAttributeValue.innerHTML
                            = `<b>${currentOrder.quantities[currentProductObject["id"]]}</b>`;
                        currentRow.appendChild(currentCellAttributeName);
                        currentRow.appendChild(currentCellAttributeValue);
                        currentProductInfoTable.appendChild(currentRow);
                        // Append created table to the modal body and add a space:
                        modalBody.appendChild(currentProductInfoTable);
                        modalBody.appendChild(document.createElement("hr"));
                    }
                }
                else if (currentButton.getAttribute("buttonType") === "approveOrder") {
                    let orderUpdaterObject = new Object();
                    orderUpdaterObject["id"]
                        = globalOrdersList[parseInt(currentButton.getAttribute("orderIndex"))]["id"];
                    orderUpdaterObject["status"] = "Aprobada";
                    console.log(orderUpdaterObject);
                    let fetchProperties = {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(orderUpdaterObject)
                    };
                    fetch("http://localhost:8080/api/order/update", fetchProperties)
                        .then(res => res.json())
                        .then(function (data) {
                        alert("La orden ha sido aprobada exitosamente. Podrás ver el cambio reflejado en la tabla de órdenes.");
                        renderOrdersTable();
                    });
                }
                else if (currentButton.getAttribute("buttonType") === "rejectOrder") {
                    let orderUpdaterObject = new Object();
                    orderUpdaterObject["id"]
                        = globalOrdersList[parseInt(currentButton.getAttribute("orderIndex"))]["id"];
                    orderUpdaterObject["status"] = "Rechazada";
                    let fetchProperties = {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(orderUpdaterObject)
                    };
                    fetch("http://localhost:8080/api/order/update", fetchProperties)
                        .then(res => res.json())
                        .then(function (data) {
                        alert("La orden ha sido rechazada exitosamente. Podrás ver el cambio reflejado en la tabla de órdenes.");
                        renderOrdersTable();
                    });
                }
            });
        }
    }
};
export {};
