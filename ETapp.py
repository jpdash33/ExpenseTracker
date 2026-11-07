from datetime import datetime
import eel
import json

eel.init("Ui")


try:
    with open("Expense.json","r") as f:
        e_record = json.load(f)
except FileNotFoundError as e:
    print("Error:",e)
    e_record = []


try:
    with open("Income.json","r") as f:
        i_record = json.load(f)
except FileNotFoundError as e:
    print("Error:",e)
    i_record = []


@eel.expose("login_data")
def login_data(name,mail,password):

    date = datetime.now().strftime("%d/%m/%Y %H:%M:%S")

    with open("Login.txt","a",encoding="utf-8") as f:
        f.write(
            f"\n\nUser: {name}\n"
            f"Mail: {mail}\n"
            f"Password: {password}\n"
            f"Date-Time: {date}\n"
            f"{'-' * 40}\n"
        )

    return {"status":200}


@eel.expose("get_expenses")
def get_expenses(category,desc,price):

    date = datetime.now().strftime("%d/%m/%Y")
    time = datetime.now().strftime("%H:%M:%S")

    data = {
        "Category":category,
        "Description":desc,
        "Price":price,
        "Date":date,
        "Time":time
    }

    e_record.append(data)

    with open("Expense.json","w") as fw:
        json.dump(e_record,fw,indent=4)

    return {"status":200}
    
  
@eel.expose("return_history")
def return_history():
    total = 0
    month_total = 0

    now = datetime.now()
    current_month = now.strftime("%m")
    current_year = now.strftime("%Y")

    with open("Expense.json", "r") as fr:
        load_data = json.load(fr)

    for item in load_data:
        # Date format is dd/mm/YYYY
        _, expense_month, expense_year = item["Date"].split("/")

        total += item["Price"]

        if expense_month == current_month and expense_year == current_year:
            month_total += item["Price"]

    return {"tot": total,
            "month_tot": month_total,
            "data": load_data}


@eel.expose("save_income")
def save_income(source, desc, amount):

    try:
        amount = float(amount)

        if not source.strip() or amount <= 0:
            return {"status": 400}

        date = datetime.now().strftime("%d/%m/%Y")
        time = datetime.now().strftime("%H:%M:%S")

        i_data = {
            "Source": source.strip(),
            "Description": desc.strip(),
            "Prce": amount,
            "Date": date,
            "Time": time
        }

        i_record.append(i_data)

        with open("Income.json", "w") as f:
            json.dump(i_record, f, indent=4)

        return {"status": 200}

    except Exception as e:
        print("Save income error:", e)
        return {"status": 500}


@eel.expose("dashboard")
def dashboard():
    in_total = 0
    exp_total = 0
    remaining = 0

    with open("Expense.json","r") as exp_f:
        exp_data = json.load(exp_f)

    for x in range(len(exp_data)):
        exp_total += exp_data[x]["Price"]


    with open("Income.json","r") as in_f:
        in_data = json.load(in_f)

    for y in range(len(in_data)):
        in_total += in_data[y]["Prce"]

    remaining = in_total - exp_total

    return {"income":in_total,
            "expense":exp_total,
            "remain":remaining}



@eel.expose("delete_expense")
def delete_expense(index):
    global e_record
    try:
        if 0 <= index < len(e_record):
            e_record.pop(index)      

            with open("Expense.json", "w") as f:
                json.dump(e_record, f, indent=4)

            return {"code": 200}

        return {"code": 500}

    except Exception as e:
        print("Delete error:", e)
        return {"code": 500}


@eel.expose("delete_income")
def delete_income(index):
    global i_record

    try:
        index = int(index)

        if 0 <= index < len(i_record):

            i_record.pop(index)

            with open("Income.json", "w") as f:
                json.dump(i_record, f, indent=4)

            return {"code": 200}

        return {"code": 404}

    except Exception as e:
        print("Delete income error:", e)
        return {"code": 500}


@eel.expose("update_income")
def update_income(index, source, desc, amount):
    global i_record

    try:
        index = int(index)
        amount = float(amount)

        if index < 0 or index >= len(i_record):
            return {"code": 404}

        if not source.strip() or amount <= 0:
            return {"code": 400}

        i_record[index]["Source"] = source.strip()
        i_record[index]["Description"] = desc.strip()
        i_record[index]["Prce"] = amount

        with open("Income.json", "w") as f:
            json.dump(i_record, f, indent=4)

        return {"code": 200}

    except Exception as e:
        print("Update income error:", e)
        return {"code": 500}



@eel.expose("show_income")
def show_income():
    global i_record

    total = 0

    for item in i_record:
        total += float(item["Prce"])

    return {
        "data": i_record,
        "total": total
    }


@eel.expose("expense_chart_data")
def expense_chart_data():
    global e_record

    return {
        "data": e_record
    }






eel.start("ETlogin.html",port = 3075)

