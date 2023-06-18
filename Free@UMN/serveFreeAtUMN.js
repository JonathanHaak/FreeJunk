console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n~~serveFreeJunk.js initiated...~~\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");

//#######     --Import Node Modules--     #######                 #######                 #######                 #######                 #######
var cp = require("child_process");
const process = require('process');
const express = require("express"); 
const app = express();
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");
const imageDataURI = require("image-data-uri");
const https = require('https');
const url = require('url');
const imageToUri = require('image-to-uri');
const request = require("request");
const requestIp = require('request-ip');
const QRCode = require('qrcode');
var nodemailer = require('nodemailer');
var WordPOS = require('wordpos');
var EventEmitter = require("events");
var wordpos = new WordPOS();

var n = null;
var MASTER_INVENTORY = {};
var CATAGORIES = null;
var LOCATIONS = null;
var mailList = null;

function c(str){
    console.log(str);
}

//#######     --Setup Express Port--     #######                 #######                 #######                 #######                 #######
app.use(express.static(path.join(__dirname, ".")));
app.use('/donate', express.static(path.join(__dirname, "..", "station_F@UMN")));
app.use(bodyParser.json({limit: '200mb'}));
app.use(bodyParser.urlencoded({limit: '200mb', extended: true}));

const PORT = process.env.PORT || 443;

//#######     --Connect To Databases--     #######                 #######                 #######                 #######                 #######
const { MongoClient, ServerApiVersion } = require('mongodb');
var account = "JunkLord";

var totalConnections = 4;
var connections = 0;

