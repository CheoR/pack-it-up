import React from "react"
import { Link } from "react-router-dom"

import "./summary.css"


export const Summary = ({ listType }) => {

 return (
  <section className="summary">
   <div className="summary__dataLength">{ listType.data.collection.length }</div>
   <div className="summary__buttons">
    <h2 className="summary__moveType">{ listType.data.type }</h2>
    <Link to={`/${listType.data.type}`}><button className="summary__linkBtn--view" >View</button></Link>
    <Link to="/"><button className="summary__linkBtn--delete" >Delete</button></Link>
   </div>
  </section>
 )
}
