console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n~~serveStation.js initiated...~~\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");

//#######     --Import Node Modules--     #######                 #######                 #######                 #######                 #######
var cp = require("child_process");
const process = require('process');
const express = require("express"); 
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");
const imageDataURI = require("image-data-uri");
const https = require('https');
const url = require('url');
const imageToUri = require('image-to-uri');
const request = require("request");
const requestIp = require('request-ip');
const EventEmitter = require('events')
const myEmitter = new EventEmitter();
const { MongoClient } = require('mongodb');
const fse = require("fs-extra");

//#######           --Globals--          #######                 #######                 #######                 #######                 #######
function c(str){
    console.log(str);
}
var objectNum = 0;
var LOCATIONS = null;

var commonRetailerData = fs.readFileSync(path.dirname(__dirname)+"/station_F@UMN/commonRetailers.json").toString();
//console.log("commonRetailerData as string: "+commonRetailerData + " " +typeof(commonRetailerData));
commonRetailerData = JSON.parse(commonRetailerData);
//console.log("commonRetailerData parsed: "+ commonRetailerData + " " +typeof(commonRetailerData));
var commonRetailersArray = commonRetailerData.retailers_commonGoods;
console.log("commonRetailersArray: "+commonRetailersArray +"\n");

var uncommonRetailerData = fs.readFileSync(path.dirname(__dirname)+"/station_F@UMN/uncommonRetailers.json").toString();
//console.log("retailerData as string: "+uncommonRetailerData + " " +typeof(uncommonRetailerData));
uncommonRetailerData = JSON.parse(uncommonRetailerData);
//console.log("retailerData parsed: "+ uncommonRetailerData + " " +typeof(uncommonRetailerData));
var uncommonRetailersArray = uncommonRetailerData.retailers_uncommonGoods;
console.log("uncommonRetailerArray: "+uncommonRetailersArray +"\n");

//#######     --Setup Express Port--     #######                 #######                 #######                 #######                 #######
/*      

const app = express();

app.use(express.static(path.join(__dirname, ".")));
app.use(bodyParser.json({limit: '200mb'}));
app.use(bodyParser.urlencoded({limit: '200mb', extended: true}));
const PORT = process.env.PORT || 3001;

app.listen(PORT, function(){
    console.log("Server started on port "+PORT+"! Working Directory:"+path.join(__dirname, ".")+"\n\n -----Ready to Load page, auxiliary setup will continue-----\n\n\n\n");
});

*/

const router = express.Router();
router.use(express.static(path.join(__dirname, ".")));

router.get(["/","/donationPage"], function(req, res){
    res.sendFile(__dirname+"/addPage.html");
});
router.get("/walkthrough", function(req, res){
    res.sendFile(__dirname+"/fullWalkthrough.html");
});
router.get("/getObjectNum", function(req, res){
    res.json({objNumber: objectNum});
});

fse.copy(path.join(__dirname,"..","Free@UMN","LocationMap_Images"), path.join(__dirname, "LocationMap_Images"),  (err)=>{
    if (err){
        console.log('An error occured while copying the folder.')
        return console.error(err)
    }
    console.log('Copy completed!');
});

router.post("/", function(req, res){
    console.log("Incomming Post from /, command: "+req.body.command);
    
    if(req.body.command == "saveDonationImg"){
        c("Saving donation image as obj"+objectNum+".png...");
        
        //c("URI sent...");
        //c(req.body.uri);
        
        generateImg(req.body.uri);
        
        res.status(204).send();
    }else if(req.body.command == "beginDontaion"){
        c("Beginning donation: creating new object data file and identifying with lens.js...");
        fs.writeFile(path.join(__dirname,"automationFiles","choppingBoard",("obj"+objectNum+"Data.json")),'{"img":"'+req.body.imgPath+'", "location":"'+req.body.bin+'"}', (err)=>{
            if(err){
                c(" !!! Unable to create obj#Data.json file");
            }else{
                c("Telling lens.js to process a new obj (#: "+objectNum+")...");
                lensAF.send({"command": "recognize new image", "objectNum": objectNum, "picName": req.body.imgPath});
            }
        });
        res.status(204).send();
    }else if(req.body.command == "namify"){
        c("Namifying object: "+req.body.objNum);
        
        var nameAFChild = cp.fork(path.dirname(__dirname)+"/station_F@UMN/automationFiles/name.js", [req.body.objNum, "deployment"]);

        nameAFChild.on("message",(data)=>{
            console.log("nameAFChild sent station server page: "+data);
        });
        
        res.status(204).send();
    }else if(req.body.command == "catagorizeAndLogObject"){
        c("Logging object: "+req.body.objNum);
        
        donationAutomation();
        
        res.status(204).send();
    }else if(req.body.command == "deleteObjectData"){
        c("Object: "+req.body.objNum + " failed to meet all donation criteria, running detetion on its data...");

        res.status(204).send();
    }else if(req.body.command == "updateLocationsArray"){
        c("Recieved command to save new locations array: "+req.body.data);
//process.send({command: "updateLocationsArray", data: req.body.data});
        
        res.status(204).send();
    }else{
        c("serveStation.js receieved a post with a command it did not recognize");
        res.status(204).send();
    }
});