const data_uri = "mongodb+srv://respect123:Pulsar78@cluster0.j2ptc.mongodb.net/?retryWrites=true&w=majority";
var astrasystem = "";
const astrasystem_client = new MongoClient(data_uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
const imgs1_uri = "mongodb+srv://Napoleon1234:socialEntreprenuer78@cluster0.iwt2p.mongodb.net/?retryWrites=true&w=majority";
var imagesCluster1 = "";
const imagesCluster1_client = new MongoClient(imgs1_uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
const imgs2_uri = "mongodb+srv://Napoleon78:SocialEntreprenuer78@cluster0.4ujuymr.mongodb.net/?retryWrites=true&w=majority";
var imagesCluster2 = "";
const imagesCluster2_client = new MongoClient(imgs2_uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
const imgs3_uri = "mongodb+srv://Napoleon78:SocialEntreprenuer78@cluster0.exasp4k.mongodb.net/?retryWrites=true&w=majority";
var imagesCluster3 = "";
const imagesCluster3_client = new MongoClient(imgs3_uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


//NOTE!: THIS IS WRONG!! ^ THE IMG#_URI VALUES SHOULD HAVE BEEN SAVED NOT ALL TO IMG1_URI BUT THAT MISTAKE WAS ALREADY MADE! CHANGE FOR FREE@UMN NEW INVENTORY
//          changed v/

function connectToDBs(){
    console.log("Connecting to Databases...");
    astrasystem_client.connect((res,err)=>{
        console.log("~Astrasystem Connection Established~");
        console.log("res: "+res+" err: "+err);
        astrasystem = astrasystem_client.db(account);
        connections++;
        connectionTreshold();
    });
    imagesCluster1_client.connect((res,err)=>{
        console.log("~imagesCluster1 Connection Established~");
        console.log("res: "+res+" err: "+err);
        imagesCluster1 = imagesCluster1_client.db("database").collection("collection");
        connections++;
        connectionTreshold();
    });
    imagesCluster2_client.connect((res,err)=>{
        console.log("~imagesCluster1 Connection Established~");
        console.log("res: "+res+" err: "+err);
        imagesCluster2 = imagesCluster2_client.db("database").collection("collection");
        connections++;
        connectionTreshold();
    });
    imagesCluster3_client.connect((res,err)=>{
        console.log("~imagesCluster1 Connection Established~");
        console.log("res: "+res+" err: "+err);
        imagesCluster3 = imagesCluster3_client.db("database").collection("collection");
        connections++;
        connectionTreshold();
    });
}
var collectionConnections = [];
function connectionTreshold(){
    if(connections == totalConnections){
        startup();
        collectionConnections = [astrasystem, imagesCluster1, imagesCluster2, imagesCluster3]; 
    }
}

var userTokens = [];
var adminTokens = [];

function addToken(tokenValue,tokenType, nullOrNot){
    astrasystem_client.db("Universals").collection("GLOBALS").insertOne({"value": tokenValue, "dataType": tokenType, "nullToken": nullOrNot});
    if(tokenType == "adminToken"){
        adminTokens.push(tokenValue);
    }else if(tokenType == "userToken"){
        userToken.push(tokenValue);
    }
    if(nullOrNot){
        nullTokens.push(tokenValue);
    }
}

function VAHCS_sniffer(token, source){
    console.log("Sniff called...");
    console.log(token);
    setTimeout(()=>{
        console.log("Deploying smell...");
        //const clientIp = requestIp.getClientIp(req); 
        var url = "https://vahcs-server.herokuapp.com/sniffTrigger?source="+source+"&ip="+token;
        console.log("Requesting url: "+url);
        request({url: url, json:true},(error,data) =>{
            console.log("Sniff request fullfilled!: "+error+ "---" +JSON.stringify(data));
        });
    },5);
}



//#######     --Regenerate Files--     #######                 #######                 #######                 #######                 #######
function startup(){
    console.log("\nInitiating startup procedure...\n");
    /*regenerateLocImgs();*/
    update_FILECOUNTjs();
}
var processedImgs = 0;
var numImgs = null; 
function regenerateLocImgs(){
    astrasystem_client.db("Universals").collection("LOCATION_Images").find().toArray((error, imagesArray)=>{
        numImgs = imagesArray.length;
        console.log("Regenerating Location Images...\t("+numImgs+")");
        imagesArray.forEach((img)=>{
            generateImg(img.name, img.uri, "./LocationMap_Images/"+img.name);
        });
    });

    //astrasystem_client.db("Universals").collection("LOCATION_Images").deleteMany({name:"IMG_20230205_190017.jpg"},()=>{});
}
async function generateImg(imgName, imgURI, imgPath){
    await imageDataURI.outputFile(imgURI, imgPath).then(res => {
        console.log("Location Img: "+imgName+" - done regenerating");
        processedImgs++;
        if(numImgs ==  processedImgs){
            console.log("v/ Location Image Regeneration Complete!\n");
            regenerateInvFiles();
        }
    });
}
function regenerateInvFiles(){
    astrasystem.collection("Free_Stuff_Files").find().toArray((error, invFiles)=>{
        var numFiles = invFiles.length;
        console.log("Storing Inventory into MASTER_INVENTORY object...\t("+numFiles+")");
        var processedFiles = 0;
        if(numFiles != 0){
            invFiles.forEach((file)=>{
                console.log("Collecting "+file.name+"...");
                MASTER_INVENTORY[file.name] = file.data;
                processedFiles++;
                if(numFiles ==  processedFiles){
                    console.log("v/ Inventory File Regeneration Complete!\n");
                    pullTokens();
                }
            });
        }else{
            console.log("/|\\no Inventory Files to store");
            console.log("\\|/\n");
            pullTokens();
        }
        console.log("result: "+JSON.stringify(MASTER_INVENTORY).substring(0,30));
    });
}
var nullTokens = [];
var userToken = [];
var adminToken = [];
function pullTokens(){
    astrasystem_client.db("Universals").collection("accessTokens").find({}).toArray((error, tokenData)=>{
        var numTokens = tokenData.length;
        console.log("Pulling tokens into global token arrays...");
        var storedTokens = 0;
        if(numTokens != 0){
            tokenData.forEach((token)=>{
                console.log("Sorting token: "+JSON.stringify(token)+"...");

                if(token.null){
                    nullTokens.push(token.value);
                }
                if(token.dataType == "userToken"){
                    userToken.push(token.value);
                }else if(token.dataType == "adminToken"){
                    adminToken.push(token.value);
                }

                storedTokens++;
                if(numTokens ==  storedTokens){
                    console.log("v/ All tokens sorted and stored!\n");
                    collect_ASTRAGLOBALS();
                }
            });
        }else{
            console.log("/|\\no tokens to store");
            console.log("\\|/\n");
            collect_ASTRAGLOBALS();
        }
        console.log("result: "+JSON.stringify(MASTER_INVENTORY).substring(0,30));
    });
}
//#######     --Configure GET and POST Handling--     #######                 #######                 #######                 #######                 #######

function collect_ASTRAGLOBALS(){
    console.log("Grabing CATAGORIES, LOCATIONS, and MAILLIST from MongoDB and storing in global varibles...");
    astrasystem.collection("GLOBALS").find({"name": "catagoryMap"}).toArray((error, catData)=>{
        CATAGORIES = catData[0].data;
        c("CATAGORIES");
        c(CATAGORIES);
        astrasystem_client.db("JunkLord").collection("GLOBALS").find({"name": "LOCATIONS"}).toArray((error, locData)=>{
            LOCATIONS = locData[0].data;
            c("LOCATIONS");
            c(LOCATIONS);
            astrasystem_client.db("JunkLord").collection("GLOBALS").find({"name": "mailList"}).toArray((error, mailListData)=>{
                mailList = mailListData[0].data;
                c("mailList");
                c(mailList);
                console.log("v/ CATAGORIES, LOCATIONS, and MAILLIST collected and stored!\n");
                generateSytleFiles();
            });
        });
    });
}
function generateFile(fileName, fileContents, filePath){
    fs.writeFileSync(filePath, fileContents);
    console.log("Inv File: "+fileName+" - done regenerating");
}

function generateSytleFiles(){
    console.log("Generating Style_Files (CSS & JS)...");
    console.log("Style parameters pulled from colors.json: ");
    var colorsJSON_fileContent = fs.readFileSync("./Style_File/colors.json").toString();
    console.log(colorsJSON_fileContent);
    console.log(typeof(colorsJSON_fileContent));
    var colorsJSON_parsed = JSON.parse(colorsJSON_fileContent)[0];
    console.log(colorsJSON_parsed);
    console.log(typeof(colorsJSON_parsed));
    var colorsJSON_stringified = JSON.stringify(colorsJSON_parsed);
    console.log(colorsJSON_stringified);
    console.log(typeof(colorsJSON_stringified));

    var str = '[{"UserName":"xxx","Rolename":"yyy"}]'; // your response in a string
    var parsed = JSON.parse(str); // an *array* that contains the user
    var user = parsed[0];         // a simple user
    console.log(user.UserName);   // you'll get xxx
    console.log(user.Rolename);   // you'll get yyy

    var colorsCSS_fileStructure = "#toolTitle,#goHome,#toolbox_label,#topbar,#createPathwayButton{\nbackground-color: "+colorsJSON_parsed.primaryColor+";\ncolor: "+colorsJSON_parsed.primaryTextColor+";\n}\n#createPathwayButton:hover{\nbackground-color: "+colorsJSON_parsed.onPageColor+";\n}\n#cat1,#cat2,#cat3,#cat4,#AAPcat{\nbackground-color: "+colorsJSON_parsed.branchColor+";\ncolor: "+colorsJSON_parsed.branchTextColor+";\n}\n#cat1:hover,#cat2:hover,#cat3:hover,#cat4:hover,#AAPcat:hover{\nbackground-color: "+colorsJSON_parsed.branchHoverColor+";\n}\n#cat1_end,#cat2_end,#cat3_end,#cat4_end,#AAPcat_end{\nbackground-color: "+colorsJSON_parsed.leafColor+";\ncolor: "+colorsJSON_parsed.leafTextColor+";\n}\n#cat1_end:hover,#cat2_end:hover,#cat3_end:hover,#cat4_end:hover,#AAPcat_end:hover{\nbackground-color: "+colorsJSON_parsed.leafHoverColor+";\n}\#goHome:hover,.onPage{\nbackground-color: "+colorsJSON_parsed.onPageColor+";\n}    \n#menuContainer{border-left:"+colorsJSON_parsed.primaryTextColor+" 1px solid;\nborder-right:"+colorsJSON_parsed.primaryTextColor+" 1px solid;\n}\na:link,a:visited{\ncolor:"+colorsJSON_parsed.primaryTextColor+"\n}\n#addHours_btn{\n background-color: "+colorsJSON_parsed.primaryColor+";\ncolor: "+colorsJSON_parsed.primaryTextColor+";\n}\n.styledBtn{\nbackground-color: "+colorsJSON_parsed.primaryColor+";\ncolor: "+colorsJSON_parsed.primaryTextColor+";\nborder-radius: 6px;\n}\n.styledBtn:hover{\nbackground-color: "+colorsJSON_parsed.onPageColor+";\n}\n";
    var colorsJS_fileStructure = "";
    fs.writeFileSync("./Style_File/colors.css", colorsCSS_fileStructure);
    fs.writeFileSync("./Style_File/colors.js", colorsJS_fileStructure);
    console.log("v/ Style_Files Generated!");

    configureRequests();
}
//Pull in colors from JSON file


//#######     --Configure GET and POST Handling--     #######                 #######                 #######                 #######                 #######
var regenerationInProgress = false;;
var preRegeneration = true;
function configureStandby(){
    console.log("Configuring GET Requests into pre-Regeneration mode...\nTo regenerate the Astradux's file structure, go to /beginStartup");

    app.get("/", function(req, res){
        if(preRegeneration){
            if(regenerationInProgress){
                res.send("!Please stand by, astrasystem file structure regenerating...");
            }else{
                res.send("To begin regenerating the astrasystem's file structure, please go to /beginStartup");
            }
        }else{
            res.sendFile(__dirname+"/Astradux.html");
            update_FILECOUNTjs();
        }
    });

    connectToDBs();

    app.get("/getImg", function(req, res){
        var queryObject = url.parse(req.url,true).query;
        console.log("---Image Fetch Request: query object: "+JSON.stringify(queryObject)+" --- file name:"+queryObject.name+"    origin: "+queryObject.origin);
        var clusterIndex = parseInt((queryObject.origin/5)+1);
        console.log("---Retrieving image "+queryObject.name+"'s data uri from from datacluster "+clusterIndex+"...");
        collectionConnections[clusterIndex].findOne({name:queryObject.name},(error, data)=>{
            if(data == null){
                console.log("---(!) Image "+queryObject.name+" does not exist in datacluster "+clusterIndex);
                var questionMarkURI = imageToUri("./Images/missingImg.png");
                res.json(buildImgResponse(questionMarkURI));
            }else{
                console.log("---Image Found!");
                res.json(buildImgResponse(data.uri));
            }
        });
    });
    app.get("/getINV", function(req, res){
        var queryObject = url.parse(req.url,true).query;
        console.log(">>>Invenotry Fetch Request: query object: "+JSON.stringify(queryObject)+" <<->> file name: "+queryObject.i);
        console.log(">>>Retrieving Inventory Fragment "+queryObject.i+"...");
        astrasystem.collection("Free_Stuff_Files").findOne({name:"INVENTORY"+queryObject.i},(error, data)=>{
            if(data == null){
                console.log(">>>(!) INVENTORY"+queryObject.i+" does not exist in database!");
                res.json([["BAD FETCH", "____", "_____", ["____"], "_____", "", false]]);
            }else{
                console.log(">>>INVENTORY"+queryObject.i+" Found!");
                res.json(buildInvResponse(data.data));
            }
        });
    });
    app.get("/getUSERMODE", function(req, res){
        var queryObject = url.parse(req.url,true).query;
        console.log(">>>User Mode Fetch Request: query object: "+JSON.stringify(queryObject)+" <<->> token: "+queryObject.token);
        var userType = "user";
        if(JSON.stringify(userTokens).indexOf(queryObject.token) != -1){
            res.send("user");
        }else if(JSON.stringify(adminTokens).indexOf(queryObject.token) != -1){
            res.json("admin");
        }else{
            res.json("user");
            addToken(queryObject.token, "user", false);
        }

        res.send(userType)
    });
    app.get("/getn", function(req, res){
        res.json(n);
    });
    app.get("/getCATAGORIES", function(req, res){
        astrasystem.collection("GLOBALS").findOne({name:"CATAGORIES"},(error, data)=>{
            if(data == null){
                console.log("-<>-(!) count not fetch CATAGORIES!");
            }else{
                console.log("-<>-fetched CATAGORIES!");
                res.json(data.data);
            }
        });
    });
    app.get("/getLOCATIONS", function(req, res){ 
        astrasystem_client.db("JunkLord").collection("GLOBALS").findOne({name:"LOCATIONS"},(error, data)=>{
            if(data == null){
                console.log("-<>-(!) count not fetch LOCATIONS!");
            }else{
                console.log("-<>-fetched LOCATIONS!");
                res.json(data.data);
            }
        });
    });
    
    app.get("/generateBoxQRs", function(req, res){
        var queryObject = url.parse(req.url,true).query;
        console.log(">>>Generate Box QRs Fetch Request: query object: "+JSON.stringify(queryObject)+" <<->> x: "+queryObject.x+" <<->> y: "+queryObject.y+" <<->> color: "+queryObject.color);

        generateQRsWrap(queryObject.x,queryObject.y,queryObject.color,res);        
    });

    app.get("/hyperlogger", function(req, res){
        console.log("You tried to go to the hyperlogger!"); 
        res.sendFile(__dirname+"/subprograms/hyperlogger/hyperloggerRedirection.html");
    });
    app.get("/qrgen", function(req, res){
        res.sendFile(__dirname+"/subprograms/qrCodeGenerator/QRCodeGeneratorRedirection.html");
    });
    app.get("/getWordPOS", function(req, res){
        var queryObject = url.parse(req.url,true).query;
        console.log(">>>Request to get word POS: query object: "+JSON.stringify(queryObject)+" <<->> word: "+queryObject.word);
        wordpos.getPOS(queryObject.word, (data,error)=>{
            console.log("POS result: "+JSON.stringify(data));
            var tos = null;
            if(data.adjectives.length!=0){
                tos = "adjective";
            }else if(data.verbs.length!=0){
                tos = "verb";
            }else if(data.nouns.length!=0){
                tos = "noun";
            }else if(data.adverbs.length!=0){
                tos = "adverb";
            }else if(data.rest.length!=0){
                tos = "rest";
            }
            res.json({part_of_speech: tos});
        });
    });
    app.get("/shelfLogger", function(req, res){   //(request, response) hey callbacks!
        res.sendFile(__dirname+"/shelfLogger.html");
    });
    app.post("/shelfLogger", function(req, res){
        console.log("Incomming Post from /shelfLogger. req body: "+JSON.stringify(req.body));
        if(req.body.command == "saveImg"){
            console.log("Image save request for:" + req.body.data);
            storeImage(req.body.data.name, req.body.data.uri, "locImg",()=>{
                saveCompleteCall.emit("imageSaved"+shelfImgNum);
            });
            res.status(204).send();
        }else if(req.body.command == "saveShelfArray"){
            console.log("Shelf Array save request for:" + req.body.data);
            updateLocArray(req.body.data, ()=>{
                res.status(204).send();
            });
        }else{
            console.log("(!)A post request was made from /shelfLogger, but the command was not recognized. Command: "+ req.body.command+" Data: "+ req.body.data);
            res.send("(!)A post request was made from /shelfLogger, but the command was not recognized. Command: "+ req.body.command+" Data: "+ req.body.data);
        }
    });
    app.get("/shelfImageSaved", function(req, res){
        saveCompleteCall.on("imageSaved"+shelfImgNum,()=>{
            shelfImgNum++;
            res.json({result: "done!"});
        });
    });
        
    app.get("/donate", function(req, res){
        res.sendFile(path.join(__dirname,"..","station_F@UMN","addPage.html"));
    });
    app.post("/donate", function(req, res){
        console.log("Incomming Post from /donate, command: "+req.body.command);
        
        var messageData = req.body;
        messageData.subcommand = req.body.command;
        messageData.command = ">>donatePost";
        messageData.postNum = donatePostTicker;
        
        stationChild.send(messageData);
        
        resolvePostEvent.on("resolveDonatePost"+donatePostTicker, ()=>{
            res.status(204).send();
        });
        donatePostTicker++;
        
    });
    app.get("/walkthrough", function(req, res){
        res.sendFile(path.join(__dirname,"..","station_F@UMN","fullWalkthrough.html"));
    });
    app.get("/criteriaCheck", function(req, res){
        var messageData = req.data;
        messageData.url= url.parse(req.url,true).query;
        messageData.postNum = donatePostTicker;
        stationChild.send(messageData);
        
        resolvePostEvent.on("resolveCriteriaCheck"+donatePostTicker, (data)=>{
            res.send({"passVal": data.criteriaResults["obj"+data.localObjectNum+"_c"+data.localCriteriaNum]}); 
        });
        donatePostTicker++;
        
    });
    
    app.get("*", function(req, res){
        if(regenerationInProgress){
            res.send("!Please stand by, astrasystem file structure regenerating...");
        }else if(preRegeneration){
            res.send("The astradux's file structure has not yet regenerated. To begin regenerating the astrasystem's file structure, please go to /beginStartup");
        }else{
            res.send("404!");
        }    
    });
}
var shelfImgNum = 0;
var donatePostTicker = 0; //This Varible tracks post and post events to resolve!

var saveCompleteCall = new EventEmitter();
var resolvePostEvent = new EventEmitter();

const testObj = {
    "test1": {
        "1": "Hello there"
    }
}
function buildImgResponse(uri){
    return {"uri": uri}
}
function buildInvResponse(frag){
    return {"inv": frag}
}

function configureRequests(){
    console.log("Configuring GET and POST Requests\n");

    app.get(["/Astradux.html", "/"], function(req, res){   //(request, response) hey callbacks!
        res.sendFile(__dirname+"/Astradux.html");
        update_FILECOUNTjs();
    });
    app.post(["/Astradux.html", "/"], function(req, res){
        console.log("Incomming Post from /Astradux.html, command: "+req.body.command);
        if(req.body.command == "modData"){
            console.log("ModData from main.js: " + req.body.data);
            modifyPartData(req.body.data, res);
            res.status(204).send();
        }else if(req.body.command == "resetSEARCHQUERY"){
            console.log("Emptying SEARCHQUERY.js");
            update_searchDATA(req.body.data);
            res.status(204).send();
        }else if(req.body.command == "transfereLoc"){
            console.log("Transfering Location...");
            transfereLocation(req.body.data);
            res.status(204).send();
        }else if(req.body.command == "saveEmailToList"){
            console.log("Adding a Key/Email pair to the mail list...");
            console.log("");
            mailList = eval(mailList).push(eval(req.body.data));
            astrasystem_client.db("JunkLord").collection("GLOBALS").updateOne({"name": "mailList"},{$set:{"data":mailList}});
            console.log("Added Key/Email pair to list");
            res.status(204).send();
        }else if(req.body.command == "VAHCS_sniff"){
            console.log("Sending sniff to VAHCS");
            VAHCS_sniffer(req.body.data, "Free@UMN Homepage");
            res.status(204).send();
        }else if(req.body.command == "updateLOCs"){
            console.log("locData from main.js:" + req.body.data);
            updateLocArray(req.body.data,()=>{});
            res.status(204).send();
        }else{
            console.log("(!)A post request was made from Astradux.html, but the command was not recognized. Command: "+ req.body.command+" Data: "+ req.body.data);
            res.send("(!)A post request was made from Astradux.html, but the command was not recognized. Command: "+ req.body.command+" Data: "+ req.body.data);
        }
    });

    app.get("/addPart.html", function(req, res){
        res.sendFile(__dirname+"/addPart.html");
    });
    app.post("/addPart.html", function(req, res){
        console.log("Incomming Post from /addPart.html, command: "+req.body.command);
        if(req.body.command == "addCat"){
            console.log("catData from addPart.js:" + req.body.data);
            updateCatArray(req.body.data);
            res.status(204).send();
        }else if(req.body.command == "addPart"){
            console.log("Processing addPart requset (no URI)...");
            console.log("partData from addPart.js:" + req.body.data);
            addPart(req.body.data, true, res);
            console.log("v/ addPart requset (no URI) processed!");
        }else if(req.body.command == "addPart_URI"){
            console.log("Processing addPart_URI requset...");
            var filePath = req.body.timestamp;
            var dataURI = req.body.uri;
            console.log("Timestamp: "+req.body.timestamp);
            console.log(("URI: "+req.body.uri).substring(0,30));
            storeImage(filePath, dataURI, "invImg",()=>{});
            /*imageDataURI.outputFile(dataURI, "./Inventory_Images/"+filePath)      //Old save to local storage code
            // RETURNS image path of the created file 'out/path/fileName.png'
                .then(res => console.log(res));*/
            addPart(req.body.data, true, res);
            console.log("v/ addPart_URI requset processed!");
            res.status(204).send();
        }else if(req.body.command == "updateLOCs"){
            console.log("locData from addPart.js:" + req.body.data);
            updateLocArray(req.body.data,()=>{});
            res.status(204).send();
        }else if(req.body.command == "ModPartData"){
            console.log("Modifing Part Data. ModData from addPart.js: " + req.body.data);
            modifyPartData(req.body.data, res);
            res.status(204).send();
            //res.sendFile(__dirname+"/Astradux.html");
        }else if(req.body.command == "undoAdd"){
            console.log("Modifing Part Data. ModData from addPart.js: " + req.body.data);
            modifyPartData(req.body.data, res);
        }else if(req.body.command == "triggerForignSearch"){
            console.log("Forign search Triggered from addPart");
            update_searchDATA(req.body.data);
            res.status(204).send();
            //res.sendFile("."+"/Astradux.html");
        }else if(req.body.command == "wipeModData"){
            console.log("Wiping MODDATA clean...");
            wipeModData();
            res.status(204).send();
        }else if(req.body.command == "sendUserHome"){
            res.status(204).send();
            //res.sendFile(__dirname+"/Astradux.html");
        }else if(req.body.command == "saveLocImg"){
            console.log("Processing requset to store a new Location_Image...");
            var filePath = req.body.timestamp;
            var dataURI = req.body.uri;
            console.log("Loc Img src: "+req.body.timestamp);
            console.log(("URI: "+req.body.uri).substring(0,30));
            storeImage(filePath, dataURI, "locImg",()=>{});
            imageDataURI.outputFile(dataURI, "./LocationMap_Images/"+filePath).then(res => {
                console.log("Location Img: "+filePath+" - done generating");
            });
            res.status(204).send();
        }else if(req.body.command == "VAHCS_sniff"){
            console.log("Sending sniff to VAHCS");
            VAHCS_sniffer(req.body.data, "Free@UMN Add Part Page");
            res.status(204).send();
        }else{
            console.log("(!)A post request was made from addPart.html, but the command was not recognized. Command: "+ req.body.command+" Data: "+ req.body.data);
            res.send("(!)A post request was made from addPart.html, but the command was not recognized. Command: "+ req.body.command+" Data: "+ req.body.data);
        }
    });

    app.get("/catagoryMap.html", function(req, res){   //(request, response) hey callbacks!
        res.sendFile(__dirname+"/catagoryMap.html");
    });
    app.post("/catagoryMap.html", function(req, res){
        console.log("Incomming Post from /catagoryMap.html. req body: "+JSON.stringify(req.body));
        if(req.body.command == "addCat"){
            console.log("catData from displayCatagories.js:" + req.body.data);
            updateCatArray(req.body.data);
            res.status(204).send();
        }else if(req.body.command == "triggerForignSearch"){
            console.log("Forign search Triggered from addPart");
            update_searchDATA(req.body.data);
            res.sendFile(__dirname+"/Astradux.html");
        }else if(req.body.command == "VAHCS_sniff"){
            console.log("Sending sniff to VAHCS");
            VAHCS_sniffer(req.body.data, "Free@UMN Catagories Page");
            res.status(204).send();
        }else{
            console.log("(!)A post request was made from catagoryMap.html, but the command was not recognized. Command: "+ req.body.command+" Data: "+ req.body.data);
            res.send("(!)A post request was made from catagoryMap.html, but the command was not recognized. Command: "+ req.body.command+" Data: "+ req.body.data);
        }
    });

    regenerationInProgress = false;
    preRegeneration = false;
    console.log("</> CONFIGURATION COMPLETE, ASTRADUX ONLINE </>\n");

    stationChild = cp.fork(path.dirname(__dirname) +"/station_F@UMN/serveStation.js");
    stationChild.on("message",(data)=>{
        console.log("stationChild sent serveFreeAtUMN Server: "+JSON.stringify(data));
        if(data.command == "sendLocations"){
            console.log("Sending stationChild locations array...");
            stationChild.send({command: "returningLocations", data: LOCATIONS});
        }else if(data.command == "updateLocationsArray"){
            console.log("Saving locations array from stationChild...");
            updateLocArray(data.data,()=>{});
        }else if(data.command == "resolveCriteriaCheck"){
            console.log("Command to resolve criteria check Num: "+data.postNum+" from the backend...");
            resolvePostEvent.emit("resolveCriteriaCheck"+data.postNum);
            
            
        }else if(data.command == "resolveDataPost"){
            console.log("Command to resolve post Num: "+data.postNum+" from the backend...");
            resolvePostEvent.emit("resolveDataPost"+data.postNum);
        }else{
            console.log("stationChild sent serveFreeAtUMN Server a command it did not recognize");
        }
    });
    
}
var stationChild = null;

//#######     --Action Definitions--     #######                 #######                 #######                 #######                 #######
const getAllDirFiles = function(dirPath, arrayOfFiles){     //This is used to look inside folders at the actual files & file names
    files = fs.readdirSync(dirPath)
    arrayOfFiles = arrayOfFiles || []
    files.forEach(function(file) {
        if (fs.statSync(dirPath + "/" + file).isDirectory()) {
            arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles)
        } else {
            arrayOfFiles.push(file)
        }
    })
    return arrayOfFiles
}
//update_FILECOUNTjs();

function addPart(partData, firstTime, res){
    astrasystem.collection("Free_Stuff_Files").find().toArray((error, fragArray)=>{
        n = fragArray.length;
        console.log("reading number of fragments: "+n);
        if(n == 0){
            console.log("Wow! This is your first Inventory Fragment! Creating it now...");
            MASTER_INVENTORY["INVENTORY1"] = "[]";
            astrasystem.collection("Free_Stuff_Files").insertOne({name: "INVENTORY1", data:"[]"/*, version: 0*/} );          //DB
            n=1;
        }
        var partDataAddedTo_fileNum = n;
        var nthFile_content = MASTER_INVENTORY["INVENTORY"+n];
        var partsIn_nthFile = eval(nthFile_content).length;
        var newFile = false;
        if(partsIn_nthFile >= 100){
            findSpace:{
                for(var i = n; i > 0; i--){ //Look for an existing INVENTORY Fragment with space vv
                    var ithFile_content = MASTER_INVENTORY["INVENTORY"+i];
                    console
                    var partsIn_ithFile = ithFile_content.length;//ithFile_content.length-4;
                    if(partsIn_ithFile < 100){
                        partDataAddedTo_fileNum = i;
                        break findSpace;
                    }
                }
                astrasystem.collection("Free_Stuff_Files").insertOne({name: "INVENTORY"+(n+1), data:"[]"/*, version: 0*/} );          //DB
                n++;
                MASTER_INVENTORY["INVENTORY"+n] = "[]";
                partDataAddedTo_fileNum = n;
            }
            newFile = true;
        }
        var fragmentStr = "INVENTORY"+partDataAddedTo_fileNum;
        console.log("fragmentStr: "+ fragmentStr);
        var fragmentToAppendTo = MASTER_INVENTORY[fragmentStr];
        console.log("fragmentToAppendTo before append: "+fragmentToAppendTo);
        var tempArray = eval(fragmentToAppendTo);
        tempArray.push(eval(eval(partData)));
        var appendedFragment = JSON.stringify(tempArray);
        console.log("fragmentToAppendTo after append: "+appendedFragment);
        MASTER_INVENTORY[fragmentStr] = tempArray;
        astrasystem.collection("Free_Stuff_Files").updateOne({name: fragmentStr}, {$set: {data: appendedFragment}}/*, {$inc:{v:1}}*/);    //DB
    });
    notifyUsers(eval(partData));
}
function notifyUsers(partData){
    eval(mailList).forEach((eKeyPair)=>{
        if(partData.indexOf(eKeyPair[0]) != -1){

        }
    });
}
var notificationKey = "";
function craft_emailNotification(key,partName,partImageSrc,shelf,shelfLocation){
    return {
        from: 'fredefree123@gmail.com',
        to: '~~~@umn.edu',
        subject: '~~~',
        html: 'Hey this is Free @ UMN! We\'re letting you know that a new '+notificationName+' has been put on '+shelf+' in '+shelfLocation+' '+'<img height="500px" src="cid:unique@kreata.ee"/><img height="500px" src="cid:unique2@kreata.ee"/>',
        attachments: [{
            filename: 'Result1.png',
            path: './timesheet/Result1.png',
            cid: 'unique2@kreata.ee' //same cid value as in the html img src
        },{
            filename: 'Result2.png',
            path: './timesheet/Result2.png',
            cid: 'unique@kreata.ee' //same cid value as in the html img src
        }]
    }
}
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'fredefree123@gmail.com',
        pass: 'jnfyluctsykvmnpn'
    }
});
var mailOptions = {
    from: 'vahcs.computer@gmail.com',
    to: 'alexa818@umn.edu',
    subject: '[Default Email]',
    text: '[This is my defualt email, sir you many not have changed the mailOptions varible in my script]'
};
function updateCatArray(newCatArray){
    console.log("updateCatArray initiated...");
    CATAGORIES = newCatArray;
    astrasystem.collection("GLOBALS").updateOne({name: "catagoryMap"}, {$set: {data: newCatArray}}).then((err,data)=>{
        console.log("Cat Array Updated! Is now: "+CATAGORIES);    
    });    //DB
}

