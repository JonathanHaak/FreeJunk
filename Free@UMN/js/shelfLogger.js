//Structure of Shelf Array: [“color”,”Place Title”,[longitude, latitude],[ > bin array <:: [[“_#”,fullBoolean,”pathToBinImage”], ...] ], [path image image paths from front door], ”youtubeVideoLink_coffmannToFrontdoor”, ”pathToFinalDestinationImage”]

var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

c("~shelfLogger.js initiated~");

var shelfImageURI = null;
var imagePathwayURIs = [];
var imagePathwayNames = [];
var binImageURIs = [[],[]];

a("addBtn").onclick = ()=>{
    var allValues = true;

    $("input").toArray().forEach((el)=>{
        c(el.value);
        if(el.value == ""){
            allValues = false;
            console.log(el);
        }
    });

    if(allValues){
        c("Hey! All inputs have a value!");

        recursivelySaveAllImages();

        a("addBtn").remove();
    }else{
        alert("Whoops unable to comply, one or more inputs are missing a value");
    }
}


function buildShelfArray(){
    locations.push([[v("shelfColor").toLowerCase(), v("placeTitle").toLowerCase(), [v("longitudeInput").toLowerCase(), v("latitudeInput").toLowerCase()],buildBinArray(),buildImgPathArray(),v("videoURLInput").toLowerCase(),a("shelfImg").files[0].name]]);
}

function buildBinArray(){
    var binArrayResult = [];

    for(var row = 0; row < shelfSize[0]; row++){
        for(var col = 0; col < shelfSize[1]; col++){
            binArrayResult.push([v("shelfColor").toLowerCase()+aphabet[row]+(col+1), false, document.getElementById("binInput"+row+"_"+col).files[0].name]);
        }
    }

    c("binArrayResult: ");
    c(binArrayResult );
    return binArrayResult;
}
function buildImgPathArray(){
    var imgPathArrayResult = [];
    
    for(var i = 0; i < imagePathwayURIs.length; i++){
        imgPathArrayResult.push(imagePathwayNames[i]);
    }

    return imgPathArrayResult;
}

function recursivelySaveAllImages(){
    //Structure of allImagesToSave: [[shelfImgName,shelfImgURI],[pathwayImg1Name,pathwayImg1URI],...,[pathwayImgNName,pathwayImgNURI], [binImg1_1Name,binImg1_1URI],...,[binImgRow_ColName,binImgRow_ColURI]]
    var allImagesToSave = [];

    //Assemble allImagesToSave array
    allImagesToSave.push([document.getElementById("shelfImg").files[0].name, shelfImageURI]);

    for(var i = 0; i < imagePathwayURIs.length; i++){
        allImagesToSave.push([imagePathwayNames[i],imagePathwayURIs[i]]);
    }

    for(var row = 0; row < shelfSize[0]; row++){
        for(var col = 0; col < shelfSize[1]; col++){
            allImagesToSave.push([document.getElementById("binInput"+row+"_"+col).files[0].name, binImageURIs[row][col]]);
        }
    }

    c("allImagesToSave:");
    c(allImagesToSave );

    //Define a recursive function that sends the image URI and name in a post, and a fetch that waits until the post goes through and then triggers the recurzive function again until the all allImagesToSave function is fully traversed through

    function saveImg(i){
        c("Saving Image "+i);
        if(typeof(allImagesToSave[i][1]) == "string"){
            $.post("/shelfLogger", {command: "saveImg", data: {name: allImagesToSave[i][0], uri: allImagesToSave[i][1]}});
        }else{
            debugger;
            throw "That image was not in form string!";
        }
        fetch('/shelfImageSaved')
            .then(response => response.json())
            .then(data => {
            document.body.appendChild(document.createTextNode("Image uploaded!"));
            console.log(data);
            i++;
            if(i < allImagesToSave.length){
                //setTimeout(()=>{
                    saveImg(i);
                //},1000);
            }else{
                //Finally, call saveShelfArrayText()
                saveShelfArray();
            }
        });
    }
    saveImg(0);
}

var locations = null;
function fetch_LOCATIONS(callback){
    console.log("Fetching LOCATIONS...");
    fetch('/getLOCATIONS')
        .then(response => response.json())
        .then(data => {
        console.log("LOCATIONS fetched: "+ data);
        locations = eval(data);
        callback();
    });
}
fetch_LOCATIONS(()=>{});

