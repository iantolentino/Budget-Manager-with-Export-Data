# Budget Tracker

A simple, elegant budget tracking application that runs entirely in your browser. Track expenses, savings, and visualize your financial health with Excel exports and charts.

**Live Demo:** [Your GitHub Pages URL here]

## Features

- **Track Expenses & Savings** – Log your daily transactions with categories
- **Multiple Currencies** – Support for Peso (₱), Dollar ($), Euro (€), and Yen (¥)
- **Data Persistence** – All data saved automatically in your browser
- **Dark/Light Mode** – Choose your preferred theme
- **Excel Export** – Generate professional reports with charts
- **JSON Backup** – Export/import your data for safekeeping
- **Responsive Design** – Works on desktop and mobile

## How to Use

### Setting Your Total Money
1. Enter your total available money in the input field
2. Click "Set Total" to update your budget

### Adding Transactions
1. Select a date (defaults to today)
2. Choose transaction type: Expense or Savings
3. Pick a category (Food, Transport, Bills, Leisure, Other)
4. Enter the amount
5. Click "Add Entry"

### Managing Entries
- **Edit** – Click Edit button on any entry to modify it
- **Delete** – Click Delete and confirm removal
- **View Summary** – See totals update in real-time

### Exporting Data
- **Export JSON** – Creates a backup file you can store safely
- **Import JSON** – Restore your data from a backup file
- **Export Excel** – Generates a professional report with:
  - All entries listed
  - Summary sheet with totals
  - Category breakdown
  - Pie chart visualization
  - Financial recommendation

### Theme & Currency
- Toggle between dark and light themes using the "Toggle Theme" button
- Change currency using the dropdown (affects all displayed amounts)

## Data Storage

All data is stored locally in your browser using localStorage. This means:
- Your data stays on your device
- No account or internet connection required
- Data persists between sessions
- Clear your browser cache to reset

## File Structure

```
budget-tracker/
├── index.html          # Main application page
├── css/
│   └── style.css       # All styles and themes
├── js/
│   └── script.js       # Application logic
└── README.md           # This file
```

## Local Setup

1. Download all three files (index.html, css/style.css, js/script.js)
2. Keep the folder structure intact
3. Open index.html in any modern web browser
4. No server or installation needed!

## Browser Support

Works on all modern browsers:
- Chrome (recommended)
- Firefox
- Safari
- Edge

## Tips

- Export JSON backups regularly to prevent data loss
- Use categories consistently for better reporting
- The Excel export is great for sharing with financial advisors
- Clear the form with the "Clear" button to start fresh

## Technical Details

- Built with vanilla JavaScript – no frameworks
- Uses ExcelJS for spreadsheet generation
- Chart.js for data visualization
- FileSaver.js for file downloads
- Responsive design with CSS Grid and Flexbox

## License

Free for personal and educational use.

```
