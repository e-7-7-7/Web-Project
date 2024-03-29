//Purchase History 

document.addEventListener('DOMContentLoaded', function() {
    displayPurchaseHistory();
});
function displayPurchaseHistory() {
    const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    const usersData = JSON.parse(localStorage.getItem('users')) || [];
    const currentUserID = localStorage.getItem('currentUserID');
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    
    // Check if the user is authenticated
    if (isAuthenticated === 'true') {
        // Ensure the current user is a customer
        const currentUser = usersData.find(user => user.id === currentUserID);
        if (currentUser && currentUser.role === 'Customer') {
            
            const customerTransactions = transactions.filter(transaction => transaction.custId === currentUserID);

           
            const purchaseHistDiv = document.querySelector('.purchaseHist');

            purchaseHistDiv.innerHTML = '';

            
            const table = document.createElement('table');
            table.innerHTML = `
                <thead>
                    <tr>
                        <th>Transaction ID</th>
                        <th>Book Title</th>
                        <th>Quantity</th>
                        <th>Total</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    ${customerTransactions.map(transaction => `
                        <tr>
                            <td>${transaction.transactionId}</td>
                            <td>${transaction.bookTitle}</td>
                            <td>${transaction.quantity}</td>
                            <td>$${transaction.total.toFixed(2)}</td>
                            <td>${transaction.date}</td>
                        </tr>
                    `).join('')}
                </tbody>
            `;
            purchaseHistDiv.appendChild(table);
        } else {
            alert('You do not have permission to view purchase history.');
        }
    } else {
        alert('Please log in to view purchase history.');
    }
}