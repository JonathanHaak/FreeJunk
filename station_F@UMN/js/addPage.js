c("~addPage.js initialized~");

//----------------------Data Collection-------------------------------------------------------------------------------------------------------------------------
var pageName = window.location.href;
var shelfColor = pageName.substring(pageName.indexOf("shelf")+6);

var objectNum = null;
function getObjNum(){
    fetch('/getObjectNum')
        .then(response => response.json())
        .then(data => {
        console.log("Current Object Number value fetched from backend: "+data.objNumber);
        objectNum = data.objNumber;
    });
}
getObjNum();

var activeBin = null;

if(window.location.href.indexOf("localhost") == -1){
   a("capturedImg").style.display = "none";
}

//----------------------User Navigation Control-----------------------------------------------------------------------------------------------------------------
var pageState = "webcamPictureReady";
document.addEventListener("keypress",(e)=>{
    console.log("Keypress heard...");
    c(e.keyCode);
    if(e.keyCode == 32){
        c("spacebar heard");

        if(pageState == "webcamPictureReady"){
            pageState = "floating";

            //here, capture image and save to a url on the backend
            cam_caputeImg();
           
            //wait for backend to confirm the image was saved sucsesfully, then...
            donationAutonmation("obj"+objectNum+".png");
           
        }else if(pageState == "placementMessage"){
            c("lowering curtain and reseting...");
            if(passVal){
                $.post("/donate", {command: "catagorizeAndLogObject", objNum: objectNum, bin: activeBin[0]});
            }
            resetFrontend();
            pageState = "floating";
            if(passVal){
                lowerCurtain("pass");
            }else{
                lowerCurtain("fail");
            }
        }
    }else if(e.keyCode == 13){
        c("enter heard");
        if(pageState == "placementMessage"){
            c("User indicated that the current active bin is full...");
            setActiveBinFullAndFindNextEmptyBin();

        }

    }
    countdownVal = countdownStartVal;
    resetCountdownUI();
});

//----------------------Idler Countdown-------------------------------------------------------------------------------------------------------------------------
var countdownStartVal = 30;
var countdownVal = countdownStartVal;
function resetCountdownUI(){
    a("countdownWrap").style.display = "none";
}

function ticker(){
    c("tick: "+countdownVal);
    countdownVal -= 1;
    if(countdownVal <= 10){
        a("countdownWrap").style.display = "block";
        a("countdownVal").innerHTML = countdownVal;
    }
    if(countdownVal <= 0){
        window.location = "/walkthrough";
    }
}

//setInterval(ticker,1000);

//----------------------Donation Triggering---------------------------------------------------------------------------------------------------------------------
function donationAutonmation(imagePath){
    c("donationAutonmation() called for image: "+imagePath);
    $.post("/donate", {command: "beginDontaion", imgPath: imagePath, bin: activeBin[0]});
    foldCamBox();
}

