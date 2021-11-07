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

  const [dropdownSelection, setDropdownSelection] = useState('');
  const [itemDetail, setItemDetail] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [hasSaved, setHasSaved] = useState(false);

  const imgInputFile = useRef(null);
  const location = useLocation();
  const history = useHistory();
  let { itemId } = useParams();

  /*
    In case user does a hard refresh, otherwise app will error out due to missing itemId.
  */
  itemId = parseInt(itemId, 10) || parseInt(location.pathname.split('/')[2], 10);

  const handleControlledDropDownChange = (event) => {
    const dropdownSelectionIndex = parseInt(event.target.options.selectedIndex, 10);

    /*
      User should not be able to select label.
    */
    if (!dropdownSelectionIndex) return;

    const updatedBoxId = parseInt(event.target.options[dropdownSelectionIndex].getAttribute('boxid'), 10);

    const _box = boxes.find((box) => box.id === updatedBoxId);

    const newitemDetail = { ...itemDetail };

    newitemDetail.boxId = parseInt(updatedBoxId, 10);
    newitemDetail.moveId = parseInt(_box.moveId, 10);

    setDropdownSelection(event.target.value);
    setItemDetail(newitemDetail);

    setHasSaved(false);
  }; // handleControlledDropDownChange

  const handleCheckboxChange = (event) => {
    const newformField = { ...itemDetail };
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
        const newitemDetail = { ...itemDetail };
        // res.original_filename,
        newitemDetail.imagePath = res.secure_url;

        setItemDetail(newitemDetail);
        setHasSaved(false);
      })
      .catch((err) => console.error(err));
  }; // imageInputChange

  const handleImageUpload = (event) => {
    event.preventDefault();
    imgInputFile.current.click();
  }; // handleImageUpload

  const submitUpdate = (event) => {
    event.preventDefault();
    const newitemDetail = { ...itemDetail };
    /*
    Remove attributes not matching ERD.
    */
    delete newitemDetail.hasAssociatedMove;
    delete newitemDetail.hasAssociatedBox;
    delete newitemDetail.box;

    updateItem(newitemDetail);
    setHasSaved(true);
  }; // updateMove

  const handleDelete = (event) => {
    event.preventDefault();
    deleteItem(itemDetail.id)
      .then(() => history.push('/items'));
  }; // handleDelete

  const handleControlledInputChange = (event) => {
    const newitemDetail = { ...itemDetail };

    newitemDetail[event.target.id] = event.target.value;
    newitemDetail.value = parseInt(newitemDetail.value, 10) || 0;

    setItemDetail(newitemDetail);
    setHasSaved(false);
  }; // handleControlledInputChange

  const loadFormFields = (item) => {
    setDropdownSelection(item.box.location);
    setItemDetail(item);
  };

  useEffect(() => {
    setIsLoading(true);
    getBoxesByUserId()
      .then(() => getItemByItemId(itemId))
      .then(loadFormFields)
      .finally(() => setIsLoading(false))
      .catch((err) => console.error(`useEffect Error: ${err}`));
  }, []); // useEffect

  useEffect(() => {
    if (hasSaved) {
      window.alert('Updated');
    }
  }, [hasSaved]); // useEffect

  if (isLoading) return <>Loading itemDetail Detail. . </>;

  return (
    <section className={styles.container}>
      <div className={styles.imgContainer}>
        { itemDetail.imagePath && (
          <img className={styles.img} src={itemDetail.imagePath} alt={`${itemDetail.description}`} />
        )}
      </div>
      <form className={styles.container__form}>
        <fieldset className={styles.container_fieldset}>
          <label className={styles.descriptionLabel} htmlFor="description">Description:
            <input
              type="text"
              id="description"
              name="description"
              className={styles.formControl}
              placeholder="Add Item Description ..."
              value={itemDetail.description}
              onChange={(e) => { handleControlledInputChange(e); }}
            />
          </label>
        </fieldset>
        <fieldset className={styles.container_fieldset}>
          <label className={styles.valueLabel} htmlFor="value">Value:
            <input
              type="text"
              id="value"
              name="value"
              className={styles.formControl}
              placeholder="Add itemDetail value ..."
              value={itemDetail.value}
              onChange={(e) => { handleControlledInputChange(e); }}
            />
          </label>
        </fieldset>
        <fieldset className={styles.container_fieldset}>
          <label className={styles.dropdownLabel} htmlFor="container__dropdown">Box
            <select
              id="container__dropdown"
              className={styles.formControl}
              value={dropdownSelection}
              onChange={handleControlledDropDownChange}
              required
            >
              <option value={itemDetail.box.id || 0}>Select Box</option>
              {boxes.map((_box) => (
                <option boxid={_box.id} key={_box.id} value={_box.location}>
                  {_box.location}
                </option>
              ))}
            </select>
          </label>
        </fieldset>

        <NavLink to={`/boxes/${itemDetail.boxId}`} className={styles.container__navlink}>
          <button type="button" id={`btn--view-${itemDetail.boxId}`} className={styles.container__navlinkBtn}>
            View Box Assgined
          </button>
        </NavLink>

        <div className={styles.buttons}>
          <fieldset className={styles.fragile__checkbox}>
            <label className={styles.fragile__checkboxLabel} htmlFor="isFragile">Fragile
              <input
                type="checkbox"
                id="isFragile"
                checked={itemDetail.isFragile}
                className={styles.checkbox__formControl}
                onChange={handleCheckboxChange}
              />
            </label>
          </fieldset>
          <input className={styles.imgInputFile} id={`imageForItemId--${itemDetail.id}`} type="file" ref={imgInputFile} onChange={imageInputChange} />
          <button className={styles.container__btn__camera} type="button" id="camera" onClick={handleImageUpload}>Camera</button>
          <button className={styles.container__btn__submit} type="submit" id={`btn--update-${itemDetail.id}`} onClick={submitUpdate}>Update</button>
          <button className={styles.container__btn__delete} type="button" id={`btn--delete-${itemDetail.id}`} onClick={handleDelete}>Delete</button>
        </div>
      </form>
    </section>
  );
};
