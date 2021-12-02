// ###############
// ### IMPORTS ###
// ###############
import { renderEntriesTable, updateClone, registerClone } from "./functions.js";
// #################
// ### EXECUTION ###
// #################
// Adds the "renderEntriesTable" function to the Event Listener of the "loadClonesButton" button:
document
    .getElementById("loadClonesButton")
    .addEventListener("click", function () {
    renderEntriesTable("http://localhost:8080/api/clone", "clonesTableDiv", updateClone);
});
// Add an event listener to the "submit" event of the Add New User form:
document
    .getElementById("newCloneForm")
    .addEventListener("submit", function (event) {
    event.preventDefault();
    // Make this general:
    registerClone();
});
