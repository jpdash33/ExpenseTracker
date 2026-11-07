const fmt = n => "₹ " + Number(n || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 });

/* ---------- DASHBOARD CARDS (your original logic) ---------- */
async function show_dashboard_data() {
    const result = await eel.dashboard()();

    document.getElementById("total-income").textContent = fmt(result["income"]);
    document.getElementById("total-expense").textContent = fmt(result["expense"]);
    document.getElementById("remaining-balance").textContent = fmt(result["remain"]);
}

/* ---------- MANAGE INCOME ---------- */
const modal = document.getElementById("income-modal");
const listEl = document.getElementById("income-list");
const emptyEl = document.getElementById("income-empty");

async function mng_income() {
    modal.hidden = false;
    await loadIncomeList();
}

function closeIncome() {
    modal.hidden = true;
}

modal.addEventListener("click", e => { if (e.target === modal) closeIncome(); });
document.addEventListener("keydown", e => { if (e.key === "Escape") closeIncome(); });

async function loadIncomeList() {
    const list = await eel.get_income_history()();

    listEl.innerHTML = "";
    emptyEl.hidden = list.length > 0;

    const total = list.reduce((s, t) => s + t.amount, 0);
    document.getElementById("income-summary").textContent =
        list.length ? `${list.length} ${list.length === 1 ? "entry" : "entries"} • Total ${fmt(total)}` : "";

    list.forEach(t => listEl.appendChild(buildRow(t)));
}

/* normal (view) row */
function buildRow(t) {
    const li = document.createElement("li");
    li.className = "income-item";

    const info = document.createElement("div");
    info.className = "income-info";
    const title = document.createElement("strong");
    title.textContent = t.source;
    const sub = document.createElement("span");
    sub.textContent = [t.desc, `${t.date} ${t.time}`].filter(Boolean).join(" • ");
    info.append(title, sub);

    const amt = document.createElement("div");
    amt.className = "income-amount";
    amt.textContent = fmt(t.amount);

    const actions = document.createElement("div");
    actions.className = "row-actions";

    const edit = document.createElement("button");
    edit.type = "button";
    edit.className = "icon-btn edit";
    edit.title = "Edit";
    edit.innerHTML = '<i class="fa-regular fa-pen-to-square"></i>';
    edit.addEventListener("click", () => li.replaceWith(buildEditRow(t)));

    const del = document.createElement("button");
    del.type = "button";
    del.className = "icon-btn delete";
    del.title = "Delete";
    del.innerHTML = '<i class="fa-regular fa-trash-can"></i>';
    del.addEventListener("click", () => deleteIncome(t));

    actions.append(edit, del);
    li.append(info, amt, actions);
    return li;
}

/* edit row */
function buildEditRow(t) {
    const li = document.createElement("li");
    li.className = "income-item editing";

    const fields = document.createElement("div");
    fields.className = "edit-fields";

    const src = document.createElement("input");
    src.type = "text";
    src.value = t.source;
    src.placeholder = "Source";

    const desc = document.createElement("input");
    desc.type = "text";
    desc.value = t.desc;
    desc.placeholder = "Description";

    const amount = document.createElement("input");
    amount.type = "number";
    amount.min = "0.01";
    amount.step = "0.01";
    amount.value = t.amount;
    amount.placeholder = "Amount";

    fields.append(src, desc, amount);

    const err = document.createElement("p");
    err.className = "row-error";
    err.hidden = true;

    const actions = document.createElement("div");
    actions.className = "row-actions";

    const save = document.createElement("button");
    save.type = "button";
    save.className = "icon-btn save";
    save.title = "Save";
    save.innerHTML = '<i class="fa-solid fa-check"></i>';

    const cancel = document.createElement("button");
    cancel.type = "button";
    cancel.className = "icon-btn";
    cancel.title = "Cancel";
    cancel.innerHTML = '<i class="fa-solid fa-xmark"></i>';

    cancel.addEventListener("click", () => li.replaceWith(buildRow(t)));

    save.addEventListener("click", async () => {
        const newAmount = parseFloat(amount.value);

        if (!src.value.trim() || !(newAmount > 0)) {
            err.textContent = "Enter a source and an amount greater than 0.";
            err.hidden = false;
            return;
        }

        const res = await eel.update_income(t.index, src.value.trim(), desc.value.trim(), newAmount)();

        if (res.status === 200) {
            await loadIncomeList();
            show_dashboard_data();          // refresh the cards
        } else {
            err.textContent = res.msg || "Could not update income.";
            err.hidden = false;
        }
    });

    actions.append(save, cancel);
    li.append(fields, actions, err);

    src.focus();
    return li;
}

async function deleteIncome(t) {
    if (!confirm(`Delete "${t.source}" income of ${fmt(t.amount)}?`)) return;

    const res = await eel.delete_income(t.index)();
    if (res.code === 200) {
        await loadIncomeList();
        show_dashboard_data();
    } else {
        alert("Could not delete this entry.");
    }
}

show_dashboard_data();