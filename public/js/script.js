document.addEventListener("DOMContentLoaded", function () {
  const loginScreen = document.getElementById("login-screen");
  const expenseScreen = document.getElementById("expense-screen");
  const loginForm = document.getElementById("login-form");
  const mealsForm = document.getElementById("meals-form");
  const otherExpensesForm = document.getElementById("other-expenses-form");
  const mealsExpensesList = document.getElementById("meals-expenses-list");
  const otherExpensesList = document.getElementById("other-expenses-list");
  const mealsTotalAmount = document.getElementById("meals-total-amount");
  const otherTotalAmount = document.getElementById("other-total-amount");
  const apiUrl = "https://expense-tracker-z0m9.onrender.com/expenses";
  const submitExpense = document.getElementById("submit_expense");
  const defaultUsername = "admin";
  const defaultPassword = "admin";

  loginForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (username === defaultUsername && password === defaultPassword) {
      loginScreen.classList.add("hidden");
      expenseScreen.classList.remove("hidden");
      loadExpenses();
    } else {
      alert("Invalid login credentials");
    }
  });
  document.querySelectorAll(".tab").forEach((tab) => {
    tab.addEventListener("click", function () {
      document
        .querySelectorAll(".tab")
        .forEach((t) => t.classList.remove("active"));
      document
        .querySelectorAll(".tab-content")
        .forEach((tc) => tc.classList.remove("active"));
      this.classList.add("active");
      document.getElementById(this.dataset.tab).classList.add("active");
    });
  });

  function loadExpenses() {
    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        renderExpenses(
          data.filter((exp) => exp.item.toLowerCase().includes("cơm")),
          mealsExpensesList,
          mealsTotalAmount
        );
        renderExpenses(
          data.filter((exp) => !exp.item.toLowerCase().includes("cơm")),
          otherExpensesList,
          otherTotalAmount
        );
      });
  }

  function renderExpenses(expenses, expensesListElement, totalAmountElement) {
    expensesListElement.innerHTML = "";
    let totalAmount = 0;
    expenses.forEach((expense) => {
      const expenseItem = document.createElement("div");
      expenseItem.className = "expense-item";
      expenseItem.innerHTML = `
                        <p><strong>Thời gian:</strong> ${expense.date}</p>
                        <p><strong>Khoản chi:</strong> ${expense.item}</p>
                        <p><strong>Người chi:</strong> ${expense.spender}</p>
                        <p><strong>Giá tiền:</strong> ${expense.amount}</p>
                        <p><strong>Thành viên:</strong> ${expense.members.join(
                          ", "
                        )}</p>
                    `;
      expensesListElement.appendChild(expenseItem);
      totalAmount += parseFloat(expense.amount);
    });
    totalAmountElement.textContent = `Total: ${totalAmount}`;
  }

  async function addExpense(expense) {
    await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(expense),
    })
      .then((response) => {
        response.json();
      })
      .then(() => loadExpenses());
  }

  mealsForm.addEventListener("submit", async function (event) {
    event.preventDefault();
    const item = document.getElementById("meal-expense-item").value;
    const spender = document.getElementById("meal-spender").value;
    const amount = document.getElementById("meal-amount").value;
    const date = document.getElementById("meal-date").value;
    const members = Array.from(
      document.querySelectorAll("#meals-tab .checkbox-group input:checked")
    ).map((cb) => cb.value);

    const expense = { item, spender, amount, date, members };
    await addExpense(expense);
    mealsForm.reset();
  });

  otherExpensesForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const item = document.getElementById("other-expense-item").value;
    const spender = document.getElementById("other-spender").value;
    const amount = document.getElementById("other-amount").value;
    const date = document.getElementById("other-date").value;
    const members = Array.from(
      document.querySelectorAll(
        "#other-expenses-tab .checkbox-group input:checked"
      )
    ).map((cb) => cb.value);

    const expense = { item, spender, amount, date, members };
    addExpense(expense);
    otherExpensesForm.reset();
  });

  document
    .getElementById("meals-filter-btn")
    .addEventListener("click", function () {
      const startDate = new Date(
        document.getElementById("meals-start-date").value
      );
      const endDate = new Date(document.getElementById("meals-end-date").value);
      filterExpenses(startDate, endDate);
    });

  document
    .getElementById("other-filter-btn")
    .addEventListener("click", function () {
      const startDate = new Date(
        document.getElementById("other-start-date").value
      );
      const endDate = new Date(document.getElementById("other-end-date").value);
      filterExpenses(startDate, endDate);
    });

  function filterExpenses(startDate, endDate) {
    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        const filteredMeals = data.filter(
          (exp) =>
            exp.item.toLowerCase().includes("cơm") &&
            new Date(exp.date) >= startDate &&
            new Date(exp.date) <= endDate
        );
        const filteredOthers = data.filter(
          (exp) =>
            !exp.item.toLowerCase().includes("cơm") &&
            new Date(exp.date) >= startDate &&
            new Date(exp.date) <= endDate
        );
        renderExpenses(filteredMeals, mealsExpensesList, mealsTotalAmount);
        renderExpenses(filteredOthers, otherExpensesList, otherTotalAmount);
      });
  }
  window.onload = function () {
    var today = new Date();
    var year = today.getFullYear();
    var month = ("0" + (today.getMonth() + 1)).slice(-2);
    var day = ("0" + today.getDate()).slice(-2);
    var hours = ("0" + today.getHours()).slice(-2);
    var minutes = ("0" + today.getMinutes()).slice(-2);

    var formattedDate =
      year + "-" + month + "-" + day + "T" + hours + ":" + minutes;

    document.getElementById("meal-date").value = formattedDate;
    document.getElementById("other-date").value = formattedDate;
  };
});