process.on("message",(data)=>{
    console.log("serveFreeAtUMN server sent stationChild: "+data);
    if(data.command == "returningLocations"){
        c("returningLocations event occured");
        LOCATIONS = data.data;
        myEmitter.emit("sendLocations"+locIteraion);
    }else{
        console.log("serveFreeAtUMN Server sent stationChild a command it did not recognize");
    }
});

var locIteraion = 0;
/*router.get("/getLOCATIONS", function(req, res){ 
    c("/getLOCATIONS fetch heard, attempting to get locations from parent...");

//process.send({command: "sendLocations"});

    myEmitter.on("sendLocations"+locIteraion, ()=>{
        c("sendLocations" +locIteraion+" event fullfilled! sending fetch resolution...");
        locIteraion++;
        res.send({data: LOCATIONS});
        c("resolution sent!");
    });

});
*/

function deleteObjData(objNum){
    var objectData = fs.readFileSync(path.dirname(__dirname)+"/station_F@UMN/automationFiles/choppingBoard/obj"+objNum+"Data.json").toString();
    console.log("objectData: "+objectData + " " +typeof(objectData));
    var objectData = JSON.parse(objectData);
    console.log("objectData: "+ objectData + " " +typeof(objectData));

    var directoryPath = path.dirname(__dirname)+"/station_F@UMN/automationFiles/choppingBoard/";
    fs.unlink(directoryPath + objectData.img, (err) => {if (err) { c("could not delete file "+directoryPath + fileName); }else{console.log("Deleted File "+directoryPath + fileName+"successfully.");}});
    fs.unlink(directoryPath + "obj"+objNum+"Data", (err) => {if (err) { c("could not delete file "+directoryPath + fileName); }else{console.log("Deleted File "+directoryPath + fileName+"successfully.");}});
    fs.unlink(directoryPath + "rawObj"+objNum+"Data", (err) => {if (err) { c("could not delete file "+directoryPath + fileName); }else{console.log("Deleted File "+directoryPath + fileName+"successfully.");}});
}


//#######     --Auatomation Handling--     #######                 #######                 #######                 #######                 #######
var lensAF = cp.fork(path.dirname(__dirname)+"/station_F@UMN/automationFiles/lens.js", ["empty", "deployment"]);    c("lens program started");
lensAF.on("exit",(code, signal)=>{
    c("Oops, lens.js closed, that's not supposed to happen!");
});
lensAF.on("message",(data)=>{
    console.log("lens.js sent serveStation.js: "+data+" ("+typeof(data)+")");
    if(data.command == "checkCriteria2"){
        console.log("Criteria 2 sent: "+data.data);
        evaluateCriteria2(data.data);
    }else if(data.command == "checkCriteria3"){
        console.log("Criteria 3 sent: "+data.data);
        evaluateCriteria3(JSON.parse(data.data));
    }else if(data.command == "status"){
        console.log("Station Server file recieved status from lens.js: '"+data.data+"'");
    }else if(data.command == "readyToRevieveImgs"){
        c("lens.js has sent serveStation.js a message that it is ready to recieve images");
        //processImgWithLensAF("hp1.png");
    }else{
        console.log("Station Server file recieved a message from lens.js with a command it did not regognize: "+data.command);
    }
});

