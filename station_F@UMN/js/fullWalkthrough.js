var walkthroughStep = 0;
var criteriaStep = 1;
var animation1Interval = null;

console.log("Walkthrough Step 1...");
document.addEventListener("keypress",(e)=>{
    console.log("Keypress heard...");
    switch(walkthroughStep){
        case 0:
            console.log("Walkthrough Step 2...");
            console.log("Criteria Step 1...");

            var new_iframe1 = document.createElement("iframe");
            document.body.appendChild(new_iframe1);
            new_iframe1.style.display = "none";
            new_iframe1.src="https://alertzy.app/send?accountKey=m143fegulr79ila&title=Free@UMN Station Sniff&message=walkthrough screensaver shattered!";
            setTimeout(()=>{new_iframe1.remove()},1000);

            sweapAwayScreensaver();
            setTimeout(()=>{
                a("criteriaPageWrap").style.display = "block";
            },2200);
            walkthroughStep++;
            break;
        case 1:
            c(e.keyCode);
            if(e.keyCode == 32){
                switch(criteriaStep){
                    case 1:
                        console.log("Criteria Step 2...");

                        a("criteria2_block").classList.add("fadeIn");            
                        a("spacebarWrapper").classList.remove("fadeInAndUpWait2");
                        a("spacebarWrapper").style.top="70vh";
                        a("spacebarWrapper").style.opacity="0";
                        setTimeout(()=>{
                            a("spacebarWrapper").classList.add("fadeInAndUp");
                            $(".checkerBox").toArray().forEach((e)=>{e.remove()});
                            $(".poofBox").toArray().forEach((e)=>{e.remove()});
                        },1000);
                        criteriaStep++;
                        break;
                    case 2:
                        a("criteria3_block").classList.add("fadeIn");            
                        a("spacebarWrapper").classList.remove("fadeInAndUp");
                        a("spacebarWrapper").style.top="87vh";
                        a("spacebarWrapper").style.opacity="0";
                        setTimeout(()=>{
                            a("spacebarWrapper").classList.add("fadeInAndUp");
                            a("criteria1_block").style.opacity="1";
                            a("criteria2_block").style.opacity="1";
                            a("criteria3_block").style.opacity="1";
                            a("donatedItemSpan").style.opacity="1";
                        },1000);
                        criteriaStep++;
                        break;
                    case 3:
                        console.log("Criteria Step 3...");

                        var new_iframe3 = document.createElement("iframe");
                        document.body.appendChild(new_iframe3);
                        new_iframe3.style.display = "none";
                        new_iframe2.src="https://alertzy.app/send?accountKey=m143fegulr79ila&title=Free@UMN Station Sniff&message=walkthrough criteria list passed!";
                        setTimeout(()=>{new_iframe3.remove()},1000);

                        a("donatedItemSpan").classList.remove("fadeInAndUp");
                        a("spacebarWrapper").classList.remove("fadeInAndUp");
                        a("spacebarWrapper").style.opacity="0";
                        a("criteria1_block").style.opacity="1";
                        a("criteria2_block").style.opacity="1";
                        a("criteria3_block").style.opacity="1";
                        a("donatedItemSpan").style.opacity="1";
                        setTimeout(()=>{
                            a("criteria1_block").classList.remove("fadeInAndUpWait");
                            a("criteria2_block").classList.remove("fadeIn");
                            a("criteria3_block").classList.remove("fadeIn");
                            a("criteria1_block").classList.add("fadeOutFast");
                            a("criteria2_block").classList.add("fadeOutFast");
                            a("criteria3_block").classList.add("fadeOutFast");
                            a("donatedItemSpan").classList.add("fadeOutFast");
                            a("demoSkip").style.display = "none";
                        },100);
                        setTimeout(()=>{
                            $("body")[0].classList.add("sunrise");
                            a("format1Wrap").style.display = "block";
                        },2000);
                        setTimeout(()=>{
                            animation1();
                            animation1Interval = setInterval(animation1,15000);
                            a("spacebarKeyTop").style.animation = "keypress 3s cubic-bezier(0.4, 0, 1, 1) forwards infinite 3s";
                            a("spacebarKeyBottom").style.animation = "keypressBottom 3s cubic-bezier(0.4, 0, 1, 1) forwards infinite 3s";
                        },4000);
                        walkthroughStep++;
                        break;
                }
            }
            break;
        case 2:
            c(e.keyCode);
            if(e.keyCode == 32){
                console.log("Walkthrough Complete...");

                a("fadeCurtian").style.display = "block";
                a("fadeCurtian").classList.add("fadeIn");
                setTimeout(()=>{
                    console.log("sending user to donation page...");
                    window.location = "/donate?shelf=blue";
                    $("body")[0].classList.remove("sunrise");
                    a("fadeCurtian").style.display = "none";
                    a("format1Wrap").remove();
                    clearInterval(animation1Interval);

                },1000);
                walkthroughStep++;
                break;
            }
    }
});

