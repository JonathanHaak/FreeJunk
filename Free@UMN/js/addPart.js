//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
// This file handles:
//      >Saving inputed part information as a txt & png file in 
//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

/*
    box-shadow: 0px 0px 3px 1px red;
    border: 1px solid #767676;
    border-radius: 2px;
*/

console.log("addPart JS File Initated");

var picURL = "";
var tags = [];
var lastDataAdded = [];

var catBlocksToDarken = [];
var catBlocksToDarken_arr = [];

var URLPartDataDecoded = null;
window.onload = function(){
    fetch_CATAGORIES(addPartStartup);
    $.post("/addPart.html", {command: "VAHCS_sniff", data: getCookie("userToken")});

    if(window.location.href.indexOf("partData") != -1){
        c("Part data detected in URL!");
        c("Retrieveing...");
        var URLPartDataRaw = window.location.href.substring(window.location.href.indexOf("partData")+9);
        c("URLPartDataRaw: "+URLPartDataRaw);
        URLPartDataDecoded = JSON.parse(decodeURI(URLPartDataRaw));
        c("URLPartDataDecoded: "+URLPartDataDecoded);

    }
}
function addPartStartup(){
    document.body.style.cursor = "default";
    a("catagoryLoadingMsg").remove();
    a("locationsLoadingMsg").remove();
    catagoryOnloadProcedure();
    $("#quantity")[0].value = 1;
    $("#quantity")[0].style="color: #999999";
    $("#quantity")[0].addEventListener("focus",()=>{$("#quantity")[0].style="color: black";});
    $("#quantity")[0].addEventListener("click",()=>{
        if($("#quantity")[0].value == 1){
            $("#quantity")[0].value = "";
        }
    });


    if(getCookie("MODDATA") /*document.querySelector("meta[name=ModDATA]").getAttribute("content")*/ != ""){
        console.log("Part modification requested, adjusting page layout accordingly...");
        partModProtocol();
    }

    $("#backdrop")[0].addEventListener("mousedown", ()=>{
        console.log("Body of page pressed, deleting a row from the web...");
        if(previousCollapseDepth != 1 && previousCollapseDepth != null){
            document.body.style.cursor = "none";
            catBlocksToDarken = [];
            catBlocksToDarken_arr = [];
            $("#mainCatCont")[0].removeChild($("#mainCatCont")[0].children[$("#mainCatCont")[0].children.length-1]);
            previousCollapseDepth--;
            catBlocksToDarken = $("#mainCatCont")[0].children[$("#mainCatCont")[0].children.length-1].children;    //Make an array for each rowBlock in the last row
            console.log("catBlocksToDarken: "+JSON.stringify(catBlocksToDarken));
            for(var i = 0; i < catBlocksToDarken.length; i++){
                catBlocksToDarken_arr.push(catBlocksToDarken[i]);
            }
            console.log("catBlocksToDarken_arr: "+JSON.stringify(catBlocksToDarken_arr));
            catBlocksToDarken_arr.forEach((block, index)=>{ //for(each element in that array){
                $("#mainCatCont")[0].children[$("#mainCatCont")[0].children.length-1].children[index].style.opacity = "1";
            });
        }
    });
    document.body.addEventListener("mouseup", ()=>{
        document.body.style.cursor = "default";
    });
    $("#autoCapsBar")[0].addEventListener("click", ()=>{
        turnAutoCatsON_OFF();
    });
    $("#locMapEdit")[0].addEventListener("click", ()=>{
        alert("should take user to locations page and pull up correct location stuff there");
    });
}

function refreshImage(){
    console.log("Pic Input Activated");    
    picURL = document.getElementById("picInput").value;
    var URL_pieces = picURL.split("\\"); //This actually splits at a single \, since \ is a special JS character
    picURL = URL_pieces[URL_pieces.length-1];
    console.log(picURL);
    //document.getElementById("imagePlaceholder").src = "Inventory_Images/" + picURL;
    document.getElementById("name").focus();
    //URIActive = false;
}

function resetPartInput(){
    document.getElementById("name").value = "";
    if(!locationLocked){
        document.getElementById("location").value = "";
    }
    document.getElementById("tags").value = "";
    document.getElementById("quantity").value = "";
    if(!catagoryLocked){
        document.getElementById("catagory").value = "";
    }
    picURL = "";
    document.getElementById("picInput").value = "";
    document.getElementById("description").value = "";

    if(descriptionActive){
        Description_ONOFF();
    }
    document.getElementById("imagePlaceholder").src = "Images/DropImageHere.png";
    document.getElementById("spaceToHome").innerHTML = "Space to go home restored";
    var i = 1;
    while(i <= document.getElementById('inputBlock_tags').children.length-1){  
        document.getElementById('inputBlock_tags').removeChild(document.getElementById('inputBlock_tags').lastChild);
        i++;
    }
    tags = [];
    document.getElementById("name").focus();
    if(!typeLocked){
        $("#isBin")[0].checked = false;
        if(device == "webpage"){
            $("#quantWrap")[0].style.display = "inline-block";
        }
    }
    if(!document.getElementById("isBin").checked){
        $("#quantity")[0].value = 1;
        $("#quantity")[0].style="color: #999999";
    }
    $("#redArrowWrap")[0].style.display = "none";
    $("#locInexistentMessage")[0].style.display = "none";
    //URIActive = false;

    if(speedMode){
        activateCamera();
    }
}

