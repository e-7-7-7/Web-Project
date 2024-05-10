//Purchase History

document.addEventListener("DOMContentLoaded", function () {
  displayPurchaseHistory();
});
async function displayPurchaseHistory() {
  let customerTransactions = [];
  const currentUserID = localStorage.getItem("currentUserID");
  if (!currentUserID) {
    alert("Please log in to view purchase history.");
    return;
  }
  try {
    const response = await fetch(
      `/api/transactions?currentUserID=${currentUserID}`
    );
    if (response.ok) {
      customerTransactions = (await response.json()).data;
    } else {
      alert((await response.json()).error);
    }
  } catch (error) {
    alert(error.message);
  }
  // Check if the user is authenticated

  // Ensure the current user is a customer

  const purchaseHistDiv = document.querySelector(".purchaseHist");

  purchaseHistDiv.innerHTML = "";

  const table = document.createElement("table");
  table.innerHTML = `
                <thead>
                    <tr>
            
                        <th>Transaction ID</th>
                        <th>Book Title</th>
                        <th>Quantity</th>
                        <th>Total</th>
                        <th>Seller ID</th>
                        <th>Date</th>
                        <th>Shipping to</th>
                    </tr>
                </thead>
                <tbody>
                    ${customerTransactions
                      .map(
                        (transaction) => `
                        <tr>
            
                            <td>${transaction.id}</td>
                            <td>${transaction.Book.title}</td>
                            <td>${transaction.amount}</td>
                            <td>$${(
                              transaction.Book.price * transaction.amount
                            ).toFixed(2)}</td>
                            <td>${transaction.Book.Seller.id}</td>
                            <td>${transaction.date}</td>
                            <td>${
                              transaction.Customer.Shipping_address.city
                            }</td>
                        </tr>
                    `
                      )
                      .join("")}
                </tbody>
            `;
  purchaseHistDiv.appendChild(table);
}
