import React from "react"

import styles from "./instructions.module.css"

export const Instructions = () => {
 return (
 <section className={styles.instructions}>
  <h3 className={styles.instructions__header}>Instructions</h3>
  <p className={styles.instructions__text}>1. Create at least one move before adding boxes.</p>
  <p className={styles.instructions__text}>2. Create at least one box before adding items.</p>
  <p className={styles.instructions__text}>3. Create items.</p>
  <p className={styles.instructions__text}>After creation, you are free to reassign items, boxes.</p>
 </section>
 )
}
