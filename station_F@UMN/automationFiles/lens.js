console.log("~Lens Automation File Initialized~");
const puppeteer = require('puppeteer');
const process = require('process');
const fs = require('fs');
var Jimp = require("jimp");
var cp = require("child_process");

function c(s){
    console.log(s);
}

var browser = null;
var page = null;

var production = (process.argv[3] == undefined) ? false : true;
var objectNum = process.argv[2];
console.log("In production?: "+production);

async function startPage(){
    let launchOptions = { headless: production, args: ['--start-maximized', '--no-sandbox'] };
    browser = await puppeteer.launch(launchOptions);
    page = await browser.newPage();
    await page.setViewport({width: 1366, height: 768});
    await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36');
    await page.goto('https://www.google.com/');
    
    await page.screenshot({path: getTimestamp()+".png"});
    
    c(":~:~:~:Waiting for img button to click...");
    await page.waitForSelector("div[aria-label='Search by image']");
    await page.evaluate(()=>{
        document.querySelectorAll("div[aria-label='Search by image']")[0].click();    
    });
    
    await page.screenshot({path: getTimestamp()+".png"});
    
    console.log("waiting for input to load...");
    await page.waitForSelector('.cB9M7');
    await page.screenshot({path:"c.png"});
    await page.waitForTimeout(500);
    c(":~:~:~:input loaded v/ lens page ready to go");
    await page.screenshot({path:"ImageClicked.png"});
    
    if(production){ process.send({command: "readyToRevieveImgs"}); }else{ runImg() }

    process.on("message",(data)=>{
        console.log("Lens.js recieved this data from the station server file: "+data);
        if(data.command == "recognize new image"){
            runImg(data.imgPath, data.objectNum);
        }else{
            c(":~:~:~:This message from the server that didn't have a valid command!");
        }
    });
}

startPage();

