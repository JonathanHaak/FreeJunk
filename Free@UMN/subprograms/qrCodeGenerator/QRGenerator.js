var blankSplashTable = "<table><tr><td></td><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td><td></td></tr></table>";


function createNewSplash(splashArr){
    $("body")[0].innerHTML += blankSplashTable;
    for(var i = 0; (splashArr.length) > i; i++){
        $("td")[$("td").length-(i+1)].innerHTML = "<div class='qrCodeBacksplash' style='background-color:"+assignedColor+"'><img src=\"./QR_Codes/"+splashArr[i]+"\"><div class='labelText'>"+splashArr[i].substring(splashArr[i].indexOf("_")+1,splashArr[i].indexOf("."))+"</div></div>";
    }
}


function createBoxCodes(x, y, color, callback){
    console.log("Generating a grid of "+x*y+" ("+x+","+y+") "+color+" Bin QR Codes..."); 
    fetch('/generateBoxQRs?x='+x+'&y='+y+'&color='+color)
        .then(response => response.json())
        .then(data => {
        var numCodes = eval(data);
        console.log("v/ " +numCodes+ " Box QR Codes Generated!");
        callback(data);
    });
}

var splitPs = [];
function splitUpPeopleBlockArr(arr){
    debugger;
    var capturedPBlockLength = arr.length;
    for(var i = 0; (capturedPBlockLength) > i; i+=16){
        splitPs.push(arr.splice(0,16));
    }
}

var pBlocks2 = [];
var i = 0;

function recursivelyCallSplash(){
    createNewSplash(splitPs[i]);
    setTimeout(()=>{
        i++;
        if(i<splitPs.length){
            recursivelyCallSplash();
        }else{
            $("body")[0].innerHTML += blankSplashTable;
            
            debugger;
            
            $("td")[$("td").length-(i+1)].innerHTML = "<div class='qrCodeBacksplash' style='background-color:"+assignedColor+"'><img src=\"./QR_Codes/"+pBlocks2[pBlocks2.length-1]+"\"><div class='labelText'>"+assignedColor+" Shelf</div></div>";
        }
    },100);
}

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
var assignedColor = null;
document.getElementById("goBtn").onclick = ()=>{
    assignedColor = a("shelfColor").value;
    createBoxCodes(a("xCount").value,a("yCount").value,a("shelfColor").value, (n)=>{
        
        for(var i = 1; i <= a("xCount").value; i++){
            for(var j = 1; j <= a("yCount").value; j++){
                pBlocks2.push(a("shelfColor").value+"_"+alphabet.charAt(j-1) + i + ".png");
            }
        }

        splitUpPeopleBlockArr(pBlocks2);
        recursivelyCallSplash();
    });
}

/*
setTimeout(()=>{
    a("xCount").value = 2;
    a("yCount").value = 2; 
    a("shelfColor").value = "skyblue";
    a("goBtn").click();
    setTimeout(()=>{
        print();
    },1000);
},500);
*/
a("xCount").focus();