function updateLocArray(newLocArray, callback){
    console.log("updateCatArray initiated...");
    LOCATIONS = newLocArray;
    astrasystem_client.db("JunkLord").collection("GLOBALS").updateOne({name: "LOCATIONS"}, {$set: {data: newLocArray}}).then((err,data)=>{
        console.log("Loc Array Updated! Is now: "+LOCATIONS);
        callback();
    });    //DB
}

function modifyPartData(File_and_Data, res){
    var split1 = File_and_Data.indexOf(":");   //This'll work even if there's another ":" in the part data
    console.log("split1: "+split1);
    var split2 = File_and_Data.indexOf(">=-:-=>");
    console.log("split2: "+split2);
    var INVENTORY_file = File_and_Data.substring(0, split1);
    console.log("INVENTORY_file: "+INVENTORY_file);
    var old_partData_str = File_and_Data.substring(split1+1, split2);
    console.log("old_partData_str: " + old_partData_str);
    var old_partData = eval(old_partData_str);
    console.log(old_partData);
    var new_partData = File_and_Data.substring(split2+7, File_and_Data.length);
    console.log(new_partData);
    //var FRAG_content = fs.readFileSync("./Inventory_Files/"+INVENTORY_file+".js").toString();
    //var FRAG_array = FRAG_content.split("\n");
    astrasystem.collection("Free_Stuff_Files").find({name:INVENTORY_file}).toArray((error, data)=>{
        console.log("data from inventory: "+JSON.stringify(data));
        var FRAG_array = eval(data[0].data);
        console.log("FRAG_array: "+FRAG_array);
        Loop:{
            for(var i = 0; i < FRAG_array.length; i++){
                var FRAG_array_str = JSON.stringify(FRAG_array[i]);
                var old_partData_str = JSON.stringify(old_partData);
                if(FRAG_array_str == old_partData_str){
                    console.log(FRAG_array_str +"=="+ old_partData_str);
                    console.log("Part Index Identified!");
                    console.log("Placement in FRAG_array: line " +(i+1)+" of "+FRAG_array.length);

                    console.log("\nFragment before mod: "+ JSON.stringify(FRAG_array));

                    if(new_partData == "[]"){
                        FRAG_array.splice(i, 1);
                    }else{
                        FRAG_array.splice(i, 1, eval(new_partData));
                    }
                    var result = JSON.stringify(FRAG_array);

                    console.log("\nFragment after mod: "+ result+"\n");

                    MASTER_INVENTORY[INVENTORY_file] = result;
                    astrasystem.collection("Free_Stuff_Files").updateOne({name: INVENTORY_file}, {$set: {data: result}});    //DB
                    console.log("A part in file "+INVENTORY_file+" was modified");
                    break Loop;
                }else{
                    console.log(FRAG_array_str +"    !=    "+ old_partData_str+"\n");
                }
            }
            console.log("A part Modification in fragment "+INVENTORY_file+" was attempted but no part matching the given old_partData was found");
        }
    });
}
function update_FILECOUNTjs(){
    console.log("Updating File count...");
    astrasystem.collection("Free_Stuff_Files").find().toArray((error, dataFiles)=>{
        n = dataFiles.length;
        console.log("v/ File count updated");
        
        regenerateInvFiles();
    });
}
function transfereLocation(locData){
    var split = locData.indexOf(">=-:-=>");
    var oldLoc = locData.substring(0, split);
    var newLoc = locData.substring(split+7, locData.length);
    var oldLoc_Globalified = new RegExp(oldLoc, "g");

    astrasystem.collection("Free_Stuff_Files").find().toArray((error, data)=>{
        data.forEach((frag)=>{
            astrasystem.collection("Free_Stuff_Files").updateOne({name: frag.name}, {$set: {data: frag.data.replace(oldLoc_Globalified, newLoc)}});
        });
        console.log("Location "+oldLoc+" changed to "+newLoc+"    ("+data.length+" INVENTORY fragments detected)");
    });
}
function storeImage(name, URI, type, callback){
    if(type == "invImg"){
        var clusterIndex = parseInt((n/5)+1);
        console.log("Saving image "+name+"'s data uri ("+URI.substring(0,30)+") to datacluster "+clusterIndex+"...");
        collectionConnections[clusterIndex].insertOne({
            name:name,
            uri: URI
        },(error, data)=>{
            if(data == null){
                console.log("(!) Unable to add inv image to data cluster: "+clusterIndex);
            }else{
                console.log("Image added to data cluster: "+clusterIndex);
                callback();
            }
        });
    }else if(type == "locImg"){
        astrasystem_client.db("Universals").collection("LOCATION_Images").insertOne({
            name:name,
            uri: URI
        },(error, data)=>{
            if(data == null){
                console.log("(!) Unable to add loc image to data cluster: "+clusterIndex);
            }else{
                console.log("Location_Image "+name+" added to database!");
                callback();
            }
        });
    }
}

