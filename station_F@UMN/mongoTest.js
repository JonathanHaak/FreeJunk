/*const { MongoClient, ServerApiVersion } = require('mongodb');

//var account = "JunkLord";
const data_uri = "mongodb+srv://respect123:Pulsar78@cluster0.j2ptc.mongodb.net/?retryWrites=true&w=majority";
var astrasystem = "";
const astrasystem_client = new MongoClient(data_uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

function connectToDBs(){
    console.log("Connecting to Databases...");
    astrasystem_client.connect((res,err)=>{
        console.log("~Astrasystem Connection Established~");
        console.log("res: "+res+" err: "+err);
        //astrasystem = astrasystem_client;
        //connections++;
        //connectionTreshold();
    });
}
connectToDBs();


*/

const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Connection URL
const url = 'mongodb+srv://respect123:Pulsar78@cluster0.j2ptc.mongodb.net/?retryWrites=true&w=majority';

// Database Name
const dbName = 'myproject';

// Use connect method to connect to the server
MongoClient.connect(url, function(err, client) {
  assert.equal(null, err);
  console.log("Connected successfully to server");

  const db = client.db(dbName);

  client.close();
});
