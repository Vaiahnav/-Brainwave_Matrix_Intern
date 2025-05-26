const form = document.getElementById("expense-form");
const descInput = document.getElementById("description");
const amountInput = document.getElementById("amount");
const dateInput = document.getElementById("date");
const expenseList = document.getElementById("expense-list");
const totalSpan = document.getElementById("total");
const selectedMonthText = document.getElementById("selected-month");
const monthSelect = document.getElementById("month");
const yearSelect = document.getElementById("year");

let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

function saveAndRender() {
  localStorage.setItem("expenses", JSON.stringify(expenses));
  renderExpenses();
}

function renderExpenses() {
  expenseList.innerHTML = "";

  const selectedMonth = parseInt(monthSelect.value);
  const selectedYear = parseInt(yearSelect.value);
  selectedMonthText.textContent = `${monthSelect.options[monthSelect.selectedIndex].text} ${selectedYear}`;

  const filtered = expenses.filter(exp => {
    const expDate = new Date(exp.date);
    return expDate.getMonth() === selectedMonth && expDate.getFullYear() === selectedYear;
  });

  let total = 0;
  filtered.forEach((expense, index) => {
    total += expense.amount;

    const li = document.createElement("li");
    li.innerHTML = `
      ${expense.description} (₹${expense.amount}) - ${expense.date}
      <button onclick="deleteExpense(${index})">❌</button>
    `;
    expenseList.appendChild(li);
  });

  totalSpan.textContent = total;
}

function deleteExpense(index) {
  expenses.splice(index, 1);
  saveAndRender();
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const description = descInput.value.trim();
  const amount = parseFloat(amountInput.value);
  const date = dateInput.value;

  if (!description || isNaN(amount) || !date) return;

  expenses.push({ description, amount, date });
  descInput.value = "";
  amountInput.value = "";
  dateInput.value = "";

  saveAndRender();
});

function populateMonthYearDropdowns() {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  for (let m = 0; m < 12; m++) {
    const option = document.createElement("option");
    option.value = m;
    option.text = new Date(0, m).toLocaleString("default", { month: "long" });
    if (m === currentMonth) option.selected = true;
    monthSelect.appendChild(option);
  }

  for (let y = currentYear - 5; y <= currentYear + 5; y++) {
    const option = document.createElement("option");
    option.value = y;
    option.text = y;
    if (y === currentYear) option.selected = true;
    yearSelect.appendChild(option);
  }

  monthSelect.addEventListener("change", renderExpenses);
  yearSelect.addEventListener("change", renderExpenses);
}

populateMonthYearDropdowns();
renderExpenses();
