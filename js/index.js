// --- 1. GET HTML ELEMENTS ---
const balance = document.getElementById('balance');
const moneyPlus = document.getElementById('money-plus');
const moneyMinus = document.getElementById('money-minus');
const list = document.getElementById('list');
const form = document.getElementById('form');
const text = document.getElementById('text');
const amount = document.getElementById('amount');
const notification = document.getElementById('notification');
const btnIncome = document.getElementById('btn-income');
const btnExpense = document.getElementById('btn-expense');

// --- 2. DATA STORAGE ---
const localStorageTransactions = JSON.parse(localStorage.getItem('transactions'));
let transactions = localStorage.getItem('transactions') !== null ? localStorageTransactions : [];

function updateLocalStorage() {
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

// --- 3. HELPER FUNCTIONS ---
function generateID() {
  return Math.floor(Math.random() * 100000000);
}

function showNotification() {
  notification.classList.add('show');
  setTimeout(() => {
    notification.classList.remove('show');
  }, 2000);
}

// --- 4. MAIN APP LOGIC ---

// Adds a new transaction to the list
function addNewTransaction(type) {
  if (text.value.trim() === '' || amount.value.trim() === '') {
    showNotification();
    return;
  }

  const transactionAmount = Math.abs(+amount.value);
  const finalAmount = type === 'expense' ? -transactionAmount : transactionAmount;

  const transaction = {
    id: generateID(),
    text: text.value,
    amount: finalAmount,
  };
  
  transactions.push(transaction);
  addTransactionDOM(transaction);
  updateValues();
  updateLocalStorage();
  
  text.value = '';
  amount.value = '';
}

// Removes a transaction from the list
function removeTransaction(id) {
  transactions = transactions.filter(transaction => transaction.id !== id);
  updateLocalStorage();
  init();
}

// --- 5. DOM/UI UPDATE FUNCTIONS ---

// Creates and displays a transaction in the history list
function addTransactionDOM(transaction) {
  const sign = transaction.amount < 0 ? '-' : '+';
  const item = document.createElement('li');
  item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');

  item.innerHTML = `
    ${transaction.text} <span>${sign}${Math.abs(transaction.amount)}</span>
    <button class="delete-btn" onclick="removeTransaction(${transaction.id})">×</button>
  `;
  list.appendChild(item);
}

// ** This is the simplified function **
// It calculates and updates the balance, income, and expenses.
function updateValues() {
  let total = 0;
  let income = 0;
  let expense = 0;

  // Loop through every transaction one by one
  for (let i = 0; i < transactions.length; i++) {
    const transaction = transactions[i];
    
    // Add the amount to the total balance
    total = total + transaction.amount;

    // If the amount is positive, add it to income
    if (transaction.amount > 0) {
      income = income + transaction.amount;
    } 
    // If the amount is negative, add it to expense
    else {
      expense = expense + transaction.amount;
    }
  }

  // Update the HTML on the page
  balance.innerText = `₹${total.toFixed(2)}`;
  moneyPlus.innerText = `+₹${income.toFixed(2)}`;
  moneyMinus.innerText = `-₹${(expense * -1).toFixed(2)}`;
}

// --- 6. INITIALIZATION & EVENT LISTENERS ---

// This function starts the app
function init() {
  list.innerHTML = '';
  transactions.forEach(addTransactionDOM);
  updateValues();
}

// Start the app when the page loads
init();

// Listen for clicks on the 'Add Income' button
btnIncome.addEventListener('click', (e) => {
  e.preventDefault();
  addNewTransaction('income');
});

// Listen for clicks on the 'Add Expense' button
btnExpense.addEventListener('click', (e) => {
  e.preventDefault();
  addNewTransaction('expense');
});

