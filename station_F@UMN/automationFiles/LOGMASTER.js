var cp = require("child_process");
const process = require('process');

var production = (process.argv[3] == undefined) ? false : true;
var objectNum = process.argv[2];
console.log("In production?: "+production);

function c(str){
    console.log(str);
    if(production){
        //process.send({status: str});
    }
}
c("~ Logger Master Autimation File initiated ~");
c("Object Number: "+objectNum);

/*
///////////////////////ROUND 1
var namerAF = cp.fork(__dirname+"/name.js", [objectNum, "deployment"]);    
c("-| name.js program spawned |-");
namerAF.on("exit",(code, signal)=>{
    c("-| name.js AF closed |-");*/
    ///////////////////////ROUND 2
    var departmentifyAF = cp.fork(__dirname+"/departmentify.js", [objectNum, "deployment"]);    
    c("-| departmentify.js program started |-");
    departmentifyAF.on("exit",(code, signal)=>{
        c("-| departmentify.js AF closed |-");
        ///////////////////////ROUND 3
        var catagorizeAF = cp.fork(__dirname+"/catagorize.js", [objectNum, "deployment"]);    
        c("-| catagorize.js program started |-");
        catagorizeAF.on("exit",(code, signal)=>{
            c("-| catagorize.js AF closed |-");
            ///////////////////////ROUND 4
            var addAF = cp.fork(__dirname+"/add.js", [objectNum, "deployment"]);    
            c("-| add.js program started |-");
            catagorizeAF.on("exit",(code, signal)=>{
                c("-| add.js AF closed |-");
                fs.unlinkSync(__dirname+"/choppingBoard/newObject_"+objectNum+".png");
                fs.unlinkSync(__dirname+"/choppingBoard/rawObj"+objectNum+"Data.json");
                fs.unlinkSync(__dirname+"/choppingBoard/obj"+objectNum+"Data.json");
                fs.unlinkSync(__dirname+"/choppingBoard/obj"+objectNum+"RawDepartmentData.json");
                process.exit();
            });
        });
    });
//});



