import React, { useContext, useEffect, useState } from "react"
import { Link, NavLink, useHistory, useParams } from "react-router-dom"

import { ItemContext } from "../items/ItemProvider"
import { MoveContext } from "./MoveProvider"
import { BoxContext } from "../boxes/BoxProvider"
import styles from "./moveDetail.module.css"


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
    moveName: "",
    userId: 0,
    totalValue: 0,
    isFragile: false,
    totalBoxes: 0
  })


  const handleDelete = () => deleteMove(move?.id).then(() => history.push("/moves"))
  const { moveId } = useParams()
  const history = useHistory()


  useEffect(() => {
    const getData = async () => {
      const userMoves = await getMoves()
      const userBoxes = await getBoxes()
      const userItems = await getItems()
      setIsLoaded(true)
    }
    getData()
  }, [])


  useEffect(() => {
    /*
      Aggregate number of boxes for this move, total value, and if anything is fragile.
    */
    if(isLoaded) {
      const move = moves.find(move => move.id === parseInt(moveId))
      const userBoxes = boxes.filter(box => box.moveId === move.id)
      const boxIds = userBoxes.map(box => box.id)
      const userItems = items.filter(item => boxIds.includes(item.boxId))

      move.totalBoxes = userBoxes.length
      move.totalValue = _getSum(userItems.map(item => item.value ? item.value : 0))
      move.isFragile = userItems.some(item => item.isFragile)
      setFormField(move)
    } // if

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

  if (!formField) return null

 return (<>
   {
     isLoaded
     ? 
     <main className={styles.container}>
       <form action="" className={styles.container__form}>
         <fieldset className={styles.container__formGroup}>
          <label className={styles.moveNameLabel} htmlFor="moveName">Move Name: </label>
          <input 
            type="text" 
            id="moveName" 
            name="moveName"
            className={styles.formControl} 
            placeholder="Add Move Name..."
            value={formField.moveName}
            onChange={(e) => {handleControlledInputChange(e)}}
          autoFocus />
          <div className={styles.container__value}>Value</div>
          <div className={styles.container__value__value}>${ formField.totalValue ? formField.totalValue : "0.00" }</div>
         </fieldset>
        <div className={styles.container__boxCount}>
          <div className={styles.container__boxCount__count}>{ formField.totalBoxes ? formField.totalBoxes : "0" }</div>
          <div className={styles.container__boxCount__box}>Boxes</div>
        </div> {/* container__boxCount */}
        <NavLink to={
          {
            pathname: "/boxes",
            state: {
              move: parseInt(moveId)
            }
          }} className={styles.container__navlink}>
          <button id={`btn--edit-boxes`} className={styles.container__navlinkBtn}>add/update boxes</button>
        </NavLink>

        <fieldset className={styles.fragile__checkbox}>
          <label className={styles.fragie__checkboxLabel} htmlFor="isFragile">Fragile</label>
          <input type="checkbox" id="isFragile" checked={formField?.isFragile}  className={styles.formControl} />
        </fieldset>

        <button className={styles.container__btn__submit} type="submit" onClick={submitUpdate}>Update</button>
        <button id={`btn--delete-${move?.id}`} className={styles.container__btn__delete} onClick={handleDelete}>Delete</button>

       </form>
     </main>
     : <> loading. . </>
   }
 </>)
}
