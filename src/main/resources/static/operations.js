"use strict";

// ###### METADATA SETUP ######

// Class for objects that will hold metadata about the database's tables:
class TableMetadata
{
    constructor( tableName, identifierName, pluralName, displayProperty, restfulApiUrl )
    {
        this._tableName = tableName;
        this._identifierName = identifierName;
        this._pluralName = pluralName;
        this._displayProperty = displayProperty;
        this._restfulApiUrl = restfulApiUrl;
    }
    
    get tableName()         { return this._tableName; }
    get identifierName()    { return this._identifierName; }
    get pluralName()        { return this._pluralName; }
    get displayProperty()   { return this._displayProperty; }
    get restfulApiUrl()     { return this._restfulApiUrl; }
}

// Input your table metadata here in the form of arrays:
// Oracle Cloud IP: 129.151.96.203
const API_BASE_URL = "http://localhost:8080/api/";
const RAW_METADATA = [
                        ["admin","id","admins","name",API_BASE_URL + "Admin"],
                        ["category","id","categories","name",API_BASE_URL + "Category"],
                        ["machine","id","machines","name",API_BASE_URL + "Machine"],
                        ["client","idClient","clients","name",API_BASE_URL + "Client"],
                        ["message","idMessage","messages","messageText",API_BASE_URL + "Message"],
                        ["reservation","idReservation","reservations","startDate",API_BASE_URL + "Reservation"],
                        ["score","idScore","scores","stars",API_BASE_URL + "Score"]
                    ];

// This Metadata Singulars Map is a MAP that uses:
// - Table names as keys (ex. "category")
// - Corresponding TableMetadata objects as values ( ex. {"tableName":"category","restfulApiUrl":""localhost:8080/blablabla,...} )
var metadataSingluralsMap = new Object();

// This Metadata Plurals Map is a MAP that uses:
// - Table names in plural as keys (ex. "categories", "machines", etc.)
// - Corresponding TableMetadata objects as values ( ex. {"tableName":"category","restfulApiUrl":""localhost:8080/blablabla,...} )
var metadataPluralsMap = new Object();

for (let i = 0; i < RAW_METADATA.length; i++)
{
    metadataSingluralsMap[ RAW_METADATA[i][0] ] = new TableMetadata( ...RAW_METADATA[i] );   
    metadataPluralsMap[ RAW_METADATA[i][2] ] = metadataSingluralsMap[ RAW_METADATA[i][0] ];
}

// ###########################################################################################
// ###### FUNCTIONS #######
// ###########################################################################################

// Function for generating a HTML dropdown list based on a particular table:
function generateDropdownMenu( tableName, singularsMap )
{   
    $.ajax(
        {   url : singularsMap[tableName].restfulApiUrl + "/all",
            type : "GET",
            datatype : "JSON",
            crossOrigin : true,
            success : function(response)
            {   
                // Start of <select> HTML code, including the "id":
                let dropdownHtml =  "<br><label for='"
                                    + tableName + "_dropdown'>"
                                    + tableName
                                    + " : </label><select required class='w3-select' name='"
                                    + tableName
                                    + "' id='"
                                    + tableName + "_dropdown'><option value='' disabled selected>Choose one option</option>";
                
                for (let entry of response)
                {
                    dropdownHtml += "<option value='"
                                    + entry[ singularsMap[tableName].identifierName ]
                                    + "'>"
                                    + entry[ singularsMap[tableName].displayProperty ]
                                    + "</option>";
                }
                
                dropdownHtml += "</select><br>";
                
                $("#htmlDropdowns").append(dropdownHtml);
            }
        } );
}

function generateMultipleDropdownMenus( tableNamesArray, singularsMap )
{
    for (let currentTableName of tableNamesArray)
    {
        generateDropdownMenu( currentTableName, singularsMap );
    }
}

