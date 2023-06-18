console.log("mobileOverride.js Initiated!");

if(pageName == "addPart.html"){
    console.log("monbileOverride has sensed that you are on addPart, optimizing...");
    if(device == "mobileVertical"){
        try{
            $("#horiBlock")[0].remove();
        }catch{}
        $("#inputBlock")[0].nextSibling.nextSibling.after($("#locationMultitool")[0]);
        $("#descriptionWrap")[0].before($("#selectCatContainer")[0]);
        addEl("div", "backPad", "movePad", "body");
        addEl("div", "nextPad", "movePad", "body");
        addEl("div","bottomButtonBar","","body");
        $("#autoCapsBar")[0].previousSibling.previousSibling.nodeValue="Part Name:";
        $("#location")[0].previousSibling.nodeValue="Location:";
        $("#type_dataLock")[0].style = "height: 100px;width: 100px;transform: translateY(-100px);";
        $("#loc_dataLock")[0].style = "transform: translateY(-150px)";
        $("#cat_dataLock")[0].style = "transform: translateY(-150px)";
        $("body")[0].style = "font-size: 86px";
        $("#bottomButtonBar")[0].appendChild($("#addButton")[0]);
        $("#bottomButtonBar")[0].appendChild($("#resetBtn")[0]);
        $("i")[1].remove();
        addEl("div","topGap","","#inputContainer");
        $("#picContainer")[0].before($("#topGap")[0]);
        $("#inputContainer")[0].appendChild($("#descriptionWrap")[0]);
        $("#inputContainer")[0].appendChild($("#addDescription")[0]);
        $("#bottomButtonBar")[0].appendChild($("#undoBtnWrap")[0]);
        $("#bottomButtonBar")[0].appendChild($("#abortBtnWrap")[0]);
        $("#bottomButtonBar")[0].appendChild($("#SuperFastModeBar")[0]);
        $("#discription_Marker")[0].innerHTML = "Details:";
        addEl("div","bottomGap","","#inputContainer");
        $("#picInput")[0].accept = "image/*";
        $("#picInput")[0].style = "display: block";
        $("#canvasBackground")[0].style = "width: 900px;height: 600px;";
        $("#undoBtn")[0].innerHTML = "undo";
        c("resetBtn", "mouseup", ()=>{
            $("#resetBtn")[0].style.backgroundColor = "yellow";
            setTimeout(()=>{
                $("#resetBtn")[0].style.backgroundColor = "crimson";
            },100);
        });
        c("addDescription", "mouseup", ()=>{
            $("#addDescription")[0].style.backgroundColor = "yellow";
            setTimeout(()=>{
                $("#addDescription")[0].style.backgroundColor = "black";
                $("#addDescription")[0].style.opacity = 1;
            },100);
        });
        c("addButton", "mouseup", ()=>{
            $("#addButton")[0].style.backgroundColor = "yellow";
            $("#addButton")[0].style.color = "white";
            setTimeout(()=>{
                $("#addButton")[0].style.backgroundColor = "#f3f3f3";
                $("#addButton")[0].style.color = "black";
            },100);
        });
        a("cat_dataLock").style.position = "absolute";
        a("cat_dataLock").style.marginTop = "65px";

        document.addEventListener("scroll",()=>{
            imageElement.style.opacity = 1;
        });
    }
}else if(pageName == "catagoryMap.html" && $("#viewPart")[0] == undefined){
    $("#goHome")[0].style = "display: none";
    $("#ML_cancelButton")[0].before($("#addLeafButton")[0]);
    addEl("div", "collapseBtn", "","body");
    a("collapseBtn").addEventListener("click",()=>{
        freeCollapse();
    });
    addEl("img", "collapseArr", "","#collapseBtn");
    a("collapseArr").src = "Images/collapseArrow.png";
}else{
    document.addEventListener("scroll",()=>{
        [...$(".search_sideBar_infoText")].forEach((el)=>{el.style.display = "none"});
    });

    $("#toolbox_label")[0].addEventListener("click",()=>{
        if(device == "mobileHorizontial"){
            if($("#toolbox")[0].style.transform == 'translate(121px)'){
                $("#toolbox")[0].style.transform = '';
            }else{
                $("#toolbox")[0].style.transform = 'translate(121px)';
            }
        }else if(device == "mobileVertical"){
            if($("#toolbox")[0].style.bottom == "15px"){
                $("#toolbox")[0].style.bottom = "-130px";
            }else{
                $("#toolbox")[0].style.bottom = "15px";
            }
        }
    });
    setTimeout(()=>{
        $("#loadingInventoryFileMessage")[0].style.marginTop = "-10px";
    },1000);

    var col1 = $("#col1")[0];
    col1.remove();
    $("#viewPart")[0].appendChild(col1);

    var col2 = $("#col2")[0];
    col2.remove();
    var col3 = $("#col3")[0];
    col3.remove();
    $("#scrollBox")[0].appendChild(col2);
    $("#scrollBox")[0].appendChild(col3);

    var locAnimation = $("#locationAnimationWrap")[0];
    locAnimation.remove();
    document.body.appendChild(locAnimation);

    var pencilImg = "<img id=\"editPartImg\" src=\"./Images/pencilIcon.png\">";
    var editBtn = $("#editPartDataButton")[0];
    editBtn.innerHTML = pencilImg;

    $("#partViewBackground")[0].onclick = ()=>{
        exit_partView();
    }
    $("#partView_partName")[0].onclick = ()=>{
        exit_partView();
    }
    $("#col3")[0].onclick = ()=>{
        exit_partView();
    }
    [...$(".mobileWrap")].forEach((ele)=>{
        ele.onclick = ()=>{
            exit_partView();
        }
    });
    $("#partViewBackground")[0].onclick = ()=>{
        exit_partView();
    }
    $("#partView_location")[0].onmousedown = ()=>{
        $("#partView_location")[0].style.borderWidth = "3px 2px 1px 2px";
        $("#partView_location")[0].style.color = "white";
        setTimeout(()=>{
            $("#partView_location")[0].style.borderWidth = "1px 2px 3px 2px";
            $("#partView_location")[0].style.color = "blue";
        }, 40);
    }
    $("#editPartDataButton")[0].onmousedown = ()=>{
        $("#editPartDataButton")[0].style.borderWidth = "8px 6px 2px 6px";
        $("#editPartDataButton")[0].style.backgroundColor = "yellow";
        setTimeout(()=>{
            $("#editPartDataButton")[0].style.borderWidth = "2px 6px 8px 6px";
            $("#editPartDataButton")[0].style.backgroundColor = "var(--controlPanel_Background)";
            $("#editPartDataButton")[0].innerHTML = dotsAnimation;
        }, 40);
    }
    $("#delete")[0].onmousedown = ()=>{
        $("#delete")[0].style.borderWidth = "8px 6px 2px 6px";
        setTimeout(()=>{
            $("#delete")[0].style.borderWidth = "2px 6px 8px 6px";
        }, 40);
    }

    document.getElementById("partView_location").onmouseenter =  function(){};
    document.getElementById("partView_location").onmouseleave =  function(){};

    var dotsAnimation = "<div class=\"lds-grid\" id=\"dotsAnimation\"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>";

    $("#rightPointer")[0].onclick = ()=>{
        $("#rightPointer")[0].style = "display: block;opacity: 1; transform:scale(0.9)";
        setTimeout(()=>{
            $("#rightPointer")[0].style = "display: block;";
        }, 5);
    }
    $("#leftPointer")[0].onclick = ()=>{
        $("#leftPointer")[0].style = "display: block;opacity: 1; transform:scale(0.9)";
        setTimeout(()=>{
            $("#leftPointer")[0].style = "display: block;";
        }, 5);
    }
    
}

