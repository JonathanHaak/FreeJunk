//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// This file handles:
//      >Transfere Location Tool Functionality
//      >Handles collapsing and retracting the keyboard shortcut div on all pages
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
console.log("toolFunctionality JS File Initated");

var KScollapsed = false;
function collapseKS(){
    if(KScollapsed){
        document.getElementById("keyboardShortcutsWrapper").style.right = "-168px";
        KScollapsed = false;
    }else{
        document.getElementById("keyboardShortcutsWrapper").style.right = "0px";
        KScollapsed = true;
    }
}

window.onload = function(){
    document.getElementById("keyboardShortcutsTab").addEventListener("mouseup",()=>{
        document.getElementById("keyboardShortcutsTab").style.backgroundColor = "#eeeeee";
    }); 
}

function showTransfereBox(){
    if(device == "webpage"){
        document.getElementById("isToolActive_meta").setAttribute('content', 'yes');
        document.getElementById("curtian").style.display = "block";
        document.getElementById("toolControlPanel").style.display = "inline";
        transBox_loc1.focus();
        var locationsScript = document.createElement("script");
        locationsScript.src = "js/locationMap.js";
        locationsScript.type = "text/javascript";

        $("#canvasBackground")[0].id = "canvasBackground_PV_deactivated";
        $("#canvasBackground_transLoc_deactivated")[0].id = "canvasBackground";

        //$("#locationCanvas")[0].id = "locationCanvas_PV_deactivated";
        $("#locationCanvas_transLoc_deactivated")[0].id = "locationCanvas";

        document.head.appendChild(locationsScript);
        locationsScript.onload=()=>{clickTarget = "loc1";}
    }else{
        alert("This tool is webpage only");
    }
}