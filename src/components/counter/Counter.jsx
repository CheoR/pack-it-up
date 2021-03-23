import React, { useState } from "react"
import { useHistory, useLocation } from "react-router"

import "./counter.css"


export const Counter = ({ createType }) => {
 const [num, setNum] = useState(1)

 /* User should not be able to create <= 0 */
 const history = useHistory()
 const location = useLocation()

 const decrementNum = () => num ? setNum(num - 1) : setNum(1) 
 const incrementNum = () => setNum(num + 1)

 const callCreate = () => {
  console.log(`calling fetch ${num} times current location is ${location.pathname}`)
  const createCalls = []
  for(let i=0; i <  num; i ++) {
   createCalls.push(createType.callAdd(createType.type))
  }
  Promise.all(createCalls).then(()=> { console.log(`${num} create`)})
  /*
   history.push should be called after number of types have been created.
  */
  // createType.callAdd(createType.type).then(() => history.push(location.pathname))
 }


 return (
  <section className="counter">
   <div className="counter__count">
    <button className="counter__decrement" onClick={decrementNum}>-</button>
    <div className="counter__num" value={num}>{ num }</div>
    <button className="counter__increment" onClick={incrementNum}>+</button>
   </div>
   <button id="btn--add" className="counter__add" onClick={callCreate}>add</button>
  </section>
 )
}
