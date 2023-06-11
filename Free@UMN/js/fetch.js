console.log("fetch.js Initialized!");

const imgController = new AbortController();
const imgSignal = imgController.signal;

var img_fetchQueue = [];    //This array stores the images to fetch (names,origins,desitinations) before the fetch request goes out
var img_fetchOutstandingRequests = [];  //This array stores which fetch request have been made and are still unfullfilled (In case we want to pause and resume)

function fetchImg(imgName, fileOriginNum, destinationSelector){
    fetch('/getImg?name='+imgName+'&origin='+fileOriginNum, {imgSignal})
        .then(response => response.json())
        .then(data => {
        //console.log(data)
        $(destinationSelector)[0].src = data.uri;
        img_fetchOutstandingRequests.splice(img_fetchOutstandingRequests.indexOf([imgName, fileOriginNum, destinationSelector]),1);
    });
}
function fetchInvFile(i, callback){
    console.log("fetching inventory fragment "+i+"..."); 
    fetch('/getINV?i='+i)
        .then(response => response.json())
        .then(data => {
        console.log("v/ inventory fragment "+i+" fetched");
        callback(data.inv);
    });
}
function fetch_n(callback){
    console.log("Fetching n...");
    fetch('/getn'/*+_and_versions*/)
        .then(response => response.json())
        .then(data => {
        console.log("n fetched: "+ data);
        INVENTORYFiles_Count = eval(data);
        //INVENTORY_masterVersionArray_copy = eval(data).v;
        callback();
    });
}
function fetch_CATAGORIES(callback){
    console.log("Fetching CATAGORIES...");
    fetch('/getCATAGORIES')
        .then(response => response.json())
        .then(data => {
        console.log("CATAGORIES fetched: "+ data);
        catagories = eval(data);
        callback();
    });
}
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
var userMode = "user";
function fetch_USERMODE(callback){
    console.log("Fetching USERMODE...");
    fetch('/getUSERMODE?token='+getCookie("userToken"))
           .then(response => response.json())
        .then(data => {
        console.log("USERMODE fetched: "+ data);
        userMode = data;
        callback();
    });
}