function addtoInventory(){
    var partInfo = null;
    var partName = null;
    var partLocation = null;
    var partTags = null;
    var partQuantity = null;
    var partCatagory = null;
    var description = null;
    var isBin = null;
    if(URLPartDataDecoded == null){
        partInfo = "";
        partName = fixQuoteMarks(document.getElementById("name").value);
        partLocation = document.getElementById("location").value.replace(/>/g, "").replace(/</g, "");
        partTags = fixQuoteMarks(document.getElementById("tags").value);
        partQuantity = document.getElementById("quantity").value;
        partCatagory = document.getElementById("catagory").value;
        description = fixQuoteMarks(document.getElementById("description").value);
        isBin = document.getElementById("isBin").checked.toString();
    }else{
        partInfo ="";
        partName =URLPartDataDecoded.name;
        partLocation =URLPartDataDecoded.location;
        partTags =URLPartDataDecoded.tags;
        partQuantity = 1;
        partCatagory = URLPartDataDecoded.catagory;
        description =URLPartDataDecoded.description;
        isBin =false;
        findAndAddCatagory(URLPartDataDecoded.catagory);
    }

    //if(URIActive){
    picURL = timestamp_picName;
    document.getElementById("command_hiddenInput").value = "addPart_URI";
    //}else{
    //document.getElementById("command_hiddenInput").value = "addPart";
    //}

    if(description == ""){
        partInfo = "[\""+partName+"\", \""+partLocation+"\", \""+partCatagory+"\", ["+tags+"], \""+partQuantity+"\", \""+picURL+"\", "+ isBin +"]";
    }else{
        partInfo = "[\""+partName+"\", \""+partLocation+"\", \""+partCatagory+"\", ["+tags+"], \""+partQuantity+"\", \""+picURL+"\", "+ isBin +", \"" +description+"\"]";
    }

    console.log("Part Data"+partInfo);

    if(partName == "" && picURL == ""){
        console.log("There was not enough part data provided, part add aborted");
        tweekConfirmationBlock_NoData();
        confirmationAnimation();
        setTimeout(()=>{
            tweekConfirmationBlock_Default();
        }, 2000);
        return;
    }

    lastDataAdded = partInfo;

    if(jQuery($("#uri_hiddenInput")[0]).attr("value") != ""){
        $.post("/addPart.html", {command: "addPart_URI", data: JSON.stringify(partInfo), uri: eval(jQuery($("#uri_hiddenInput")[0]).attr("value")), timestamp: jQuery($("#captureTimestamp_hiddenInput")[0]).attr("value")});
    }else{
        $.post("/addPart.html", {command: "addPart", data: JSON.stringify(partInfo)});
    }
    /*    document.getElementById("data_hiddenInput").value = JSON.stringify(partInfo);
    document.getElementById("hiddenForm").submit();*/

    resetPartInput();

    tweekConfirmationBlock_Default();
    confirmationAnimation();
    showThenRemoveUndoBtn();
}

function fixQuoteMarks(rawString){      //Replace " with \"
    var doubleQuoteIndecies = [];
    var fixedStr = rawString;
    while(rawString.indexOf("\"") != -1){
        doubleQuoteIndecies.push(rawString.lastIndexOf("\""));
        console.log("found a \" at index: "+rawString.lastIndexOf("\""));
        rawString = rawString.substring(0,rawString.lastIndexOf("\""));
        console.log("rawString chopped, is now: "+rawString);
    }
    doubleQuoteIndecies.forEach((el)=>{
        var partDataPreQuote = fixedStr.substring(0,el);
        var partDataPostQuote = fixedStr.substring(el,fixedStr.length);
        fixedStr = partDataPreQuote+"\\"+partDataPostQuote;
    });

    return fixedStr;
}

var revisedPN = "";
function partNameProcessing(){
    revisedPN = "";
    var partNamePieces = (document.getElementById("name").value).split(" ");
    partNamePieces.forEach(cap_and_combine);
    document.getElementById("name").value = revisedPN.substring(0, revisedPN.length-1);
}
var revisedPiece = "";
function cap_and_combine(item){
    revisedPiece = autoCaps ? item.charAt(0).toUpperCase() : item.charAt(0);
    revisedPiece += item.substring(1, item.length);
    revisedPN += revisedPiece+" ";
}

function quantityProcessing(){
    document.getElementById("quantity").value = (document.getElementById("quantity").value).toLowerCase();
}

function quantityON_OFF(){
    if(document.getElementById("isBin").checked){
        document.getElementById("quantWrap").style.display = "none";
        $("#quantity")[0].value = "";
    }else{
        document.getElementById("quantWrap").style.display = "block";
        $("#quantity")[0].value = 1;
        $("#quantity")[0].style="color: #999999";
    }
}

document.addEventListener('keydown', event => {
    if(document.activeElement.tagName != "INPUT" && document.activeElement.tagName != "TEXTAREA"){
        if(event.which == 82){
            resetPartInput();
            setTimeout(()=>{
                document.getElementById("name").value = "";
            },0);
        }else if(event.which == 80){
            activateCamera();
        }
    }
    if(event.code === 'Space' && cameraActive){
        cam_caputeImg();
        setTimeout(()=>{
            var oldVal = $("#name")[0].value;
            if(oldVal != "") $("#name")[0].value = oldVal.substring(0,oldVal.length-1);
            else $("#name")[0].value = "";
        },0);
    }
    var partName = document.getElementById("name").value;
    var partLocation = document.getElementById("location").value;
    var partTags = document.getElementById("tags").value;
    var partQuantity = document.getElementById("quantity").value;
    var partCatagory = document.getElementById("catagory").value;
    var description = document.getElementById("description").value;
    var locCreateInput = document.getElementById("locCreateInput").value;
    if(partName == "" && partLocation == "" && partTags == "" && partQuantity == "" && partCatagory == ""  && description == "" && locCreateInput == ""){//Checks that you're not just trying to type part info
        if(event.code === 'Space'){
            if(!cameraActive){
                window.location.href = "Astradux.html";
            }
            return;
        }
        if(document.activeElement.tagName != "INPUT" && document.activeElement.tagName != "TEXTAREA"){
            if(event.which == '67'){
                window.location.href = "catagoryMap.html";
                return;
            }
            if(event.which == '83'){
                document.getElementById("inquiry").focus();
            }
        }
    }else{
        if(event.which == '67' || event.code === 'Space'){
            document.getElementById("spaceToHome").innerHTML = "Space to go home is turned off (hit add part to turn back on)";
        }
    }
    if(event.keyCode === 13 && document.activeElement.id == 'tags'){
        if(document.getElementById("tags").value != ""){
            addTag(document.getElementById("tags").value);
        }
    }else if(event.keyCode === 13 && document.activeElement.id != 'tags' && document.activeElement.id != 'inquiry' && document.activeElement.id != 'locCreateInput'){
        if(getCookie("MODDATA") /*document.querySelector("meta[name=ModDATA]").getAttribute("content")*/ != ""){
            submitPartMod();
        }else{
            addtoInventory();
        }
    }else if(event.keyCode === 13 && document.activeElement.id == 'inquiry') {  //checks whether the pressed key is "Enter"
        //$.post("/addPart.html", {command: "triggerForignSearch", data: "[\""+document.getElementById("inquiry").value+"\",\"\"]"});
        setCookie("SEARCHQUERY", JSON.stringify([document.getElementById("inquiry").value,""]), "1");

        setTimeout(()=>{
            window.location.href = "Astradux.html";
        },100);

        /*document.getElementById("command_hiddenInput").value = "triggerForignSearch";
        document.getElementById("data_hiddenInput").value = "[\""+document.getElementById("inquiry").value+"\",\"\"]";
        document.getElementById("hiddenForm").submit();*/
    }
})

