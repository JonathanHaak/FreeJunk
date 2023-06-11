//:::::::::::::::::::::::::::::::::::::::::
// This file handles:
//      >The part modification feature
//:::::::::::::::::::::::::::::::::::::::::
console.log("partModification JS File Initated");
var partData = "";

function storeDataforPartMod(){
    var inventoryIndex = document.getElementById("meta_indexLocation").content;    //record index of the part in the Inventory Array
    console.log("This part is stored at Inventory Array index: " + inventoryIndex);
    //In the complete Node.js version, the program would retrieve the data from the Inventory JSON array here, but for now let's just use a random entry...
    partData = ["Tiny Metal Collars", "Shelf 5d", "", ["Mechanical Pencils"], "", "IMG_20200409_175017.jpg", false, "These came from mechanical pencils"];
    window.location.href = "addPart.html"; //send the user to the add a part page
    //*****ISSUE!****** You can't change pages without aborting this function!! Need some Node/JSON action here to save the data stored above to a seperate file and then somehow prompt addPart.html to modify itself accordingly onload
}

function changeAAPForPartMod(){
    //Replace the inputs with the part data
    //Replace teh part image
    //change the add part button's text and onclick function
    //add an abort button
    //if the stored location exists in the array
        //change the map location to match the location stored
    //collapse the catagory map to the point where the stored catagory exists
}

function executePartMod(){
    //delete old part at index which was stored earlier
    //save part data at the index where the old one was
    //bring user back to the main page
    //pull up a part view based on the origional stored Inventory index
}
//g