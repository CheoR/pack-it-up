import React from "react"
import { NavLink } from "react-router-dom"

import styles from "./summary.module.css"


const SummaryCard = ({ typeObj }) => {
  return (

    <li className={styles.summary__li}>
      <h2 className={styles.summary__dataType}>{ typeObj.data.type }</h2>
      <div className={styles.summary__dataLength}>{ typeObj.data.collection.length }</div>

      <NavLink to={`/${typeObj.data.type}`} className={styles.summary__navlink__view}>
        <button className={styles.summary__navlinkBtn__view} disabled={typeObj.data.canUse}>
          Add/View
        </button>
      </NavLink>
    </li>
  )
}

export const Summary = ({ listOfTypes }) => {

 return (
   <ul className={styles.summary__ul}>
     {
      listOfTypes.map((data, i) => <SummaryCard key={i} typeObj={{ data }} />)
     }
   </ul>
 )
}