async function runImg(imgPath, objectNum){
//==================Drop Image==================================================================================================================================
    await page.screenshot({path:"RIGHTBEFORETYPINGPICTURELINK.png"});
    await page.type('.cB9M7', "https://www.freeumn.com/donate/automationFiles/choppingBoard/obj"+objectNum+".png");
    await page.screenshot({path:"RIGHTAFTERTYPINGPICTURELINKWAITHINGFORSELECTORSEARCH.png"});
    await page.waitForSelector('.Qwbd3');
    await page.screenshot({path:"RIGHTBEFORECLICKINGSEARCH.png"});
    await page.click(".Qwbd3");
    await page.screenshot({path:"AFTERCLICKINGSEARCH.png"});

    /*var i = 0;
    const interval = setInterval(() => {
        i++;
        page.screenshot({path:"AFTER"+i+"SECOND.png"});
    }, 1000);*/ 
    
    await page.waitForTimeout(4000);

    console.log("waiting for lens results to load...");
    await page.waitForSelector('.UAiK1e');
    await page.screenshot({path:getTimestamp()+".png"});
    
    console.log("lens results loaded");
    await page.screenshot({path:getTimestamp()+".png"});
    
    await page.screenshot({path:__dirname+"/choppingBoard/lensResultLeft.png"});
    Jimp.read(__dirname+"/choppingBoard/lensResultLeft.png")
        .then(image=>{
        image.crop(13,153,660,495);
        image.writeAsync(__dirname+"/choppingBoard/result_outlinedImage.png");            
    });
    await page.screenshot({path:"d.png"});
    await page.screenshot({path: getTimestamp()+".png"});
    
//==============================================================================================================================================================
//==================Collect Raw Data============================================================================================================================
    await page.evaluate(()=>{
        var resultTitles = []; 
        document.querySelectorAll(".UAiK1e").forEach(el=>{resultTitles.push(el.innerHTML)});
        var newTextEl = document.createElement("meta");
        newTextEl.content = JSON.stringify(resultTitles);
        newTextEl.id = "DATA_TRANSFERE_ELEMENT";
        document.body.appendChild(newTextEl);
    });
    await page.screenshot({path: getTimestamp()+".png"});
    
    var resultTextArray = await page.$$eval("#DATA_TRANSFERE_ELEMENT",(el)=>{
        return el.map(e=>e.content);
    });
    await page.screenshot({path: getTimestamp()+".png"});
    
    resultTextArray = eval(resultTextArray[0]);
    console.log("resultTextArray: "+resultTextArray);
    fs.writeFileSync(__dirname+"/choppingBoard/rawObj"+objectNum+"Data.json", JSON.stringify({rawObjData: resultTextArray}));
    await page.screenshot({path:"e.png"});
    
//==============================================================================================================================================================
//==================Criteia Check 1=============================================================================================================================
    await page.evaluate(()=>{
        var pricedTilePercentage = document.querySelectorAll(".oOZ3vf").length/document.querySelectorAll(".G19kAf").length; 
        var newTextEl = document.createElement("meta");
        newTextEl.content = JSON.stringify(pricedTilePercentage);
        newTextEl.id = "DATA_TRANSFERE_ELEMENT2";
        document.body.appendChild(newTextEl);
    });
    var resultPricedTilePercentage = await page.$$eval("#DATA_TRANSFERE_ELEMENT2",(el)=>{
        return el.map(e=>e.content);
    });
    console.log("resultPricedTilePercentage: "+resultPricedTilePercentage);
    if(production){process.send({command: 'checkCriteria2',data: resultPricedTilePercentage});}
//==============================================================================================================================================================
//==================Criteia Check 2=============================================================================================================================
    await page.evaluate(()=>{
        var sources = [];
        document.querySelectorAll(".fjbPGe").forEach((el)=>{sources.push(el.innerHTML)});
        var newTextEl = document.createElement("meta");
        newTextEl.content = JSON.stringify(sources);
        newTextEl.id = "DATA_TRANSFERE_ELEMENT3";
       document.body.appendChild(newTextEl);
    });
    var resultTileSources = await page.$$eval("#DATA_TRANSFERE_ELEMENT3",(el)=>{
        return el.map(e=>e.content);
    });
    console.log("resultTileSources"+resultTileSources);
    if(production){
        process.send({command: 'checkCriteria3',data: resultTileSources});
    }
//==============================================================================================================================================================
//==================Clean up====================================================================================================================================
    await page.screenshot({path:__dirname+"/choppingBoard/lensResultRight.png"});
    Jimp.read(__dirname+"/choppingBoard/lensResultLeft.png")
        .then(image=>{
        image.crop(692,99,650,665);
        image.writeAsync(__dirname+"/choppingBoard/result_resultTiles.png");
    });
//==============================================================================================================================================================
    c(":~:~:~:~~~runImg() complete~~~");

    c(":~:~:~:Resetting google lens page...");
    await page.goto('https://www.google.com/');
    c(":~:~:~:Waiting for img button to click...");
    await page.waitForSelector("div[aria-label='Search by image']");
    await page.evaluate(()=>{
        document.querySelectorAll("div[aria-label='Search by image']")[0].click();    
    });
    console.log("waiting for input to load...");
    await page.waitForSelector('.cB9M7');
    await page.waitForTimeout(500);
    c(":~:~:~:input loaded v/ lens page ready to go");
}


function getTimestamp() {
  // Get the current date and time
  const currentDate = new Date();

  // Extract the individual components of the date and time
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1; // Months are zero-based, so we add 1
  const day = currentDate.getDate();
  const hours = currentDate.getHours();
  const minutes = currentDate.getMinutes();
  const seconds = currentDate.getSeconds();

  // Format the timestamp as a string without spaces and colons
  const timestamp = `${year}${padZero(month)}${padZero(day)}${padZero(hours)}${padZero(minutes)}${padZero(seconds)}`;

  // Function to pad single-digit numbers with leading zeros
  function padZero(number) {
    return number < 10 ? `0${number}` : number;
  }

  // Return the timestamp
  return timestamp;
}