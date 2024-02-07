// Selecting DOM elements
const form = document.querySelector(".add");
const incomeList = document.querySelector("ul.income-list");
const expenseList = document.querySelector("ul.expense-list");
const balance = document.getElementById("balance");
const income = document.getElementById("income");
const expense = document.getElementById("expense");

// Retrieving transactions from local storage or initializing an empty array
let transactions = localStorage.getItem("transactions") !== null ? JSON.parse(localStorage.getItem("transactions")) : [];


// Function to update statistics displayed on the page
function updateStatistics() {
    // Calculating total income
    const updatedIncome = transactions
                                .filter(transaction => transaction.amount > 0)
                                .reduce((total, transaction) => total += transaction.amount, 0);

    console.log(updatedIncome);

    // Calculating total expense
    const updatedExpense = transactions
                                .filter(transaction => transaction.amount < 0)
                                .reduce((total, transaction) => total += Math.abs(transaction.amount), 0)

    // Calculating updated balance
    updatedBalance = updatedIncome - updatedExpense;
   
    // Updating DOM with updated statistics
    balance.textContent = updatedBalance;
    income.textContent = updatedIncome;
    expense.textContent = updatedExpense;
}



// Function to generate HTML template for transaction record
function generateTemplate(id, source, amount, time) {
    return `<li data-id="${id}">
    <p>
        <span>${source}</span>
        <span id="time">${time}</span>
        
    </p>
    ₹<span>${Math.abs(amount)}</span>
    
    <i class="bi bi-trash delete"></i>
</li>`
}

// Function to add transaction record to the DOM
function addTransactionDOM(id, source, amount, time) {

    if (amount >= 0) {
        incomeList.innerHTML += generateTemplate(id, source, amount, time);
    } else {
        expenseList.innerHTML += generateTemplate(id, source, amount, time);
    }
}

// Function to add a new transaction
function addTransaction(source, amount) {

    const time = new Date();
    const transaction = {
        id: Math.floor(Math.random() * 100000),
        source: source,
        amount: amount,
        time: `${time.toLocaleTimeString()} ${time.toLocaleDateString()}`
    };

    // Adding transaction to the array and updating local storage
    transactions.push(transaction);
    localStorage.setItem("transactions", JSON.stringify(transactions));

     // Adding transaction record to the DOM
    addTransactionDOM(transaction.id, source, amount, transaction.time)
}

// Event listener for form submission
form.addEventListener("submit", event => {
    event.preventDefault();
    if(form.source.value.trim() === "" || form.amount.value === ""){
        // Alerting user if input values are empty
        return alert ("Uh-oh! Hold on a moment! 🛑 Please add proper values to continue your financial journey with us! 💼💰");
          
    }

    // Adding transaction and updating statistics
    addTransaction(form.source.value.trim(), Number(form.amount.value))
    updateStatistics();
    form.reset();
})


// Function to display existing transactions on page load
function getTransaction() {
    transactions.forEach(transaction => {
        if (transaction.amount > 0) {
            incomeList.innerHTML += generateTemplate(transaction.id, transaction.source, transaction.amount, transaction.time);

        } else {
            expenseList.innerHTML += generateTemplate(transaction.id, transaction.source, transaction.amount, transaction.time);

        }
    });
}


// Function to delete a transaction
function deleteTransaction(id) {
    transactions = transactions.filter(transaction => {
        return transaction.id !== id;
    });

    // Updating local storage after deleting transaction
    localStorage.setItem("transactions", JSON.stringify(transactions));

}

// Event listeners for delete buttons in income and expense lists
incomeList.addEventListener("click", event => {
    if (event.target.classList.contains("delete")) {
        event.target.parentElement.remove();
        deleteTransaction(Number(event.target.parentElement.dataset.id)); 
        updateStatistics();
    }
});

expenseList.addEventListener("click", event => {
    if (event.target.classList.contains("delete")) {
        event.target.parentElement.remove();
        deleteTransaction(Number(event.target.parentElement.dataset.id));
        updateStatistics();
    }
});

// Function to initialize the page
function init(){
    updateStatistics();
    getTransaction();
}

init(); // Initializing the page