function closeProgram(){
    console.log("Program Complete");
    process.exit(0);
}
























////////////////////////////////////INSTAPULL//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const archiver = require('archiver');
const fse = require('fs-extra');

app.get("/pullInstabatch", function(req, res){fetchInstagramBatch(5,res)});

var randomeInventoryIndicies = [];
var completePulls = 0;

function fetchInstagramBatch(pulls, res){
    console.log("fetchInstagramBatch() requested!");
    randomeInventoryIndicies = [];
    completePulls = 0;
    var i = 0;
    recursivePullDriver(i,pulls, res);
}
function recursivePullDriver(i,pulls, res){
    console.log("Working on pull "+i+"...");
    randomeInventoryIndicies.push(pullRandomFileIndex());
    var imgName = randomeInventoryIndicies[i][0][5];
    console.log("Fetched: "+randomeInventoryIndicies[i]+" img name: "+imgName);
    var url = "https://jrarass-freejunk.herokuapp.com/getImg?name=" + encodeURIComponent(imgName) + "&origin=" + randomeInventoryIndicies[i][1];
    console.log("Requesting url: "+url);
    request({url: url, json:true},(error,data) =>{
        console.log("get image request fullfilled!: "+error+ "---" +JSON.stringify(data));

        if(data.status == 500){
            res.send("Something went wrong with url request!");
        }else{

            imageDataURI.outputFile(data.body.uri, "./Instagram_dataPackage/"+imgName).then(resOuter => {
                console.log(imgName+" - done generating in Instagram_dataPackage/");
                completePulls++;
                console.log(completePulls+"/"+pulls+" pulls complete");
                if(completePulls == pulls){
                    console.log("All Pulls Fullfilled! Saving pull data to txt file, zipping, and returning to user...");
                    fs.writeFileSync("./Instagram_dataPackage/pullData.txt", JSON.stringify(randomeInventoryIndicies));

                    console.log("Attempting to zip and download all user data to client's computer...");
                    var output = fs.createWriteStream('JRARASS_instaBatch.zip');
                    var archive = archiver('zip');
                    output.on('close', function () {
                        console.log(archive.pointer() + ' total bytes');
                        console.log('Archiver has been finalized and the output file descriptor has closed -- zip sucsessful!');
                        res.download(__dirname+"/JRARASS_instaBatch.zip");
                        console.log('~Done!~');
                        console.log('Clearing Batch Directory...');
                        for(var j=0;j<pulls;j++){
                            try{
                                var deleteFile = randomeInventoryIndicies[j][0][5];
                                fs.unlinkSync('./Instagram_dataPackage/'+deleteFile);
                                console.log("./Instagram_dataPackage/"+deleteFile+" is deleted.");
                            }catch(error){
                                console.log("Was unable to delete file "+deleteFile+"! Error: "+error);
                            }
                        }
                        try{
                            fs.unlinkSync('./Instagram_dataPackage/pullData.txt');
                            console.log("./Instagram_dataPackage/pullData.txt is deleted.");
                        }catch(error){
                            console.log("Was unable to delete file ./Instagram_dataPackage/pullData.txt! Error: "+error);
                        }
                        console.log('Batch Directory Cleared');
                    });
                    archive.on('error', function(err){
                        throw err;
                    });
                    archive.pipe(output);
                    archive.directory('./Instagram_dataPackage', false);
                    archive.directory('subdir/', 'new-subdir');
                    archive.finalize();
                }else{
                    i++;
                    recursivePullDriver(i,pulls, res);
                }
            });
        }
    });
}

