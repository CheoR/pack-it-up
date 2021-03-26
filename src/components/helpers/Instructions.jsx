import React from "react"

import "./instructions.css"

export const Instructions = () => {
 return (
 <section className="summaryList__instructions">
 <h3 className="summaryList__instructions--header">Instructions</h3>
  <p className="summaryList__instructions--text">1. Create at least one move before adding boxes.</p>
  <p className="summaryList__instructions--text">2. Create at least one box before adding items.</p>
  <p className="summaryList__instructions--text">3. Create items.</p>
  <p className="summaryList__instructions--text">After creation, you are free to reassign items, boxes.</p>
 </section>
 )
}
