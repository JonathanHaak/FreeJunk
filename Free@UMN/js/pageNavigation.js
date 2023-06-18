//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>  
// This file handles:           
//      >Hit space to return to mainpage
//      >Press a to go to add a part
//      >Press c to go to catagoyMap page
//      >Press s to go to the search box
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>    NOTE: this file isn't applied to addAPart as it automatically focuses an input on loading
console.log("pageNavigation JS File Initated");

var urlArray = window.location.href.split("/");     //Splits up the whole url
var pageName = urlArray.pop();                      //isolates the last part which is the page name (in case I move the files around) 

document.addEventListener('keydown', event => {     //space to go home & a to go to addAPart
    if(document.activeElement.tagName != "INPUT" && document.activeElement.tagName != "TEXTAREA"){
        if (pageName == "addPart.html"){
            if(event.code === 'Space' && document.getElementById("cameraStatus_meta").getAttribute("content")=="unactive"){
                window.location.href = "Astradux.html";
            }
        }
        if(event.which == '67' && pageName != "catagoryMap.html") {
            window.location.href = "catagoryMap.html";
        }
        if(event.which == '83'){
            document.getElementById("inquiry").focus();
            setTimeout(()=>{
                document.getElementById("inquiry").value = document.getElementById("inquiry").value.substring(0,document.getElementById("inquiry").value.length-1);
            }, 10);
        }
    }
});
