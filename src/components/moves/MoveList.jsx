import React, { useContext, useEffect, useRef, useState } from "react"

import { userStorageKey, userStorageUserName } from "../auth/authSettings"
import { MoveSummary } from "./MoveSummary"
import { MoveContext } from "./MoveProvider"
import { Counter } from "../counter/Counter"

import { useUserData } from "../helpers/useUserData"
import styles from "./moveList.module.css"


export const MoveList = () => {

  const loggedInUserId = parseInt(sessionStorage.getItem(userStorageKey))
  const loggedInUserName = sessionStorage.getItem(userStorageUserName)

  const [ data, pendingData, setPendingData, error ] = useUserData()
  const [ isLoading, setIsLoading ] = useState(true)
  const [ formField, setFormField ] = useState({})
  
  const inputRef = useRef()
  

  useEffect(() => {
    console.log("MoveList -   2nd useEffect - only calling once")
    
    if(pendingData) return
    if(!pendingData) {
      console.log("not pending")
        setFormField({
          type: {
            "userId": loggedInUserId,
            "moveName": "New Move"
          },
          create: data.add.move,
          resetInputRef: inputRef,
          resetPending: setPendingData
        })
        setIsLoading(false)
      } // if

    }, [ pendingData ]) // useEffect
  


  const handleControlledInputChange = ( event ) =>  {

    const newformField = { ...formField }
  
    newformField.type[event.target.id] = inputRef.current.value // event.target.value
    setFormField(newformField)
  } // handleControlledInputChange

  console.log(data)
  /*
    Problem is on add, page is not calling a fresh call to getMoves and is returning stale data.
  */
   return (<>
     {
      !isLoading
       ?
      <main className={styles.summary}>
        <h1 className={styles.summary__header}>{ loggedInUserName === undefined ? "User" : loggedInUserName }'s Moves</h1> 
        {
          data.type.move.map((move, i) => <MoveSummary key={i} move={ move } />)
        }
        <form action="" className="summary__form">
          <fieldset className={styles.summary__formGroup}>
            <label className={styles.moveNameLabel} htmlFor="moveName">Move Name: </label>
            <input 
            type="text" 
            id="moveName" 
            name="moveName"
            ref={inputRef}
            className={styles.formControl}
            placeholder="Add Move Name..."
            // value={formField.type.moveName}
            onChange={(e) => {handleControlledInputChange(e)}}
            autoFocus />
          </fieldset>
        </form>
      <Counter objType={formField} />
    </main>
       : <>Loading</>
     }
  </>)
}
