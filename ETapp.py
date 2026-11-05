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
    current_month = datetime.now().strftime("%m")

    month_total = 0

    with open("Expense.json", "r") as fr:
        load_data = json.load(fr)

    for x in range(len(load_data)):

        expense_month = load_data[x]["Date"].split("/")[1]

        if expense_month == current_month:
            month_total += load_data[x]["Price"]
        else:
            month_total = 0

    for x in range(len(load_data)):
        total += load_data[x]["Price"]

    return {"tot":total,
            "month_tot":month_total,
            "data":load_data}


@eel.expose("save_income")
def save_income(source,desc,amount):

    date = datetime.now().strftime("%d/%m/%Y")
    time = datetime.now().strftime("%H:%M:%S")

    i_data = {
        "Source":source,
        "Description":desc,
        "Prce":amount,
        "Date": date,
        "Time":time
    }

    i_record.append(i_data)

    with open("Income.json","w") as f:
        json.dump(i_record,f,indent=4)

    return {"status":200}


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






eel.start("ETlogin.html",port = 3075)