//----------------------UI Animation Control--------------------------------------------------------------------------------------------------------------------
function raiseCurtain(passFailStr){
    a("placementWrap").style = "z-index: 100";
    a("placementWrap").classList.add("raiseCurtain");
    if(passFailStr == "pass"){
        a("placeSplurb").classList.add("raiseCurtianText");
        a("enterWhenDoneBtn").classList.add("fadeInWithDelay");
        a("spacebarIfTooFullBtn").classList.add("fadeInWithDelay");
        a("binImage").classList.add("raiseCurtianImage");
    }else if(passFailStr == "fail"){
        a("rejectionSplurb").classList.add("raiseCurtianText2");
        a("spacebarToTryAgain").classList.add("fadeInWithDelay");
    }else{
        throw "raising curtain with unknown parameter!";
    }

    setTimeout(()=>{

        pageState = "placementMessage";

        a("placementWrap").classList.remove("raiseCurtain");
        if(passFailStr == "pass"){
            a("placementWrap").style = "height: 100%";
            a("placeSplurb").style = "padding-top:35vh;opacity:1";
            a("binImage").style = "margin-top:27vh;opacity:1";
            a("placeSplurb").classList.remove("raiseCurtianText");
            a("enterWhenDoneBtn").classList.remove("fadeInWithDelay");
            a("spacebarIfTooFullBtn").classList.remove("fadeInWithDelay");
            a("binImage").classList.remove("raiseCurtianImage");
            a("spacebarIfTooFullBtn").style = "margin-top:27vh;opacity:1";
            a("enterWhenDoneBtn").style = "margin-top:27vh;opacity:1";
        }else if(passFailStr == "fail"){
            a("rejectionSplurb").classList.remove("raiseCurtianText2");
            a("enterWhenDoneBtn").classList.remove("fadeInWithDelay");
            a("rejectionSplurb").style = "opacity:1";
            a("spacebarToTryAgain").style = "opacity:1";
        }else{
            throw "raising curtain with unknown parameter!";
        }


    },2000);
}
function lowerCurtain(passFailStr){
    a("placementWrap").classList.add("lowerCurtain");
    if(passFailStr == "pass"){
        a("placeSplurb").classList.add("lowerCurtianText");
        a("enterWhenDoneBtn").classList.add("fadeout");
        a("spacebarIfTooFullBtn").classList.add("fadeout");
    }else if(passFailStr == "fail"){
        a("rejectionSplurb").classList.add("lowerCurtianText");
        a("spacebarToTryAgain").classList.add("fadeout");
    }else{

    }

    setTimeout(()=>{
        a("spacebarIfTooFullBtn").style = "";
        a("enterWhenDoneBtn").style = "";
    },1000);
    setTimeout(()=>{
        if(passFailStr == "pass"){

        }else if(passFailStr == "fail"){

        }else{

        }

        a("placementWrap").style = "z-index: unset";
        a("placementWrap").style = "";
        a("placeSplurb").style = "";
        a("binImage").style = "";
        a("spacebarIfTooFullBtn").style = "";
        a("enterWhenDoneBtn").style = "";
        a("spacebarToTryAgain").style = "";

        a("placementWrap").classList.remove("lowerCurtain");
        a("placeSplurb").classList.remove("lowerCurtianText");
        a("enterWhenDoneBtn").classList.remove("fadeout");
        a("spacebarIfTooFullBtn").classList.remove("fadeout");
        a("binImage").classList.remove("lowerCurtianImage");

        a("spacebarToTryAgain").classList.remove("fadeInWithDelay");

        a("rejectionSplurb").style = "";
        a("spacebarToTryAgain").style = "";        
        expandCamBox();
        getObjNum();

    },2000);
}
function expandCamBox(){
    a("obj_picInput").classList.remove("shrink");
    a("imageWrap").style = "z-index: 100";
    a("imageWrap").classList.add("expandAndFill");
    setTimeout(()=>{
        a("imageWrap").style.height = "100%";
        a("imageWrap").style.width = "100%";
        a("imageWrap").classList.remove("expandAndFill");
        activateCamera();
        a("webcam").style.display = "block";
        a("imagePlaceholder").style.display = "none";
        
    },1000);
    setTimeout(()=>{
        a("donateAgainSplurb").style = "opacity: 1";
    },500);
    a("pressSpacebarToTakePicSplurb").style = "opacity: 1";
    a("imgExWrap").style = "opacity: 1";

    pageState = "webcamPictureReady";
}
function foldCamBox(){
    a("imageWrap").classList.add("foldBack");
    a("obj_picInput").classList.add("shrink");
   
    setTimeout(()=>{
        a("imageWrap").style = "z-index: unset";
        a("imageWrap").style.height = "65%";
        a("imageWrap").style.width = "50%";
        a("imageWrap").classList.remove("foldBack");
        initializeCheck();
    },1000);
    a("pressSpacebarToTakePicSplurb").style = "opacity: 0";
    a("imgExWrap").style = "opacity: 0";
    a("donateAgainSplurb").style = "opacity: 0";
}

//----------------------Criteria Checking-----------------------------------------------------------------------------------------------------------------------
function fetchCriteriaResult(num, callback){
    console.log("Waiting for criteria "+num+" check...");
    fetch('/criteriaCheck?cNum='+num+'&oNum='+objectNum)
        .then(response => response.json())
        .then(data => {
        console.log("v/ criteria "+num+" check fullfilled. Criteria "+num+" passed?: "+data.passVal);
        callback(data.passVal);
    });
}
function initializeCheck(){
    fetchCriteriaResult(2, (result)=>{
        a("m2").style.display = "none";
        if(result == "pass"){
            a("c2_pass").style.display = "block";
            criteriaResults.push("pass");
        }else if(result == "fail"){
            a("c2_fail").style.display = "block";
            criteriaResults.push("fail");
        }else{
            c("Whoops, criteria 2 resolved with a result value that did not make senes");
        }
        numCriteriaPassed++;
        if(numCriteriaPassed == 3){
            passORfail();
        }
    });
    fetchCriteriaResult(3,  (result)=>{
        a("m3").style.display = "none";
        if(result == "pass"){
            a("c3_pass").style.display = "block";
            criteriaResults.push("pass");
        }else if(result == "fail"){
            a("c3_fail").style.display = "block";
            criteriaResults.push("fail");
        }else{
            c("Whoops, criteria 2 resolved with a result value that did not make senes");
        }
        numCriteriaPassed++;
        if(numCriteriaPassed == 3){
            passORfail();
        }
    });

    a("m1").style.display = "block";
    setTimeout(()=>{
        a("m2").style.display = "block";
        setTimeout(()=>{
            a("m3").style.display = "block";
            setTimeout(()=>{
                a("m1").style.display = "none";
                a("c1_pass").style.display = "block";
            },2000);
        },100);
    },100);

}

