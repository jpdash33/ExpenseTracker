document.getElementById("category").focus();
let user = localStorage.getItem("user");

document.getElementById("username").textContent = user;

async function add() {
    const category = document.getElementById("category").value.trim();
    const description = document.getElementById("description").value.trim();
    const price = Number(document.getElementById("price").value.trim());

    if (!category || !description || !price) {
        alert("Please Fill the form complitely....");
        document.getElementById("category").focus();
        return;
    }

    const result = await eel.get_expenses(category, description, price)();

    if (result["status"] === 200) {
        alert(`✅Hello ${user}, Expense successfully saved.`);

        document.getElementById("category").value = "";
        document.getElementById("description").value = "";
        document.getElementById("price").value = "";
        document.getElementById("category").focus();

        return;
    }
    else {
        alert("⚠ Somthing is wrong, PLEASE TRY AGAIN.");

        document.getElementById("category").value = "";
        document.getElementById("description").value = "";
        document.getElementById("price").value = "";
        document.getElementById("category").focus();

        return;
    }
}

function cancel() {
    document.getElementById("category").value = "";
    document.getElementById("description").value = "";
    document.getElementById("price").value = "";
    document.getElementById("category").focus();
    return;
}


function addIncome() {
    document.getElementById("income-overlay").classList.add("show");
    document.getElementById("income-source").focus();
}

function closeIncome() {
    document.getElementById("income-overlay").classList.remove("show");
    document.getElementById("income-source").value = "";
    document.getElementById("income-description").value = "";
    document.getElementById("income-amount").value = "";
}

async function saveIncome() {

    let source = document.getElementById("income-source").value.trim();
    let description = document.getElementById("income-description").value.trim();
    let amount = Number(document.getElementById("income-amount").value.trim());

    if (!source || !description || !amount) {
        alert("Please Fill the form complitely....");
        document.getElementById("income-source").focus();
        return;
    }

    const income_result = await eel.save_income(source, description, amount)();

    if (income_result["status"] === 200) {
        alert(`Hi ${user}, your income successfully saved ✅.`);
        document.getElementById("income-source").value = "";
        document.getElementById("income-description").value = "";
        document.getElementById("income-amount").value = "";
        return;
    }
    else {
        alert("⚠ Somthing is wrong, PLEASE TRY AGAIN.");

        document.getElementById("income-source").value = "";
        document.getElementById("income-description").value = "";
        document.getElementById("income-amount").value = "";
        document.getElementById("income-source").focus();
        return;
    }

}