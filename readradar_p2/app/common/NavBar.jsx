'use client'
import React from "react";
import styles from '@/app/page.module.css'

export default function NavBar() {
  return (
    <>
      <header>
        <div class="name">
          <img src="NameclassName../media/icons/radar.svg" alt="" />
          <h1>ReadRadar</h1>
        </div>
        <div class="search">
          <img src="NameclassName../media/icons/search.svg" alt="" />
          <form id="searchForm">
            <input
              type="search"
              id="searchInput"
              name="search"
              placeholder="Search for books"
            />
            <button type="submit" id="search-button">
              <img src="../media/icons/arrow-right.svg" alt="" />
            </button>
          </form>
        </div>
        <section class="profile">
          <input
 NameclassName           id="profileImageInput"
            type="image"
            src="../media/icons/circle-user.svg"
            alt="Profile"
          />
          <p id="headerUsername"></p>

          <div id="profilePopup" class="hidden"></div>

 NameclassName         <div id="addressUpdatePopup" class="hidden">
            <h2>Update Shipping Address</h2>
 NameclassName           <form id="addressUpdateForm">
              <label for="country">Country:</label>
              <input type="text" id="country" name="country" required />

              <label for="city">City:</label>
              <input type="text" id="city" name="city" required />

              <label for="street">Street:</label>
              <input type="text" id="street" name="street" required />

              <label for="house_number">House Number:</label>
              <input
                type="number"
                id="house_number"
                name="house_number"
                min="1"
                required
              />

              <button type="submit">Save Address</button>
              <button type="reset" id="cancelUpdateAddress">
                Cancel
              </button>
            </form>
          </div>
        </section>
      </header>

      <nav class="navigation">
        <div className={styles.nav}>
          <ul className={styles.navList}>
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
            <li class="hidden" id="purchaseHistListItem">
              <img src="../media/icons/shopping-cart.svg" alt="" />
              <a href="../Purchase History/purchaseHist.html">
                Purchase History
              </a>
            </li>
          </ul>

          <ul>
            <li>
              <img src="../media/icons/headset.svg" alt="" />
              <a href="#contact">Contact Us</a>
            </li>
            <li class="hidden" id="addListItem">
              <a href="Add item" id="addItemLink">
                Add Item
              </a>
            </li>
            <li class="hidden" id="viewSalesListItem">
              <a href="../View Sales/View_Sales.html" id="viewSalesLink">
                View Sales
              </a>
            </li>
          </ul>

          <div id="popupForm" class="hidden">
            <form id="uploadItemForm"NameclassName>
              <label for="title">Title:</label>
              <input type="text" id="title" name="title" required />

              <label for="author">Author:</label>
              <input type="text" id="author" name="author" />

              <label for="genre">Genre:</label>
              <select id="genre" name="genre">
                <option value="Fiction">Fiction</option>
                <option value="Books 2024">2024 Books</option>
                <option value="Action">Action</option>
                <option value="Mystery">Mystery</option>
                <option value="Self Devlopment">Self-Development</option>
                <option value="Arabic">Arabic</option>
              </select>

              <label for="price">Price:</label>
              <input
                type="number"
                id="price"
                name="price"
                required
                step="0.01"
              />

              <label for="bookQuantity">Quantity:</label>
              <input
                type="number"
                id="bookQuantity"
                name="bookQuantity"
                required
                step="1"
                min="1"
              />

              <label for="description">Description:</label>
              <textarea id="description" name="description"></textarea>

              <label for="coverImageUrl">Cover Image:</label>
              <input
                type="text"
                id="coverImageUrl"
                name="coverImageUrl"
                accept="image/*"
              />

              <button type="submit" id="submit">
                Add Item
              </button>
            </form>
          </div>
        </div>
      </nav>
    </>
  );
}