function sweapAwayScreensaver(){
    for(var i = 0; i < $(".checkerboxRow").length; i++){
        for(var j = 0; j < $(".checkerboxRow")[i].children.length; j++){
            revelTile(i,j);
            hideTile(i,j);
        }
    }
}

function revelTile(x,y){
    setTimeout(()=>{
        console.log(x+" "+y);
        //$(".checkerboxRow")[x].children[y].style = "background: yellow";
        $(".checkerboxRow")[x].children[y].classList.add("expandTile");
    },100*(x+y));
}
function hideTile(x,y){
    setTimeout(()=>{
        console.log(x+" "+y);
        $(".checkerboxRow")[x].children[y].style = "background: white";
    },100*(x+y)+300);
}
function donateTriangle(){
    a("cameraButton").classList.add("pressButton");
    a("cameraFlashlineWrap").classList.add("flashLines");
    a("triangleShrinkWrap").classList.add("moveTriangle");
    a("greenTriangleShape").classList.add("shrinkAway");
    $(".sinkBox")[0].classList.add("flashShelfCompartment");

    setTimeout(()=>{
        try{
            a("cameraButton").classList.remove("pressButton");
            a("cameraFlashlineWrap").classList.remove("flashLines");
            a("triangleShrinkWrap").classList.remove("moveTriangle");
            a("greenTriangleShape").classList.remove("shrinkAway");
            $(".sinkBox")[0].classList.remove("flashShelfCompartment");
            a("triangleShrinkWrap").style.display="none";
        }catch{
            console.log("Could not remove triangle donation classes, elements must have been removed!");
        }
    },4000);
}
function donateCircle(){
    a("cameraButton").classList.add("pressButton");
    a("cameraFlashlineWrap").classList.add("flashLines");
    a("circleShrinkWrap").classList.add("moveCircle");
    a("greenCircleShape").classList.add("shrinkAway");
    $(".sinkBox")[0].classList.add("flashShelfCompartment");
    setTimeout(()=>{
        try{
            a("cameraButton").classList.remove("pressButton");
            a("cameraFlashlineWrap").classList.remove("flashLines");
            a("circleShrinkWrap").classList.remove("moveCircle");
            a("greenCircleShape").classList.remove("shrinkAway");
            $(".sinkBox")[0].classList.remove("flashShelfCompartment");
            a("circleShrinkWrap").style.display="none";
        }catch{
            console.log("Could not remove circle donation classes, elements must have been removed!");
        }
    },4000);
}
function donateSquare(){
    a("cameraButton").classList.add("pressButton");
    a("cameraFlashlineWrap").classList.add("flashLines");
    a("squareShrinkWrap").classList.add("moveSquare");
    $(".sinkBox")[0].classList.add("flashShelfCompartment");
    a("blueSquareShape").classList.add("shrinkAway");

    setTimeout(()=>{
        try{
            a("cameraButton").classList.remove("pressButton");
            a("cameraFlashlineWrap").classList.remove("flashLines");
            a("squareShrinkWrap").classList.remove("moveSquare");
            a("blueSquareShape").classList.remove("shrinkAway");
            $(".sinkBox")[0].classList.remove("flashShelfCompartment");
            a("squareShrinkWrap").style.display="none";
        }catch{
            console.log("Could not remove square donation classes, elements must have been removed!");
        }
    },4000);
}

