import React, { useContext, useEffect, useRef, useState } from "react"
import { NavLink, useHistory, useLocation, useParams } from "react-router-dom"

import { userStorageKey } from "../auth/authSettings"
import { BoxContext } from "../boxes/BoxProvider"
import { ItemContext } from "./ItemProvider"

import styles from "./itemDetail.module.css"

const defaultItem = {
  "userId": 0,
  "boxId": 0,
  "description": "loading",
  "value": 0,
  "isFragile": false,
  "imagePath": "loading",
   "box": {
     "id": 0,
     "location": "loading"
   }
}


export const ItemDetail = () => {

  const loggedInUserId = parseInt(sessionStorage.getItem(userStorageKey))

  const { items, getItemsByUserId, updateItem, deleteItem, uploadItemImage } = useContext(ItemContext)
  const { boxes, getBoxesByUserId, setBoxes } = useContext(BoxContext)
  
  const [ isLoaded, setIsLoaded ] = useState(false)
  const [ hasSaved, setHasSaved ] = useState(false)
  const [ item, setItem ] = useState(defaultItem)
  const [ selected, setSelected ] = useState("")

  const imgInputFile = useRef(null) 
  let { itemId } = useParams()
  const location = useLocation()
  const history = useHistory()

  itemId = parseInt(itemId) || parseInt(location.pathname.split("/")[2])


  useEffect(() => {
    getBoxesByUserId()
    .then(getItemsByUserId)
    .then(() => {
      
      // console.log(`ItemId: ${itemId}`)
    /*
      Need boxes in case user wants to reassign the item.
    */
   if(items && boxes) {
    //  console.log('items"')
    //  console.table(items)
    //  console.log("boxes")
    //  console.table(boxes)

     const item = items.find(item => item.id === itemId)
    //  console.log(" item  so far")
    //  console.table(item)
     const box = boxes.find(box => item.boxId === box.id)
 
     setBoxes(boxes.filter(box => box.userId === loggedInUserId))
     setItem(items.find(item => item.id === itemId))
     setSelected(box.location)
     setItem(item)
     setIsLoaded(true)
   }
   })
 }, []) // useEffect

  // useEffect(async () => {
//     const boxesLoaded = await getBoxesByUserId()
//     const itemsLoaded = await getItemsByUserId()

      
//       console.log(`ItemId: ${itemId}`)
//       console.log(`itemsLoaded: ${itemsLoaded}`)
//     /*
//       Need boxes in case user wants to reassign the item.
//     */
//    if(itemsLoaded && boxesLoaded) {
//      console.log('items"')
//      console.table(items)
//      console.log("boxes")
//      console.table(boxes)

//      const item = items.find(item => item.id === itemId)
//      console.log(" item  so far")
//      console.table(item)
//      const box = boxes.find(box => item.boxId === box.id)
//           console.log(" box  so far")
//      console.table(box)
 
//     //  setBoxes(boxes.filter(box => box.userId === loggedInUserId))
//     //  setItem(items.find(item => item.id === itemId))
//     //  setSelected(box.location)
//     //  setItem(item)
//      setIsLoaded(true)
//    }

//   //  return () => {
//   //    setIsLoaded(false)
//   //  }
//  }, []) // useEffect

 useEffect(() => {
  if(hasSaved) {
    window.alert("Updated")
  }
 }, [hasSaved, isLoaded]) // useEffect


 const handleDelete = ( event ) => {
   event.preventDefault()
   deleteItem(item.id).then(() => history.push("/items"))
 } // handleDelete


  const handleImageUpload = ( event ) => {
    event.preventDefault()
    imgInputFile.current.click()
  } // handleImageUpload
 

   const handleControlledInputChange = ( event ) => {
    const newItem = { ...item }

    newItem[event.target.id] = event.target.value
    newItem.value = parseInt(newItem.value) || 0

    setItem(newItem)
    setHasSaved(false)
} // handleControlledInputChange


  const handleCheckboxChange = ( event ) => {
    const newformField = { ...item }

    newformField[event.target.id] = event.target.checked

    setItem(newformField)
    setHasSaved(false) 
  } // handleCheckboxChange


 const handleControlledDropDownChange = ( event ) => {
   const selectedIndex = parseInt(event.target.options.selectedIndex)
   const updatedBoxId = event.target.options[selectedIndex].getAttribute('boxid')
   const newItem = { ...item }

  newItem[event.target.id] = event.target.value
  newItem.boxId = parseInt(updatedBoxId)

  setSelected(event.target.value)
  setItem(newItem)
  setHasSaved(false)
 } // handleControlledDropDownChange


  const imageInputChange = ( event ) => {
    event.stopPropagation()
    event.preventDefault()

    const file = event.target.files[0];
    const formData = new FormData();

    formData.append('file', file) // files[0]);
    formData.append('upload_preset', 'packItUp__upload');

    uploadItemImage(formData)
      .then(res => {
        const newItem = { ...item }
        // res.original_filename,
        newItem.imagePath = res.secure_url

        setItem(newItem)
        setHasSaved(false)
      })
      .catch(err => console.log(err));
  } // imageInputChange


const submitUpdate = ( event ) => {
  event.preventDefault()
  const newItem = { ...item }
  /*
    Remove attributes not matching ERD.
  */
  delete newItem.container__dropdown
  delete newItem.hasAssociatedMove
  delete newItem.hasAssociatedBox
  delete newItem.box

  updateItem(newItem)
  setHasSaved(true)
} // updateMove


 return (<>
    {
      isLoaded
      ? 
      <main className={styles.container}>
        <div className={styles.container__image_container}>
          { item.imagePath && (
            <img className={styles.container__image} src={item.imagePath} alt={`Picture of ${item.description}`}  />
          )}
        </div>
        
        <form action="" className={styles.container__form}>
          <fieldset className={styles.container__formGroup}>

            <label className={styles.descriptionLabel} htmlFor="location">Description: </label>
            <input 
            type="text" 
            id="description" 
            name="description"
            className={styles.formControl} 
            placeholder="Add Item Description ..."
            value={item.description}
            onChange={(e) => {handleControlledInputChange(e)}}
            autoFocus />

            <label className={styles.valueLabel} htmlFor="location">Value: </label>
            <input 
            type="text" 
            id="value" 
            name="value"
            className={styles.formControl}
            placeholder="Add Item value ..."
            value={item.value}
            onChange={(e) => {handleControlledInputChange(e)}}
            autoFocus />

            <label className={styles.container__dropdownLabel} htmlFor="container__dropdown">Current Box Assignment</label>
            <select value={selected} id="container__dropdown" className={styles.formControl} onChange={handleControlledDropDownChange}>
              <option value="0">Select Move</option>
              {boxes.map(box => (
                <option boxid={box.id} key={box.id} value={box.location}>
                  {box.location}
                </option>
              ))}
            </select>

            <NavLink to={`/boxes/${item.boxId}`} className={styles.container__navlink}>
              <button id={`btn--view-${item.boxId}`} className={styles.container__navlinkBtn}>View Box Assgined</button>
            </NavLink>

          </fieldset>

          <fieldset className={styles.fragile__checkbox}>
            <label className={styles.fragie__checkboxLabel} htmlFor="isFragile">Fragile</label>
            <input type="checkbox" id="isFragile" onChange={handleCheckboxChange} checked={item.isFragile}  className={styles.formControl} />
          </fieldset>

            {/* <div className="form-group">
              accept="image/*;capture=environment" 
              <input id={`imageForItemId--${item.id}`} className={styles.imgInputFile} type="file" ref={imgInputFile} onChange={imageInputChange} />
            </div> */}
          <input className={styles.imgInputFile} id={`imageForItemId--${item.id}`} type="file" ref={imgInputFile} onChange={imageInputChange} />

          <button className={styles.container__btn__camera} type="button" id="camera" onClick={handleImageUpload} >Camera</button>
          <button className={styles.container__btn__submit} type="submit" id={`btn--update-${item.id}`} onClick={submitUpdate}>Update</button>
          <button className={styles.container__btn__delete} type="button" id={`btn--delete-${item.id}`} onClick={handleDelete}>Delete</button>

        </form>
      </main> 
      : <>Loading .. </>
    }
  </>)
}
