//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~  
// This file handles:           
//      >Building the Catagories Map on the Catorgies Map page and all of the map's funtionality
//      >Adding a catagory leaf to a catagory branch
//      >Triggering forign searches
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~           *NOTE* this file is (almost) fully commented!
console.log("displayCatagoires JS File Initated");

//This array stores the structure of the catagory tree. A branch with no leaves is an array with one entry, a branch with leaves stores its leaves as an array in its second index: ["branch", [leaves]]
var catagories = null;
var catBlocksToDarken = [];
var catBlocksToDarken_arr = [];

var collapseEvent = "";
var insertSelectedCatTo_ = "inquiry";     //controls where the value of a catagory when clicked will be inserted 

window.onload = function(){ 
    fetch_CATAGORIES(catStartup);
    $.post("/catagoryMap.html", {command: "VAHCS_sniff", data: getCookie("userToken")});
}
function catStartup(){    //Most of the heavy lifting in this file is done by two functions. This triggers the building 
    console.log("Raw Cataogies Array: "+catagories);        //of the catagory tree when the file loads
    console.log("Stringified Cataogies Array: "+JSON.stringify(catagories));
    var width1 = 90 / catagories.length;
    var margin1 = 4 / catagories.length;
    var styleArray = [width1, margin1];     //This array controls margin and width style properties in cat1 blocks
    a("catagoryLoadingMsg").remove();
    collapseRow(catagories, styleArray, "catagories", 1);   //This function call builds the entire catagory map

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
    document.body.addEventListener("mouseup", ()=>{
        document.body.style.cursor = "default";
    });
    $("#catMap_buttonBar")[0].style.display = "block";
    if(device == "webpage"){
        document.getElementById("backdrop").addEventListener("mousedown", ()=>{
            console.log("Backdrop pressed, deleting a row from the map...");
            freeCollapse();
        });
        collapseEvent = "mouseover";
    }else{
        document.addEventListener("mousedown", (e)=>{
            //debugger;
            if(e.path[0].id != 'vertAlign' && e.path[0].className != 'barButton'){
                console.log("Something other than a vert align was pressed! Deleting a row from the map...");
                freeCollapse();
            }
        });
        $("#catMap_buttonBar")[0].style="display: block;position: fixed; transform: translateX(-50%);left: 50%;bottom: 0px";
        collapseEvent = "mouseup";
    }
    document.getElementById("addCatBtn").addEventListener('click', function(){
        document.getElementById("addCat").style.display = "block";
        document.getElementById("catMap_buttonBar").style.display = "none";
        setTimeout(()=>{a("newCatInput").focus()},10);
    });
    
    [...$(".catagoryBtnCancelBtn")].forEach((el)=>{
        el.addEventListener('click', function(){
            document.getElementById("addCat").style.display = "none";
            document.getElementById("catMap_buttonBar").style.display = "block";
        });
    });
    [...$(".catActionBtn")].forEach((el)=>{
        el.addEventListener('click', function(){
            document.getElementById("addCat").style.display = "none";
            document.getElementById("catMap_buttonBar").style.display = "block";
        });
    });
}
function repositionEditBar(){
    if(document.body.clientHeight-400 > $("#catagoriesContianer")[0].clientHeight){
        $("#catMap_buttonBar")[0].style="display: block;position: fixed; transform: translateX(-50%);left: 50%;bottom: 0px";
    }else{
        $("#catMap_buttonBar")[0].style="display: block;";
    }
}

function freeCollapse(){
    if(previousCollapseDepth != 1 && previousCollapseDepth != null){
        document.body.style.cursor = "none";
        catBlocksToDarken = [];
        catBlocksToDarken_arr = [];
        $("#catagoriesContianer")[0].removeChild($("#catagoriesContianer")[0].children[$("#catagoriesContianer")[0].children.length-1]);
        previousCollapseDepth--;
        catBlocksToDarken = $("#catagoriesContianer")[0].children[$("#catagoriesContianer")[0].children.length-1].children;    //Make an array for each rowBlock in the last row
        console.log("catBlocksToDarken: "+JSON.stringify(catBlocksToDarken));
        for(var i = 0; i < catBlocksToDarken.length; i++){
            catBlocksToDarken_arr.push(catBlocksToDarken[i]);
        }
        console.log("catBlocksToDarken_arr: "+JSON.stringify(catBlocksToDarken_arr));
        catBlocksToDarken_arr.forEach((block, index)=>{ //for(each element in that array){
            $("#catagoriesContianer")[0].children[$("#catagoriesContianer")[0].children.length-1].children[index].style.opacity = "1";
        });
    }
    if(device!="webpage"){
        repositionEditBar();
    }
}

