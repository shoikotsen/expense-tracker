/* 
  Author: Shoikot Sen
  Project: Expense Tracker Web App
  Description: This JavaScript handles adding expenses, saving them to localStorage,
               updating the UI with a list of expenses, and rendering a pie chart
               using Chart.js to show spending by category.
*/

// Get references to DOM elements
const form = document.getElementById('expense-form');
const list = document.getElementById('expense-list');
const chartCanvas = document.getElementById('expense-chart').getContext('2d');

// Load previously saved expenses from localStorage or start with an empty array
let expenses = JSON.parse(localStorage.getItem('expenses')) || [];

// Initialize the list and chart on page load
updateList();
updateChart();

// When the form is submitted, add a new expense
form.addEventListener('submit', function (e) {
  e.preventDefault(); // Prevent page reload

  // Get input values
  const description = document.getElementById('description').value;
  const amount = parseFloat(document.getElementById('amount').value);
  const category = document.getElementById('category').value;

  if (description && !isNaN(amount)) {
    // Create an expense object
    const expense = { description, amount, category };

    // Add it to the list and save to localStorage
    expenses.push(expense);
    localStorage.setItem('expenses', JSON.stringify(expenses));

    // Update UI and chart
    updateList();
    updateChart();

    // Reset the form
    form.reset();
  }
});

// Update the expense list with Delete buttons
function updateList() {
  list.innerHTML = ''; // Clear existing list

  expenses.forEach((expense, index) => {
    const item = document.createElement('li');
    item.innerHTML = `
      ${expense.description} - $${expense.amount.toFixed(2)} <span>${expense.category}</span>
      <button class="delete-btn" onclick="deleteExpense(${index})">Delete</button>
    `;
    list.appendChild(item);
  });

  // Add Clear All button if there are expenses
  if (expenses.length > 0) {
    const clearBtn = document.createElement('button');
    clearBtn.textContent = 'Clear All';
    clearBtn.className = 'clear-btn';
    clearBtn.onclick = clearAllExpenses;
    list.appendChild(clearBtn);
  }
}

// Delete a single expense by index
function deleteExpense(index) {
  expenses.splice(index, 1);
  localStorage.setItem('expenses', JSON.stringify(expenses));
  updateList();
  updateChart();
}

// Clear all expenses
function clearAllExpenses() {
  if (confirm('Are you sure you want to delete all expenses?')) {
    expenses = [];
    localStorage.removeItem('expenses');
    updateList();
    updateChart();
  }
}

// Update the pie chart
function updateChart() {
  const categoryTotals = expenses.reduce((totals, expense) => {
    totals[expense.category] = (totals[expense.category] || 0) + expense.amount;
    return totals;
  }, {});

  const labels = Object.keys(categoryTotals);
  const data = Object.values(categoryTotals);

  if (window.expenseChart) {
    window.expenseChart.destroy();
  }

  window.expenseChart = new Chart(chartCanvas, {
    type: 'pie',
    data: {
      labels: labels,
      datasets: [{
        label: 'Expenses by Category',
        data: data,
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0']
      }]
    }
  });
}