var numCriteriaPassed = 1;
var criteriaResults = ["pass"];
var passVal = null;

function passORfail(){
    passVal = (criteriaResults[0] == "pass" && criteriaResults[1] == "pass" && criteriaResults[2] == "pass");
    c("passVal: "+ passVal);
    if(passVal){
        pass();
        setTimeout(()=>{
            raiseCurtain("pass");
        },3000);
    }else{
        fail();
        setTimeout(()=>{
            raiseCurtain("fail");
        },3000);
    }
}

function pass(){
    c("object passed");
    $(".placementPassEl").toArray().forEach((el)=>{
        el.style.display = "block";
    });
    $(".placementFailEl").toArray().forEach((el)=>{
        el.style.display = "none";
    });
    //}
    $.post("/donate", {command: "namify", objNum: objectNum});
}

function fail(){
    c("object failed");
    $(".placementPassEl").toArray().forEach((el)=>{
        el.style.display = "none";
    });
    $(".placementFailEl").toArray().forEach((el)=>{
        el.style.display = "block";
        setTimeout(()=>{
            //lowerCurtain();        
        },3000);
    });
    $.post("/donate", {command: "deleteObjectData", objNum: objectNum});
}


function resetFrontend(){
    numCriteriaPassed = 1;
    criteriaResults = ["pass"];
    a("c1_pass").style.display = "none";
    a("c2_pass").style.display = "none";
    a("c3_pass").style.display = "none";
    a("c1_fail").style.display = "none";
    a("c2_fail").style.display = "none";
    a("c3_fail").style.display = "none";
    getObjNum();
}






//----------------------Fetch Functions-------------------------------------------------------------------------------------------------------------------------
var locations = null;
var specificShelfLocation = null;
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


fetch_LOCATIONS(()=>{
    if(pageName.indexOf("shelf") == -1){
        alert("Whoops! No shelf color provided!");
    }else{
        c("Finding specificShelfLocation...");
        locations.forEach((el)=>{
            c("Checking: ");
            c(el);
            c(el[0]);
            if(shelfColor == el[0]){
                c("Shelf Branch Found!");
                specificShelfLocation = el;
                c("specificShelfLocation");
                c(el);
                identifyEmptyBin();
            }
        });

        if(specificShelfLocation == null){
            alert("Unable to find shelf location!");
        }
    }
});

function identifyEmptyBin(){
    c("looking for empty bin...");
    specificShelfLocation[3].forEach((el)=>{
        c(el);
        c(el[1]);
        //c(el[0][1]);
        if(!el[1] && activeBin == null){
            c("found Empty bin!");
            activeBin = el;
            c("Active bin: "+activeBin);
        }
    });
    if(activeBin == null){
        c("all bins are full!");
        a("allFullMessage").style.display = "block";
    }else{
        a("binImage").src = "./LocationMap_Images/"+activeBin[2];
    }
}

function setActiveBinFullAndFindNextEmptyBin(){
    c("looking for active bin...");
    specificShelfLocation[3].forEach((el)=>{
        c(el);
        c(el[0]);
        if(el == activeBin && activeBin != null){
            c("found active bin in array!");
            el[1] = true;
            activeBin = null;
            c("Active bin: "+activeBin);
        }
    });

    $.post("/donate", {command: "updateLocationsArray", data: JSON.stringify(locations)});

    identifyEmptyBin();
}

function parseFinalLetterAndNumber(str) {
    const regex = /^.*([A-Za-z]\d+)$/;
    const match = regex.exec(str);
    return match ? match[1] : null;
}