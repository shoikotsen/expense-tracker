/* 
  Author: Shoikot Sen
  Project: Expense Tracker Web App
  Description: This JavaScript handles adding expenses, saving them to localStorage,
               updating the UI with a list of expenses, and rendering a pie chart
               using Chart.js (v4 compatible) and DataLabels plugin.
*/

// Get references to DOM elements
const form = document.getElementById('expense-form');
const list = document.getElementById('expense-list');
const chartCanvas = document.getElementById('expense-chart').getContext('2d');

// Load expenses from localStorage or start empty
let expenses = JSON.parse(localStorage.getItem('expenses')) || [];

// Initialize on page load
updateList();
updateChart();

// Add expense on form submit
form.addEventListener('submit', function (e) {
  e.preventDefault();

  const description = document.getElementById('description').value.trim();
  const amount = parseFloat(document.getElementById('amount').value);
  const category = document.getElementById('category').value;

  if (description && !isNaN(amount)) {
    expenses.push({ description, amount, category });
    localStorage.setItem('expenses', JSON.stringify(expenses));
    updateList();
    updateChart();
    form.reset();
  }
});

// Update expense list with Delete and Clear All buttons
function updateList() {
  list.innerHTML = '';

  expenses.forEach((expense, index) => {
    const item = document.createElement('li');
    item.innerHTML = `
      ${expense.description} - $${expense.amount.toFixed(2)}
      <span>${expense.category}</span>
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

// Delete a single expense
function deleteExpense(index) {
  if (confirm('Delete this expense?')) {
    expenses.splice(index, 1);
    localStorage.setItem('expenses', JSON.stringify(expenses));
    updateList();
    updateChart();
  }
}

// Clear all expenses
function clearAllExpenses() {
  if (confirm('Delete ALL expenses?')) {
    expenses = [];
    localStorage.removeItem('expenses');
    updateList();
    updateChart();
  }
}

// Update the pie chart with percentages (Chart.js v4 compatible)
function updateChart() {
  const totals = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {});

  const labels = Object.keys(totals);
  const data = Object.values(totals);

  if (window.expenseChart) {
    window.expenseChart.destroy();
  }

  window.expenseChart = new Chart(chartCanvas, {
    type: 'pie',
    data: {
      labels: labels,
      datasets: [{
        data: data,
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0']
      }]
    },
    options: {
      plugins: {
        datalabels: {
          color: '#fff',
          formatter: (value, context) => {
            const total = context.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1) + '%';
            return percentage;
          },
          font: {
            weight: 'bold',
            size: 14
          }
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              const total = context.dataset.data.reduce((a, b) => a + b, 0);
              const value = context.raw;
              const percentage = ((value / total) * 100).toFixed(1) + '%';
              return `${context.label}: $${value.toFixed(2)} (${percentage})`;
            }
          }
        }
      }
    },
    plugins: [ChartDataLabels]
  });
}
