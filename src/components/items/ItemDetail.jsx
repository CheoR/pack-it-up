import React, { useContext, useEffect, useState, useRef } from 'react';
import { NavLink, useHistory, useLocation, useParams } from 'react-router-dom';

import { BoxContext } from '../boxes/BoxProvider';
import { ItemContext } from './ItemProvider';

import styles from './itemDetail.module.css';

export const ItemDetail = () => {
  const { boxes, getBoxesByUserId } = useContext(BoxContext);
  const { getItemByItemId, deleteItem, uploadItemImage, updateItem } = useContext(
    ItemContext
  );

  const [isLoading, setIsLoading] = useState(true);
  const [hasSaved, setHasSaved] = useState(false);
  const [selected, setSelected] = useState('');
  const [item, setItemDetail] = useState({});

  const imgInputFile = useRef(null);
  const location = useLocation();
  const history = useHistory();
  let { itemId } = useParams();

  /*
    In case user does a hard refresh, otherwise app will error out due to missing itemId.
  */
  itemId = parseInt(itemId, 10) || parseInt(location.pathname.split('/')[2], 10);

  const handleControlledDropDownChange = (event) => {
    const selectedIndex = parseInt(event.target.options.selectedIndex, 10);

    /*
      User should not be able to select label.
    */
    if (!selectedIndex) return;

    const updatedBoxId = parseInt(event.target.options[selectedIndex].getAttribute('boxid'), 10);

    console.log(` selectedIndex: ${selectedIndex}\nupdatedBoxId: ${updatedBoxId}\nvalue: ${event.target.value}`);
    const _box = boxes.find((box) => box.id === updatedBoxId);

    const newItem = { ...item };

    newItem.boxId = parseInt(updatedBoxId, 10);
    newItem.moveId = parseInt(_box.moveId, 10);

    setSelected(event.target.value);
    setItemDetail(newItem);

    setHasSaved(false);
  }; // handleControlledDropDownChange

  const handleCheckboxChange = (event) => {
    const newformField = { ...item };
    newformField[event.target.id] = event.target.checked;
    setItemDetail(newformField);
    setHasSaved(false);
  }; // handleCheckboxChange

  const imageInputChange = (event) => {
    event.stopPropagation();
    event.preventDefault();

    const file = event.target.files[0];
    const formData = new FormData();

    formData.append('file', file); // files[0]);
    formData.append('upload_preset', 'packItUp__upload');

    uploadItemImage(formData)
      .then((res) => {
        const newItem = { ...item };
        // res.original_filename,
        newItem.imagePath = res.secure_url;

        setItemDetail(newItem);
        setHasSaved(false);
      })
      .catch((err) => console.log(err));
  }; // imageInputChange

  const handleImageUpload = (event) => {
    event.preventDefault();
    imgInputFile.current.click();
  }; // handleImageUpload

  const submitUpdate = (event) => {
    event.preventDefault();
    const newItem = { ...item };
    /*
    Remove attributes not matching ERD.
    */
    delete newItem.hasAssociatedMove;
    delete newItem.hasAssociatedBox;
    delete newItem.box;

    updateItem(newItem);
    setHasSaved(true);
  }; // updateMove

  const handleDelete = (event) => {
    event.preventDefault();
    deleteItem(item.id).then(() => history.push('/items'));
  }; // handleDelete

  const handleControlledInputChange = (event) => {
    const newItem = { ...item };

    newItem[event.target.id] = event.target.value;
    newItem.value = parseInt(newItem.value, 10) || 0;

    setItemDetail(newItem);
    setHasSaved(false);
  }; // handleControlledInputChange

  useEffect(() => {
    setIsLoading(true);
    getItemByItemId(itemId)
      .then((_item) => setItemDetail(_item))
      .then(getBoxesByUserId)
      .then(() => setSelected(item?.box?.location))
      .then(() => setIsLoading(false))
      .catch((err) => console.error(`useEffect Error: ${err}`));
  }, []); // useEffect

  useEffect(() => {
    if (hasSaved) {
      window.alert('Updated');
    }
  }, [hasSaved]); // useEffect

  if (isLoading) return <>Loading Item Detail. . </>;

  return (
    <section className={styles.container}>
      <div className={styles.imgContainer}>
        { item.imagePath && (
          <img className={styles.img} src={item.imagePath} alt={`${item.description}`} />
        )}
      </div>
      <form className={styles.container__form}>
        <fieldset className={styles.container__formGroup}>
          <label className={styles.descriptionLabel} htmlFor="location">Description:
            <input
              type="text"
              id="description"
              name="description"
              className={styles.formControl}
              placeholder="Add Item Description ..."
              value={item.description}
              onChange={(e) => { handleControlledInputChange(e); }}
            />
          </label>

          <label className={styles.valueLabel} htmlFor="location">Value:
            <input
              type="text"
              id="value"
              name="value"
              className={styles.formControl}
              placeholder="Add Item value ..."
              value={item.value}
              onChange={(e) => { handleControlledInputChange(e); }}
            />
          </label>

          <label className={styles.container__dropdownLabel} htmlFor="container__dropdown">Current Box Assignment
            <select value={selected} id="container__dropdown" className={styles.formControl} onChange={handleControlledDropDownChange} required>
              <option value={item?.box?.id || 0}>Select Box</option>
              {boxes.map((_box) => (
                <option boxid={_box.id} key={_box.id} value={_box.location}>
                  {_box.location}
                </option>
              ))}
            </select>
          </label>

          <NavLink to={`/boxes/${item.boxId}`} className={styles.container__navlink}>
            <button type="button" id={`btn--view-${item.boxId}`} className={styles.container__navlinkBtn}>View Box Assgined</button>
          </NavLink>
        </fieldset>

        <fieldset className={styles.fragile__checkbox}>
          <label className={styles.fragie__checkboxLabel} htmlFor="isFragile">Fragile
            <input type="checkbox" id="isFragile" onChange={handleCheckboxChange} checked={item.isFragile} className={styles.formControl} />
          </label>
        </fieldset>

        {/* <div className="form-group">
        accept="image/*;capture=environment"
        <input id={`imageForItemId--${item.id}`} className={styles.imgInputFile} type="file"
          ref={imgInputFile} onChange={imageInputChange} />
        </div> */}
        <input className={styles.imgInputFile} id={`imageForItemId--${item.id}`} type="file" ref={imgInputFile} onChange={imageInputChange} />
        <button className={styles.container__btn__camera} type="button" id="camera" onClick={handleImageUpload}>Camera</button>
        <button className={styles.container__btn__submit} type="submit" id={`btn--update-${item.id}`} onClick={submitUpdate}>Update</button>
        <button className={styles.container__btn__delete} type="button" id={`btn--delete-${item.id}`} onClick={handleDelete}>Delete</button>
      </form>
    </section>
  );
};
