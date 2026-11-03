document.getElementById("out").onclick = function () {

    const check = prompt("Conform about logout(y/n): ").trim();

    if(check == "y" || check == "Y") {
        localStorage.removeItem("user");
        localStorage.removeItem("mail");

        window.location.href = "ETlogin.html"
    }
    else {
        return
    }
}