import React from 'react'
import styles from '@/app/page.module.css'

export default function Footer() {
  return (
    <>
      <footer className={styles.footer}>
        <section >
          <p id="phoneNo">+974 66118811</p>
          <p id="email">readradar.cont@book.qa</p>
        </section>
        <section>
          {" "}
          <p>2024 © ReadRadar</p>
        </section>
      </footer>
    </>
  );
}
