console.log("~Automation File 3 initialized~");

const puppeteer = require('puppeteer');
const fs = require('fs');
const process = require('process');

var production = (process.argv[3] == undefined) ? false : true;
var objectNum = process.argv[2];
console.log("In production?: "+production);

//production = false;

function c(str){
    console.log(str);
    if(production){
        process.send({status: str});
    }
}

async function run() {
    puppeteer.launch({headless: production,args: ['--start-maximized', '--no-sandbox']}).then(async browser => {
        c("beginning automation 3");
        const page = await browser.newPage();
        universalPage = page;
        //await page.goto('https://www.amazon.com/s?k=');
        //await page.waitForSelector("#twotabsearchtextbox");
        var objectData = fs.readFileSync(__dirname+"/choppingBoard/obj"+objectNum+"Data.json").toString();
        console.log("objectData: "+objectData + " " +typeof(objectData));
        var objectData = JSON.parse(objectData);
        console.log("objectData: "+ objectData + " " +typeof(objectData));

        var objectName = objectData.name;
        console.log("Fully Parsed Object Name: "+objectName);

        var objectName_withAllCharactersNotALetterSpaceOrNumberRemoved = objectName.replace(/[^\w\s]/g, '');
        var objectName_withAllCharactersNotALetterSpaceOrNumberRemoved_andSpacesReplacedWithEqualSings = objectName.replace(/ /g, '+');
        
        await page.goto('https://www.amazon.com/s?k='+objectName_withAllCharactersNotALetterSpaceOrNumberRemoved_andSpacesReplacedWithEqualSings);
        
        //await page.type("#twotabsearchtextbox", "First Edition Harry Potter And the Philosopher's stone");
        //await page.waitForSelector("#nav-search-submit-button");
        //await page.type("#nav-search-submit-button", objectName);
        await page.waitForSelector("#departments");
        await page.evaluate(()=>{
            function returnAllInnerHTMLOfDecendants(node){
                var text = "";
                var mainDepartmentText = "";
                function returnAllInnerHTMLOfDecendants_recursiveDriver(child){
                    var i = 0;
                    while(i < child.children.length){
                        returnAllInnerHTMLOfDecendants_recursiveDriver(child.children[i]);
                        i++
                    }
                    if(child.children.length == 0){
                        //debugger;
                        if(child.parentElement.parentElement.parentElement.classList.value.indexOf('s-navigation-indent-1') == -1){
                            mainDepartmentText += child.innerHTML;
                            mainDepartmentText += " ";
                        }
                        text += child.innerHTML;
                        text += " ";
                    }
                }
                returnAllInnerHTMLOfDecendants_recursiveDriver(node);
                var finalResult = "{\"mainDepartmentText\": \""+mainDepartmentText+"\", \"text\": \""+text+"\"}";
                return finalResult;
            }
            
            /*var resultTitles = []; 
            document.querySelectorAll(".UAiK1e").forEach(el=>{resultTitles.push(el.innerHTML)});*/
            var newTextEl = document.createElement("meta");
            newTextEl.content = returnAllInnerHTMLOfDecendants(document.getElementById("departments"));
            newTextEl.id = "DATA_TRANSFERE_ELEMENT";
            document.body.appendChild(newTextEl);
        });
        var resultTextArray = await page.$$eval("#DATA_TRANSFERE_ELEMENT",(el)=>{
            return el.map(e=>e.content);
        });
        
        console.log("resultTextArray: "+resultTextArray[0]+"\n");
        
        console.log("resultTextArray: "+resultTextArray[0]+"\n");
        

        fs.writeFileSync(__dirname+"/choppingBoard/obj"+objectNum+"RawDepartmentData.json",resultTextArray[0]);
        
        c("~~departmentify.js complete~~");
        process.exit();
    });
}
run();

