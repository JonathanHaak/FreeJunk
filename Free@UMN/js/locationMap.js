//)))))))))))))))))))))))))))))))))))))))))
// This file handles:
//      >Navigating the locations[] array with the location Map
//      >Modifying the location array
//)))))))))))))))))))))))))))))))))))))))))
console.log("locationsMap JS File Initated");

var locations = null;

window.addEventListener('load', function(){
    fetch_LOCATIONS(locStartup);
});
function locStartup(){
    console.log("Locations Array: ");
    console.log(locations);
    displayLocation("locations"); //This draws the markers on the basement image when the page loads
}
var canvas = document.getElementById("locationCanvas");
var ctx = canvas.getContext("2d");
var arrayLocation = [0];

function drawMarker(x, y, r, color){
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fillStyle = color;
    ctx.fill();
}

function getMousePos(evnt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evnt.clientX - rect.left,
        y: evnt.clientY - rect.top
    };
}

function moveMarker(evt){
    ctx.beginPath();
    ctx.fillStyle = "red";
    window.requestAnimationFrame(function loop(){
        ctx.clearRect(0, 0, canvas.getBoundingClientRect().width, canvas.getBoundingClientRect().height);
        ctx.arc(getMousePos(evt).x, getMousePos(evt).y, 5, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
    })
}

var freshImg = false;
var currentArrayLocation = "";
var currentMarkers = [];
function displayLocation(arraylocation){
    ctx.clearRect(0,0, 300, 200);    //clear canvas
    currentArrayLocation = arraylocation;
    console.log("displayLocation() is creating the map at: " + currentArrayLocation);
    if(freshImg){
        document.getElementById("canvasBackground").src = eval(picURI);
        freshImg = false;
    }else{
        if(typeof(arraylocation) == 'object'){  //this is a work around for displaying the root location not working after add location
            arraylocation = "locations";
        }
        document.getElementById("canvasBackground").src = "LocationMap_Images/"+eval(arraylocation+"[1]");
    }
    ctx.fillStyle = "blue";
    document.getElementById("drawingMarkersMessage").style.visibility = "visible";
    currentMarkers = [];
    for(var i = 0; i < eval(arraylocation+"[4]").length; i++){ //convert array to actual markers on the page with a name that matches the location name
        var sublocation = arraylocation+"[4]["+i+"]";
        console.log("In for Loop");
        console.log("Drawing location of "+eval(sublocation+"[0]")+" at ("+eval(sublocation+"[2]")+","+eval(sublocation+"[3]")+")");
        var locMiniArray = [];
        locMiniArray.push(eval(sublocation+"[0]"));
        locMiniArray.push(eval(sublocation+"[2]"));
        locMiniArray.push(eval(sublocation+"[3]"));
        if(eval(sublocation)[0] == document.getElementById("location").value){
            drawMarker(eval(sublocation+"[2]"),eval(sublocation+"[3]"),5,"#ffbc1f");
            locMiniArray.push(true);
        }else if(eval(sublocation).length == 5){
            drawMarker(eval(sublocation+"[2]"),eval(sublocation+"[3]"),5,"blue");
            locMiniArray.push(true);
        }else{
            drawMarker(eval(sublocation+"[2]"),eval(sublocation+"[3]"),5,"#b3dfff");   
            locMiniArray.push(false);
        }
        currentMarkers.push(locMiniArray);
        //currentMarkers.push("["+eval(sublocation+"[0]")+","+eval(sublocation+"[2]")+","+eval(sublocation+"[3]")+"]");
    }
    document.getElementById("drawingMarkersMessage").style.visibility = "hidden";
    console.log("Current Markers Array: " + JSON.stringify(currentMarkers));
    console.log("currentArrayLocation: "+currentArrayLocation);
    if(currentArrayLocation == "locations"){
        console.log("can't go back any further! deactivating back button");
        document.getElementById("locMapBack").style.opacity = "0.5";
        document.getElementById("locMapBack").style.pointerEvents = "none";
    }else{
        document.getElementById("locMapBack").style.opacity = "1";
        document.getElementById("locMapBack").style.pointerEvents = "auto";
    }
}

var placingMaker = false;
var newLocation = "";
var changelocations = false;
canvas.addEventListener("mousemove", function( event ) {   
    if(!locMap_editMode){
        var hovering = false;
        for(var i = 0; i < currentMarkers.length; i++){
            if(Math.round(getMousePos(event).x) < currentMarkers[i][1]+7 && Math.round(getMousePos(event).x) > currentMarkers[i][1]-7 && Math.round(getMousePos(event).y) < currentMarkers[i][2]+7 && Math.round(getMousePos(event).y) > currentMarkers[i][2]-7){//if user hovering over marker...
                drawMarker(currentMarkers[i][1], currentMarkers[i][2], 5, "yellow");
                hovering = true;
            }else{
                if(currentMarkers[i][0] == document.getElementById("location").value.split(":")[0]){
                    drawMarker(currentMarkers[i][1], currentMarkers[i][2], 5, "#ffbc1f");
                }else if(currentMarkers[i][3]){
                    drawMarker(currentMarkers[i][1], currentMarkers[i][2], 5, "blue");
                }else{
                    drawMarker(currentMarkers[i][1], currentMarkers[i][2], 5, "#b3dfff");
                }
                document.body.style.cursor = "default";
            }
        }
        if(hovering){
            document.body.style.cursor = "pointer";
        }
    }
}, false);
canvas.addEventListener("mousedown", function( event ) {   
    if(!locMap_editMode){
        detectLoop:
        for(var i = 0; i < currentMarkers.length; i++){
            if(Math.round(getMousePos(event).x) < currentMarkers[i][1]+7 && Math.round(getMousePos(event).x) > currentMarkers[i][1]-7 && Math.round(getMousePos(event).y) < currentMarkers[i][2]+7 && Math.round(getMousePos(event).y) > currentMarkers[i][2]-7){//if user clicking on a marker...
                console.log("You clicked on the location: "+currentMarkers[i][0]);
                if(newLocCreationStep == "newLoc_branch"){
                    document.getElementById("locCreateInput").value = currentMarkers[i][0];
                    setTimeout(function(){  //for some reason the .focus() doesn't work without this
                        document.getElementById("locCreateInput").focus();
                    });
                    if(currentMarkers[i][3]){   //if contains an image and pathway...
                        newLocation = currentArrayLocation+"[4]["+i+"]";
                        changelocations = true;
                    }
                    break detectLoop;
                }else{
                    if(clickTarget == ""){
                        document.getElementById("location").value = currentMarkers[i][0];
                    }else if(clickTarget == "loc1"){
                        document.getElementById("transBox_loc1").value = currentMarkers[i][0];
                    }else if(clickTarget == "loc2"){
                        document.getElementById("transBox_loc2").value = currentMarkers[i][0];
                    }
                    //debugger;
                    if(currentMarkers[i][3]){   //if contains an image and pathway...
                        newLocation = currentArrayLocation+"[4]["+i+"]";
                        changelocations = true;
                        setTimeout(function(){
                            //if(wind){
                            if(clickTarget == ""){
                                try{document.getElementById("tags").focus();}catch{}
                            }else if(clickTarget == "loc1"){
                                document.getElementById("transBox_loc2").focus();
                            }else if(clickTarget == "loc2"){
                                document.getElementById("submitLocTransfereButton").focus();
                            }
                            //}
                        });
                        break detectLoop;
                    }else{
                        setTimeout(function(){
                            if(clickTarget == ""){
                                try{document.getElementById("tags").focus();}catch{}
                            }else if(clickTarget == "loc1"){
                                document.getElementById("transBox_loc2").focus();
                            }else if(clickTarget == "loc2"){
                                document.getElementById("submitLocTransfereButton").focus();
                            }
                        });
                        break detectLoop;
                    }
                }
            }
        }
        if(changelocations){
            displayLocation(newLocation);   //call draw markers function with the array location parameter
            setTimeout(function(){
                document.body.style.cursor = "default";
            }, 0);
        }else{      //This fixes the bug where the old yellow marker stuck around until you moved the mouse and a true blue dot was replaced with a light blue dot after it was deselected 
            displayLocation(currentArrayLocation);
        }
        changelocations = false;
        document.getElementById("redArrowWrap").style = "display: none";
        document.getElementById("locInexistentMessage").style = "display: none";
    }
    if(newLocCreationStep == "newLoc_location"){
        newLoc_location = [getMousePos(event).x-1, getMousePos(event).y-1];
        document.getElementById("locCreateInput").value = JSON.stringify(newLoc_location);
        drawMarker(getMousePos(event).x-1, getMousePos(event).y-1, 5, "red");
        document.getElementById("locCreateInput").style.color = "black";
        setTimeout(function(){
            document.getElementById("locCreateInput").focus();
        });
    }
}, false);
canvas.addEventListener("mouseleave", function( event ) {   //This just restores the markers and mouse if there is an unregestered mouse departure from the canvas
    if(!locMap_editMode){
        for(var i = 0; i < currentMarkers.length; i++){
            if(currentMarkers[i][0] == document.getElementById("location").value){
                drawMarker(currentMarkers[i][1], currentMarkers[i][2], 5, "#ffbc1f");
            }else if(currentMarkers[i][3]){
                drawMarker(currentMarkers[i][1], currentMarkers[i][2], 5, "blue");
            }else{
                drawMarker(currentMarkers[i][1], currentMarkers[i][2], 5, "#b3dfff");
            }
            document.body.style.cursor = "default";
        }
    }else{

    }
}, false);

var breakAllLoopLayers = false;
var locationExists = false;
function checkLocExistence(){
    console.log("Checking if that location exists");
    locationExists = false;
    var locationToFind = document.getElementById("location").value.split(":")[0];
    if(document.getElementById("location").value == "" || document.getElementById("location").value == "UMN Campus"){//The search doesn't include the outer-most location entry (full house), and want to deactivate if the location line is empty.  
        locationExists = true;
    }else{
        searchLocLayer("locations[4]", locationToFind);//comb through locations array
    }
    if(!locationExists){
        document.getElementById("redArrowWrap").style = "display: block";
        document.getElementById("locInexistentMessage").style = "display: block";
    }else{
        document.getElementById("redArrowWrap").style = "display: none";
        document.getElementById("locInexistentMessage").style = "display: none";
    }
    breakAllLoopLayers = false;
}
function resetLocAnimation(){
    document.getElementById("location").style = "";
}

function searchLocLayer(layer, target){        //This function is used to find and display a randomly inputed location if it exists 
    Loop:
    for(var i = 0; i < eval(layer).length; i++){
        if(breakAllLoopLayers){
            break Loop;
        }
        var layerObject = layer+"["+i+"]";
        console.log("LayerObject is: "+layer+"["+i+"]");
        console.log(eval(layerObject)[0]);
        if(eval(layerObject)[0] == target){
            console.log("found the location!");
            locationExists = true;
            displayLocation(layer.substring(0,layer.length-3));
            breakAllLoopLayers = true;
            break Loop;
        }
        if(eval(layerObject).length > 4){
            var newLayer = layerObject+"[4]";
            searchLocLayer(newLayer, target);
        }
    }
}
var foundLocIndex = ""; 
function searchLayerII(layer, target){        //This function is used to find and record the index of a randomly inputed location if it exists
    breakAllLoopLayers = false;
    Loop:
    for(var i = 0; i < eval(layer).length; i++){
        if(breakAllLoopLayers){
            break Loop;
        }
        var layerObject = layer+"["+i+"]";
        console.log("LayerObject is: "+layer+"["+i+"]");
        console.log(eval(layerObject)[0]);
        if(eval(layerObject)[0] == target){
            foundLocIndex = layerObject;
            console.log("found the location!: " + foundLocIndex);
            locationExists = true;
            breakAllLoopLayers = true;
            break Loop;
        }
        if(eval(layerObject).length > 4){
            var newLayer = layerObject+"[4]";
            searchLayerII(newLayer, target);
        }
    }
}

function goBack(){
    currentArrayLocation = currentArrayLocation.substring(0, currentArrayLocation.length-6);
    displayLocation(currentArrayLocation);
}

function goHome(){
    displayLocation("locations");
}


var newLoc_name = "";
var newLoc_branch = "";
var newLoc_location = [];
var pressforCreateMode = true;
var newLocCreationStep = "";
function initialte_or_cancel_CreateLoc(){
    if(pressforCreateMode){
        document.getElementById("locCreationWrap").style = "display: block";
        document.getElementById("locCreateInput").style = "display: inline-block";
        document.getElementById("locCreateInput").focus();
        document.getElementById("createPathwayButton").innerHTML = "Cancel";
        newLocCreationStep = "newLoc_name";
        document.getElementById("locCreationWrap_text").innerHTML = "New Location Name:";
    }else{
        document.getElementById("createPathwayButton").innerHTML = "Add Location";
        document.getElementById("locCreationWrap").style = "display: none";
        document.getElementById("locationCanvas").style.cursor = "";
        document.getElementById("locationCanvas").style.border = "black 2px solid";
        newLocCreationStep = "newLoc_name";
        newLoc_name = "";
        newLoc_branch = ""; 
        newLoc_location = [];
        newLocCreationStep = "";
        document.getElementById("locCreateInput").value = "";
    }
    pressforCreateMode = !pressforCreateMode;
}

document.addEventListener('keydown', event => {
    if(event.keyCode === 13 && document.activeElement.id == 'locCreateInput'){
        changeStep: {
            if(newLocCreationStep == "newLoc_name"){
                newLoc_name = document.getElementById("locCreateInput").value;
                document.getElementById("locCreateInput").value = eval(currentArrayLocation+"[0]");
                newLocCreationStep = "newLoc_branch";
                document.getElementById("locCreationWrap_text").innerHTML = "Branch New Location off of:";
                document.getElementById("locCreateInput").focus();
                break changeStep;
            }
            if(newLocCreationStep == "newLoc_branch"){
                newLoc_branch = document.getElementById("locCreateInput").value;
                locationExists = false;
                if(newLoc_branch == "UMN Campus"){ //The search doesn't include the outer-most location entry (full house)  
                    locationExists = true;
                    foundLocIndex = locations;
                }else{
                    searchLayerII("locations[4]", newLoc_branch);   //find branch in locations array and record its index
                }
                if(locationExists){
                    if(eval(foundLocIndex).length == 4){   //if selected branch has no child leaves
                        document.getElementById('file-input_forNewLoc').click();  //prompt the user to enter an image
                        //wait until the user selects a file to move on, the execution of this block of code continues below as an event listener for the file-input
                    }else{
                        document.getElementById("locCreateInput").value = "";
                        newLocCreationStep = "newLoc_location";
                        document.getElementById("locCreationWrap_text").innerHTML = "Place marker on map...";
                        document.getElementById("locCreateInput").style.color = "grey";
                        document.getElementById("locCreateInput").style = "text-align: center; color: grey";
                        document.getElementById("locCreateInput").value = "...location will go here...";
                        document.getElementById("locationCanvas").style.cursor = "crosshair";
                        document.getElementById("locCreateInput").blur();
                        document.getElementById("locationCanvas").style.border = "red 2px solid";
                        break changeStep;
                    }
                }else{
                    alert("It doesn't look like that branch exists! please try again");
                }
            }
            if(newLocCreationStep == "newLoc_location"){
                newLoc_location = document.getElementById("locCreateInput").value;
                document.getElementById("locCreateInput").style = "text-align: left";
                document.getElementById("locationCanvas").style.cursor= ""; //This gets rid of the crosshair value but also lets the cursor be a pointer if hovering over a locaiton
                document.getElementById("locCreateInput").value = "";
                document.getElementById("locationCanvas").style.border = "black 2px solid";
                newLocCreationStep = "done";
                eval(foundLocIndex)[4].push([]);
                eval(foundLocIndex)[4][eval(foundLocIndex)[4].length-1].push(newLoc_name);
                eval(foundLocIndex)[4][eval(foundLocIndex)[4].length-1].push("");
                eval(foundLocIndex)[4][eval(foundLocIndex)[4].length-1].push(eval(newLoc_location+"[0]"));
                eval(foundLocIndex)[4][eval(foundLocIndex)[4].length-1].push(eval(newLoc_location+"[1]"));
                document.getElementById("location").value = newLoc_name;     //Put this new location into the location input box
                setTimeout(function(){  //for some reason the .focus() doesn't work without this
                    document.getElementById("name").focus();
                });
                initialte_or_cancel_CreateLoc();

                $.post("/addPart.html", {command: "updateLOCs", data: JSON.stringify(locations)});

                /*document.getElementById("command_hiddenInput").value = "updateLOCs";
                document.getElementById("data_hiddenInput").value = JSON.stringify(locations);
                document.getElementById("hiddenForm").submit();*/

                displayLocation(foundLocIndex);     // <this will change the marker from red to Astradux color
                locAddedAnimation();     //cool confirmation animation that makes the border turn green and fade back to black
                break changeStep;
            }            
        }
    }
})

var slashIndex = null; //This will store where we have to start our substring
var newBracnchImageSrc = null;
document.getElementById('file-input_forNewLoc').addEventListener("change",()=>{
    newBracnchImageSrc = document.getElementById('file-input_forNewLoc').value;

    SearchforSlash:{    //Now we have to isolate the last part of the file path that contians the file name...
        for(var i = newBracnchImageSrc.length-1; i >= 0; i--){
            if(newBracnchImageSrc.charAt(i) == "\\"){   //is the character a backslash? (in js two \\ in a string = one \)
                slashIndex = i;
                break SearchforSlash;
            }
        }
    }

    freshImg = true;
    convertToURI(document.getElementById('file-input_forNewLoc').files[0]);

    console.log("You selected the image with SRC: "+newBracnchImageSrc);

    //The stuff that used to be here was moved into convertToURI() in addPart.js

    document.getElementById("locCreateInput").value = "";
    newLocCreationStep = "newLoc_location";
    document.getElementById("locCreationWrap_text").innerHTML = "Place marker on map...";
    document.getElementById("locCreateInput").style.color = "grey";
    document.getElementById("locCreateInput").style = "text-align: center; color: grey";
    document.getElementById("locCreateInput").value = "...location will go here...";
    document.getElementById("locationCanvas").style.cursor = "crosshair";
    document.getElementById("locCreateInput").blur();
    document.getElementById("locationCanvas").style.border = "red 2px solid";
}, false);

var locMap_editMode = false;
function locMap_enterEditMode(){
    locMap_editMode = true;
    //change appearance of the canvas to "edit mode"
    //Change the pencil icon to a checkmark icon
    //Change onclick of the locMapEditImg to locMap_exitEditMode
}

function locMap_exitEditMode(){
    locMap_editMode = false;
    //restore the appearance of the canvas
    //Change the checkmark icon to a pencil icon
    //Change onclick of the locMapEditImg to locMap_enterEditMode
}

function locAddedAnimation(){
    var greenVal = 270;
    var decreaseColor = setInterval(frame, 50);
    console.log("beggining locAddedAnmination");
    borderColor = "2px solid rgb(0,"+greenVal+",0)";

    function frame() {
        if(greenVal <= 0){            
            clearInterval(decreaseColor);
            console.log("Border color back to black, exiting animation");
        }else{
            greenVal -= 15;
            document.getElementById("locationCanvas").style.border = "2px solid rgb(0,"+greenVal+",0)";
            console.log("decreating border-green");
        }
    }
}

var clickTarget = "";
var activePage = window.location.href.split("/").pop();
if(activePage == "Astradux.html" || activePage == ""){
    setTimeout(()=>{
        displayLocation("locations[4][1][4][0]");
    }, 1);
    try{
        $("#transBox_loc1")[0].onclick = ()=>{clickTarget = "loc1";}
        $("#transBox_loc2")[0].onclick = ()=>{clickTarget = "loc2";}
        $("#transBox_loc1")[0].onfocus = ()=>{clickTarget = "loc1";}
        $("#transBox_loc2")[0].onfocus = ()=>{clickTarget = "loc2";}
        $("#transBox_loc1")[0].onfocusout = ()=>{setTimeout(()=>{clickTarget = "";},100);}
        $("#transBox_loc2")[0].onfocusout = ()=>{setTimeout(()=>{clickTarget = "";},100);}
    }catch{}
}

////////////////////Location hours tool






