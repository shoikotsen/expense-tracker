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

  // Only proceed if the input is valid
  if (description && !isNaN(amount)) {
    // Create an expense object
    const expense = { description, amount, category };

    // Add it to the list and save to localStorage
    expenses.push(expense);
    localStorage.setItem('expenses', JSON.stringify(expenses));

    // Update UI and chart
    updateList();
    updateChart();

    // Reset the form for the next entry
    form.reset();
  }
});

// Update the expense list on the page
function updateList() {
  list.innerHTML = ''; // Clear the list first

  // Create a list item for each expense
  expenses.forEach((expense, index) => {
    const item = document.createElement('li');
    item.innerHTML = `${expense.description} - $${expense.amount.toFixed(2)} <span>${expense.category}</span>`;
    list.appendChild(item);
  });
}

// Update the pie chart based on current expenses
function updateChart() {
  // Group expenses by category and sum their amounts
  const categoryTotals = expenses.reduce((totals, expense) => {
    totals[expense.category] = (totals[expense.category] || 0) + expense.amount;
    return totals;
  }, {});

  // Get labels and data from the grouped totals
  const labels = Object.keys(categoryTotals);
  const data = Object.values(categoryTotals);

  // Destroy previous chart if it exists to prevent overlap
  if (window.expenseChart) {
    window.expenseChart.destroy();
  }

  // Create a new pie chart with the updated data
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