function addTag(tagRaw){
    var partTag = tagRaw.toLowerCase();
    var tag = document.createElement("div");
    var tagWrap = document.createElement("div");
    var minusIcon = document.createElement("img");
    tag.id = "tagContainer";
    minusIcon.id = "minusIcon_"+tags.length;
    tagWrap.className = "tagWrap";
    tag.innerHTML = partTag;
    tags.push("\""+partTag+"\"");
    document.getElementById("tags").value = "";
    minusIcon.src = "Images/minusIcon.png";
    minusIcon.className = "minusImg";
    tagWrap.appendChild(minusIcon);

    document.getElementById('inputBlock_tags').appendChild(tagWrap).appendChild(tag);

    tagWrap.style.width = tag.clientWidth+40+40;
    tagWrap.addEventListener("mouseenter", ()=>{
        console.log("Hoving over hotLink Wrapper");
        tagWrap.children[0].style.visibility = "visible";
    });
    tagWrap.addEventListener("mouseleave", ()=>{
        tagWrap.children[0].style.visibility = "hidden";
    });
    minusIcon.addEventListener("click", ()=>{
        var tagNum = minusIcon.id.substring(minusIcon.id.length-1);
        console.log("Deleting tag #"+tagNum);
        tags.splice(tagNum,1);
        minusIcon.parentElement.remove();
    });
}

var descriptionActive = false;
function Description_ONOFF(){
    if(descriptionActive){        
        document.getElementById("addDescription").innerHTML = "+Details";
        document.getElementById("description_inputBlock").style.display = "none";
    }else{
        document.getElementById("addDescription").innerHTML = "-Details";
        if(device == "webpage"){
            document.getElementById("description_inputBlock").style.display = "flex";
        }else{
            document.getElementById("description_inputBlock").style.display = "block";
        }
        document.getElementById("description").focus();
    }
    descriptionActive = !descriptionActive;
}

function confirmationAnimation(){
    var elem = document.getElementById("partAddedConfirmationBlock");
    elem.classList.remove("CB_RunAnimation");
    void elem.offsetWidth;
    elem.classList.add("CB_RunAnimation");
}

var block = document.getElementById("partAddedConfirmationBlock");
var blockImg = document.getElementById("checkboxImage");
var blockText = document.getElementById("confirmationText");
function tweekConfirmationBlock_NoData(){
    block.style.background = "yellow";
    blockImg.src = "Images/cautionIcon.png";
    blockImg.style = "height: 33px; margin-top: 3px; margin-left: 8px";
    blockText.innerHTML = "No Data - Part Add Blocked";
    blockText.style = "margin-top: -33px; margin-left: 42px;";
}
function tweekConfirmationBlock_Default(){
    block.style.background = "#03fc5e";
    blockImg.src = "Images/checkmark.png";
    blockImg.style = "height: 40px; margin-top: -3px; margin-left: 3px";
    blockText.innerHTML = "Part Information Added to Inventory";
    blockText.style = "margin-top: -34.5px; margin-left: 38px;";
}
function tweekConfirmationBlock_AddUndone(){
    block.style.background = "red";
    blockText.innerHTML = "Part Data Removed";
    blockText.style.marginTop = "-35px";
    blockImg.src = "Images/crumpledPaperIcon.png";
    blockImg.style.height = "38px";
    blockImg.style.marginTop = "0px";
}

var locationLocked = false;
function lockorunlock_location(){
    console.log("Location Lock Function Triggered");
    locationLocked = !locationLocked;
    if(locationLocked){
        document.getElementById("loc_dataLock").src = "Images/Locked.png";
    }else{
        document.getElementById("loc_dataLock").src = "Images/Unlocked.png";
    }
}
var catagoryLocked = false;
function lockorunlock_catagory(){
    catagoryLocked = !catagoryLocked;
    if(catagoryLocked){
        document.getElementById("cat_dataLock").src = "Images/Locked.png";
    }else{
        document.getElementById("cat_dataLock").src = "Images/Unlocked.png";
    }
}
var typeLocked = false;
function lockorunlock_type(){
    typeLocked = !typeLocked;
    if(typeLocked){
        document.getElementById("type_dataLock").src = "Images/Locked.png";
    }else{
        document.getElementById("type_dataLock").src = "Images/Unlocked.png";
    }
}

