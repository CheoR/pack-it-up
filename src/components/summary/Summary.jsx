import React from "react"
import { Link } from "react-router-dom"

import "./summary.css"


export const Summary = ({ listType }) => {

 return (
  <section className="summary">
   <h2 className="summary__dataType">{ listType.data.type }</h2>
   <div className="summary__dataLength">{ listType.data.collection.length }</div>
   <div className="summary__btnContainer">
    <Link to={`/${listType.data.type}`}>
      <button className="summary__btn--view" disabled={listType.data.canUse}>
        Add/View
      </button>
    </Link>
   </div>
  </section>
 )
}
