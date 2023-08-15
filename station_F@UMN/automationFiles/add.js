console.log("~Automation File 4 initialized~");

const puppeteer = require('puppeteer');
const fs = require('fs');
const process = require('process');

var production = (process.argv[3] == undefined) ? false : true;
var objectNum = process.argv[2];
console.log("In production?: "+production);

//Save object # as a variable from command line arguments
var objectNum = process.argv[2];

function c(str){
    console.log(str);
    if(production){
        //process.send({status: str});
    }
}

async function run() {
    //Read in the object raw data file and parse into an array saved to a variable
    var objectArray = fs.readFileSync(__dirname+"/choppingBoard/obj"+objectNum+"Data.json");
    c("JSON object collected from obj#Data.json file: "+ objectArray +"  ("+typeof(objectArray)+")"+"\n");
    var jsonObject = JSON.parse(objectArray);
    c("rawObj#Data.json file data converted into object: "+ JSON.stringify(jsonObject) +"  ("+typeof(jsonObject)+")"+"\n");

    //Open the obj#Data.json file as a piece of json
    var objectData = JSON.parse(fs.readFileSync(__dirname+"/choppingBoard/obj"+objectNum+"Data.json"));
    console.log("objectData: "+ JSON.stringify(objectData) + " " +typeof(objectData)+"\n");
    
    var argsProp = null;
    if(production){
        argsProp = ['--start-maximized', '--no-sandbox'];
    }else{
        argsProp = ['--start-maximized'];
    }
    
    puppeteer.launch({headless: production, args:argsProp}).then(async browser => {
        c("beginning automation 4");
        const page = await browser.newPage();
        universalPage = page;
        c("Opening addPart page...");
        await page.goto('https://www.freeumn.com/addPart.html?partData='+encodeURI(JSON.stringify(objectData)));

        await page.waitForSelector('#picInput');
        await page.waitForTimeout(1000);

        // get the ElementHandle of the selector above
        const inputUploadHandle = await page.$('#picInput');

        c("Image Name ~ "+objectData.img);

        // prepare file to upload, I'm using test_to_upload.jpg file on same directory as this script
        // Photo by Ave Calvar Martinez from Pexels https://www.pexels.com/photo/lighthouse-3361704/
        let fileToUpload = __dirname+"/choppingBoard/"+objectData.img;
        c("Full Image Path ~ "+fileToUpload);
        
        // Sets the value of the file input to fileToUpload
        inputUploadHandle.uploadFile(fileToUpload);
        

        /*
        c("Object Name ~ "+objectData.name);
        await page.waitForSelector("#name");
        await page.type("#name",objectData.name);
        
        c("Object Location ~ "+objectData.location);
        await page.waitForSelector("#location");
        await page.type("#location",objectData.location);
        
        c("Object Tags ~ "+objectData.tags);
        var i = 0;
        while(i < objectData.tags.length){
            await page.type("#tags",objectData.tags[i]);
            await page.keyboard.press("Enter");
            i++;
        }
        await page.type("#tags",objectData.catagory);
        await page.keyboard.press("Enter");

        c("Object Catagory ~ "+objectData.catagory);
        await page.waitForSelector("#catagory");
        await page.type("#catagory",objectData.catagory);

        c("Object Description ~ "+objectData.description);
        if(objectData.description != undefined){
            console.log("Description exists in Object Data, pressing the add description button...");
            await page.waitForSelector("#addDescription");
            await page.click("#addDescription");
            await page.waitForTimeout(1000);
            await page.waitForSelector("#description");
            await page.type("#description",objectData.description);
        }else{
            console.log("Description does not exist in Object Data, not pressing the add description button");
        }
        */
        await page.waitForTimeout(1000);
        
        console.log("Pressing the add button and adding catagory if it does not exist...");
        await page.evaluate(()=>{
            addtoInventory();
        });

        await page.waitForTimeout(1000);
        
        console.log("//////\\\\\\\\||||||||||\\");
        console.log("|| Addition Sucsessful! ||");
        console.log("\\\\\\\\\\\\\\\\\\\///////");
        
        
//        await page.waitForTimeout(3500000);

        //await page.waitForTimeout(35000);
        process.exit();
    });
}
run();