let usernameText = document.getElementById("usernameText");
let exitBtn = document.getElementById("exitBtn");
let rolBox = document.querySelector(".rolBox");

let navTable = document.getElementById("navTable");
let navAdmin = document.getElementById("navAdmin");
let navUsers = document.getElementById("navUsers");

if (sessionStorage.getItem("user")) {
    let user = JSON.parse(sessionStorage.getItem("user"));
    usernameText.innerText = user["name"];
    if(user["rol"] === "manager") {
        rolBox.innerText = "GESTOR";
        rolBox.style.backgroundColor = "hsl(210, 100%, 50%)";
    } else {
        rolBox?.remove();
        navTable?.remove();
        navAdmin?.remove();
        navUsers?.remove();
    }
} else {
    document.location = "login.html";
}

exitBtn.onclick = () => {
    sessionStorage.removeItem("user");
    document.location = "login.html";
}