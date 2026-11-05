async function show_dashboard_data()
{
    const result = await eel.dashboard()();

    income = result["income"]
    expense = result["expense"]
    remain = result["remain"]

    document.getElementById("total-income").textContent = `₹ ${income}`;
    document.getElementById("total-expense").textContent = `₹ ${expense}`;;
    document.getElementById("remaining-balance").textContent = `₹ ${remain}`;;

}

show_dashboard_data()