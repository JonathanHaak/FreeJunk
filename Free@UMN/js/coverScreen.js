var coverPageHTML = "<body><img id=\"rainbowWheel\" src=\"./Images/wheel3.png\"><div id=\"leftBlackBlocker\" class=\"blackBlocker\"></div> <div id=\"rightBlackBlocker\" class=\"blackBlocker\"></div> <div id=\"topBlackBlocker\" class=\"blackBlocker\"></div> <div id=\"bottomBlackBlocker\" class=\"blackBlocker\"></div><div id=\"imageTile1\" class=\"imageTile\"><img class=\"tileImg\" id=\"img1\" src=\"\"></div> <div id=\"imageTile2\" class=\"imageTile\"><img class=\"tileImg\" id=\"img2\" src=\"\"></div> <div id=\"imageTile3\" class=\"imageTile\"><img class=\"tileImg\" id=\"img3\" src=\"\"></div> <div id=\"imageTile4\" class=\"imageTile\"><img class=\"tileImg\" id=\"img4\" src=\"\"></div> <div id=\"imageTile5\" class=\"imageTile\"><img class=\"tileImg\" id=\"img5\" src=\"\"></div> <div id=\"imageTile6\" class=\"imageTile\"><img class=\"tileImg\" id=\"img6\" src=\"\"></div> <div id=\"imageTile7\" class=\"imageTile\"><img class=\"tileImg\" id=\"img7\" src=\"\"></div></body>";

document.body.innerHTML = coverPageHTML;

document.body.sytle = "transform: rotate(180deg);";

var objectsInsideImgArr = null;

function populateTile(tileNum, imageIndex){
    c("Running populateTile() for tile: "+tileNum+" on imageIndex: " + imageIndex);
    var oldTile = a("imageTile"+tileNum);
    oldTile.id = "imageTile"+tileNum+"_old";
    var oldTileImg = a("img"+tileNum);
    oldTileImg.id = "img"+tileNum+"_old";
    var newTile = document.createElement("div");
    newTile.id = "imageTile" + tileNum;
    newTile.classList.add("fadeIn");
    newTile.classList.add("imageTile");
    var newTileImg = document.createElement("img");
    newTileImg.classList.add("tileImg");
    newTileImg.id = "img" + tileNum;
    newTile.appendChild(newTileImg);
    document.body.appendChild(newTile);
    
    fetchImg(img_fetchQueue[imageIndex][0], img_fetchQueue[imageIndex][1], "#img" + tileNum);
    
    setTimeout(()=>{
        oldTile.remove();
    },newTileDelay);
}

var newTileDelay = 4000;

function startTiles(){
    c("startTiles() beginning, filling in all 7 tiles...");
    objectsInsideImgArr = scrambleArray(objectsInsideImgArr);   //Scramble Image Array
    c("filling tile 1");
    populateTile(1, 0);
    c("filling tile 2");
    populateTile(2, 1);
    c("filling tile 3");
    populateTile(3, 2);
    c("filling tile 4");
    populateTile(4, 3);
    c("filling tile 5");
    populateTile(5, 4);
    c("filling tile 6");
    populateTile(6, 5);
    c("filling tile 7");
    populateTile(7, 6);
}

function recursivelyCallPopulate(i){
    c("recursivelyCallPopulate() called with i value: "+i);
    var selectTile = (parseInt(Math.random()*7)+1);
    populateTile(selectTile, i % objectsInsideImgArr.length);
}

var i = 7;
setInterval(()=>{recursivelyCallPopulate(i++)},newTileDelay);

setTimeout(()=>{    //Reload this page every hour to caputure changes
    c("Reloading cover page to capture changes...");
    var currentWindowLocation = window.location.href;
    window.location.href = currentWindowLocation;
},(1000*60*60));

function scrambleArray(array){
    // loop through the array from the last element to the first
    for (let i = array.length - 1; i > 0; i--) {
        // generate a random index from 0 to i
        const j = Math.floor(Math.random() * (i + 1));
        // swap the elements at i and j
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
