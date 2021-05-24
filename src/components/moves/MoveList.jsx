import React, { useContext, useEffect, useRef, useState } from "react"

import { userStorageKey, userStorageUserName } from "../auth/authSettings"
import { useFilteredData } from "../helpers/useFilterdData"
import { MoveSummary } from "./MoveSummary"
import { MoveContext } from "./MoveProvider"
import { Counter } from "../counter/Counter"

import styles from "./moveList.module.css"

let renderCount = 1

export const MoveList = () => {

  // const { moves, addMove } = useFilteredData()
  const { moves, getMovesByUserId, addMove } = useContext(MoveContext)
  
  const [ isLoading, setIsLoading ] = useState(true)
  const [ formField, setFormField ] = useState({})
  const [ userInfo, setUserInfo ] = useState({
    loggedInUserId: 0,
    loggedInUserName: ""
  })

  const inputRef = useRef()
  
    // console.log(" print location 1 ")
    // console.table(moves)
    // console.log(Array.isArray(moves))

    useEffect(() => {
      // console.log(" euseeffect 1 i only only logg once")
      const loggedInUserId = parseInt(sessionStorage.getItem(userStorageKey))
      const loggedInUserName = sessionStorage.getItem(userStorageUserName)
    
      setUserInfo({
        loggedInUserId: loggedInUserId, 
        loggedInUserName: loggedInUserName
      })

      setFormField({
        type: {
          "userId": loggedInUserId,
          "moveName": "New Move"
        },
        addObj: addMove,
        resetInputRef: inputRef
      })
    }, [ ]) // useEffect
  
  useEffect(() => {
          // console.log(" euseeffect 2 i only only logg once")

    getMovesByUserId()
    // console.log("===================")
    // console.log(" ipre location in use effect")
    // console.table(moves)
    // console.log(Array.isArray(moves))
    // console.log("===================")
    
    // console.log(`vlue is ${userInfo.loggedInUserName}`)
    setIsLoading(false)
  }, [ ]) // useEffect
  

    // console.log(" print location 2 ")
    // console.table(moves)
    // console.log(Array.isArray(moves))

  const handleControlledInputChange = ( event ) =>  {
    /*
      TODO: Form needs to clear aroud after submission.
    */
    const newformField = { ...formField }
    newformField.type[event.target.id] = inputRef.current.value // event.target.value

    // console.log("current formfield")
    // console.table(newformField)
    setFormField(newformField)
  } // handleControlledInputChange

  if(isLoading) return <div>Loading</div>
  //  console.log(`renderCount: ${renderCount}`)
   renderCount = renderCount + 1
  
  
    // console.log(" print location 3 ")
    // console.table(moves)
    // console.log(Array.isArray(moves))

   return (<>
     {
       !isLoading && moves
       ?
      <main className={styles.summary}>
        <h1 className={styles.summary__header}>{ userInfo.loggedInUserName === undefined ? "User" : userInfo.loggedInUserName }'s Moves</h1>
        {
          moves.map((move, i) => <MoveSummary key={i} move={ move } />)
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
