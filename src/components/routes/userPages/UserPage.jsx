import React from "react"
import { SummaryList } from "../../summary/SummaryList"
import styles from "./userPage.module.css"

export const UserPage = () => {

 return (
  <main className={styles.userPage}>
   {/* <h1 className={styles.userPage__header}>PackItUp</h1> */}
   <SummaryList />
   
  </main>
 )
}
