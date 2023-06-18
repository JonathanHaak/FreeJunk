//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
// This file handles:
//      >Creating location animations
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
console.log("locationAnimations JS File Initated");

console.log("Attempting to load location data from meta tag...");
var locations = null;
function emptyFunc(){
var fooElement = document.createElement("img"); 
    fooElement.id = "fooElement";
    fooElement.style.display = "none";
    document.getElementById("body").appendChild(fooElement);
    fooElement.src = "./LocationMap_Images/"+locations[1];
}
fetch_LOCATIONS(emptyFunc);

var breakAllLoopLayers_LA = false;
var foundLocationIndex_LA = "";    //This will store the array location (in string form) of the found location if it exitst
function searchLayerForCat(layer, target){        //This function is used to find and return a randomly inputed location if it exists 
    foundLocationIndex_LA = "";
    Loop:{
        for(var i = 0; i < eval(layer).length; i++){
            if(breakAllLoopLayers_LA){
                break Loop;
            }else{
                var layerObject = layer+"["+i+"]";
                console.log("LayerObject is: "+layer+"["+i+"]");
                console.log(eval(layerObject)[0]);
                if(eval(layerObject)[0] == target){
                    console.log("found the location!");
                    foundLocationIndex_LA = layerObject;
                    breakAllLoopLayers_LA = true;
                    break Loop;
                }
                if(eval(layerObject).length > 4){
                    var newLayer = layerObject+"[4]";
                    searchLayerForCat(newLayer, target);
                }
            }
        }
    }
}

var aniCanvas = document.getElementById("animationCanvas");
var ctx = aniCanvas.getContext("2d");
var backgroundImage = document.getElementById("canvasBackground");

function markerAnimation(x, y, animationPeriod){//Create a function to display a cool pointer animation
    var timer = 0;
    setTimeout(()=>{
        ctx.beginPath();
        ctx.fillStyle = "red";
        var r = 0;
        ctx.arc(x, y, 5, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.fill();
    }, 4*animationPeriod/5);
    setTimeout(()=>{
        ctx.clearRect(0,0, 300, 200);
    }, animationPeriod+(animationPeriod/15));
    setTimeout(()=>{
        ctx.beginPath();
        ctx.fillStyle = "red";
        var r = 0;
        ctx.arc(x, y, 5, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.fill();
    }, animationPeriod+animationPeriod/3);
}


var iteration = 0;
function showAmimationFrame(locationSLAVE, locIndexStr){
    console.log("Refreshing Animation Frame, on iteration: "+iteration+" showing location branch: "+eval(locIndexStr.substring(0, 9+6*iteration))[0]);
    var imageName = eval(locIndexStr.substring(0, 9+6*iteration))[1];
    backgroundImage.src = "LocationMap_Images/"+imageName;  //Set animation box background to the [1]st index of the superLocation
    iteration++;
}

var animationInterval;
function promptAnimation(location, msBetweenFrames, msAtEnd){
    foundLocationIndex_LA = "";
    searchLayerForCat("locations[4]", location);
    breakAllLoopLayers_LA = false;
    if(foundLocationIndex_LA != ""){
        iteration = 0;
        //Varible to store current location string
        var curLocStr = "";
        //Varible to store location array values to add to curLocStr. Shrinks as program progresses
        var locStrDeck = foundLocationIndex_LA;
        curLocStr += locStrDeck.substring(0,locStrDeck.indexOf("]")+1);
        locStrDeck = locStrDeck.substring(locStrDeck.indexOf("]")+1,locStrDeck.length);

        curLocStr += locStrDeck.substring(0,locStrDeck.indexOf("]")+1);
        locStrDeck = locStrDeck.substring(locStrDeck.indexOf("]")+1,locStrDeck.length);
        animationInterval = setInterval(()=>{
            console.log("Refreshing Animation Frame, on iteration: "+iteration+" showing location branch: "+eval(foundLocationIndex_LA.substring(0, 9+6*iteration))[0]+", which has index: "+foundLocationIndex_LA.substring(0, 9+6*iteration));

            var imageName = eval(curLocStr)[1];
            backgroundImage.src = "LocationMap_Images/"+imageName;

            setTimeout(()=>{document.getElementById("locAnimation_LocLine").innerHTML = eval(curLocStr)[0]},50);

            curLocStr += locStrDeck.substring(0,locStrDeck.indexOf("]")+1);
            locStrDeck = locStrDeck.substring(locStrDeck.indexOf("]")+1,locStrDeck.length);

            curLocStr += locStrDeck.substring(0,locStrDeck.indexOf("]")+1);
            locStrDeck = locStrDeck.substring(locStrDeck.indexOf("]")+1,locStrDeck.length);
            console.log("curLocStr: "+curLocStr);
            console.log("locStrDeck: "+locStrDeck);

            var pointer_xpos = eval(curLocStr)[2];   //retrieve the coordinates of the leaf you will point to 
            var pointer_ypos = eval(curLocStr)[3];

            setTimeout(()=>{ctx.clearRect(0,0, 300, 200)}, 30);
            markerAnimation(pointer_xpos, pointer_ypos, msBetweenFrames/2);

            if(curLocStr == foundLocationIndex_LA){
                console.log("Animation complete, clearing animationInterval");
                clearInterval(animationInterval);
            }
            iteration++;
        }, msBetweenFrames);   //uses recursion to traverse to the full depth of the location
        animationInterval;
    }else{
        console.log("It looks like this location does not exist in the locations array!");
        document.getElementById("canvasBackground").src = "Images/LocationNotInArray.png";
    }
}

function testAnimationFunction(){
    console.log("Test Animation Started");
    promptAnimation(document.getElementById("testLocation").value, 1000, 500);
}


function preloadLocImages(layer){     //When Node stuff is figured out, export this to add a part and run it onload there too
    /*fooElement.src = "Images/"+eval(layer)[1];
    console.log("Preloading Image");
    console.log("LayerObject is: "+layer+"["+i+"]");
    console.log(eval(layerObject)[1]);*/

    for(var i = 0; i < eval(layer).length; i++){
        var layerObject = layer+"["+i+"]";
        if(eval(layerObject)[1] != ""){
            console.log("LayerObject is: "+layer+"["+i+"]");
            console.log(eval(layerObject)[1]);
            setTimeout(()=>{fooElement.src = "./LocationMap_Images/"+eval(layerObject)[1]}, 1000);
        }
        if(eval(layerObject).length > 4){
            var newLayer = layerObject+"[4]";
            preloadLocImages(newLayer);
        }
    }
}

function pullUpLocAni(){
    console.log("Hovering over the loc line, displaying location aninmation!");
    document.getElementById("locationAnimationWrap").style.display = "block";
    var locToAnimate = document.getElementById("partView_location").innerHTML.split(":")[0];
    promptAnimation(locToAnimate, 1150, 500);
}
function closeLocAni(){
    document.getElementById("locationAnimationWrap").style.display = "none";
    document.getElementById("canvasBackground").src = "Images/LocationAniLoadingGIF.gif";
    clearInterval(animationInterval);
    ctx.clearRect(0,0, 300, 200);
    document.getElementById("locAnimation_LocLine").innerHTML = "...";
}


