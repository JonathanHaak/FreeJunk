const express = require("express"); 
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const imageToUri = require('image-to-uri');
const imageDataURI = require("image-data-uri");

app.use(express.static(path.join(__dirname, ".")));
app.use(bodyParser.json({limit: '200mb'}));
app.use(bodyParser.urlencoded({limit: '200mb', extended: true}));

console.log("Server Initiated! Working Directory (for server js file):"+path.join(__dirname, "."));

const PORT = process.env.PORT || 8080;
app.listen(PORT, function(){
    console.log("Server started on port 8080");
});

app.get("/", function(req, res){
    res.sendFile(__dirname+"/IS.html");        
});

app.post("/", function(req, res){
    if(req.body.command == "convertURItoPNG"){
        console.log("Post request recieved to Read QR Code...");
        generateImg(req.body.uri,'/receivedImage.png');
    }else{
        console.log("Post recieved with unrecognized command");
    }
});

async function generateImg(imgURI, imgPath){
    console.log("Beginning Image Regeneration...");
    await imageDataURI.outputFile(imgURI, "."+imgPath).then(res => {
        console.log("Image Regeneration complete v/");
        console.log("Img: "+imgPath+" - done regenerating");
    });
}