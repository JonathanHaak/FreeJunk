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


fse.copy(path.join(__dirname,"..","Free@UMN","LocationMap_Images"), path.join(__dirname, "LocationMap_Images"),  (err)=>{
    if (err){
        console.log('An error occured while copying the folder.')
        return console.error(err)
    }
    console.log('Copy completed!');
});

process.on("message",(data)=>{
    console.log("serveFreeAtUMN server sent stationChild: "+data);
    if(data.command == "returningLocations"){
        c("returningLocations event occured");
        LOCATIONS = data.data;
        myEmitter.emit("sendLocations"+locIteraion);
    }else if(data.command == ">>donatePost"){
        //CONSTRUCTION ZONE!!/////////////////////////////////////////////////////////////
        c(">>donatePost event occured! serveFreeAtUMN.js heard a donatePost and redirected it as a process message to the serveStation file! The Subcommand is: "+data.subcommand);
        if(data.subcommand == "saveDonationImg"){
            c("Saving donation image as obj"+objectNum+".png...");

            generateImg(data.uri);

            console.log("saveDonationImg process complete, telling parent to resolve the post  -- this post had #: "+data.postNum);
            process.send({command: "resolveDataPost", postNum: data.postNum});
        }else if(data.subcommand == "beginDontaion"){
            c("Beginning donation: creating new object data file and identifying with lens.js...");
            fs.writeFile(path.join(__dirname,"automationFiles","choppingBoard",("obj"+objectNum+"Data.json")),'{"img":"'+data.imgPath+'", "location":"'+data.bin+'"}', (err)=>{
                if(err){
                    c(" !!! Unable to create obj#Data.json file");
                }else{
                    c("Telling lens.js to process a new obj (#: "+objectNum+")...");
                    lensAF.send({"command": "recognize new image", "objectNum": objectNum, "picName": data.imgPath});
                }
            });

            console.log("beginDontaion process complete, telling parent to resolve the post  -- this post had #: "+data.postNum);
            process.send({command: "resolveDataPost", postNum: data.postNum});
        }else if(data.subcommand == "namify"){
            c("Namifying object: "+data.objNum);

            var nameAFChild = cp.fork(path.dirname(__dirname)+"/station_F@UMN/automationFiles/name.js", [data.objNum, "deployment"]);

            nameAFChild.on("message",(data)=>{
                console.log("nameAFChild sent station server page: "+data);
            });

            console.log("namify process complete, telling parent to resolve the post  -- this post had #: "+data.postNum);
            process.send({command: "resolveDataPost", postNum: data.postNum});

        }else if(data.subcommand == "catagorizeAndLogObject"){
            c("Logging object: "+data.objNum);

            donationAutomation();

            console.log("catagorizeAndLogObject process complete, telling parent to resolve the post  -- this post had #: "+data.postNum);
            process.send({command: "resolveDataPost", postNum: data.postNum});
        }else if(data.subcommand == "deleteObjectData"){
            c("Object: "+data.objNum + " failed to meet all donation criteria, running detetion on its data...");

            console.log("deleteObjectData process complete, telling parent to resolve the post  -- this post had #: "+data.postNum);
            process.send({command: "resolveDataPost", postNum: data.postNum});
        }else if(data.subcommand == "updateLocationsArray"){
            c("Recieved command to save new locations array: "+data.data);
            //process.send({command: "updateLocationsArray", data: data.data});

            console.log("updateLocationsArray process complete, telling parent to resolve the post  -- this post had #: "+data.postNum);
            process.send({command: "resolveDataPost", postNum: data.postNum});
        }else{
            c("serveStation.js receieved a post with a command it did not recognize");
            process.send({command: "resolveDataPost", postNum: data.postNum});
        }
        //CONSTRUCTION ZONE!!/////////////////////////////////////////////////////////////
    }else if("criteriaCheck"){

        var queryObject = data.url;
        console.log("---criteriaCheck Fetch Request: query object: "+JSON.stringify(queryObject)+" --- object Number: "+queryObject.oNum + " --- Criteria Number: "+queryObject.cNum);
        var localObjectNum = parseInt((queryObject.oNum));
        var localCriteriaNum = parseInt((queryObject.cNum));        

        c("obj"+localObjectNum+"_criteria"+localCriteriaNum+" event handler created");
        myEmitter.on("obj"+localObjectNum+"_criteria"+localCriteriaNum, ()=>{
            c("obj"+localObjectNum+"_criteria"+localCriteriaNum+"Fullfilled event occured, in event handler");
            
            console.log("criteriaCheck process complete, telling parent to resolve the post  -- this post had #: "+data.postNum);
            process.send({command: "resolveCriteriaCheck", criteriaResults: criteriaResults, localObjectNum: localObjectNum, localCriteriaNum: localCriteriaNum, postNum: data.postNum});

            if(criteriaResults["obj"+objectNum+"_c2"] != undefined && criteriaResults["obj"+objectNum+"_c3"] != undefined){
                reset();
            }
        });

    }else{
        console.log("serveFreeAtUMN Server sent stationChild a command it did not recognize");
    }
});

var locIteraion = 0;

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
    //if(res != undefined) res.send({"result":"done"});

    childAF1.on("message",(data)=>{
        console.log("Logmaster sent station server page: "+data);
    });
}

//#######     --Criteria Stuff--     #######                 #######                 #######                 #######                 #######


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
