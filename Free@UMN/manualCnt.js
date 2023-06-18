console.log("~Manual Control Starterd~\n\n");

const fs = require("fs");
const path = require('path');
const imageToUri = require('image-to-uri')
const imageDataURI = require('image-data-uri')
const { MongoClient, ServerApiVersion } = require('mongodb');
var account = "Tools";

var totalConnections = 2;
var connections = 0;

const data_uri = "mongodb+srv://respect123:Pulsar78@cluster0.j2ptc.mongodb.net/?retryWrites=true&w=majority";
var astrasystem = "";
const astrasystem_client = new MongoClient(data_uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
const imgs1_uri = "mongodb+srv://Napoleon1234:socialEntreprenuer78@cluster0.iwt2p.mongodb.net/?retryWrites=true&w=majority";
var imagesCluster1 = "";
const imagesCluster1_client = new MongoClient(imgs1_uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

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
}
function connectionTreshold(){
    if(connections == totalConnections){
        perform();
    }
}
function closeProgram(){
    console.log("Program Complete");
    process.exit(0);
}
connectToDBs();
////////SETUP COMPLETE////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function perform(){
    console.log("\nInitiating perform()...\n");
    astrasystem.collection("LOCATION_Images").find().toArray((error, data)=>{
        data.forEach((imgObj)=>{
            console.log("Processing: "+JSON.stringify(imgObj).substring(0,60)+"...");
            astrasystem_client.db("Universals").collection("LOCATION_Images").insertOne(imgObj);
            astrasystem.collection("LOCATION_Images").deleteOne(imgObj);
        });
    });
}

































