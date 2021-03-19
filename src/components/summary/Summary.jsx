import React from "react"
import { Link } from "react-router-dom"

import "./summary.css"


export const Summary = ({ data } ) => {

 return (
  <section className="summary">
   <div className="summary__dataLength">{ data.collection.length }</div>
   <div className="summary__buttons">
    <h2 className="summary__moveType">{ data.type }</h2>
    <Link to="/"><button className="summary__linkBtn--view" >View</button></Link>
    <Link to="/"><button className="summary__linkBtn--edit" >Edit</button></Link>
    <Link to="/"><button className="summary__linkBtn--delete" >Delete</button></Link>
   </div>
  </section>
 )
}