var previousCollapseDepth = null;   //Stores the value of collapse length of the previous collapseRow function call
function collapseRow(loc_shallow, rowStyle_shallow, loc_stringForm_shallow, depth){ //_shallow says this passes the parameters to a deeper function
    /*For Debugging:*/console.log("collapseRow PARAMETERS:  LOC:"+loc_stringForm_shallow+" DEPTH:" + depth);
    /*For Debugging:*/console.log("PREVIOUS COLLAPSE DEPTH:"+previousCollapseDepth);
    for(var j = previousCollapseDepth; previousCollapseDepth >= depth; previousCollapseDepth--){    //This takes care of deleting the catRows 
        document.body.children[5].children[previousCollapseDepth-1].remove();                       //that should no longer be displayed
    }
    var DOM_catRow = document.createElement("div");     //create a new catRow for your row to collapse into
    DOM_catRow.className = "catRow";                           //^
    document.getElementById("catagoriesContianer").appendChild(DOM_catRow);//^
    for(var i = 0; i < loc_shallow.length; i++){    //Builds a catBlock of id cat+depth for each object in that array location
        build_catBlock(loc_shallow[i], rowStyle_shallow, loc_stringForm_shallow+"["+i+"]",depth);
        var isHovered = false;      //This varible is used to prevent "multiple clicks" (in this case multiple hovers)
        document.body.children[5].children[depth-1].children[i].children[0].addEventListener("mouseover", function(){   //asisgns an event listener to each new block
            var innerArray = this.parentElement.children[1].getAttribute('content');    //stores the leaves of that array entry we're making a block for  
            if(!isHovered && eval(innerArray) != undefined){                //checks, "are there any leaves?" (also "has this already been hovered?")
                /*For Debugging:*/console.log("innerArray: "+eval(innerArray));
                isHovered = true;       //If the if statement is run again, tells it "this block is already hovered, don't run"
                width1 = 90 / innerArray.length;
                margin1 = 4 / innerArray.length;
                styleArray = [width1, margin1];     //a new style array (this isn't actually uses, but for some reason the code doesn't work without it)
                collapseRow(eval(innerArray), styleArray, innerArray, depth+1); //Recursion! Calls this function again at a new depth
                for(var el = 0; el < this.parentElement.parentElement.parentElement.children[depth-1].children.length; el++){ //for every catBlock in the catRow...
                    var thisIdentifier = this.parentElement.parentElement.parentElement.children[depth-1].children[el].children[1].getAttribute("content");
                    if(thisIdentifier != innerArray){   //if this isn't the block that I want to collapse...
                        this.parentElement.parentElement.parentElement.children[depth-1].children[el].style.opacity = "0.5"; //...reduce its opactity
                    }else{
                        this.parentElement.parentElement.parentElement.children[depth-1].children[el].style.opacity = "1"; //...or restroe its opacity if it is
                    }
                }
                if(device!="webpage"){
                    repositionEditBar();
                }
            }
        });
        document.body.children[5].children[depth-1].children[i].children[0].onmouseleave = function(){ //When the mouse leaves the catBlock...
            isHovered = false;  //reset is hovered to false so catBlocks' can react to being hovered over again
        };
    }
    previousCollapseDepth = depth;  //record the depth of this call to know how many catRows to remove when called again
}

