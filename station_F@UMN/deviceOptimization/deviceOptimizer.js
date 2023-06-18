console.log("deviceOptimizer.js File Initated");

window.addEventListener('resize',()=> {
    setTimeout(()=>{
        console.log("");
        optimizeForDevice();
    },10);
});


optimizeForDevice();

function optimizeForDevice(){
    console.log("Checking device...");
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        console.log("User is on mobile, overriding stylization...");
        if($("#MOJS")[0] == undefined){
            var MOCSS = document.createElement("link");
            var MOJS = document.createElement('script'); 
            MOCSS.href = "deviceOptimization/mobileOverride.css";
            MOCSS.rel = "stylesheet";
            MOCSS.id = "MOCSS";
            MOJS.src = "./deviceOptimization/mobileOverride.js";
            MOJS.id = "MOJS";
            $("head")[0].appendChild(MOCSS);
            $("head")[0].appendChild(MOJS);
        }
        if(window.innerHeight > window.innerWidth){     //Vertical Mode
            device = "mobileVertical";
            console.log("Detected that user is in verticle mode");

            if($("#MOVCSS")[0] == undefined){
                console.log("Applying verticle Stylization");
                var MOVCSS = document.createElement("link");
                MOVCSS.href = "deviceOptimization/mobileOverrideVertical.css";
                MOVCSS.rel = "stylesheet";
                MOVCSS.id = "MOVCSS";
                $("head")[0].appendChild(MOVCSS);
            }
            if($("#MOHCSS")[0] != undefined){
                $("#MOHCSS")[0].remove();
            }
        }else{                                          //Horizontial Mode
            device = "mobileHorizontial";
            console.log("Detected that user is in horizontial mode");
            if($("#MOHCSS")[0] == undefined){
                console.log("Applying horizontial Stylization");
                var MOHCSS = document.createElement("link");
                MOHCSS.href = "deviceOptimization/mobileOverrideHorizontal.css";
                MOHCSS.rel = "stylesheet";
                MOHCSS.id = "MOHCSS";
                $("head")[0].appendChild(MOHCSS);    
            }
            if($("#MOVCSS")[0] != undefined){
                $("#MOVCSS")[0].remove();
            }
        }
    }else{
        console.log("User is on Computer...");
        device = "webpage";
        if($("#MOJS")[0] != undefined){
            $("#MOCSS")[0].remove();
            $("#MOJS")[0].remove();
        }
        if($("#MOVCSS")[0] != undefined){
            $("#MOVCSS")[0].remove();
        }
        if($("#MOHCSS")[0] != undefined){
            $("#MOHCSS")[0].remove();
        }
    }
}