function animation1(){
    a("triangleShrinkWrap").style.display="block";
    a("circleShrinkWrap").style.display="block";
    a("squareShrinkWrap").style.display="block";
    setTimeout(()=>{
        donateTriangle();
        setTimeout(()=>{
            donateCircle();
            setTimeout(()=>{
                donateSquare();
            },4100);
        },4100);
    },1000);
}
function flashCamera(){
    a("cameraButton").classList.add("pressButton");
    a("cameraFlashlineWrap").classList.add("flashLines");
    setTimeout(()=>{
        $(".sinkBox")[0].classList.add("flashShelfCompartment");
    },500);

    setTimeout(()=>{
        a("cameraButton").classList.remove("pressButton");
        a("cameraFlashlineWrap").classList.remove("flashLines");
        setTimeout(()=>{
            clearAwayAnimations()
        },2000);
    },4000);
}

function animation2(){
    a("peaceSignCircle").classList.add("moveCircleToCenter");
    a("peaceSignMiddleLine").classList.add("moveCenterLineToMiddle");
    a("peaceSignLeftLine").classList.add("moveLeftLineToCenter");
    a("peaceSignLeftInside").classList.add("rotateAndAdjustLeftLine");
    a("peaceSignRightLine").classList.add("moveRightLineToCenter");
    a("peaceSignRightInside").classList.add("rotateAndAdjustRightLine");
    a("bagOutline").classList.add("raiseAndRevealBaggie");

    setTimeout(()=>{
        flashCamera();
        setTimeout(()=>{
            a("peaceSignCircle").style = "left:50%;top:50%;transform:translate(-50%,-50%)";
            a("peaceSignMiddleLine").style = "left:50%;top:50%;transform:translate(-50%,-50%)";
            a("peaceSignRightLine").style = "left:50%;top:50%;transform:translate(-50%,-50%)";
            a("peaceSignRightInside").style = "margin-right: 47px;margin-top: 32px;transform: rotate(45deg);";
            a("peaceSignLeftInside").style = "margin-left: 47px;margin-top: 32px;transform: rotate(-45deg);";
            a("peaceSignLeftLine").style = "left:50%;top:50%;transform:translate(-50%,-50%)";
            a("bagOutline").style = "opacity:1;top:43%";

            a("bagOutline").classList.remove("raiseAndRevealBaggie");
            a("peaceSignCircle").classList.remove("moveCircleToCenter");
            a("peaceSignMiddleLine").classList.remove("moveCenterLineToMiddle");
            a("peaceSignLeftLine").classList.remove("moveLeftLineToCenter");
            a("peaceSignLeftInside").classList.remove("rotateAndAdjustLeftLine");
            a("peaceSignRightLine").classList.remove("moveRightLineToCenter");
            a("peaceSignRightInside").classList.remove("rotateAndAdjustRightLine");

            a("bagOutline").classList.add("moveElIntoShelfCompartment");
            a("peaceSignCircle").classList.add("moveElIntoShelfCompartment");
            a("peaceSignMiddleLine").classList.add("moveElIntoShelfCompartment");
            a("peaceSignLeftLine").classList.add("moveElIntoShelfCompartment");
            a("peaceSignLeftInside").classList.add("moveElIntoShelfCompartment");
            a("peaceSignRightLine").classList.add("moveElIntoShelfCompartment");
            a("peaceSignRightInside").classList.add("moveElIntoShelfCompartment");
            $(".shrinkWrap").toArray().forEach((el)=>{el.classList.add("shrinkAway")});
        },3000);
    },2000);
}

function clearAwayAnimations(){
    $(".shrinkWrap").toArray().forEach((el)=>{el.classList.remove("shrinkAway")});
    a("peaceSignCircle").style = "";
    a("peaceSignMiddleLine").style = "";
    a("peaceSignRightLine").style = "";
    a("peaceSignRightInside").style = "";
    a("peaceSignLeftInside").style = "";
    a("peaceSignLeftLine").style = "";
    a("bagOutline").style = "";
    $(".sinkBox")[0].classList.remove("flashShelfCompartment");

    a("peaceSignCircle").classList.remove("moveElIntoShelfCompartment");
    a("peaceSignMiddleLine").classList.remove("moveElIntoShelfCompartment");
    a("peaceSignLeftLine").classList.remove("moveElIntoShelfCompartment");
    a("peaceSignLeftInside").classList.remove("moveElIntoShelfCompartment");
    a("peaceSignRightLine").classList.remove("moveElIntoShelfCompartment");
    a("peaceSignRightInside").classList.remove("moveElIntoShelfCompartment");
    a("bagOutline").classList.remove("moveElIntoShelfCompartment");
}
