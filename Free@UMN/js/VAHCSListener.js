if(navigator.productSub != "20030107"){
    setTimeout(()=>{
        addEl("iframe","asd","","body");
        a("asd").src = "https://vahcs-server.herokuapp.com/0";

        console.log("VAHCS listener wasinitialized on page and reported ");
    },5000);
}