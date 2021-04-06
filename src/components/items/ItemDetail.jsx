import React, { useContext, useEffect, useRef, useState } from "react"
import { NavLink, useHistory, useParams } from "react-router-dom"

import { userStorageKey } from "../auth/authSettings"
import { BoxContext } from "../boxes/BoxProvider"
import { ItemContext } from "./ItemProvider"
import styles from "./itemDetail.module.css"
import { Delete } from "../helpers/buttons/Buttons"


export const ItemDetail = () => {

  const { boxes, getBoxes, setBoxes } = useContext(BoxContext)
  const { items, getItems, updateItem, deleteItem } = useContext(ItemContext)
  
  const loggedInUserId = parseInt(sessionStorage.getItem(userStorageKey))
  const [ isLoaded, setIsLoaded ] = useState(false)
  const [ hasSaved, setHasSaved ] = useState(false)
  const [ item, setItem ] = useState({})
  const [ formField, setFormField ] = useState({
  "userId": loggedInUserId,
  "boxId": 0,
  "description": "",
  "value": 0,
  "isFragile": true,
  "imagePath": "",
})

  const history = useHistory()
  const { itemId } = useParams()
  const [ selected, setSelected ] = useState("")
  const imgInputFile = useRef(null) 
  const [ imgState, setImgState ] = useState({
    imageUrl: null,
    imageAlt: null,
  })

 useEffect(() => {
  getBoxes()
   .then(getItems)
   .then(() => setIsLoaded(true))
 }, []) // useEffect


 useEffect(() => {
   /*
    To display boxes/items assoicated with user.
   */
  if(isLoaded && boxes) {
    setBoxes(boxes.filter(box => box.userId === loggedInUserId))
    setItem(items.find(item => item.id === parseInt(itemId)))
    const item = items.find(item => item.id === parseInt(itemId))
    const box = boxes.find(box => item.boxId === box.id)

    setSelected(box.location)
    setFormField({
        "id": item?.id,
        "userId": loggedInUserId,
        "boxId": item?.boxId,
        "description": item?.description,
        "value": item?.value,
        "isFragile": item?.isFragile,
        "imagePath": item?.imagePath
      })
  } // if
    if(hasSaved) {
    window.alert("Updated")
  }
 }, [items, isLoaded])


 const handleDelete = ( event ) => {
   event.preventDefault()
   deleteItem(item?.id).then(() => history.push("/items"))
 }
 
   const handleControlledInputChange = ( event ) => {
    const newformField = { ...formField }
    newformField[event.target.id] = event.target.value
    newformField.value = parseInt(newformField.value) || 0
    setFormField(newformField)
    setHasSaved(false)
} // handleControlledInputChange

const submitUpdate = ( event ) => {
  event.preventDefault()
  const newformField = { ...formField }

  /*
    Cleanup. Does not belong to ERD.
  */

  updateItem(newformField)
  setHasSaved(true)
} // updateMove


 const handleControlledDropDownChange = ( event ) => {
  const newformField = { ...formField }
  newformField[event.target.id] = event.target.value

  setSelected(event.target.value)
  
  const selectedIndex = parseInt(event.target.options.selectedIndex)
  const optionId = event.target.options[selectedIndex].getAttribute('boxid')
  
  newformField.boxId = parseInt(optionId)

  /*
    Remove attributes not matching ERD.
  */
  delete newformField["container__dropdown"]
  setFormField(newformField)
  setHasSaved(false)
 }

  const handleCheckboxChange = ( event ) => {
    const newformField = { ...formField }
    newformField[event.target.id] = event.target.checked
    setFormField(newformField)   
  }

  const handleImageUpload = ( event ) => {
    event.preventDefault()
    imgInputFile.current.click()
    
  } // handleImageUpload
  
  const imageInputChange = ( event ) => {
    event.stopPropagation()
    event.preventDefault()

    const file = event.target.files[0];


    const formData = new FormData();
    formData.append('file', file) // files[0]);
    formData.append('upload_preset', 'packItUp__upload');

    const options = {
      method: 'POST',
      body: formData,
    };

    return fetch('https://api.Cloudinary.com/v1_1/cheor/image/upload', options)
    .then(res => res.json())
    .then(res => {
      setImgState({
        imageUrl: res.secure_url,
        imageAlt: res.original_filename,
      })
      const newformField = { ...formField }

      newformField.imagePath = res.secure_url
      setFormField(newformField)
    })
    .catch(err => console.log(err));
  } // imageInputChange


 return (<>
    {
      isLoaded
      ? 
      <main className={styles.container}>
        <div className={styles.container__image_container}>
          { item?.imagePath && (
            <img className={styles.container__image} src={item?.imagePath} alt={`Picture of ${item.description}`}  />
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
            value={formField.description}
            onChange={(e) => {handleControlledInputChange(e)}}
            autoFocus />

            <label className={styles.valueLabel} htmlFor="location">Value: </label>
            <input 
            type="text" 
            id="value" 
            name="value"
            className={styles.formControl}
            placeholder="Add Item value ..."
            value={formField.value}
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
            <input type="checkbox" id="isFragile" onChange={handleCheckboxChange} checked={formField.isFragile}  className={styles.formControl} />
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
