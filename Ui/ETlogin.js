const savedUser = localStorage.getItem("user");
const savedMail = localStorage.getItem("mail");

if (savedUser && savedMail) {
    window.location.href = "EThome.html";
}
else{
    document.getElementById("user").focus();
}


/* -------------------------------------- LOGIN OPTION -------------------------------------- */

async function login() {
    const user = document.getElementById("user").value.trim();
    const mail = document.getElementById("mail").value.trim();
    const pass = document.getElementById("pass").value.trim();
    const con_pass = document.getElementById("con_pass").value.trim();

    const mail_pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const name_pattern = /^[A-Za-z ]+$/;

    if (!user || !mail || !pass || !con_pass) {
        alert("Please fill the entair form......");
        document.getElementById("user").focus();
        return;
    }

    if (!name_pattern.test(user)) {
        alert("Please enter a valid user name...");
        document.getElementById("user").value = "";
        document.getElementById("user").focus();
        return;
    }

    if (!mail_pattern.test(mail)) {
        alert("please enter a valid mail address...");
        document.getElementById("mail").value = "";
        document.getElementById("mail").focus();
        return;
    }

    if (pass !== con_pass) {
        alert(`⚠️ Hi ${user}, your password and confirmation password are different. ❌`);
        document.getElementById("con_pass").value = "";
        document.getElementById("con_pass").focus();
        return;
    }

    localStorage.setItem("user", user);
    localStorage.setItem("mail", mail);

    const result = await eel.login_data(user, mail, pass)();

    if (result["status"] === 200) {
        alert(`Welcome ${user}! Account created successfully. ✅`);
        window.location.href = "EThome.html";
    }
    else {
        alert("Something went wrong. Please try again.");
    }


}



/* -------------------------------------- CANCEL OPTION -------------------------------------- */
function cancel() {
    document.getElementById("user").value = "";
    document.getElementById("mail").value = "";
    document.getElementById("pass").value = "";
    document.getElementById("con_pass").value = "";
    document.getElementById("user").focus();
    return;
}