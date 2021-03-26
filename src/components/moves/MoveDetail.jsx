import React, { useContext, useEffect, useState } from "react"
import { Link, useHistory, useParams } from "react-router-dom"

import { userStorageKey } from "../auth/authSettings"
import { ItemContext } from "../items/ItemProvider"
import { MoveContext } from "./MoveProvider"
import { BoxContext } from "../boxes/BoxProvider"
import "./moveDetail.css"


const _getSum = ( valueList ) => {
 /*
  Using .reduce on list of objects results with incorrect sum values.
 */

 if(!valueList.length) return 0;

 return valueList.reduce((acc, curr) => acc + curr, 0)
}

export const MoveDetail = () => {

  const { moves, getMoves, updateMove, deleteMove } = useContext(MoveContext)
  const { boxes, getBoxes } = useContext(BoxContext)
  const { items, getItems } = useContext(ItemContext)
  const [ isLoaded, setIsLoaded ] = useState(false)
  const [ hasSaved, setHasSaved ] = useState(false)
  const [ move, setMove ] = useState({})
  const [ formField, setFormField ] = useState({
    moveName: ""
  })
  
  const handleDelete = () => deleteMove(move?.id).then(() => history.push("/moves"))
  const loggedInUserId = parseInt(sessionStorage.getItem(userStorageKey))

  const { moveId } = useParams()
  const history = useHistory()


  useEffect(() => {
    getMoves()
      .then(getBoxes)
      .then(getItems)
      .then(() => setIsLoaded(true))
  }, [])


  useEffect(() => {
    const tmpMove = moves.find(move => move.id === parseInt(moveId))
    if(tmpMove) {
      /*
        Aggregate number of boxes for this move, total value, and if anything is fragile.
      */
      const userBoxesIds = boxes.filter(box => box?.moveId === move?.id).map(box => box?.id)
      const userItems = items.filter(item => userBoxesIds.includes(item?.boxId))

      tmpMove.totalValue = _getSum(userItems.map(item => item.value ? item.value : 0))
      tmpMove.isFragile = userItems.some(item => item.isFragile)
      tmpMove.totalBoxes = userBoxesIds.length

      setFormField(tmpMove)
    }
    if(hasSaved) {
      window.alert("Updated")
    }
  }, [isLoaded, hasSaved])

  const handleControlledInputChange = ( event ) => {
    const newformField = { ...formField }
    newformField[event.target.id] = event.target.value
    setFormField(newformField)
    setHasSaved(false)
} // handleControlledInputChange

const submitUpdate = (event) => {
  event.preventDefault()
  const newformField = { ...formField }

  /*
    Cleanup. Does not belong to ERD.
  */
  delete newformField.user
  delete newformField.totalValue
  delete newformField.isFragile
  delete newformField.totalBoxes

  updateMove(newformField)
    .then(() => setHasSaved(true))
} // updateMove


 return (<>
   {
     isLoaded
     ? 
      <form action="" className="moveDetailForm">
        <fieldset className="form-group">
          <label className="moveNameLabel" htmlFor="moveName">Move Name: </label>
          <input 
          type="text" 
          id="moveName" 
          name="moveName"
          className="form-control" 
          placeholder="Add Move Name..."
          value={formField.moveName}
          onChange={(e) => {handleControlledInputChange(e)}}
          autoFocus />
        </fieldset>
        <div className="moveDetail__value">
          <div>Value</div>
          <div className="moveDetail__value--value">${ move.totalValue ? move.totalValue : "0.00" }</div>
        </div> {/* moveDetail__value */}
        <div className="moveDetail__boxSummary">
          <div className="moveDetail__boxCount">
            <div className="moveDetail__boxCount__count">{ move.totalBoxes ? move.totalBoxes : "0"}</div>
            <div>Boxes</div>
          </div>
          <Link to={`/boxes`}>
            <button id={`btn--edit-boxes`} className="moveDetail__linkBtn--edit">add/update boxes</button>
          </Link>
        </div>{/** moveDetail__boxSummary */}

        <div className="lowerRow">
          <div className="fragile">
            <p>Fragile</p>
            <div className="checkBox">{ move.isFragile ? "X" : ""}</div>
          </div>
          <button className="btn--submit-moves" type="submit" onClick={submitUpdate}>Update</button>
          <button id={`btn--delete-${move?.id}`} className="move__linkBtn--delete" onClick={handleDelete} >Delete</button>
        </div> {/* lowerRow */}
      </form>
     : <> loading. . </>
   }
 </>)
}