function saveShelfArray(){
    buildShelfArray();
    document.body.appendChild(document.createTextNode("Array uploaded!"));
    
    document.body.appendChild(document.createTextNode("Awesome! Everything uploaded!"));
    $("table")[0].remove();
    $.post("/shelfLogger", {command: "saveShelfArray", data: JSON.stringify(locations)});
}

a("endPath").onclick = ()=>{
    a("pathwayImage").remove();
    a("endPath").remove();
    document.getElementById('imagePathway'+(imagePathwayURIs.length+1)).remove();
}

var shelfSize = [null, null];
var selectedBin = [null,null];
function checkInputsAndBuildBinTable(){
    c("Hey! A row or column input lost focus!");

    const rowInput = document.getElementById('rowInput');
    const columnInput = document.getElementById('columnInput');

    if (rowInput.value >= 0 && columnInput.value >= 0) {
        // Both inputs has have a number above 0
        console.log('One of the inputs is empty');
        
                shelfSize[0] = parseInt(a("rowInput").value);
        shelfSize[1] = parseInt(a("columnInput").value);

        binImageURIs = new Array(shelfSize[0]).fill(0).map(() => new Array(shelfSize[1]).fill(0));

        try{ $("table")[0].remove(); }catch{}
        c("Creating bin input table...");
        var table = document.createElement("table");
        a("tableAnchor").appendChild(table);
        for(var row = 0; row < a("rowInput").value; row++){
            var newRow = document.createElement("tr");
            table.appendChild(newRow);
            for(var col = 0; col < a("columnInput").value; col++){
                var newCol = document.createElement("td");
                newRow.appendChild(newCol);

                var binImage = document.createElement("img");
                binImage.src = "";
                binImage.id = "binImg"+row+"_"+col;
                binImage.style = "height: 20px";
                var binInput = document.createElement("input");
                binInput.type = "file";
                binInput.id = "binInput"+row+"_"+col;
                binInput.accept = "application/jpg, application/png, application/svg, application/gif, application/jpeg";
                binInput.style = "";

                newCol.appendChild(binImage);
                newCol.appendChild(binInput);
            }
        }

        c("creating event listeners... ");
        for(var row = 0; row < a("rowInput").value; row++){
            for(var col = 0; col < a("columnInput").value; col++){
                c("assigning event handler to input for row: "+row+" & col: "+col);
                $("#binInput"+row+"_"+col)[0].onclick = (e)=>{
                    selectedBin[0] = parseInt(e.currentTarget.id.substring(8,e.currentTarget.id.indexOf('_')));
                    selectedBin[1] = parseInt(e.currentTarget.id.substring(e.currentTarget.id.indexOf('_')+1));
                }
                $("#binInput"+row+"_"+col).change(function(evt) {
                    c("binInput"+row+"_"+col+" input EH triggered");
                    var files = evt.target.files;
                    var file = files[0];
                    if(file){
                        var reader = new FileReader();
                        reader.onload = function(e) {
                            console.log("selectedBin...");
                            c(selectedBin);

                            try{
                                binImageURIs[parseInt(selectedBin[0])][parseInt(selectedBin[1])] = e.target.result;
                            }catch{
                                debugger;
                            }

                            document.getElementById("binImg"+selectedBin[0]+"_"+selectedBin[1]).src = e.target.result;

                        }
                        reader.readAsDataURL(file);
                    }

                });
            }
        }
        a("rowInput").remove();
        a("columnInput").remove();
    } else {
        // Something else happens
        console.log('Something else happens');
        
        
    }

}
a("shelfColor").value = "blue";
a("placeTitle").value = "Anderson Labs";
a("longitudeInput").value = "44.9748889";
a("latitudeInput").value = "-93.2331667";
a("videoURLInput").value = "https://www.youtube.com/watch?v=MtN1YnoL46Q&ab_channel=forrestfire101";

a("rowInput").onblur = ()=>{checkInputsAndBuildBinTable()};
a("columnInput").onblur = ()=>{checkInputsAndBuildBinTable()};


/*-------------------------IMAGE STUFF-------------------------*/
function createTimestamp(){
    var clock = new Date();
    timestamp_picName = clock.getFullYear()+"-"+(clock.getMonth()+1)+"-"+clock.getDate()+"_"+clock.getHours()+"_"+clock.getMinutes()+"_"+clock.getSeconds()+"_"+clock.getMilliseconds()+".png";
    jQuery($("#captureTimestamp_hiddenInput")[0]).attr("value",timestamp_picName);
    return timestamp_picName;
}

