function refreshCatagoryMap(collapseTo){
    console.log("Reseting Catagory Map and collapsing to: "+collapseTo+"...");
    [...document.querySelectorAll("#catRow")].forEach((ele)=>{
        ele.remove();
    });
    var collapse_decay = collapseTo.substring(10,collapseTo.length);
    var collapse_grow = "";
    previousCollapseDepth = 0;
    //issue--collapse grow
    collapseRow(catagories, 0.3, "catagories", 1); 
    collapse_grow += "catagories";
    while(collapse_decay != ""){  
        debugger;
        for(var i = 0; i < 2; i++){
            collapse_grow += collapse_decay.substring(0,collapse_decay.indexOf("]")+1);
            collapse_decay = collapse_decay.substring(collapse_decay.indexOf("]")+1,collapse_decay.length);
        }
        debugger;
        collapseRow(eval(collapse_grow), 0.3, collapse_grow, previousCollapseDepth+1);
        $("[content='"+collapse_grow+"']")[0].parentElement.parentElement.forEach((el)=>{
            el.style = "opacity: o.5";
        });
        $("[content='"+collapse_grow+"']")[0].parentElement.children[0].style = "opacity: 1";
    }
}