var autoCaps = true;
function turnAutoCatsON_OFF(){
    autoCaps = !autoCaps;
    if(autoCaps){
        document.getElementById("autoCapsBar").innerHTML = "Auto-Cap - ON";
    }else{
        document.getElementById("autoCapsBar").innerHTML = "Auto-Cap - OFF";
    }
}

function fillInPartData(dataArr){
    document.getElementById("name").value = dataArr[0];
    document.getElementById("location").value = dataArr[1];
    document.getElementById("isBin").value = dataArr[6];
    if(dataArr[6] == true){
        document.getElementById("isBin").checked = true;
        document.getElementById("quantWrap").style.display = "none";
    }
    for(var i = 0; i < dataArr[3].length; i++){
        addTag(dataArr[3][i]);
    }
    document.getElementById("quantity").value = dataArr[4];
    document.getElementById("catagory").value = dataArr[2];
    if(dataArr.length == 8){
        Description_ONOFF();
        document.getElementById("description").value = dataArr[7];
    }
    if(dataArr[5] != ""){
        //document.getElementById("imagePlaceholder").src = "Inventory_Images/"+dataArr[5];

        fetchImg(dataArr[5], modData_fileOrigin, "#imagePlaceholder");
    }
    picURL = eval(JSON.parse(getCookie("MODDATA")).data) /*document.querySelector("meta[name=ModDATA]").getAttribute("content")*/[0][0][5];
    document.getElementById("addButton").innerHTML = "Save Changes";
    document.getElementById("addButton").onclick = function(){
        submitPartMod();
    }
    checkLocExistence();

    searchLayer("catagories", dataArr[2]);   //In the works: collapsing the tree to the current catagory
    var curLocStr = "";
    var curcatStr = "";      //Varible to store location array values to add to curLocStr. Shrinks as program progresses
    if(foundCatStr != undefined){
        curLocStr += foundCatStr.substring(0,foundCatStr.indexOf("]")+1);
        foundCatStr = foundCatStr.substring(foundCatStr.indexOf("]")+1,foundCatStr.length);

        curLocStr += foundCatStr.substring(0,foundCatStr.indexOf("]")+1);
        foundCatStr = foundCatStr.substring(foundCatStr.indexOf("]")+1,foundCatStr.length);
    }
    //for(int i = 0; i >
    //collapseRow(catagories, margin1, "catagories", 1);    Maybe add a parameter "returnPath" to searchLayer() to get each collapse that has to happen
}

var modData_fileOrigin = null;
function partModProtocol(){
    //if(eval(eval(JSON.parse(getCookie("MODDATA")).data) /*document.querySelector("meta[name=ModDATA]").getAttribute("content")*/ )) != undefined){
    document.getElementById("abortBtnWrap").style.display = "block";
    document.getElementById("partModBannerWrap").style.display = "block";

    //debugger;
    var inventoryFileOrStr = eval(JSON.parse(getCookie("MODDATA")).data) /*document.querySelector("meta[name=ModDATA]").getAttribute("content")*/[1];
    //debugger;
    modData_fileOrigin = inventoryFileOrStr.substring(inventoryFileOrStr.indexOf("Y")+1, inventoryFileOrStr.length);

    fillInPartData(eval(JSON.parse(getCookie("MODDATA")).data)/*document.querySelector("meta[name=ModDATA]").getAttribute("content")*/[0][0]);

    console.log(">>>Mod Mode active<<<");

    //setCookie("MODDATA","",1);

    //$.post("/addPart.html", {command: "wipeModData", data: ""});

    /*document.getElementById("command_hiddenInput").value = "wipeModData";
        document.getElementById("data_hiddenInput").value = "";
        document.getElementById("hiddenForm").submit();*/

    //v     Collapse CatMap      v
    breakAllLoopLayers = false;
    searchLayer("catagories","Box");
    //}
}
function submitPartMod(){
    document.getElementById("undoBtnWrap").style.display = "none";
    var modMessage = "INVENTORY"+/*document.querySelector("meta[name=FILETOMOD]").content*/eval(JSON.parse(getCookie("MODDATA")).fileN)+":";

    var partName = document.getElementById("name").value;
    var partLocation = document.getElementById("location").value;
    var partTags = document.getElementById("tags").value;
    var partQuantity = document.getElementById("quantity").value;
    var partCatagory = document.getElementById("catagory").value;
    var description = document.getElementById("description").value.join(" ");
    var isBin = document.getElementById("isBin").checked.toString();

    var dataToMod = eval(JSON.parse(getCookie("MODDATA")).data) /*document.querySelector("meta[name=ModDATA]").getAttribute("content")*/[0][0];
    dataToMod.splice(4,1, dataToMod[4].toString());

    //Add a space between each entry...
    modMessage += "[\""+dataToMod[0]+"\", \""+dataToMod[1]+"\", \""+dataToMod[2]+"\", ";
    if(dataToMod[3].length != 0){
        modMessage += "[" + JSON.stringify(dataToMod[3]).substring(1,JSON.stringify(dataToMod[3]).length-1)+"]";
    }else{
        modMessage += "[]";
    }
    modMessage += ", \""+dataToMod[4]+"\", \""+dataToMod[5]+"\", "+ dataToMod[6];
    if(dataToMod.length == 8){
        modMessage += ", \"" +dataToMod[7]+"\"";
    }
    modMessage += "]>=-:-=>";
    if(description == ""){
        modMessage += "[\""+partName+"\", \""+partLocation+"\", \""+partCatagory+"\", ["+tags+"], \""+partQuantity+"\", \""+picURL+"\", "+ isBin +"]";
    }else{
        modMessage += "[\""+partName+"\", \""+partLocation+"\", \""+partCatagory+"\", ["+tags+"], \""+partQuantity+"\", \""+picURL+"\", "+ isBin +", \"" +description+"\"]";
    }

    console.log("modMessage: "+modMessage);

    $.post("/addPart.html", {command: "ModPartData", data: modMessage}).done(()=>{window.location = "/Astradux.html";});

    /*document.getElementById("command_hiddenInput").value = "ModPartData";
    document.getElementById("data_hiddenInput").value = modMessage;
    document.getElementById("hiddenForm").submit();*/

    resetCookie("MODDATA");
}

