

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" href="./styles/global.css" />
        <link rel="stylesheet" href="./styles/main.css" />
        <title>ReadRadar</title>
        <link rel="icon" href="./media/icons/radar -white.svg" type="image/x-icon" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css" />
      </head>
      <body>
        <header>
        <div className="name">
            <img src="../media/icons/radar.svg" alt="" />
            <h1>ReadRadar</h1>
          </div>
          <div className="search">
            <img src="../media/icons/search.svg" alt="" />
            <form id="searchForm">
              <input type="search" id="searchInput" name="search" placeholder="Search for books" />
              <button type="submit" id="search-button">
                <img src="../media/icons/arrow-right.svg" alt="" />
              </button>
            </form>
          </div>
          <section className="profile">
            <input id="profileImageInput" type="image" src="../media/icons/circle-user.svg" alt="Profile" />
            <p id="headerUsername"></p>
            <div id="profilePopup" className="hidden"></div>
            <div id="addressUpdatePopup" className="hidden">
              <h2>Update Shipping Address</h2>
              <form id="addressUpdateForm">
                <label htmlFor="country">Country:</label>
                <input type="text" id="country" name="country" required />
                <label htmlFor="city">City:</label>
                <input type="text" id="city" name="city" required />
                <label htmlFor="street">Street:</label>
                <input type="text" id="street" name="street" required />
                <label htmlFor="house_number">House Number:</label>
                <input type="number" id="house_number" name="house_number" min="1" required />
                <button type="submit">Save Address</button>
                <button type="reset" id="cancelUpdateAddress">
                  Cancel
                </button>
              </form>
            </div>
          </section>
        </header>

        <nav className="navigation">
          <div className="nav">
          <div className="nav">
            <ul>
              <li>
                <img src="../media/icons/home.svg" alt="" />
                <a href="index.html">Home</a>
              </li>
              <li>
                <img src="../media/icons/trophy.svg" alt="" />
                <a href="#bestBooks">2023 Best books</a>
              </li>
              <li>
                <img src="../media/icons/book-marked.svg" alt="" />
                <a href="#Genres">Genres</a>
              </li>
              <li className="hidden" id="purchaseHistListItem">
                <img src="../media/icons/shopping-cart.svg" alt="" />
                <a href="../Purchase History/purchaseHist.html">Purchase History</a>
              </li>
              <li className="hidden" id="stat">
                <a href="../../">Statistics</a>
              </li>
            </ul>

            <ul>
              <li>
                <img src="../media/icons/headset.svg" alt="" />
                <a href="#contact">Contact Us</a>
              </li>
              <li className="hidden" id="addListItem">
                <a href="#Add item" id="addItemLink">
                  Add Item
                </a>
              </li>
              <li className="hidden" id="viewSalesListItem">
                <a href="../View Sales/View_Sales.html" id="viewSalesLink">
                  View Sales
                </a>
              </li>
            </ul>
          </div>
          </div>
        </nav>

        {children}

        <aside>
        <section className="aside-title">
            <img id="shopping-cart" src="../media/icons/shopping-cart.svg" alt="" />
            <h2> Your Cart</h2>
          </section>

          <div id="purchContent">
            <section id="book-picked">
              <p id="purchase"></p>
            </section>
          </div>

          <form id="cartForm">
            <label id="quantLabel" htmlFor="quantity">
              Qunatity:
            </label>
            <input type="number" id="quantity" name="qunatity" min="1" placeholder="Quantity" />
          </form>

          <section className="purchase-buttons">
            <button type="submit" id="cancel">
              Cancel
            </button>
            <button type="submit" id="proceed">
              Proceed
            </button>
          </section>

          <div id="checkoutForm" className="hidden">
            <section id="checkout">
              <h2>
                <img src="../media/icons/shopping-basket.svg" alt="" />
                Checkout
              </h2>
            </section>
            <section id="transaction">
              <section id="trans"></section>
              <section id="quant"></section>
            </section>
            <section id="checkoutAdd">
              <h3>Your Shipping Address</h3>
              <section id="address"></section>
            </section>

            <form id="purchaseForm">
              <button type="button" id="updateCheckout">
                Update Shipping Address
              </button>
              <button type="button" id="cancelCheckout">
                Cancel
              </button>
              <button type="button" id="checkoutButton">
                Checkout
              </button>
            </form>
          </div>
        </aside>

        <footer>
        <section id="contact">
            <p id="phoneNo">+974 66118811</p>
            <p id="email">readradar.cont@book.qa</p>
          </section>
          <section>
            <p>2024 © ReadRadar</p>
          </section>
        </footer>
      </body>
    </html>
  );
}