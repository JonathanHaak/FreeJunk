

console.log("deviceOptimizer.js File Initated");

//if(pageName != "addPart.html"){
window.addEventListener('resize',()=> {
    setTimeout(()=>{
        console.log("");
        optimizeForDevice();
    },10);
});
//}


optimizeForDevice();

function optimizeForDevice(){
    console.log("Checking device...");
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        console.log("User is on mobile, overriding stylization...");

        /*
        if($("#MOJS")[0] != undefined){
            $("#MOJS")[0].remove();
        }else{
            var MOCSS = document.createElement("link");
            MOCSS.href = "deviceOptimization/mobileOverride.css";
            MOCSS.rel = "stylesheet";
            MOCSS.id = "MOCSS";
            $("head")[0].appendChild(MOCSS);        
        }
        var MOJS = document.createElement('script'); 
        MOJS.src = "./deviceOptimization/mobileOverride.js";
        MOJS.id = "MOJS";
        $("head")[0].appendChild(MOJS);
        */

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
            $("#A")[0].src = "Style_File/AstraduxSignage_Shortened.png";
            $("#searchLabel")[0].innerHTML = "";
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
            if(showingSearchResults){
                $("#widener")[0].style = "";
            }
        }else{                                          //Horizontial Mode
            device = "mobileHorizontial";
            console.log("Detected that user is in horizontial mode");
            $("#A")[0].src = "Style_File/AstraduxSignage.png";
            $("#searchLabel")[0].innerHTML = "Search: ";
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
            if(showingSearchResults){
                $("#widener")[0].style = "height: 30px";
            }
        }

        if(pageName == "addPart.html"){
            if(device == "mobileHorizontial"){
                addEl("div","horiBlock","","body");
                $("#horiBlock")[0].innerHTML = "Horizontial Add Part is not yet supported";
                $("#horiBlock")[0].style = "position: fixed;width: 90%;height: 100%;background-color: white;padding: 190px;font-size: 70px;text-align: center;left: 50%;transform: translate(-50%);font-family: monospace;color: rgb(178, 178, 178);top: 0px;font-style: oblique;z-index: 1;"
            }else{
                try{
                    $("#horiBlock")[0].remove();
                }catch{}
            }
        }else if(pageName == "catagoryMap.html" && $("#viewPart")[0] == undefined){ //Catmap

        }else{      //Homepage
            try{
                homepageResize();
            }catch{console.log("Failed to run homepageResize")}
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
        $("#A")[0].src = "Style_File/AstraduxSignage.png";
        $("#searchLabel")[0].innerHTML = "Search: ";
    }
}