function showThenRemoveUndoBtn(){
    document.getElementById("undoBtnWrap").style.display = "block";
    setTimeout(()=>{
        document.getElementById("undoBtnWrap").style.animation = "fadeout 1s";
        setTimeout(()=>{
            document.getElementById("undoBtnWrap").style.display = "none";
            document.getElementById("undoBtnWrap").style.animation = "";
        }, 1000);
    }, 5000);
}

document.getElementById("abortBtn").addEventListener("click", ()=>{
    //$.post("/addPart.html", {command: "wipeModData"}).done(()=>{window.location = "/Astradux.html";});

    resetCookie("MODDATA");

    window.location = "/Astradux.html";

    /*document.getElementById("command_hiddenInput").value = "wipeModData";
    document.getElementById("hiddenForm").submit();*/
});
document.getElementById("undoBtn").addEventListener("click", ()=>{
    tweekConfirmationBlock_AddUndone();
    document.getElementById("undoBtnWrap").style.display = "none";
    var modMessage = "INVENTORY"+/*document.querySelector("meta[name=FILETOMOD]").content*/eval(JSON.parse(getCookie("MODDATA")).fileN)+":";
    modMessage += lastDataAdded+">=-:-=>"+"[]";
    console.log("modMessage: "+modMessage);

    $.post("/addPart.html", {command: "undoAdd", data: modMessage});

    /*document.getElementById("command_hiddenInput").value = "undoAdd";
    document.getElementById("data_hiddenInput").value = modMessage;
    document.getElementById("hiddenForm").submit();*/

    confirmationAnimation();

    fillInPartData(eval(lastDataAdded));
});

var picURI = null;
var imageElement = document.getElementById("imagePlaceholder");
var inputElement = document.getElementById('picInput');

imageElement.addEventListener("drop", (e)=>{
    imageElement.src = "Images/subtleLoading.gif";
    var droppedFiles = e.dataTransfer.files

    console.log("Drop Heard!");
    //Future: droppedFiles can hold multiple files! Good jumping off point for assigning multiple images to the same part
    if(droppedFiles.length == 1){

        var imgName = droppedFiles[0].name;
        console.log("The file you dropped is called\""+imgName+"\"");
        //document.getElementById("imagePlaceholder").src = "Inventory_Images/"+imgName;
        //picURL = imgName;
        picURL = createTimestamp();

        //var droppedFiles = e.dataTransfer.files;
        console.log("Here's what I captured:");
        console.log(droppedFiles);

        convertToURI(droppedFiles[0]);
        storeURIData();

    }else{
        alert("It looks like you tried to drop multiple files into the drop zone. We're not quite ready for that yet, please try again!");
        imageElement.src = "Images/DropImageHere.png";
    }
    document.getElementById('imagePlaceholder').style.opacity += 1;
    stop_borderAnimation();
    imageElement.style.border = "dashed 3px black";
    setTimeout(()=>{
        imageElement.style.border = "dashed 3px black";
    }, 200);
    $("#imagePlaceholder")[0].classList.add("naturalSizedImg");
});

imageElement.addEventListener("dragenter", (e)=>{
    console.log("Dragged over");
    borderAnimation();
});

imageElement.addEventListener("dragleave", (e)=>{
    console.log("Drag left");
    stop_borderAnimation();
    imageElement.style.border = "dashed 3px black";
});

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

imageElement.addEventListener("mouseup", (e)=>{
    console.log("UP!");
});

['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    imageElement.addEventListener(eventName, preventDefaults, false);
});

inputElement.addEventListener("change",(e)=>{
    console.log("Picture Input Changed!");
    convertToURI(inputElement.files[0]);
    storeURIData();
});



function storeURIData(){
    console.log("Stroing image uri data and timestamp...");
    timestamp_picName = createTimestamp();
    jQuery($("#uri_hiddenInput")[0]).attr("value",picURI);
    if(freshImg){      //This tells us if img is for a location or not
        jQuery($("#captureTimestamp_hiddenInput")[0]).attr("value",newLocSRC);
        displayLocation(foundLocIndex);
        $.post("/addPart.html", {command: "saveLocImg", uri: eval(jQuery($("#uri_hiddenInput")[0]).attr("value")), timestamp: jQuery($("#captureTimestamp_hiddenInput")[0]).attr("value")});
        console.log("~storage compete, asking backend to save location img!~");
    }else{
        jQuery($("#captureTimestamp_hiddenInput")[0]).attr("value",timestamp_picName);
        console.log("~storage compete~");
    }
}

var newLocSRC = null;
function convertToURI(imgToConvert){
    const reader = new FileReader();
    reader.addEventListener("load", ()=>{
        picURI = reader.result;
        console.log("~URI TRANSLATION COMPLETE!...");
        resizeImgWrapper(picURI);
        if(!freshImg){      //This tells us if img is for a location or not
            imageElement.src = picURI;           
        }else{
            newLocSRC = newBracnchImageSrc.substring(slashIndex+1, newBracnchImageSrc.length);
            eval(foundLocIndex)[1] = newLocSRC;      //add the image src to the respective location in the array
            console.log("You added the image src: "+newLocSRC+" to the locations array"); 
            eval(foundLocIndex).push([]);     //add a [] to the fifth index of the branch

        }
        picURI = "\'"+picURI+"\'";

        console.log(picURI.substring(0,30)+"...");

        storeURIData();

        /*if(device != "webpage"){
            var image = new Image();
            image.src = reader.result;
            image.onload = () =>{
                console.log("width : "+ image.width +"px, height: " + image.height +"px");
                ResizeImage();
                storeURIData();
            }
        }else{
            storeURIData();
        }*/
    })
    reader.readAsDataURL(imgToConvert);
}

