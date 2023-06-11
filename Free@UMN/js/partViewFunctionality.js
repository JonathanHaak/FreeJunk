//******************************************
// This file handles:
//      >Using the spacebar to hide partInfo
//      >Linking the scales to viewPart Pop-up
//******************************************
console.log("partView Functionality JS File Initated");


document.addEventListener('keydown', event => {
    if(event.code === 'Space'){
        try{    //This was a quick work around for a bug that happened when trying to do a search right after another search (the DOM elements in this try block no longer exist)
            if(document.getElementById("isActive_meta").getAttribute('content')=="yes"){
                if(document.getElementById("zoomActive_meta").getAttribute('content')=="yes"){
                    exit_zoomImg();
                }else{
                    document.getElementById("hiddenBtn").focus();
                    exit_partView();
                }
            }else if(document.getElementById("isToolActive_meta").getAttribute('content')=="yes" && document.getElementById("transBox_loc1").value == "" && document.getElementById("transBox_loc2").value == ""){
                exit_ToolPanel();
            }
        }catch{}
    }
});
document.addEventListener('keyup', event => {
    if(event.code === 'Space'){
        document.getElementById("homeBlocker_meta").setAttribute('content', 'off');
    }
});


function exit_any(){
    if(document.getElementById("isActive_meta").getAttribute('content')=="yes"){
        exit_partView();
    }else if(document.getElementById("isToolActive_meta").getAttribute('content')=="yes"){
        exit_ToolPanel();
    }
}    

function exit_ToolPanel(){
    document.getElementById("curtian").style.display = "none";
    document.getElementById("toolControlPanel").style.display = "none";
    document.getElementById("isToolActive_meta").setAttribute('content', 'no');
    console.log("exit_ToolPanel triggered");
    $("#canvasBackground")[0].id = "canvasBackground_transLoc_deactivated";
    $("#locationCanvas")[0].id = "locationCanvas_transLoc_deactivated";
    
    
    $("#canvasBackground_PV_deactivated")[0].id = "canvasBackground";
    //$("#locationCanvas_PV_deactivated")[0].id = "locationCanvas";
    
    $("script[src='js/locationAnimations.js']")[0].remove();
    var locAniScript = document.createElement("script");
    locAniScript.src = "js/locationAnimations.js";
    locAniScript.type = "text/javascript";
    document.head.appendChild(locAniScript);
}

function exit_partView(){
    document.getElementById("viewPart").style.display = "none";
    document.getElementById("curtian").style.display = "none";
    document.getElementById("leftPointer").style.display = "none";
    document.getElementById("rightPointer").style.display = "none";

    var fooTile = document.getElementById("fooTile");
    fooTile.removeChild(fooTile.childNodes[0]);
    document.getElementById("isActive_meta").setAttribute('content', 'no');
    document.getElementById("homeBlocker_meta").setAttribute('content', 'on');
    
    document.getElementById("retrievedImg").src = "Images/subtleLoading.gif";
}

function exit_zoomImg(){
    zoomImg();
    //document.getElementById("zoomImgCurtain").style.display = "none";
    //document.getElementById("zoomImg").style.display = "none";
    //document.getElementById("zoomActive_meta").setAttribute('content',"no");
}

function scalePartViewToWindow(){
    var scaleVal = 1;
    if(window.innerWidth < 1200){
        //Scale part view down so that the 1365 to 836 pixel ratio is preserved
        var scaleFactor = (836/1365)*window.innerWidth;
        console.log("Window too small to hold partView, scalling down by factor: "+scaleFactor);
    }
}
