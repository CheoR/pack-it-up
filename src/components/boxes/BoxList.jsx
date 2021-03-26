import React, { useContext, useEffect, useState } from "react"
import { useHistory } from "react-router"

import { userStorageKey, userStorageUserName } from "../auth/authSettings"
import { MoveContext } from "../moves/MoveProvider"
import { BoxContext } from "./BoxProvider"
import { ItemContext } from "../items/ItemProvider"
import { BoxSummary } from "./BoxSummary"
import { Counter } from "../counter/Counter"
import "./boxList.css"


const _getSum = ( valueList ) => {
 /*
  Using .reduce on list of objects results with incorrect sum values.
 */

 if(!valueList.length) return 0;

 const numList = valueList.map(item => item.value)

 return numList.reduce((acc, curr) => acc + curr, 0)
}


export const BoxList = () => {

  const loggedInUserId = parseInt(sessionStorage.getItem(userStorageKey))
  const loggedInUserName = sessionStorage.getItem(userStorageUserName)
  const { moves, getMoves, setMoves } = useContext(MoveContext)
  const { boxes, getBoxes, addBox } = useContext(BoxContext)
  const { items, getItems } = useContext(ItemContext)
  const [ isLoaded, setIsLoaded ] = useState(false)
  const [ newBox, setNewBox ] = useState({})
  const history = useHistory()

  useEffect(() => {
    getMoves()
    .then(getBoxes)
    .then(getItems)
    .then(() => setIsLoaded(true))
 }, []) // useEffect


 useEffect(() => {
  if(isLoaded) {
    setNewBox(  {
      type: {
        "userId": loggedInUserId,
        "moveId": 0,
        "location": "Change Box Location",
        "qrCode": ""
      },
      addObj: addBox
    })
  } // if
 }, [isLoaded])


  const userMoves = moves.filter(move => move.userId === loggedInUserId)
  const boxesData = boxes.filter(box => box.userId === loggedInUserId)
  const itemsData = items.filter(item => boxesData.find(box => item.boxId === box.id))

  /*
    Boxes should aggregate information about its contents.
  */
  boxesData.forEach(box => {
   box.totalCount = itemsData.filter(item => item.boxId === box.id).length
   box.totalValue = _getSum(itemsData.filter(item => item.boxId === box.id ? item.value : 0))
   box.isFragile = itemsData.some(item => item.isFragile ? true : false)
   box.moveName = box?.move?.moveName// movesData.find(move => move.id === box.moveId).moveName
  }) // boxes.forEach

  const handleControlledInputChange = ( event ) => {
    /*
      moveid - moveId, not option value.
    */    
    const selectedIndex = parseInt(event.target.options.selectedIndex)
    const optionId = event.target.options[selectedIndex].getAttribute('moveid')
    const updateBox = { ...newBox}
    updateBox.type.moveId = parseInt(optionId)
    setNewBox(updateBox)
  } // handleControlledInputChange

   return (<>
     { isLoaded
      ? <div className="boxSummaryList">
      <h1 className="boxSummaryList__header">{ loggedInUserName }'s Boxes</h1>
      {
        boxesData.map((box, i) => <BoxSummary key={i} box={ box } />)
      }
      <label htmlFor="usersMoves">Assign To Move</label>

      <select value={userMoves[0]?.id} id="usersMoves" className="form-control" onChange={handleControlledInputChange}>
        <option value="0">Select a location</option>
        {
          userMoves.map(move => (
            <option moveid={move.id} key={move.id} value={move.moveName}>{move.moveName}</option>
          ))
        }
      </select>

      <Counter objType={newBox} />
    </div>
      : <>Loading . . </>
     }

  </>) // return
}