// GET (ALL) IMPLEMENTATION:
function loadHtmlTable( singularsMap, pluralsMap, tableName, apiEnding, htmlTableDiv )
{
    // ###### INNER FUNCTIONS (only relevant here) ######
    
    // If a property to load is a sub-object, organize it:
    function organizeSubObject( subObject, tableName, tablesMap  )
    {   
        let resultString = "";
        let subObjectProperties = Object.keys(subObject);

        for ( let prop of subObjectProperties )
        {
            if( prop === "password")
            {
                resultString += "password : <strong>[REDACTED]</strong><br>";
            }
            else if (   prop === tablesMap[tableName].identifierName
                        || subObject[prop] instanceof Array
                        || typeof subObject[prop] === "object" )
            {
              continue;
            } 
            else
            {
              resultString += prop + " : " + subObject[prop] + "<br>";
            }
        }
        return resultString;
        
    }
    
    // If a property to load is a sub-array, organize it and prune out its sub-lists and sub-objects:
    function organizeSubArray( subArray, pluralProperty, pluralsMap )
    {    
        if (subArray.length === 0)
        {
            return "[None yet]";
        }
        else
        {
            let resultString = "";
            let subobjectsProperties = Object.keys(subArray[0]);

            for (let entry = 0; entry < subArray.length; entry++)
            {
                resultString += organizeSubObject( subArray[entry], pluralProperty, pluralsMap  )
                                + "- - -<br>";
            }
        
            return resultString;
        }
    }
    
    
    // ######## MAIN FUNCTION CODE ######
    $.ajax(
            {	url : singularsMap[tableName].restfulApiUrl + apiEnding,
                type : "GET",
                datatype : "JSON",
                crossOrigin : true,
                success : function(response) {
                    
                    // Empty elements table:
                    $(htmlTableDiv).empty();

                    if (response.length === 0) {
                        $(htmlTableDiv).append("[ Currently, there are no elements in the corresponding table. ]");
                        return;
                    }
                    
                    // Initialize a new HTML table:
                    let htmlTable = "<table class='w3-table w3-border w3-bordered'><tr>";

                    // Extract keys except for the corresonding "id", and put them in the list tablePropertiesList:
                    let tablePropertiesList =   Object
                                                .keys( response[0] )
                                                .filter( x => x !== singularsMap[tableName].identifierName );

                    // Fill out the header row:
                    for (let col = 0; col < tablePropertiesList.length; col++ )
                    {	
                        htmlTable += "<th>" + tablePropertiesList[col] + "</th>";
                    }
                    
                    // Close the header row with spaces for the Update and Delete buttons:
                    htmlTable += "<th></th><th></th></tr>";

                    // Fill the rest of the table:
                    for (let row = 0; row < response.length; row++)
                    {
                            // Open current row on the table:
                            htmlTable += "<tr>";

                            // Fill cells with their corresponding values,
                            // following the order provided by tablePropertiesList:
                            for (let prop of tablePropertiesList)
                            {   
                                htmlTable += "<td>";
                                
                                if ( prop === "password")
                                {// If the property is a password, DON'T SHOW IT
                                    htmlTable += "<strong>[REDACTED]</strong>";
                                    
                                }
                                else if ( response[row][prop] === null ) 
                                {// If the property is null, show "(None yet)"
                                    htmlTable += "[None yet]";
                                }    
                                else if (response[row][prop] instanceof Array)
                                {   // If the property is an Array, organize it accordingly for display on the table
                                    //
                                    // Organize sub-array sending in:
                                    // - The sub-array itself
                                    // - The current plural property (for instance, "machines")
                                    // - And the pluralsMap
                                    htmlTable += organizeSubArray( response[row][prop],
                                                                   prop,
                                                                   pluralsMap );
                                }
                                else if (typeof response[row][prop] === "object")
                                {
                                    htmlTable += organizeSubObject( response[row][prop],
                                                                    prop,
                                                                    singularsMap );
                                }
                                else
                                {
                                    htmlTable += response[row][prop];   
                                }
                                
                                htmlTable += "</td>";
                            }
                            
                            // Add cell with the corresponding "Update" button:
                            htmlTable += `<td><button class="w3-btn w3-orange w3-text-white" onclick="updateDatabaseEntry(${response[row][ singularsMap[tableName].identifierName ]},metadataSingluralsMap,'${tableName}')">Update</button></td>`;

                            // Add cell with the corresponding "Delete" button:
                            htmlTable += `<td><button class="w3-btn w3-red" onclick="deleteDatabaseEntry(${response[row][ singularsMap[tableName].identifierName ]},metadataSingluralsMap,'${tableName}')">Delete</button></td>`;

                            // Close current row on the table:
                            htmlTable += "</tr>";
                    }

                    // Close table:
                    htmlTable += "</table>";

                    // Load the table in the <div> with ID "items":
                    $(htmlTableDiv).append(htmlTable);
                }
            }
    );
}