function pullRandomFileIndex(){
    console.log("Generating random numbers...");
    var randFileNum = rand(1,n);
    console.log("randFileNum: "+randFileNum);
    var randFile = MASTER_INVENTORY["INVENTORY"+randFileNum];
    //console.log("randFile: "+randFile.substring(0,40)+"...");
    var toReturn = [eval(randFile)[rand(0,eval(randFile).length-1)],randFileNum];
    console.log("->Returning: "+JSON.stringify(toReturn));
    return toReturn;
}
function rand(min,max){
    return parseInt(Math.random()*((max+1)-min)+min);
}


////////////////////////////////////BOX QR Generation//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
function generateLocationStr(x,y,color){
    console.log("Creating a new user token...");
    let result = 'https://freeumn.com/?search=["'+encodeURI(color+alphabet.charAt(yIndex-1)+xIndex)+'","location"]';
    console.log("New Location Str: "+ result);
    return result;
}

var resultImageArray = [];
var xIndex = 1;
var yIndex = 1;
function generateQRsWrap(x,y,c,r){
    xIndex = 1;
    yIndex = 1;

    //Generate the first QR Code
    QRCode.toDataURL('https://freeumn.com/?search=["'+c+'","location"]', function (err, code) {
        if(err) return console.log("error occurred");
        console.log(code);
        let filePath = "./subprograms/qrCodeGenerator/QR_Codes/"+c+"_shelf.png";
        imageDataURI.outputFile(code, filePath).then((res)=>{
            console.log(res);
            resultImageArray.push(filePath);

            console.log("Within generate QRs wrap, calling generateNewLocationQRs recursive driver...");
            generateNewLocationQRs(x,y,c,r);
        }); 
    });
}
function generateNewLocationQRs(x,y,c,r){
    console.log("Generating new location QR code...");
    console.log("xIndex: "+xIndex+" yIndex: "+yIndex);
    if(xIndex > x){ //If row fully traversed...
        console.log("Determined that the full row has been traversed! Incrementing row and setting column back to 1");
        yIndex++;   //...increment yIndex value
        xIndex=1;   //reset the x index to 1
        if(yIndex > y){
            console.log("creating pdf with these images:");
            resultImageArray.forEach((index)=>{
                console.log(index);
            });
            resultImageArray = [];
            r.send({"gridSize":(x*y)});
        }else{
            generateNewLocationQRs(x,y,c,r);
        }
    }else{
        QRCode.toDataURL(generateLocationStr(x,y,c), function (err, code) {
            if(err) return console.log("error occurred");
            console.log(code);
            let filePath = "./subprograms/qrCodeGenerator/QR_Codes/"+c+"_"+alphabet.charAt(yIndex-1)+(xIndex-1)+".png";
            imageDataURI.outputFile(code, filePath).then((res)=>{
                console.log(res);
                resultImageArray.push(filePath);
                generateNewLocationQRs(x,y,c,r);

            }); 
        });
        xIndex++;
    }
}

const options = {
    key: fs.readFileSync('./www.freeumn.com.key'),
    cert: fs.readFileSync('./cert.pem')
}

https.createServer(options, app)
    .listen(443, function (req, res) {
    console.log("Server started at port 443");
   
    console.log("Server started on port 3000! Working Directory:"+path.join(__dirname, ".")+"\n");
    /*|>Start::*/  configureStandby();
});


console.log("Server Online");
