let incomeData = [];
let editingIndex = null;

async function show_dashboard_data() {
    const result = await eel.dashboard()();

    const income = result["income"];
    const expense = result["expense"];
    const remain = result["remain"];

    document.getElementById("total-income").textContent = `₹ ${income}`;
    document.getElementById("total-expense").textContent = `₹ ${expense}`;
    document.getElementById("remaining-balance").textContent = `₹ ${remain}`;
}

show_dashboard_data();


function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}


async function mng_income() {
    editingIndex = null;
    await load_income();
    document.getElementById("income-modal").hidden = false;
}


function closeIncome() {
    document.getElementById("income-modal").hidden = true;
    editingIndex = null;
}


async function load_income() {
    const result = await eel.show_income()();
    incomeData = result["data"];

    document.getElementById("income-summary").textContent =
        `${incomeData.length} entries • Total ₹${result["total"]}`;

    render_income();
}


function render_income() {
    const list = document.getElementById("income-list");
    const emptyMsg = document.getElementById("income-empty");

    list.innerHTML = "";
    emptyMsg.hidden = incomeData.length !== 0;

    incomeData.forEach((item, index) => {
        const li = document.createElement("li");
        li.className = "income-item";

        if (editingIndex === index) {
            // Edit mode
            li.innerHTML = `
                <div class="income-edit">
                    <input type="text" id="edit-source" value="${escapeHtml(item["Source"])}" placeholder="Source">
                    <input type="text" id="edit-desc" value="${escapeHtml(item["Description"])}" placeholder="Description">
                    <input type="number" id="edit-amount" value="${item["Prce"]}" placeholder="Amount" min="0" step="any">
                </div>
                <div class="income-actions">
                    <button class="btn-save" onclick="save_income_edit(${index})">
                        <i class="fa-solid fa-check"></i>
                    </button>
                    <button class="btn-cancel" onclick="cancel_edit()">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                </div>
            `;
        } else {
            // View mode
            li.innerHTML = `
                <div class="income-info">
                    <strong>${escapeHtml(item["Source"])}</strong>
                    <span>${escapeHtml(item["Description"])}</span>
                    <small>${item["Date"]} ${item["Time"]}</small>
                </div>
                <div class="income-amount">₹${item["Prce"]}</div>
                <div class="income-actions">
                    <button class="btn-edit" onclick="start_edit(${index})">
                        <i class="fa-solid fa-pen"></i>
                    </button>
                    <button class="btn-delete" onclick="delete_income_item(${index})">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            `;
        }

        list.appendChild(li);
    });
}


function start_edit(index) {
    editingIndex = index;
    render_income();
}


function cancel_edit() {
    editingIndex = null;
    render_income();
}


async function save_income_edit(index) {
    const source = document.getElementById("edit-source").value.trim();
    const desc = document.getElementById("edit-desc").value.trim();
    const amount = parseFloat(document.getElementById("edit-amount").value);

    if (!source || isNaN(amount) || amount <= 0) {
        alert("Please enter a valid source and amount.");
        return;
    }

    const res = await eel.update_income(index, source, desc, amount)();

    if (res["code"] === 200) {
        editingIndex = null;
        await load_income();
        show_dashboard_data();   // refresh the cards
    } else {
        alert("Failed to update income.");
    }
}


async function delete_income_item(index) {
    if (!confirm("Delete this income entry?")) return;

    const res = await eel.delete_income(index)();

    if (res["code"] === 200) {
        editingIndex = null;
        await load_income();
        show_dashboard_data();
    } else {
        alert("Failed to delete income.");
    }
}



// GRAPH 

let categoryChart = null;
let monthlyChart = null;

async function load_expense_charts() {

    try {
        const result = await eel.expense_chart_data()();
        const expenses = result.data;

        let categoryData = {};
        let monthlyData = {};

        expenses.forEach(item => {

            const category = item.Category;
            const amount = Number(item.Price);

            if (!Number.isFinite(amount)) return;

            // Category-wise calculation
            categoryData[category] =
                (categoryData[category] || 0) + amount;

            // Monthly calculation
            const [day, month, year] = item.Date.split("/");

            const monthKey = `${year}-${month}`;

            monthlyData[monthKey] =
                (monthlyData[monthKey] || 0) + amount;
        });

        // Category chart
        const categoryLabels = Object.keys(categoryData);
        const categoryValues = Object.values(categoryData);

        if (categoryChart) categoryChart.destroy();

        categoryChart = new Chart(
            document.getElementById("categoryChart"),
            {
                type: "doughnut",
                data: {
                    labels: categoryLabels,
                    datasets: [{
                        data: categoryValues,
                        backgroundColor: [
                            "#4ade80",
                            "#38bdf8",
                            "#a78bfa",
                            "#fbbf24",
                            "#fb7185",
                            "#2dd4bf",
                            "#f97316"
                        ],
                        borderWidth: 2,
                        borderColor: "#12301f"
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: {
                        legend: {
                            position: "bottom",
                            labels: {
                                color: "#ffffff",
                                padding: 18
                            }
                        }
                    }
                }
            }
        );

        // Monthly chart
        const sortedMonths = Object.keys(monthlyData).sort();

        const monthLabels = sortedMonths.map(key => {
            const [year, month] = key.split("-");
            return new Date(
                Number(year),
                Number(month) - 1
            ).toLocaleString("en", {
                month: "short",
                year: "numeric"
            });
        });

        const monthValues = sortedMonths.map(
            key => monthlyData[key]
        );

        if (monthlyChart) monthlyChart.destroy();

        monthlyChart = new Chart(
            document.getElementById("monthlyChart"),
            {
                type: "bar",
                data: {
                    labels: monthLabels,
                    datasets: [{
                        label: "Expenses (₹)",
                        data: monthValues,
                        backgroundColor: "#4ade80",
                        borderRadius: 8
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        x: {
                            ticks: { color: "#ffffff" },
                            grid: { display: false }
                        },
                        y: {
                            beginAtZero: true,
                            ticks: { color: "#ffffff" },
                            grid: {
                                color: "rgba(255,255,255,0.08)"
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            labels: { color: "#ffffff" }
                        }
                    }
                }
            }
        );

    } catch (error) {
        console.error("Expense chart error:", error);
    }
}

// Load charts when dashboard opens
load_expense_charts();