// POST IMPLEMENTATION:
function createDatabaseEntry( singularsMap, tableName )
{
    let dataToUpload = new Object();
    
    // Obtain list of all the "input"-type elements contained in the HTML element "inputsForDatabase":
    let inputElements = document
                        .getElementById("inputsToUpload")
                        .getElementsByTagName("input");

    // Pass IDs and their respective values to the object entryData:
    for (let elem of inputElements)
    {	
        dataToUpload[elem.id] = elem.value;
    }
    
    // Get all values in the "htmlDropdowns" DIV,
    // so long as "htmlDropdowns" actually exists and has content:
    if ( document.getElementById("htmlDropdowns") !== null )
    {     
        let selectsList =   document
                            .getElementById("htmlDropdowns")
                            .getElementsByTagName("select");
        
        let currentSubObject, currentTableName, currentIdentifier, currentValue; 
        for ( let currentSelect of selectsList )
        {
            currentSubObject = new Object();
            currentTableName = currentSelect.name;
            currentIdentifier = singularsMap[ currentTableName ].identifierName;
            currentValue = currentSelect.value;
            
            currentSubObject[ currentIdentifier ] = currentValue;
            
            dataToUpload[ currentTableName ] = currentSubObject;
        }
    }
    
    // Stringify and upload to database:
    let dataToUploadJSON = JSON.stringify(dataToUpload);
    $.ajax(
            {
                url : singularsMap[tableName].restfulApiUrl + "/save",
                type : "POST",
                data : dataToUploadJSON,
                contentType : "application/JSON",
                datatype : "JSON",
                crossOrigin : true,
                success : function(response)
                {
                    alert("Entry added successfully! Press the \"VIEW\" button to see the changes.");
                }
            }
    );
}

// PUT IMPLEMENTATION:
// Only the properties listed in the inputElements can be edited, except for the Client's or Admin's email
// No implementation needed to update Foreign Keys or List Properties
function updateDatabaseEntry(idToUpdate, singularsMap, tableName)
{
	// Obtain list of all the "input"-type elements contained within the element "inputsToUpload":
	let inputElements = document
                            .getElementById("inputsToUpload")
                            .getElementsByTagName("input");
	
	// Create "dataToUpload" object with the id_name and corresponding id_value preloaded:
        let dataToUpload = new Object();
	dataToUpload[ singularsMap[tableName].identifierName ] = idToUpdate;

	// Generate prompts asking the user for the new inputs:
	for (let elem of inputElements)
	{	
		if (    elem.id === singularsMap[ tableName ].identifierName
                        || elem.id === "email" )
		{
                    continue;
		}
		else
		{
                    dataToUpload[elem.id] = prompt("Please enter the new " + elem.id + ":");
		}
	}

	// Stringify and upload to database:
	let dataToUploadJSON = JSON.stringify(dataToUpload);

	$.ajax(
		{
			url : singularsMap[tableName].restfulApiUrl + "/update",
			type : "PUT",
			data : dataToUploadJSON,
			contentType : "application/JSON",
			datatype : "JSON",
			success : function(response){
				alert("Entry updated successfully! Press the \"VIEW\" button to see the changes.");
			}
		}
	);
}

// DELETE IMPLEMENTATION:
function deleteDatabaseEntry(idToDelete, singularsMap, tableName)
{
	if ( confirm("Are you sure you want to delete the selected entry?") )
	{
		// Create "dataToUpload" object with the id_name and corresponding id_value preloaded:
                let dataToUpload = new Object();
                dataToUpload[ singularsMap[tableName].identifierName ] = idToDelete;
                
		// Convertir datos a formato JSON y hacer petición DELETE por medio de la función ajax:
		let dataToUploadJSON = JSON.stringify(dataToUpload);

		$.ajax(
			{
                            url : singularsMap[tableName].restfulApiUrl + "/" + idToDelete,
                            type : "DELETE",
                            data : dataToUploadJSON,
                            contentType : "application/JSON",
                            datatype : "JSON",
                            success : function(response){
                                    alert("Entry deleted successfully! Press the \"VIEW\" button to see the changes.");
                            }
			}
		);	
	}
}

