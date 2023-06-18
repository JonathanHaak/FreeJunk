console.log("~Catagorize.js Initialized~");
const fs = require("fs");
var cp = require("child_process");
const process = require('process')

function c(s){console.log(s)}

//Save object # as a variable from command line arguments
var production = (process.argv[3] == undefined) ? false : true;
var objectNum = process.argv[2];
console.log("In production?: "+production);

var nameResult = "noName";
tagsResult = [];

function run(){
    //Read in the object raw data file and parse into an array saved to a variable
    var rawDepartmentData = fs.readFileSync(__dirname+"/choppingBoard/obj"+objectNum+"RawDepartmentData.json");
    c("JSON object collected from obj#RawDepartmentData.json file: "+ rawDepartmentData +"  ("+typeof(rawDepartmentData)+")"+"\n");
    var departmentData = JSON.parse(rawDepartmentData);
    c("obj#RawDepartmentData.json file data converted into object: "+ JSON.stringify(departmentData) +"  ("+typeof(departmentData)+")"+"\n");

    //Open the obj#Data.json file as a piece of json
    var objectData = JSON.parse(fs.readFileSync(__dirname+"/choppingBoard/obj"+objectNum+"Data.json"));
    console.log("objectData: "+ JSON.stringify(objectData) + " " +typeof(objectData)+"\n");

    var catagory = findMostCommonWord(departmentData.mainDepartmentText, departmentData.text).toLowerCase();
    console.log("Catagory: " + catagory + "\n");

    objectData.catagory = catagory;

    c("New value of objectData result: "+JSON.stringify(objectData));

    //Resave in json file
    fs.writeFileSync(__dirname+"/choppingBoard/obj"+objectNum+"Data.json",JSON.stringify(objectData));

    //Self terminate
    c("~~catagorize.js complete~~");
    process.exit(0);
}
run();










//==================Supporting Functions========================================================================================================================
function findMostCommonWord(str1, str2) {
    // split the first string into an array of words
    const words = str1.split(" ");

    // create an object to store the count of each word
    const wordCount = {};

    // loop through each word in the second string and count its occurrences
    str2.split(" ").forEach(word => {
        if (words.includes(word)) {
            if (wordCount[word]) {
                wordCount[word]++;
            } else {
                wordCount[word] = 1;
            }
        }
    });

    // find the word with the highest count
    let mostCommonWord = "";
    let highestCount = 0;
    for (const word in wordCount) {
        if (wordCount[word] > highestCount) {
            mostCommonWord = word;
            highestCount = wordCount[word];
        }
    }

    return mostCommonWord;
}
//==============================================================================================================================================================
