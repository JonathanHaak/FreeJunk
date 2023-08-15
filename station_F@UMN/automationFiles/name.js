console.log("~Name.js Initialized~");
const fs = require("fs");
var cp = require("child_process");
const process = require('process');
const path = require("path");

function c(s){console.log(s)}

var addWordToName_thresholdVal = 0.1;

//Save object # as a variable from command line arguments
var production = (process.argv[3] == undefined) ? false : true;
var objectNum = process.argv[2];
console.log("In production?: "+production);

var nameResult = "noName";
tagsResult = [];

function run(){
    //Read in the object raw data file and parse into an array saved to a variable
    var objectArray = fs.readFileSync(__dirname+"/choppingBoard/rawObj"+objectNum+"Data.json");
    c("JSON object collected from rawObj#Data.json file: "+ objectArray +"  ("+typeof(objectArray)+")"+"\n");
    var jsonObject = JSON.parse(objectArray);
    c("rawObj#Data.json file data converted into object: "+ JSON.stringify(jsonObject) +"  ("+typeof(jsonObject)+")"+"\n");

    //Open the obj#Data.json file as a piece of json
    var objectData = JSON.parse(fs.readFileSync(__dirname+"/choppingBoard/obj"+objectNum+"Data.json"));
    console.log("objectData: "+ JSON.stringify(objectData) + " " +typeof(objectData)+"\n");

    //Open the commonWords.json file as a piece of json
    var commonWords = fs.readFileSync(path.join(__dirname,"..","commonWords.json"));
    var commonWords = JSON.parse(commonWords).commonWords;
    c("Array collected from commonWords.json file: "+ commonWords +"  ("+typeof(commonWords)+")"+"\n");

    var wordCounts = countWords(jsonObject.rawObjData);
    console.log("wordCounts: "+ JSON.stringify(wordCounts)+"\n");

    //NAME=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+    
    //Follow namer protocol to generate a name saved to a variable from the raw data array
    function namify(arr){
        //Create a word count for every word in the data
        var mostCommonWord = findWordWithHighestCount(wordCounts);
        nameResult = mostCommonWord;
        console.log("mostCommonWord: "+ JSON.stringify(mostCommonWord)+"\nNew nameResult value: "+nameResult+"\n");

        //combine all word array into one array split at all spaces
        var combinedWordArray = [">>END<<"];
        for(var i = 0; i<arr.length; i++){
            var newArrChunk = arr[i].split(" ")
            newArrChunk.forEach(str =>{
                combinedWordArray.push(str.toLowerCase());
            });
            combinedWordArray.push(">>END<<");
        }
        c("combinedWordArray: "+ JSON.stringify(combinedWordArray)+"\n");

        function recursivelyAddWordsBefore(marker){
            var wordsBefore = countWordsBeforeMostCommonWord(combinedWordArray,marker);
            console.log("wordsBefore: "+ JSON.stringify(wordsBefore)+"\n");

            if(wordsBefore.percentage >= addWordToName_thresholdVal && wordsBefore.word != ">>END<<" && nameResult.indexOf(wordsBefore.word) == -1){
                nameResult = wordsBefore.word+" "+nameResult;
                console.log("New nameResult value: "+nameResult+"\n");
                if(nameResult.split(" ").length < 15){
                    recursivelyAddWordsBefore(wordsBefore.word);
                }
            }
        }
        recursivelyAddWordsBefore(mostCommonWord);


        function recursivelyAddWordsAfter(marker){
            var wordsAfter = countWordsAfterMostCommonWord(combinedWordArray,marker);
            console.log("wordsAfter: "+ JSON.stringify(wordsAfter)+"\n");

            if(wordsAfter.percentage >= addWordToName_thresholdVal && wordsAfter.word != ">>END<<" && nameResult.indexOf(wordsAfter.word) == -1){
                nameResult = nameResult+" "+wordsAfter.word;
                console.log("New nameResult value: "+nameResult+"\n");
                if(nameResult.split(" ").length < 15){
                    recursivelyAddWordsAfter(wordsAfter.word);
                }
            }
        }
        recursivelyAddWordsAfter(mostCommonWord);

    }
    namify(jsonObject.rawObjData);


    //Append the name value to the objectData json object
    objectData.name = nameResult;


    //TAG=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=
    function tag(arr){
        var meanWordCount = calculateMeanWordCount(wordCounts);
        console.log("meanWordCount: "+ meanWordCount +"\n");

        var wordCountStandardDeviation = calculateStandardDeviation(wordCounts);
        console.log("wordCountStandardDeviation: "+ wordCountStandardDeviation +"\n");

        var preFilteredtagsResult = findWordsAboveThreshold(wordCounts, meanWordCount+(wordCountStandardDeviation/3));
        preFilteredtagsResult = filterCommas(preFilteredtagsResult);
        console.log("tagsResult: "+ JSON.stringify(tagsResult) +"\n");

        commonWords = commonWords.concat(nameResult.split(" "));

        tagsResult = removeStrings(preFilteredtagsResult, commonWords);
        console.log("tagsResult: "+ JSON.stringify(tagsResult) +"\n");

    }
    tag(jsonObject.rawObjData);

    //Append the name value to the objectData json object
    objectData.tags = tagsResult;



    //DESCRIBE=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+
    var desciptionResult = findShortestStrings(jsonObject.rawObjData);
    console.log("desciptionResult: "+ desciptionResult +"\n");

    c("filtering out survivors...");
    var survivors = [];
    var similarityThreshold = 0.7;
    var similarityArray = [];

    similarityArray.push(stringSimilarityPercentage(nameResult.toUpperCase(),desciptionResult[0].toUpperCase()));
    var passed = true;
    similarityArray.forEach((entry)=>{
        console.log("entry:"+entry);
        if(entry > similarityThreshold){
            passed = false;
            c("entry exceeds similarity threshold, value will not be added to survivors");
        }else{c("entry within similarity threshold");}
    });
    c("passed?: "+passed);
    if(passed){survivors.push(desciptionResult[0])}
    similarityArray = [];

    similarityArray.push(stringSimilarityPercentage(nameResult.toUpperCase(),desciptionResult[1].toUpperCase()));
    similarityArray.push(stringSimilarityPercentage(desciptionResult[0].toUpperCase(),desciptionResult[1].toUpperCase()));
    passed = true;
    similarityArray.forEach((entry)=>{
        console.log("entry:"+entry);
        if(entry > similarityThreshold){
            passed = false;
            c("entry exceeds similarity threshold, value will not be added to survivors");
        }else{c("entry within similarity threshold");}
    });
    c("passed?: "+passed);
    if(passed){survivors.push(desciptionResult[1])}
    similarityArray = [];

    similarityArray.push(stringSimilarityPercentage(nameResult.toUpperCase(),desciptionResult[2].toUpperCase()));
    similarityArray.push(stringSimilarityPercentage(desciptionResult[0].toUpperCase(),desciptionResult[2].toUpperCase()));
    similarityArray.push(stringSimilarityPercentage(desciptionResult[1].toUpperCase(),desciptionResult[2].toUpperCase()));
    passed = true;
    similarityArray.forEach((entry)=>{
        console.log("entry:"+entry);
        if(entry > similarityThreshold){
            passed = false;
            c("entry exceeds similarity threshold, value will not be added to survivors");
        }else{c("entry within similarity threshold");}
    });
    c("passed?: "+passed);
    if(passed){survivors.push(desciptionResult[2])}
    similarityArray = [];

    c("survivors:" + JSON.stringify(survivors));
    
    if(survivors.length != 0){
        //Append the name value to the objectData json object
        objectData.description = survivors;
    }else{
        c("there were no survivors in the survivors array so this object will not contain a description");
    }

    c("Name, Tag, and Description result: "+JSON.stringify(objectData));

    //Resave in json file
    fs.writeFileSync(__dirname+"/choppingBoard/obj"+objectNum+"Data.json",JSON.stringify(objectData));

    //Self terminate
    c("~~name.js complete~~");
    process.exit(0);
}
run();