function donationAutomation(/*res*/){
    var childAF1 = cp.fork(path.dirname(__dirname)+"/station_F@UMN/automationFiles/LOGMASTER.js", [objectNum, "deployment"]);
    //if(res != undefined) res.send({"result":"done"});

    childAF1.on("message",(data)=>{
        console.log("Logmaster sent station server page: "+data);
    });
}

//#######     --Criteria Stuff--     #######                 #######                 #######                 #######                 #######
router.get("/criteriaCheck", function(req, res){
    var queryObject = url.parse(req.url,true).query;
    console.log("---criteriaCheck Fetch Request: query object: "+JSON.stringify(queryObject)+" --- object Number: "+queryObject.oNum + " --- Criteria Number: "+queryObject.cNum);
    var localObjectNum = parseInt((queryObject.oNum));
    var localCriteriaNum = parseInt((queryObject.cNum));

    c("obj"+localObjectNum+"_criteria"+localCriteriaNum+" event handler created");
    myEmitter.on("obj"+localObjectNum+"_criteria"+localCriteriaNum, ()=>{
        c("obj"+localObjectNum+"_criteria"+localCriteriaNum+"Fullfilled event occured, in event handler");
        res.send({"passVal": criteriaResults["obj"+localObjectNum+"_c"+localCriteriaNum]}); 

        if(criteriaResults["obj"+objectNum+"_c2"] != undefined && criteriaResults["obj"+objectNum+"_c3"] != undefined){
            reset();
        }
    });
});

var criteriaResults = {};

function evaluateCriteria2(criteriaData){
    c("evaluating criteria 2...");
    if(criteriaData > 0.20){        //Reset to a better value once you've tested on some objects
        c(">>>>>Criteria 2 passed<<<<<");
        criteriaResults["obj"+objectNum+"_c2"] = "pass";
    }else{
        c("<<<<<Criteria 2 failed>>>>>");
        criteriaResults["obj"+objectNum+"_c2"] = "fail";
    }
    myEmitter.emit("obj"+objectNum+"_criteria"+2);
    c("obj"+objectNum+"_criteria"+2+" event emitted");
}
function evaluateCriteria3(sourceArr){
    c("evaluating criteria 3...");
    var obscureResult = ( generateObscuraScore(sourceArr) >= 0 );
    c("obscureResult: "+ obscureResult);
    if(obscureResult){
        c(">>>>>Criteria 3 passed<<<<<");
        criteriaResults["obj"+objectNum+"_c3"] = "pass";
    }else{
        c("<<<<<Criteria 3 failed>>>>>");
        criteriaResults["obj"+objectNum+"_c3"] = "fail";
    }
    myEmitter.emit("obj"+objectNum+"_criteria"+3);
    c("obj"+objectNum+"_criteria"+3 +" event emitted");
}

function generateObscuraScore(sourceArr){
    var obsuraScore = 0;
    c("number of sources to check: "+sourceArr.length);
    sourceArr.forEach((source)=>{
        c("running obscura check on source: "+ source);
        if(commonRetailersArray.includes(source)){
            obsuraScore += 10;
            c("source common, +10");
        }else if(uncommonRetailersArray.includes(source)){
            obsuraScore -= 3;
            c("source uncommon, -3");
        }else{
            obsuraScore -= 1;
            c("source nuetral, -1");
        }
    });
    c("obsuraScore: "+ obsuraScore);
    return obsuraScore;
}

function reset(){
    c("Reseting serveStation.js's varibles for next lens.js run");
    objectNum++;
}

async function generateImg(imgURI){
    console.log("Beginning Image Regeneration...");
    await imageDataURI.outputFile(imgURI, __dirname+"/automationFiles/choppingBoard/obj"+objectNum+".png").then(res => {
        console.log("Image Regeneration complete v/");
        //console.log("Img: "+imgPath+" - done regenerating");
    });
}

//#######     --Functions From Main Server.js--     #######                 #######                 #######                 #######                 #######
function updateLocArray(newLocArray, callback){
    console.log("updateCatArray initiated...");
    LOCATIONS = newLocArray;
    astrasystem_client.db("JunkLord").collection("GLOBALS").updateOne({name: "LOCATIONS"}, {$set: {data: newLocArray}}).then((err,data)=>{
        console.log("Loc Array Updated! Is now: "+LOCATIONS);
        callback();
    });    //DB
}

module.exports = router;
