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
          </ul>

        </div>
      </nav>
    </>
  );
}
