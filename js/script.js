// Budget Tracker Application
(() => {
  // DOM Elements
  const elements = {
    currency: document.getElementById('currency'),
    toggleTheme: document.getElementById('toggleTheme'),
    totalMoneyInput: document.getElementById('totalMoneyInput'),
    setTotalBtn: document.getElementById('setTotalBtn'),
    entryDate: document.getElementById('entryDate'),
    entryType: document.getElementById('entryType'),
    entryCategory: document.getElementById('entryCategory'),
    entryAmount: document.getElementById('entryAmount'),
    addEntryBtn: document.getElementById('addEntryBtn'),
    clearFormBtn: document.getElementById('clearFormBtn'),
    exportJsonBtn: document.getElementById('exportJsonBtn'),
    importJsonBtn: document.getElementById('importJsonBtn'),
    importJsonFile: document.getElementById('importJsonFile'),
    exportExcelBtn: document.getElementById('exportExcelBtn'),
    tableBody: document.getElementById('tableBody'),
    mobileList: document.getElementById('mobileList'),
    entriesTable: document.getElementById('entriesTable'),
    uiTotalMoney: document.getElementById('uiTotalMoney'),
    uiExpenses: document.getElementById('uiExpenses'),
    uiSavings: document.getElementById('uiSavings'),
    uiRemaining: document.getElementById('uiRemaining')
  };

  // Data Model
  let budgetData = {
    totalMoney: 0,
    entries: []
  };

  const STORAGE_KEY = 'budgetData_v2';

  // Utility Functions
  const safeNumber = (value) => {
    const num = parseFloat(value);
    return isNaN(num) ? 0 : num;
  };

  const formatCurrency = (value) => {
    return (elements.currency.value || '₱') + safeNumber(value).toFixed(2);
  };

  const normalizeEntry = (entry) => {
    return {
      date: entry?.date || new Date().toISOString().slice(0, 10),
      type: (entry?.type === 'Savings' || entry?.type === 'Expense') ? entry.type : 'Expense',
      category: entry?.category || 'Other',
      amount: safeNumber(entry?.amount ?? entry?.value ?? entry?.amt)
    };
  };

  const normalizeData = (raw) => {
    if (!raw) return { totalMoney: 0, entries: [] };
    
    if (Array.isArray(raw)) {
      return { totalMoney: 0, entries: raw.map(normalizeEntry) };
    }
    
    if (typeof raw === 'object') {
      const totalMoney = safeNumber(raw.totalMoney);
      let entries = [];
      
      if (Array.isArray(raw.entries)) {
        entries = raw.entries.map(normalizeEntry);
      } else if (Array.isArray(raw.data)) {
        entries = raw.data.map(normalizeEntry);
      }
      
      return { totalMoney, entries };
    }
    
    return { totalMoney: 0, entries: [] };
  };

  // Storage Functions
  const loadFromStorage = () => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return;
    
    try {
      const parsed = JSON.parse(stored);
      budgetData = normalizeData(parsed);
    } catch (error) {
      console.warn('Failed to load stored data:', error);
      budgetData = { totalMoney: 0, entries: [] };
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const saveToStorage = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(budgetData));
    } catch (error) {
      console.error('Failed to save data:', error);
      alert('Failed to save data. Check browser storage settings.');
    }
  };

  // Calculations
  const calculateTotals = () => {
    let expenses = 0, savings = 0;
    
    budgetData.entries.forEach(entry => {
      if (entry.type === 'Expense') {
        expenses += safeNumber(entry.amount);
      } else {
        savings += safeNumber(entry.amount);
      }
    });
    
    const remaining = safeNumber(budgetData.totalMoney) - expenses - savings;
    
    return { expenses, savings, remaining };
  };

  const calculateCategoryTotals = () => {
    const categories = {};
    
    budgetData.entries.forEach(entry => {
      if (!categories[entry.category]) {
        categories[entry.category] = { expenses: 0, savings: 0 };
      }
      
      if (entry.type === 'Expense') {
        categories[entry.category].expenses += safeNumber(entry.amount);
      } else {
        categories[entry.category].savings += safeNumber(entry.amount);
      }
    });
    
    return categories;
  };

  // Rendering
  const renderUI = () => {
    const totals = calculateTotals();
    
    elements.uiTotalMoney.textContent = formatCurrency(budgetData.totalMoney);
    elements.uiExpenses.textContent = formatCurrency(totals.expenses);
    elements.uiSavings.textContent = formatCurrency(totals.savings);
    elements.uiRemaining.textContent = formatCurrency(totals.remaining);
    
    renderTable();
    renderMobileList();
  };

  const renderTable = () => {
    elements.tableBody.innerHTML = '';
    
    budgetData.entries.forEach((entry, index) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${entry.date}</td>
        <td>${entry.type}</td>
        <td>${entry.category}</td>
        <td>${formatCurrency(entry.amount)}</td>
        <td class="actions">
          <button onclick="window.BT_edit(${index})">Edit</button>
          <button onclick="window.BT_delete(${index})">Delete</button>
        </td>
      `;
      elements.tableBody.appendChild(row);
    });
  };

  const renderMobileList = () => {
    elements.mobileList.innerHTML = '';
    
    if (window.innerWidth <= 700) {
      elements.mobileList.style.display = 'block';
      elements.entriesTable.style.display = 'none';
      
      budgetData.entries.forEach((entry, index) => {
        const card = document.createElement('div');
        card.className = 'entry-card';
        card.innerHTML = `
          <div style="display:flex;justify-content:space-between;margin-bottom:8px;">
            <strong>${entry.date}</strong>
            <span>${formatCurrency(entry.amount)}</span>
          </div>
          <div style="margin-bottom:8px;">${entry.type} • ${entry.category}</div>
          <div>
            <button onclick="window.BT_edit(${index})">Edit</button>
            <button onclick="window.BT_delete(${index})">Delete</button>
          </div>
        `;
        elements.mobileList.appendChild(card);
      });
    } else {
      elements.mobileList.style.display = 'none';
      elements.entriesTable.style.display = 'table';
    }
  };

  // Event Handlers
  const setTotalMoney = () => {
    const amount = safeNumber(elements.totalMoneyInput.value);
    budgetData.totalMoney = amount;
    saveToStorage();
    renderUI();
    elements.totalMoneyInput.value = '';
  };

  const addEntry = () => {
    const date = elements.entryDate.value || new Date().toISOString().slice(0, 10);
    const type = elements.entryType.value;
    const category = elements.entryCategory.value;
    const amount = safeNumber(elements.entryAmount.value);
    
    if (amount <= 0) {
      alert('Please enter an amount greater than 0');
      return;
    }
    
    budgetData.entries.push({ date, type, category, amount });
    saveToStorage();
    renderUI();
    
    // Clear form
    elements.entryAmount.value = '';
    elements.entryDate.value = '';
  };

  const clearForm = () => {
    elements.entryDate.value = '';
    elements.entryAmount.value = '';
    elements.entryCategory.value = 'Food';
    elements.entryType.value = 'Expense';
  };

  const deleteEntry = (index) => {
    if (!confirm('Delete this entry?')) return;
    
    budgetData.entries.splice(index, 1);
    saveToStorage();
    renderUI();
  };

  const editEntry = (index) => {
    const entry = budgetData.entries[index];
    if (!entry) return;
    
    elements.entryDate.value = entry.date;
    elements.entryType.value = entry.type;
    elements.entryCategory.value = entry.category;
    elements.entryAmount.value = entry.amount;
    
    // Remove original entry (will be re-added on save)
    budgetData.entries.splice(index, 1);
    saveToStorage();
    renderUI();
    
    elements.entryAmount.focus();
  };

  // Export/Import Functions
  const exportJSON = () => {
    try {
      const data = JSON.stringify(budgetData, null, 2);
      const blob = new Blob([data], { type: 'application/json' });
      const filename = `budget-backup-${new Date().toISOString().slice(0, 10)}.json`;
      
      if (window.saveAs) {
        saveAs(blob, filename);
      } else {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export JSON');
    }
  };

  const importJSON = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target.result);
        budgetData = normalizeData(parsed);
        saveToStorage();
        renderUI();
        alert('Import successful!');
      } catch (error) {
        console.error('Import failed:', error);
        alert('Invalid JSON file');
      } finally {
        elements.importJsonFile.value = '';
      }
    };
    
    reader.readAsText(file);
  };

  const exportExcel = async () => {
    const totals = calculateTotals();
    const categories = calculateCategoryTotals();
    
    try {
      const workbook = new ExcelJS.Workbook();
      
      // Entries worksheet
      const entriesSheet = workbook.addWorksheet('Entries');
      entriesSheet.addRow(['Date', 'Type', 'Category', 'Amount']);
      budgetData.entries.forEach(entry => {
        entriesSheet.addRow([entry.date, entry.type, entry.category, safeNumber(entry.amount)]);
      });
      
      // Summary worksheet
      const summarySheet = workbook.addWorksheet('Summary');
      summarySheet.addRow(['Total Money', safeNumber(budgetData.totalMoney)]);
      summarySheet.addRow(['Total Expenses', totals.expenses]);
      summarySheet.addRow(['Total Savings', totals.savings]);
      summarySheet.addRow(['Remaining', totals.remaining]);
      
      // Categories worksheet
      const categorySheet = workbook.addWorksheet('By Category');
      categorySheet.addRow(['Category', 'Expenses', 'Savings']);
      Object.entries(categories).forEach(([cat, values]) => {
        categorySheet.addRow([cat, values.expenses, values.savings]);
      });
      
      // Generate chart
      const canvas = document.createElement('canvas');
      canvas.width = 600;
      canvas.height = 400;
      const ctx = canvas.getContext('2d');
      
      const chart = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: ['Expenses', 'Savings', 'Remaining'],
          datasets: [{
            data: [totals.expenses, totals.savings, totals.remaining],
            backgroundColor: ['#ff4c4c', '#4caf50', '#2196f3'],
            borderColor: '#111',
            borderWidth: 1
          }]
        },
        options: {
          plugins: {
            title: { display: true, text: 'Budget Distribution' },
            legend: { display: true, position: 'bottom' }
          },
          animation: false
        }
      });
      
      // Wait for chart to render
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Add chart to Excel
      const base64 = canvas.toDataURL('image/png').split(',')[1];
      const imageId = workbook.addImage({ base64, extension: 'png' });
      summarySheet.addImage(imageId, { tl: { col: 3, row: 0 }, ext: { width: 450, height: 300 } });
      
      // Add recommendation
      const recommendation = totals.expenses > totals.savings
        ? 'Expenses exceed savings - consider reducing expenses'
        : 'Savings are healthy - keep it up!';
      summarySheet.addRow([]);
      summarySheet.addRow(['Recommendation', recommendation]);
      
      // Save workbook
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      });
      saveAs(blob, 'budget-report.xlsx');
      
      chart.destroy();
    } catch (error) {
      console.error('Excel export failed:', error);
      alert('Failed to export Excel file');
    }
  };

  // Theme Management
  const initTheme = () => {
    const savedTheme = localStorage.getItem('bt_theme');
    if (savedTheme === 'light') {
      document.body.classList.add('light');
    }
  };

  const toggleTheme = () => {
    document.body.classList.toggle('light');
    const isLight = document.body.classList.contains('light');
    localStorage.setItem('bt_theme', isLight ? 'light' : 'dark');
  };

  // Currency Management
  const initCurrency = () => {
    const savedCurrency = localStorage.getItem('bt_currency');
    if (savedCurrency) {
      elements.currency.value = savedCurrency;
    }
  };

  // Window resize handler
  const handleResize = () => {
    renderMobileList();
  };

  // Expose global functions for inline onclick handlers
  window.BT_delete = deleteEntry;
  window.BT_edit = editEntry;

  // Initialize
  const init = () => {
    loadFromStorage();
    initTheme();
    initCurrency();
    renderUI();
    
    // Event listeners
    elements.currency.addEventListener('change', () => {
      localStorage.setItem('bt_currency', elements.currency.value);
      renderUI();
    });
    
    elements.toggleTheme.addEventListener('click', toggleTheme);
    elements.setTotalBtn.addEventListener('click', setTotalMoney);
    elements.addEntryBtn.addEventListener('click', addEntry);
    elements.clearFormBtn.addEventListener('click', clearForm);
    elements.exportJsonBtn.addEventListener('click', exportJSON);
    elements.importJsonBtn.addEventListener('click', () => elements.importJsonFile.click());
    elements.importJsonFile.addEventListener('change', importJSON);
    elements.exportExcelBtn.addEventListener('click', exportExcel);
    
    window.addEventListener('resize', handleResize);
  };

  init();
})();