$(document).ready(function() {
    $('#shelfImg').change(function(evt) {
        var files = evt.target.files;
        var file = files[0];
        if (file) {
            var reader = new FileReader();
            reader.onload = function(e) {
                shelfImageURI = e.target.result;

                document.getElementById('shelfImage').src = e.target.result;
            };
            reader.readAsDataURL(file);

        }
    });
    $('#pathwayImage').change(function(evt) {
        var files = evt.target.files;
        var file = files[0];
        if (file) {
            var reader = new FileReader();
            reader.onload = function(e) {
                //debugger;
                imagePathwayURIs.push(e.target.result);

                imagePathwayNames.push(document.getElementById("pathwayImage").files[0].name);
                
                document.getElementById('imagePathway'+imagePathwayURIs.length).src = e.target.result;

                var pathImage = document.createElement("img");
                pathImage.id = 'imagePathway'+(imagePathwayURIs.length+1);
                pathImage.src = "";
                pathImage.style = "height: 20px";

                a("pathwayImageWrapper").appendChild(pathImage);
            };
            reader.readAsDataURL(file);

        }
    });
});

function dataURItoBlob(dataURI) {
    // convert base64/URLEncoded data component to raw binary data held in a string
    var byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0)
        byteString = atob(dataURI.split(',')[1]);
    else
        byteString = unescape(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to a typed array
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ia], {type:mimeString});
}


var MAX_WIDTH = null;
var MAX_HEIGHT = null;

var iphoneDelay = 300;
function ResizeImage(uri) {

    //------------Convert the URI back to a file Object------------//
    var fileType = uri.substring(uri.indexOf(":")+1, uri.indexOf(";"))

    var myBlob = dataURItoBlob(uri);

    var file = new File([myBlob], fileType.replaceAll("/",".") /*'image.jpeg'*/, {
        type: myBlob.type,
    });


    //------------------------------------------------------------//


    if (window.File && window.FileReader && window.FileList && window.Blob) {
        /*var filesToUploads = document.getElementById('imageFile').files;
        var file = filesToUploads[0];*/
        if (file) {
            var reader = new FileReader();
            // Set the image once loaded into file reader
            reader.onload = function(e) {
                setTimeout(()=>{
                    var img = document.createElement("img");
                    img.src = e.target.result;
                    console.log("width : "+ img.width +"px, height: " + img.height +"px");
                    var canvas = document.createElement("canvas");
                    //document.body.appendChild(canvas);
                    var ctx = canvas.getContext("2d");
                    ctx.drawImage(img, 0, 0);
                    var width = img.width;
                    var height = img.height;
                    if(device == "webpage"){
                        MAX_WIDTH = 2500;
                        MAX_HEIGHT = 2500;
                    }else{
                        MAX_WIDTH = 400;
                        MAX_HEIGHT = 400;
                    }
                    var resizeNeeded = false;
                    if (width > height) {
                        if (width > MAX_WIDTH) {
                            height *= MAX_WIDTH / width;
                            width = MAX_WIDTH;
                            resizeNeeded = true;
                        }
                    } else {
                        if (height > MAX_HEIGHT) {
                            width *= MAX_HEIGHT / height;
                            height = MAX_HEIGHT;
                            resizeNeeded = true;
                        }
                    }
                    canvas.width = width;
                    canvas.height = height;
                    setTimeout(()=>{
                        if(resizeNeeded){
                            console.log("Image found to be too big! Scaling down and resaving URI...");
                            //canvas.style = "background-color:blue";
                            var ctx = canvas.getContext("2d");
                            ctx.drawImage(img, 0, 0, width, height);
                            var smallerURI = canvas.toDataURL(file.type);
                            //document.getElementById('output').src = dataurl;
                            var newImg = document.createElement("img");
                            setTimeout(()=>{
                                newImg.src = smallerURI;
                                console.log("new image width : "+ newImg.width +"px, height: " + newImg.height +"px");
                                jQuery($("#uri_hiddenInput")[0]).attr("value", "\'"+smallerURI+"\'");
                                console.log("~Re-sized URI storage successful~");
                                submitImg();
                            },iphoneDelay);
                        }else{
                            console.log("Image found to be within acceptable size bounds");
                            submitImg();
                        }
                    },iphoneDelay);
                },iphoneDelay);
            }
            reader.readAsDataURL(file);
        }

    } else {
        alert('The File APIs are not fully supported in this browser.');
    }
}
function resizeImgWrapper(uri){
    console.log("Determining if image is too large to be POST-ed...");
    ResizeImage(uri);
}




