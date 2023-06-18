console.log("Location Hours Initialized");

$("#addHours_btn")[0].onclick = ()=>{
    $("#addHours_actionBox")[0].style.display = "block";
    $("#addHours_btn")[0].style.display = "none";
}

$("#addHours_cancel")[0].onclick = ()=>{
    $("#addHours_actionBox")[0].style.display = "none";
    $("#addHours_btn")[0].style.display = "inline-block";
}