var frameA;
var frameB;
function borderAnimation(){
    var blinkInterval = 400;
    imageElement.style.border = "dashed 3px white";
    setTimeout(()=>{
        imageElement.style.border = "dashed 3px black";
    }, blinkInterval/2);
    setTimeout(()=>{
        imageElement.style.border = "dashed 3px white";
    }, blinkInterval);
    frameA = setInterval(()=>{
        imageElement.style.border = "dashed 3px white";
    }, blinkInterval);
    setTimeout(()=>{
        frameB =setInterval(()=>{
            imageElement.style.border = "dashed 3px black";
        }, blinkInterval);
    }, blinkInterval/2);
}

function stop_borderAnimation(){
    clearInterval(frameA);
    clearInterval(frameB);
}

imageElement.addEventListener("mouseenter", ()=>{
    imageElement.style.opacity = 0.5;
});
imageElement.addEventListener("mouseleave", ()=>{
    imageElement.style.opacity = 1;
});







/*-----------------------------From displayCatagories (replace with node.js functionality when figured out)----------------------------*/
var catagories = null;

var insertSelectedCatTo_ = "catagory";     //controls where the value of a catagory when clicked will be inserted 

var margin1 = 0.3;
function catagoryOnloadProcedure(){         //Most of the heavy lifting in this file is done by two functions. This triggers the building 
    console.log(catagories);        //of the catagory tree when the file loads
    collapseRow(catagories, margin1, "catagories", 1);   //This function call builds the entire catagory map
    document.getElementById("name").focus();

    document.getElementById("branchInput").addEventListener('click', function(){
        document.getElementById("branchInput").value = "";
        document.getElementById("branchInput").style.color = "black";
        insertSelectedCatTo_ = "branchInput";
        console.log(document.activeElement.tagName);
    });
    document.getElementById("branchInput").addEventListener('focusout', function(){
        document.getElementById("addLeafButton").focus();
        document.getElementById("addLeafButton").style.color = "blue";
    });

}

var previousCollapseDepth = null;   //Stores the value of collapse length of the previous collapseRow function call
function collapseRow(loc_shallow, rowStyle_shallow, loc_stringForm_shallow, depth){ //_shallow says this passes the parameters to a deeper function
    /*For Debugging:*/console.log("collapseRow PARAMETERS:  LOC:"+loc_stringForm_shallow+" DEPTH:" + depth);
    /*For Debugging:*/console.log("PREVIOUS COLLAPSE DEPTH:"+previousCollapseDepth);
    for(var j = previousCollapseDepth; previousCollapseDepth >= depth; previousCollapseDepth--){    //This takes care of deleting the catRows 
        document.getElementById("mainCatCont").children[previousCollapseDepth-1].remove();                       //that should no longer be displayed
    }
    var DOM_catRow = document.createElement("div");     //create a new catRow for your row to collapse into
    DOM_catRow.id = "catRow";                           //^
    document.getElementById("mainCatCont").appendChild(DOM_catRow);//^
    for(var i = 0; i < loc_shallow.length; i++){    //Builds a catBlock of id cat+depth for each object in that array location
        build_catBlock(loc_shallow[i], rowStyle_shallow, loc_stringForm_shallow+"["+i+"]",depth);
        var isHovered = false;      //This varible is used to prevent "multiple clicks" (in this case multiple hovers)
        document.getElementById("mainCatCont").children[depth-1].children[i].children[0].onmouseover = function(){   //asisgns an event listener to each new block
            var innerArray = this.parentElement.children[1].getAttribute('content');    //stores the leaves of that array entry we're making a block for  
            if(!isHovered && eval(innerArray) != undefined){                //checks, "are there any leaves?" (also "has this already been hovered?")
                /*For Debugging:*/console.log("innerArray: "+eval(innerArray));
                isHovered = true;       //If the if statement is run again, tells it "this block is already hovered, don't run"
                margin1 = 4 / innerArray.length;
                collapseRow(eval(innerArray), margin1, innerArray, depth+1); //Recursion! Calls this function again at a new depth
                for(var el = 0; el < this.parentElement.parentElement.parentElement.children[depth-1].children.length; el++){ //for every catBlock in the catRow...
                    var thisIdentifier = this.parentElement.parentElement.parentElement.children[depth-1].children[el].children[1].getAttribute("content");
                    if(thisIdentifier != innerArray){   //if this isn't the block that I want to collapse...
                        this.parentElement.parentElement.parentElement.children[depth-1].children[el].style.opacity = "0.5"; //...reduce its opactity
                    }else{
                        this.parentElement.parentElement.parentElement.children[depth-1].children[el].style.opacity = "1"; //...or restroe its opacity if it is
                    }
                }
            }
        };
        document.getElementById("mainCatCont").children[depth-1].children[i].children[0].onmouseleave = function(){ //When the mouse leaves the catBlock...
            isHovered = false;  //reset is hovered to false so catBlocks' can react to being hovered over again
        };
    }
    previousCollapseDepth = depth;  //record the depth of this call to know how many catRows to remove when called again
}

