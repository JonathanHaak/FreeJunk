console.log("Data mover starting...");

const fs = require("fs");
const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://Napoleon1234:socialEntreprenuer78@astradata.3dnfp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const path = require('path');


function workWithDB(){
    var collection = null;
    client.connect(err => {
        collection = client.db("Astradata").collection("astradata");


        collection.findOne({systemName: "Taylor's House"},(error, data)=>{
            console.log("Loading in astrasystem "+data.username+"'s Inventory Data" );
            collection.updateOne({systemName: "Taylor's House"},{$set:{superpowers:true}});
        });   


        setTimeout(()=>{
            console.log("Closing mongoDB session");
            client.close();
        },2000);
    });
}

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

var m = getAllDirFiles("./Inventory_Files");

console.log(m);
console.log(m.length);


var n = getAllDirFiles("./Inventory_Images");

console.log(n);
console.log(n.length);