//==================Supporting Functions========================================================================================================================
function countWords(arr) {
    let wordCount = {};
    arr.forEach(str => {
        let words = str.split(' ');
        words.forEach(word => {
            word = word.toLowerCase();
            if(wordCount[word]){
                wordCount[word]++;
            }else{
                wordCount[word] = 1;
            }
        });
    });
    return wordCount;
}
function findWordWithHighestCount(wordCounts) {
    let highestCount = 0;
    let wordWithHighestCount = '';
    // Loop through all the key-value pairs in the JSON object
    for (let word in wordCounts) {
        if (wordCounts[word] > highestCount) {
            highestCount = wordCounts[word];
            wordWithHighestCount = word;
        }
    }
    // Return the word with the highest count
    return wordWithHighestCount;
}
function countWordsBeforeMostCommonWord(arr, mostPopularWord) {
    let wordCounts = {};
    let mostCommonWord = null;
    let mostCommonCount = 0;
    let totalCount = 0;

    for (let i = 1; i < arr.length; i++) {
        //console.log(arr[i]);
        if (arr[i] == mostPopularWord) {
            let wordBefore = arr[i - 1];
            //console.log("wordBefore found: "+arr[i - 1]);

            if (wordBefore in wordCounts) {
                wordCounts[wordBefore]++;
            } else {
                wordCounts[wordBefore] = 1;
            }
            totalCount++;
            if (wordCounts[wordBefore] > mostCommonCount) {
                mostCommonWord = wordBefore;
                mostCommonCount = wordCounts[wordBefore];
            }

        }
    }

    let percentage = mostCommonCount / totalCount;

    return { word: mostCommonWord, percentage: percentage };
}
function countWordsAfterMostCommonWord(arr, mostPopularWord) {
    let wordCounts = {};
    let mostCommonWord = null;
    let mostCommonCount = 0;
    let totalCount = 0;

    for (let i = 0; i < arr.length-1; i++) {
        //console.log(arr[i]);
        if (arr[i] == mostPopularWord) {
            let wordAfter = arr[i + 1];
            //console.log("wordBefore found: "+arr[i - 1]);

            if (wordAfter in wordCounts) {
                wordCounts[wordAfter]++;
            } else {
                wordCounts[wordAfter] = 1;
            }
            totalCount++;
            if (wordCounts[wordAfter] > mostCommonCount) {
                mostCommonWord = wordAfter;
                mostCommonCount = wordCounts[wordAfter];
            }

        }
    }

    let percentage = mostCommonCount / totalCount;

    return { word: mostCommonWord, percentage: percentage };
}
function calculateMeanWordCount(wordCounts){
    let count = 0;
    let totalWordCount = 0;

    for (let word in wordCounts) {
        totalWordCount += wordCounts[word];
        count++;
    }

    return totalWordCount / count;
}
function calculateStandardDeviation(wordCounts){
    let count = 0;
    let totalWordCount = 0;
    let totalSquaredDiff = 0;

    for (let word in wordCounts) {
        totalWordCount += wordCounts[word];
        count++;
    }

    let mean = totalWordCount / count;

    for (let word in wordCounts) {
        let diff = wordCounts[word] - mean;
        totalSquaredDiff += diff * diff;
    }

    let variance = totalSquaredDiff / count;
    let standardDeviation = Math.sqrt(variance);

    return standardDeviation;
}
function findWordsAboveThreshold(wordCounts, threshold) {
    let wordsAboveThreshold = [];

    for (let word in wordCounts) {
        if (wordCounts[word] > threshold) {
            wordsAboveThreshold.push(word);
        }
    }

    return wordsAboveThreshold;
}
function findShortestStrings(arr) {
    // Sort the array of strings by length
    let sortedArr = arr.sort((a, b) => a.length - b.length);

    console.log("sortedArr::: "+sortedArr);

    // Return the first 3 elements in the sorted array

    return [sortedArr[0],sortedArr[1],sortedArr[2]];
    //return sortedArr[0]+", "+sortedArr[1]+", "+sortedArr[2];
}
function removeStrings(arr1, arr2) {
    return arr1.filter(str => str.length > 2 && !arr2.includes(str));
}
function removeCaseInsensitiveDuplicates(arr) {
    const uniqueValues = [];
    const lowerCaseValues = [];

    for (const value of arr) {
        const lowerCaseValue = value.toLowerCase();
        if (!lowerCaseValues.includes(lowerCaseValue)) {
            lowerCaseValues.push(lowerCaseValue);
            uniqueValues.push(value);
        }
    }

    return uniqueValues;
}
function filterCommas(arr) {
    return arr.map(str => str.replace(/,/g, ''));
}
function stringSimilarityPercentage(str1, str2){
    const len1 = str1.length;
    const len2 = str2.length;
    const matrix = [];

    // initialize the matrix with 0s
    for (let i = 0; i <= len1; i++) {
        matrix[i] = [i];
    }
    for (let j = 0; j <= len2; j++) {
        matrix[0][j] = j;
    }

    // fill in the rest of the matrix
    for (let i = 1; i <= len1; i++) {
        for (let j = 1; j <= len2; j++) {
            if (str1[i - 1] === str2[j - 1]) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1], // substitution
                    matrix[i][j - 1], // insertion
                    matrix[i - 1][j] // deletion
                ) + 1;
            }
        }
    }

    const distance = matrix[len1][len2];
    const maxLen = Math.max(len1, len2);
    const similarity = ((maxLen - distance) / maxLen);
    return similarity;
}
//==============================================================================================================================================================