function build_catBlock(loc, margin, loc_stringForm, depth){      //Function builds a cat block based on array entry  
    var catBlock = document.createElement("div");                   //loc- where we are in the array structure
    catBlock.id = "AAPcatBlock";                                       //loc_stringForm- To store this information as a meta element loc is also stored as a string
    var catX = document.createElement("div");
    catX.id = "AAPcat";                                          //id changes based on depth
    var vertAlign = document.createElement("div");
    vertAlign.id = "vertAlign";                                     //This node allows the text inside to be manipulated easily with CSS
    vertAlign.innerHTML = eval(loc_stringForm)[0];
    var arrayLocation = document.createElement("meta");             //This node stores the array location...
    arrayLocation.name = "Array_Location";                          //^
    arrayLocation.content = loc_stringForm+"[1]";                   //...of any potential leaves on the array branch
    catX.style = "margin:"+margin+"%";  
    catX.onclick = function(){                                      //triggers search when a catBlock is clicked
        if(insertSelectedCatTo_ == "branchInput"){
            document.getElementById("branchInput").value = eval(loc_stringForm)[0];     //Retrieves clicked block's string value and puts it in the branchInput box
            document.getElementById("addLeafButton").focus();
            insertSelectedCatTo_ = "catagory";
        }else if(insertSelectedCatTo_ == "catagory"){
            document.getElementById("catagory").value = eval(loc_stringForm)[0];     //Retrieves clicked block's string value and puts it in the search box 
            document.getElementById("addButton").focus();
        }
    };
    if(loc.length == 1){                                            //if this branch has no leaves...
        catX.id = "AAPcat_end";                               //add a "_end" to it's id so it's styled approprietly
    }
    catX.appendChild(vertAlign);                                    //puts all the nodes together
    catBlock.appendChild(catX);                                     //^
    catBlock.appendChild(arrayLocation);                            //^
    document.getElementById("mainCatCont").lastElementChild.appendChild(catBlock);  //..and appends it to the last catRow
}

$("#istypeText")[0].addEventListener("click",()=>{
    $("#isBin")[0].click();
});

var breakAllLoopLayers = false;
function executeAddCat(){
    var newCatArray = "";
    var catToFind = document.getElementById("branchInput").value;
    console.log("Cat to find: " + catToFind);   
    var currentCatLocation = "catagories";
    searchLayer("catagories", catToFind);       //Unnessarily hard way

    $.post("/addPart.html", {command: "addCat", data: JSON.stringify(catagories)});

    breakAllLoopLayers = false;

    /*document.getElementById("command_hiddenInput").value = "addCat";
    document.getElementById("data_hiddenInput").value = JSON.stringify(catagories);
    document.getElementById("hiddenForm").submit();*/

    document.getElementById("branchInput").value = "Focus to select from map";
    document.getElementById("branchInput").style.color = "#aaaaaa";
    document.getElementById("newCatInput").value = "";
    document.getElementById("addLeafButton").style.color = "black";
}

var foundCatStr;
function searchLayer(layer, target){
    Loop:
    for(var i = 0; i < eval(layer).length; i++){
        if(breakAllLoopLayers){
            break Loop;
        }
        var layerObject = layer+"["+i+"]";
        console.log("LayerObject is: "+layer+"["+i+"]");
        console.log(eval(layerObject)[0]);
        if(eval(layerObject)[0] == target){
            console.log("found the catagory!");
            foundCatStr = layerObject;
            if(eval(layerObject).length != 1){
                eval(layerObject)[1].push(eval("['"+document.getElementById("newCatInput").value+"']"));
            }else{
                eval(layerObject).push(eval("[['"+document.getElementById("newCatInput").value+"']]"));
            }
            breakAllLoopLayers = true;
            break Loop;
        }
        if(eval(layerObject).length != 1){
            var newLayer = layerObject+"[1]";
            searchLayer(newLayer, target);
        }
    }
}

var speedMode = false;
function toggleSpeedMode(){
    speedMode = !speedMode;
    if(speedMode){
        if(device == "webpage"){
            $("#SuperFastModeBar")[0].innerHTML = "Exit Speed Mode";
        }else{
            $("#SuperFastModeBar")[0].innerHTML = "deactivate speed mode";
        }
    }else{
        if(device == "webpage"){
            $("#SuperFastModeBar")[0].innerHTML = "Enter Speed Mode";
        }else{
            $("#SuperFastModeBar")[0].innerHTML = "activate speed mode";
        }
    }
    if(device != "webpage"){
        $("#SuperFastModeBar")[0].style.backgroundColor = "yellow";
        $("#SuperFastModeBar")[0].style.color = "white";
        setTimeout(()=>{
            $("#SuperFastModeBar")[0].style.backgroundColor = "white";
            $("#SuperFastModeBar")[0].style.color = "black";
        },100);
    }
}

function imageInputClick(){
    //if(device == "webpage"){
    document.getElementById('picInput').click();
    /*}else{
        document.getElementById('picInput').outerHTML = "<input type=\"file\" id=\"picInput\" style=\"display: none;\" onchange=\"refreshImage()\">";
        document.getElementById('picInput').click();
    }*/
}
/*-------------------------CAMERA STUFF-------------------------*/
const webcamElement = document.getElementById('webcam');
const canvasElement = document.getElementById('canvas');
const snapSoundElement = document.getElementById('snapSound');
const webcam = new Webcam(webcamElement, 'user', canvasElement, snapSoundElement);

/*
setTimeout(()=>{
    var pictureURI = webcam.snap();
    //console.log(picture);
    document.querySelector('#downloadLink').href = pictureURI;

    webcam.stop();

    $("#command_hiddenInput")[0].setAttribute("value","saveImg3");
    $("#data_hiddenInput")[0].setAttribute("value",pictureURI);
    $("#hiddenForm").submit();


},10000);*/

var cameraActive = false;
$("#cameraIconWrap")[0].addEventListener("click", ()=>{
    if(device == "webpage"){
        activateCamera();
    }else{
        inputElement.accept = "image/*";
        inputElement.capture = "camera";
        document.getElementById('picInput').click();
    }
});
$("#curtian")[0].addEventListener("click", ()=>{
    deactivateCamera();
    setTimeout(()=>{
        $("#name")[0].focus();
    }, 0);
});
$("#camFlipBtn")[0].addEventListener("click", ()=>{
    webcam.stop();
    webcam.flip();
    webcam.start();
});

jQuery($("#cameraBox_border")[0]).on("click", ()=>{cam_caputeImg()});