var searchBarCover = document.createElement("div");
searchBarCover.id = "searchBarCover";
$("#topbar")[0].appendChild(searchBarCover);

var searchCurtain = document.createElement("div");
searchCurtain.id = "searchCurtain";
searchCurtain.className = "subCurtian";
$("body")[0].appendChild(searchCurtain);
$("#searchCurtain")[0].onclick = () => {
    unfillSearchbar();
}
$("#searchBarCover")[0].onclick = ()=>{
    if(device == "mobileHorizontial"){
        $("#inquiry")[0].style = "margin-right: 0px;border-radius: 6px;text-align: center;font-size: 26px; width: 100%; transform: translateY(-18px);width:100%;";
        $("#search")[0].style = "float: right;height: 0px;width: 100%;height: 100%;position: absolute;top: 0px;margin-top:0px;margin-right:0px";
    }else if(device == "mobileVertical"){
        $("#inquiry")[0].style = "margin-right: 0px;border-radius: 11px;text-align: center;font-size: 26px;width:100%;";
        $("#search")[0].style = "float: right; width: 100%; height: 100%; position: absolute; top: 0px; margin-top: 0px; margin-right: 0px;";
    }
    $("#searchCurtain")[0].style.display = "block";
    document.getElementById("inquiry").focus();
    document.getElementById("inquiry").click();
    setTimeout(()=>{
        document.getElementById("inquiry").focus();
        document.getElementById("inquiry").click();
    },500);
}
function unfillSearchbar(){
    $("#inquiry")[0].style = "";
    $("#search")[0].style = "";
    document.getElementById("searchCurtain").style.display = "none";
}
function homepageResize(){
    console.log("running homepageResize...");
    if(device == "mobileHorizontial"){
        setTimeout(()=>{
            $("#toolbox")[0].style.bottom = "";            
            $("#toolbox")[0].style.transform = 'translate(121px)';
        },100);
        $("#toolbox_label")[0].onclick = ()=>{

        }
        addEl("div","background1","colBack","#col2");
        addEl("div","background2","colBack","#col1");
        b("colBack").forEach((el)=>{
            el.addEventListener("click",()=>{
                exit_partView();
            });
        });
    }else if(device == "mobileVertical"){
        setTimeout(()=>{
            $("#toolbox")[0].style.bottom = "-130px";
            $("#toolbox")[0].style.transform = '';
        },100);
    }
}






