console.log("~userFunctions.js initialized!~");

const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
function generateUserToken(length){
    console.log("Creating a new user token...");
    let result = ' ';
    const charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    console.log("New User Token: "+ result);
    return result;
}

function toggleUserMode(){
    if(userMode == "user"){
        b("adminContent").forEach((ele)=>{
            ele.style.display = "none";
        });
        b("userContent").forEach((ele)=>{
            ele.style.display = "block";
        });
        document.getElementById("toolbox").style.display = "none";
    }else if(userMode == "admin"){
        b("adminContent").forEach((ele)=>{
            ele.style.display = "block";
        });
        b("userContent").forEach((ele)=>{
            ele.style.display = "none";
        });
        a("col1").innerHTML = userCol1_innerHTML;
        document.getElementById("toolbox").style.display = "block";
    }
}

function toggleUserMode_tool(){
    if(userMode == "user"){
        a("col1").innerHTML = userCol1_innerHTML;
        userMode = "admin";
    }else if(userMode == "admin"){
        a("col1").innerHTML = userCol1_innerHTML;
        userMode = "user";
    }   
}
//