function activateCamera(){
    cameraActive = true;
    $("#curtian")[0].style.display = "block";
    $("#cameraBox_border")[0].style.display = "block";
    $("#camFlipBtn")[0].style.display = "block";
    webcam.start().then(result =>{
        console.log("webcam started");
    }).catch(err => {
        console.log(err);
    });
    document.getElementById("cameraStatus_meta").setAttribute("content","active");
}
function deactivateCamera(){
    cameraActive = false;
    $("#curtian")[0].style.display = "none";
    $("#cameraBox_border")[0].style.display = "none";
    $("#camFlipBtn")[0].style.display = "none";
    webcam.stop();
    document.getElementById("cameraStatus_meta").setAttribute("content","unactive");
}
//var URIActive = false;
var timestamp_picName = "";
function cam_caputeImg(){
    var photo = webcam.snap();
    //URIActive = true;
    $("#imagePlaceholder")[0].src = photo;
    jQuery($("#uri_hiddenInput")[0]).attr("value","\'"+photo+"\'");
    createTimestamp();
    deactivateCamera();
    setTimeout(()=>{
        $("#name")[0].focus();
    },0);
    resizeImgWrapper(photo);
}

function createTimestamp(){
    var clock = new Date();
    timestamp_picName = clock.getFullYear()+"-"+(clock.getMonth()+1)+"-"+clock.getDate()+"_"+clock.getHours()+"_"+clock.getMinutes()+"_"+clock.getSeconds()+"_"+clock.getMilliseconds()+".png";
    jQuery($("#captureTimestamp_hiddenInput")[0]).attr("value",timestamp_picName);
    return timestamp_picName;
}




/*-------------------------IMG RESIZING STUFF-------------------------*/
$(document).ready(function() {
    $('#imageFile').change(function(evt) {
        var files = evt.target.files;
        var file = files[0];
        if (file) {
            var reader = new FileReader();
            reader.onload = function(e) {
                document.getElementById('preview').src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });
});

function dataURItoBlob(dataURI) {
    // convert base64/URLEncoded data component to raw binary data held in a string
    var byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0)
        byteString = atob(dataURI.split(',')[1]);
    else
        byteString = unescape(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to a typed array
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ia], {type:mimeString});
}


var MAX_WIDTH = null;
var MAX_HEIGHT = null;

var iphoneDelay = 300;
function ResizeImage(uri) {

    //------------Convert the URI back to a file Object------------//
    var fileType = uri.substring(uri.indexOf(":")+1, uri.indexOf(";"))

    var myBlob = dataURItoBlob(uri);

    var file = new File([myBlob], fileType.replaceAll("/",".") /*'image.jpeg'*/, {
        type: myBlob.type,
    });


    //------------------------------------------------------------//


    if (window.File && window.FileReader && window.FileList && window.Blob) {
        /*var filesToUploads = document.getElementById('imageFile').files;
        var file = filesToUploads[0];*/
        if (file) {
            var reader = new FileReader();
            // Set the image once loaded into file reader
            reader.onload = function(e) {
                setTimeout(()=>{
                    var img = document.createElement("img");
                    img.src = e.target.result;
                    console.log("width : "+ img.width +"px, height: " + img.height +"px");
                    var canvas = document.createElement("canvas");
                    //document.body.appendChild(canvas);
                    var ctx = canvas.getContext("2d");
                    ctx.drawImage(img, 0, 0);
                    var width = img.width;
                    var height = img.height;
                    if(device == "webpage"){
                        MAX_WIDTH = 2500;
                        MAX_HEIGHT = 2500;
                    }else{
                        MAX_WIDTH = 400;
                        MAX_HEIGHT = 400;
                    }
                    var resizeNeeded = false;
                    if (width > height) {
                        if (width > MAX_WIDTH) {
                            height *= MAX_WIDTH / width;
                            width = MAX_WIDTH;
                            resizeNeeded = true;
                        }
                    } else {
                        if (height > MAX_HEIGHT) {
                            width *= MAX_HEIGHT / height;
                            height = MAX_HEIGHT;
                            resizeNeeded = true;
                        }
                    }
                    canvas.width = width;
                    canvas.height = height;
                    setTimeout(()=>{
                        if(resizeNeeded){
                            console.log("Image found to be too big! Scaling down and resaving URI...");
                            //canvas.style = "background-color:blue";
                            var ctx = canvas.getContext("2d");
                            ctx.drawImage(img, 0, 0, width, height);
                            var smallerURI = canvas.toDataURL(file.type);
                            //document.getElementById('output').src = dataurl;
                            var newImg = document.createElement("img");
                            setTimeout(()=>{
                                newImg.src = smallerURI;
                                console.log("new image width : "+ newImg.width +"px, height: " + newImg.height +"px");
                                jQuery($("#uri_hiddenInput")[0]).attr("value", "\'"+smallerURI+"\'");
                                console.log("~Re-sized URI storage successful~");
                            },iphoneDelay);
                        }else{
                            console.log("Image found to be within acceptable size bounds");
                        }
                        setTimeout(()=>{
                            $("#name")[0].focus();
                        }, 0);
                    },iphoneDelay);
                },iphoneDelay);
            }
            reader.readAsDataURL(file);
        }

    } else {
        alert('The File APIs are not fully supported in this browser.');
    }
}
function resizeImgWrapper(uri){
    console.log("Determining if image is too large to be POST-ed...");
    if(uri.substring(0,50).indexOf("data:image") != -1){
        ResizeImage(uri);
    }else{
        alert("That upload was not an image!");
    }
}



//------------Convert the URI back to a file Object------------//

function findAndAddCatagory(cat){
    var catagoryAlreadyExists = false;  
    catagories.forEach((c)=>{
        if(c[0].toLowerCase() == cat.toLowerCase()){catagoryAlreadyExists = true;}
    });
    if(!catagoryAlreadyExists){
        catagories.push([cat]);
        $.post("/addPart.html", {command: "addCat", data: JSON.stringify(catagories)});
    }
}












