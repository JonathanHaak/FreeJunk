var showingSearchResults = false;
var device = "webpage";
var claimedItem = "";

function addEl(type, id, className, appendSelector){
    var el= document.createElement(type);
    el.id = id;
    el.className = className;
    $(appendSelector)[0].appendChild(el);
}

var POST_paramObj = {};
function submitPost(){
    if(device == "webpage"){

    }else{
        $.post(pageName, POST_paramObj /*{ command: "resetSEARCHQUERY", data: "[\"\",\"\"]" }*/ );
    }
}
function a(id){
    return $("#"+id)[0];
}
function b(cl){
    return [...$("."+cl)];
}

function c(str){
    console.log(str);
}

function c(id, ev, func){   //c() was origionally declared before c() was used as the shorthand for console.log, here it's doubled up!
    if(ev == undefined){
        console.log(id);   
    }else{
       $("#"+id)[0].addEventListener(ev,func);
    }
}

function v(id){
    return $("#"+id)[0].value;
}