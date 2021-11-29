"use strict";
// ### FUNCTIONS ###
function renderEntriesTable(getAllEntriesApi, entriesHtmlTableDivId) {
    // I use the fetch function for API interactions instead of JQuery's ajax:
    fetch(getAllEntriesApi)
        .then(response => response.json())
        .then(data => {
        let entriesHtmlTableElement = document.getElementById(entriesHtmlTableDivId);
        // First we empty the contents of the HTML table:
        entriesHtmlTableElement.innerHTML = "";
        // If there are no entries in the database, render a message saying so, and return:
        if (data.length === 0) {
            entriesHtmlTableElement.innerHTML
                = "[ Actualmente no hay entradas de este tipo registradas en el sistema. ]";
            return;
        }
        // Initialize the code of a new HTML table, using Bootstrap classes:
        let htmlTableCode = "<div class='table-responsive'><table class='table table-dark table-striped'><tr>";
        // Grab all the property names for the corresponding entries:
        let propertiesNamesList = Object.keys(data[0]);
        // Fill out the header row of the HTML table:
        for (let currentPropertyName of propertiesNamesList) {
            htmlTableCode += `<th>${currentPropertyName}</th>`;
        }
        // Close the header row, leaving spaces for the Update and Delete buttons:
        htmlTableCode += "<th>UPDATE</th><th>DELETE</th></tr>";
        // Fill the rest of the table:
        for (let currentEntry of data) {
            // Open current row on the table:
            htmlTableCode += "<tr>";
            // Fill cells with their corresponding values,
            // following the order provided by propertiesNames:
            for (let currentPropertyName of propertiesNamesList) {
                // Open the current cell:
                htmlTableCode += "<td>";
                // If the property is a password, REDACT IT!:
                if (currentPropertyName === "password") {
                    htmlTableCode += "<strong>[REDACTED]</strong>";
                }
                // ELSE, place in the current cell the value corresponding to the property name,
                // of the current entry:
                else {
                    htmlTableCode += currentEntry[currentPropertyName];
                }
                // Then we close the current cell:
                htmlTableCode += "</td>";
            }
            // Add cell with the corresponding "Update" button:
            htmlTableCode += "<td><button class='btn btn-warning'>Actualizar</button></td>";
            // Add cell with the corresponding "Delete" button:
            htmlTableCode += "<td><button class='btn btn-danger'>Eliminar</button></td>";
            // Close current row on the table:
            htmlTableCode += "</tr>";
        }
        // Close table:
        htmlTableCode += "</table>";
        // Load the table HTML code in the <div> with the "entriesHtmlTableDivId":
        entriesHtmlTableElement.innerHTML = htmlTableCode;
    });
}
// ### EXECUTION ###
document
    .getElementById("loadUsersButton")
    .addEventListener("click", () => renderEntriesTable("http://localhost:8080/api/user/all", "usersTableDiv"));
