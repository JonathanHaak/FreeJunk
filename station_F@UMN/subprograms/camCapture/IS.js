console.log("Image Uploader Program Initalized");

var picURI = null;
var imageElement = document.getElementById("imagePlaceholder");
var inputElement = document.getElementById('picInput');

inputElement.addEventListener("change",(e)=>{
    convertToURI(inputElement.files[0]);
});

imageElement.addEventListener("drop", (e)=>{
    var droppedFiles = e.dataTransfer.files;
    console.log("Drop Heard! Here's what I captured:");
    console.log(droppedFiles);
    var imgName = droppedFiles[0].name;
    imageElement.style.opacity = 1;
    stop_borderAnimation();
    imageElement.style.border = "dashed 3px black";
    setTimeout(()=>{
        imageElement.style.border = "dashed 3px black";
    }, 200);
    convertToURI(droppedFiles[0]);
});

function convertToURI(imgToConvert){
    imageElement.src = "imgLoading.gif";

    const reader = new FileReader();

    reader.addEventListener("load", ()=>{
        picURI = reader.result;
        console.log("~URI TRANSLATION COMPLETE!...");
        console.log(picURI);
        imageElement.src = picURI;
        ResizeImage(picURI);
    });

    reader.readAsDataURL(imgToConvert);
}

imageElement.addEventListener("dragenter", (e)=>{
    console.log("Dragged over");
    borderAnimation();
});

imageElement.addEventListener("dragleave", (e)=>{
    console.log("Drag left");
    stop_borderAnimation();
    imageElement.style.border = "dashed 3px black";
});

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    imageElement.addEventListener(eventName, preventDefaults, false);
});

var frameA;
var frameB;
function borderAnimation(){
    var blinkInterval = 400;
    imageElement.style.border = "dashed 3px white";
    setTimeout(()=>{
        imageElement.style.border = "dashed 3px black";
    }, blinkInterval/2);
    setTimeout(()=>{
        imageElement.style.border = "dashed 3px white";
    }, blinkInterval);
    frameA = setInterval(()=>{
        imageElement.style.border = "dashed 3px white";
    }, blinkInterval);
    setTimeout(()=>{
        frameB =setInterval(()=>{
            imageElement.style.border = "dashed 3px black";
        }, blinkInterval);
    }, blinkInterval/2);
}

function stop_borderAnimation(){
    clearInterval(frameA);
    clearInterval(frameB);
}

imageElement.addEventListener("mouseenter", ()=>{
    imageElement.style.opacity = 0.5;
});
imageElement.addEventListener("mouseleave", ()=>{
    imageElement.style.opacity = 1;
});


/*-------------------------IMG RESIZING STUFF-------------------------*/
$(document).ready(function() {
    $('#imageFile').change(function(evt) {
        var files = evt.target.files;
        var file = files[0];
        if (file) {
            var reader = new FileReader();
            reader.onload = function(e) {
                document.getElementById('preview').src = e.target.result;
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


var MAX_WIDTH = 1000;
var MAX_HEIGHT = 1000;

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
/*                    if(device == "webpage"){
                        MAX_WIDTH = 2500;
                        MAX_HEIGHT = 2500;
                    }else{
                        MAX_WIDTH = 400;
                        MAX_HEIGHT = 400;
                    }                           */
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
    if(uri.substring(0,50).indexOf("data:image") != -1){
        ResizeImage(uri);
    }else{
        alert("That upload was not an image!");
    }
}
function submitImg(){
    $.post("/", {command: "convertURItoPNG", uri: eval($("#uri_hiddenInput")[0].value), timestamp: $("#captureTimestamp_hiddenInput")[0].value});
    fetch('/getQRBack')
        .then(response => response.json())
        .then(data => {
        
    });
}