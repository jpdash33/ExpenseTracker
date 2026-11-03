async function show_history() {
    const result = await eel.return_history()();
    let total = result["tot"];
    let mon_tot = result["month_tot"];

    document.getElementById("total-expense").textContent = total; 
    document.getElementById("month-expense").textContent = mon_tot; 



    let data = result["data"];
    const expenseList = document.getElementById("expense-list");

    // Clear the table
    expenseList.innerHTML = "";


    // If there are no expenses
    if (data.length === 0) {

        expenseList.innerHTML = `
            <tr id="no-expense-row">
                <td colspan="5">
                    <div class="empty-state">
                        <div class="empty-icon">💸</div>
                        <h3>No Transactions Yet</h3>
                        <p>Your expenses will appear here once you add a transaction.</p>
                    </div>
                </td>
            </tr>
        `;

        return;
    }


    // Display expenses
    data.forEach((expense, index) => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${expense["Date"]}</td>
            <td>${expense["Category"]}</td>
            <td>${expense["Description"]}</td>
            <td>₹${expense["Price"]}</td>
        `;

        expenseList.appendChild(row);
    });




}

show_history()