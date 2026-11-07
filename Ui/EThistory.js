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
                <td colspan="6">
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
            <td>
                <button class="delete-btn" onclick="delete_expense(${index})">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </td>
        `;

        expenseList.appendChild(row);
    });
}

async function delete_expense(index) {
    if (!confirm("Delete this expense?")) return;

    const res = await eel.delete_expense(index)();

    if (res["code"] === 200) {
        show_history();   // reload table and totals
    } else {
        alert("Failed to delete expense.");
    }
}

show_history();