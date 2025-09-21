# 💰 Budget Tracker (Local JSON + Excel Export)

A simple, offline-first **budget tracking web app** built with **HTML, CSS, and JavaScript**.  
It runs directly in your browser — no backend required. Data is saved to **localStorage** (and can be exported/imported via JSON).

---

## ✨ Features

- **Add expenses and savings** with date, type, category, and amount  
- **Currency selector** (₱, $, €, ¥ supported out of the box)  
- **Light/Dark theme toggle**  
- **Summary dashboard** showing:
  - Total money
  - Expenses
  - Savings
  - Remaining balance
- **Data persistence** using localStorage  
- **Export & Import**:
  - JSON backup and restore
  - Excel report (`.xlsx`) with:
    - Entries table
    - Summary sheet
    - Expenses/Savings breakdown
    - Auto-generated **pie chart** (via Chart.js + ExcelJS)
- **Mobile-friendly layout** (responsive table → card list)

---

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript  
- **Libraries**:
  - [ExcelJS](https://github.com/exceljs/exceljs) – Excel export  
  - [FileSaver.js](https://github.com/eligrey/FileSaver.js) – Save files in browser  
  - [Chart.js](https://www.chartjs.org/) – Charts & graphs  

---

## 🚀 Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/budget-tracker.git
   cd budget-tracker

2. Open the project:

   * Just open `index.html` in your browser.
   * No build tools or server required.

---

## 📂 Project Structure

```
budget-tracker/
│── index.html   # Main app (HTML, CSS, JS inline)
│── README.md    # Documentation
```

---

## 📸 Screenshots

*(Optional: add screenshots of dark mode, summary cards, and Excel export here)*

---

## 💡 Usage Tips

* Use **Export JSON** to back up your data.
* To move your budget to another computer, copy the JSON file and **Import JSON** there.
* Excel export adds a **chart** and category breakdown — great for reports.

---

## 📜 License

MIT License.
Feel free to use, modify, and share!