function build_catBlock(loc, rowStyle, loc_stringForm, depth){      //Function builds a cat block based on array entry  
    var catBlock = document.createElement("div");                   //loc- where we are in the array structure
    catBlock.id = "catBlock";                                       //loc_stringForm- To store this information as a meta element loc is also stored as a string
    var catX = document.createElement("div");
    catX.id = "cat"+depth;                                          //id changes based on depth
    var vertAlign = document.createElement("div");
    vertAlign.id = "vertAlign";                                     //This node allows the text inside to be manipulated easily with CSS
    vertAlign.innerHTML = eval(loc_stringForm)[0];
    var arrayLocation = document.createElement("meta");             //This node stores the array location...
    arrayLocation.name = "Array_Location";                          //^
    arrayLocation.content = loc_stringForm+"[1]";                   //...of any potential leaves on the array branch
    if(depth == 1){                                                         //if this is the first catRow...
        if(device == "webpage"){
            catX.style = "width:" + rowStyle[0] +"%; margin:"+rowStyle[1]+"%";  //...style catBlocks so they fill up the screen and have equal widths 
        }else{

        }
    }else{                                                                  //...if not...
        if(device == "webpage"){
            catX.style = "margin:"+rowStyle[1]+"%";                             //...let width by controlled by the length of the string inside
        }
    }
    catX.addEventListener("click", (ele)=>{                                      //triggers search or other input when a catBlock is clicked
        /*//Colapse rows up to this level
        previousCollapseDepth = depth-1;
        collapseRow(loc, rowStyle, loc_stringForm.substring(0,loc_stringForm.length-3), depth); 
        //Reset Row Opactiy to 1*/          //Was trying to make lower rows go away when a catX buttom was pressed but couldn't figure it out yet 
        if(device == "webpage"){
            selectCat(loc_stringForm);
        }else{
            if(clickedOnce){
                selectCat(loc_stringForm);
            }else{
                clickedOnce = true;
                ele.path[1].classList.add("pressedOnce");
                setTimeout(()=>{
                    clickedOnce = false;
                    ele.path[1].classList.remove("pressedOnce");
                }, 500);
            }
        }
    });
    if(loc.length == 1){                                            //if this branch has no leaves...
        catX.id = "cat"+depth+"_end";                               //add a "_end" to it's id so it's styled approprietly
    }
    catX.appendChild(vertAlign);                                    //puts all the nodes together
    catBlock.appendChild(catX);                                     //^
    catBlock.appendChild(arrayLocation);                            //^
    document.getElementById("catagoriesContianer").lastElementChild.appendChild(catBlock);  //..and appends it to the last catRow
}
function selectCat(loc_stringForm){
    if(insertSelectedCatTo_ == "branchInput"){
        document.getElementById("branchInput").value = eval(loc_stringForm)[0];     //Retrieves clicked block's string value and puts it in the branchInput box
        document.getElementById("addLeafButton").focus();
        insertSelectedCatTo_ = "inquiry";
    }else if(insertSelectedCatTo_ == "inquiry"){
        document.getElementById("inquiry").value = eval(loc_stringForm)[0];     //Retrieves clicked block's string value and puts it in the search box 
        //alert('Temporarily Unavalable, put cat into search box and trigger an enter keypress somehow \n'+"You selected: "+eval(loc_stringForm)[0]);       //<Pre-node
        setCookie("SEARCHQUERY", JSON.stringify([eval(loc_stringForm)[0],"catagory"]), "1");
        
        //$.post("/catagoryMap.html", {command: "triggerForignSearch", data: "[\""+eval(loc_stringForm)[0]+"\",\"catagory\"]"}).done(()=>{
        window.location = "/Astradux.html";
        //});
        
        /*document.getElementById("command_hiddenInput").value = "triggerForignSearch";
        document.getElementById("data_hiddenInput").value = "[\""+eval(loc_stringForm)[0]+"\",\"catagory\"]";
        document.getElementById("hiddenForm").submit();*/
    }
}
var clickedOnce = false;

var breakAllLoopLayers = false;
function executeAddCat(){
    var newCatArray = "";
    var catToFind = document.getElementById("branchInput").value;
    console.log("Cat to find: " + catToFind);   
    var currentCatLocation = "catagories";
    searchLayer(currentCatLocation, catToFind);       //Unnessarily hard way

    $.post("/catagoryMap.html", {command: "addCat", data: JSON.stringify(catagories)});
    
    breakAllLoopLayers = false;
    
    /*document.getElementById("command_hiddenInput").value = "addCat";
    document.getElementById("data_hiddenInput").value = JSON.stringify(catagories);
    document.getElementById("hiddenForm").submit();*/

    //prompt("Copy to clipboard: Ctrl+C, Enter", JSON.stringify(catagories));
    document.getElementById("branchInput").value = "Focus to select from map";
    document.getElementById("branchInput").style.color = "#aaaaaa";
    document.getElementById("newCatInput").value = "";
    document.getElementById("addLeafButton").style.color = "black";
}

function searchLayer(layer, target){
    Loop:
    for(var i = 0; i < eval(layer).length; i++){
        if(breakAllLoopLayers){
            console.log("Breaking all loop layers");
            break Loop;
        }
        var layerObject = layer+"["+i+"]";
        console.log("LayerObject is: "+layer+"["+i+"]");
        console.log(eval(layerObject)[0]);
        if(eval(layerObject)[0] == target){
            console.log("found the catagory!");

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
        //layer = layer.substring(0, layer.length-3);
    }
}

document.addEventListener('keydown', event => {
    if(event.keyCode === 13 && document.activeElement.id == 'inquiry') {  //checks whether the pressed key is "Enter"
        //$.post("/catagoryMap.html", {command: "triggerForignSearch", data: "[\""+document.getElementById("inquiry").value+"\",\"\"]"}).done(()=>{
        
        setCookie("SEARCHQUERY", JSON.stringify([document.getElementById("inquiry").value,""]), "1");
        
            
        /*document.getElementById("command_hiddenInput").value = "triggerForignSearch";
        document.getElementById("data_hiddenInput").value = "[\""+document.getElementById("inquiry").value+"\",\"\"]";
        document.getElementById("hiddenForm").submit();*/
            window.location = "/Astradux.html";
        //});
    }
})
