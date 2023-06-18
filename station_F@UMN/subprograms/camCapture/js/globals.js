var device = "webpage";
var pageName = "homepage";
function submitPOST(command, dataObj){
    $.post("/", {command: command, data: dataObj});
}
function addEl(type, id, className, appendSelector){
    var el= document.createElement(type);
    el.id = id;
    el.className = className;
    $(appendSelector)[0].appendChild(el);
}
function a(id){
    return $("#"+id)[0];
}