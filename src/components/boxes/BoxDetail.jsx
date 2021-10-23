/* eslint-disable */
import React, { useContext, useEffect, useState } from 'react';
import { NavLink, useLocation, useHistory, useParams } from 'react-router-dom';

import { MoveContext } from '../moves/MoveProvider';
import { BoxContext } from './BoxProvider';
import { ItemContext } from '../items/ItemProvider';

import styles from './boxDetail.module.css';
console.log('BEFORE BOX DETAIL LOADS');
export const BoxDetail = () => {

  const { getItemByItemId, updateItem } = useContext(ItemContext);
  const { moves, getMovesByUserId } = useContext(MoveContext);
  const { getBoxByBoxId, updateBox, deleteBox } = useContext(BoxContext);

  const [isLoading, setIsLoading] = useState(true);
  const [hasSaved, setHasSaved] = useState(false);
  const [selected, setSelected] = useState('');
  const [boxDetail, setBoxDetail] = useState({});

  const location = useLocation();
  const history = useHistory();
  let { boxId } = useParams();
  console.log(`start of BoxDetail , isLoading: ${isLoading}`);

  /*
    In case user does a hard refresh, otherwise app will error out due to missing boxId.
  */
  boxId = parseInt(boxId, 10) || parseInt(location.pathname.split('/')[2], 10);

  const aggregateBoxInfo = (_box) => {
    console.log(`aggregateBoxInfo, isLoading: ${isLoading}`);
    // const _box = { ...boxDetail };

    console.log('aggregateBoxInfo box before ');
    console.table(_box);
    _box.totalItemsCount = _box.items?.length;
    _box.totalItemsValue = _box.items?.map((item) => item.value)
      .reduce((acc, curr) => acc + curr, 0);
    _box.isFragile = _box.items?.some((item) => item.isFragile);
    console.log('aggregateBoxInfo box after');
    console.table(_box);
    setBoxDetail(_box);
    // return new Promise((resolve, reject) => {
    //   resolve(true);
    //   reject(() => new Error('aggregateBoxInfo something went wrong'));
    // });
  }; // aggregateMoveInfo

  const handleControlledDropDownChange = (event) => {
    console.log(`handleControlledDropDownChange, isLoading: ${isLoading}`);
    const _box = { ...boxDetail };

    _box[event.target.id] = event.target.value;

    const selectedIndex = parseInt(event.target.options.selectedIndex, 10);
    const optionId = parseInt(event.target.options[selectedIndex].getAttribute('moveid'), 10);

    console.log('handleControlledDropDownChange');
    console.log('_box ');
    console.table(_box);
    console.log(` selectedIndex: ${selectedIndex}\noptionId:${optionId}`);

    /*
      Default 1st move if no selection made.
      No select results in parseInt(optionId) is null.
    */
    setSelected(event.target.value);
    _box.moveId = parseInt(optionId, 10) || moves[0].id;
    setBoxDetail(_box);
    setHasSaved(false);
  }; // handleControlledInputChange

  const submitUpdate = (event) => {
    event.preventDefault();
    console.log(`submitUpdate, isLoading: ${isLoading}`);
    const _box = { ...boxDetail };
    const id = _box.move.id;
    const itemIds = _box.items.map((item) => item.id);

    Promise.all(itemIds.map((id) => getItemByItemId(id)))
      .then((objs) => {
        Promise.all(obj.forEach((obj) => {
          obj.moveId = _box.moveId;
          delete obj.box;
          updateItem(obj);
        }))
      })
      .catch((err) => console.error(`Promise.all Error: ${err}`));
    /*
    Cleanup. Does not belong to ERD.
    */
    delete _box.totalItemsCount;
    delete _box.totalItemsValue;
    delete _box.usersMoves;
    delete _box.isFragile
    delete _box.items;
    delete _box.move;

    updateBox(_box);

    setHasSaved(true);
  }; // updateMove

  const handleDelete = (event) => {
    event.preventDefault();
    deleteBox(boxDetail?.id).then(() => history.push('/boxes'));
  };

  const handleControlledInputChange = (event) => {
    console.log(`handleControlledInputChange, isLoading: ${isLoading}`);
    const _box = { ...boxDetail };

    _box[event.target.id] = event.target.value;

    setBoxDetail(_box);
    setHasSaved(false);
  }; // handleControlledInputChange

  useEffect(() => {
    console.log(`use effect 1 loaded, isLoading: ${isLoading}`);
    setIsLoading(true);
    getBoxByBoxId(boxId)
      .then((_box) => {
        console.log('current box');
        console.table(_box);
        // setBoxDetail(_box);
        // .then(() => aggregateBoxInfo())
        aggregateBoxInfo(_box);
      })
      .then(() => setSelected(boxDetail?.move?.moveName))
      .then(getMovesByUserId)
      .then(() => setIsLoading(false))
      .catch((err) => console.error(`useEffect Error: ${err}`));
  }, []);


//   Hello everybody, i was wondering if I can get some help on my thought process why this is no working. 
// Issue is with setState as part of a then chain inside a useEffect. 

// There's more to this file but it's not important. 

// Things to note:

// 1. fetchBoxById successfully fetches the box object by id.
// 2. setBox fails to update the box state
// 3. callFuncThatDoesStuffWithBoxData fails to mutate box since box state never updated before being called

// I see that 

// then

//  returns resolved/rejected values in a new promise, so I don't mind that 

// setBox

//  returns undefined. 
// I just can't figure out why box's value is not set before 

// callFuncThatDoesStuffWithBoxData

//  runs. 

// const [box, setBox] = useState({});
// const { boxId } = useParams();

// const callFuncThatDoesStuffWithBoxData = () => {
//   const updateBox = { ...box };
//   update fields for updateBox
//   add extra fields to updateBox
//   setBox(updateBox);
// }

// useEffect(() => {
//   setIsLoading(true);
//   fetchBoxById(boxId)
//     .then(setBox)
//     .then(callFuncThatDoesStuffWithBoxData)
//     .finally(setIsLoading(false))
//     .catch((err) => console.err(`Hey, look at this error: ${err.message}`);
// }, []);

// if (isLoading) return <>Loading Box Detail. . </>;

// return (
//   <div>
//     <other stuff here />
//   </div>
// )


  // useEffect(() => {
  //   async function fetchData() {
  //     try {
  //       setIsLoading(true);
  //       const box = await getBoxByBoxId(boxId);
  //       console.log('box ------------ box');
  //       console.table(box);
  //       console.log('box ------------ box');
  //       await setBoxDetail(box);
  //       console.log('box detail set 1');
  //       console.table(boxDetail);
  //       await aggregateBoxInfo();
  //       console.log('box detail set 2');
  //       console.table(boxDetail);
  //     } catch (err) {
  //       console.error(`useEffect Error: ${err}`)
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   }
  //   fetchData();
  // }, []);

  // useEffect(() => {
  //   setIsLoading(true);
  //   getBoxByBoxId(boxId)
  //     .then((_box) => setBoxDetail((prevState, _box) => {
  //       return {
  //         ...prevState,
  //         ..._box,
  //       }
  //     }))
  //     .then(() => aggregateBoxInfo())
  //     .then(() => setSelected(boxDetail?.move?.moveName))
  //     .then(getMovesByUserId)
  //     .then(() => setIsLoading(false))
  //     .catch((err) => console.error(`useEffect Error: ${err}`));
  // }, []);

  // useEffect(() => {
  //   setIsLoading(true);
  //   aggregateBoxInfo()
  //     .then(() => setSelected(boxDetail?.move?.moveName))
  //     .then(getMovesByUserId)
  //     .then(() => setIsLoading(false))
  //     .catch((err) => console.error(`useEffect Error: ${err}`));
  // }, [boxDetail]);

  useEffect(() => {
    console.log(`use effect 2 loaded, isLoading: ${isLoading}`);

    if (hasSaved) {
      window.alert('Updated');
    }
  }, [hasSaved]); // useEffect

  console.log(` end of file before if, isLoading: ${isLoading}`);
  if (isLoading) return <>Loading Box Detail. . </>;
  console.log(`end of file after if isLoading: ${isLoading}`);
  return (
    <section className={styles.container}>
      <div className={styles.imgContainer}>
        <img className={styles.img} src={`https://source.unsplash.com/featured/?${boxDetail?.location}`} alt={`${boxDetail?.location}`} />
      </div>
      <form action="" className={styles.container__form}>
        <fieldset className={styles.container__formGroup}>
          <label className={styles.locationLable} htmlFor="location">Location:
            <input
              type="text"
              id="location"
              name="location"
              className={styles.formControl}
              placeholder="Add boxDetail Location ..."
              value={boxDetail.location}
              onChange={(e) => { handleControlledInputChange(e); }}
            />
          </label>
          <label className={styles.locationLable} htmlFor="value">Value
            <input
              type="text"
              id="value"
              name="value"
              className={styles.formControl}
              placeholder="boxDetail Value"
              value={`$${boxDetail?.totalItemsValue || '0.00'}`}
              disabled
            />
          </label>
          <label className={styles.container__dropdownLabel} htmlFor="usersMoves">Current Move Assignment
            {/* excluding value={selected}
            shows selected move, including it always shows default */}
            <select id="usersMoves" value={selected} className={styles.formControl} onChange={handleControlledDropDownChange} required>
              <option value={boxDetail?.move?.id || 0}>Move</option>
              {moves.map((move) => (
                <option moveid={move.id} key={move.id} value={move.moveName}>
                  {move.moveName}
                </option>
              ))}
            </select>
          </label>
        </fieldset>

        <div className={styles.container__itemCount}>
          <div className={styles.container__itemCount__count}>{boxDetail?.totalItemsCount}</div>
          <div className={styles.container__itemCount__item}>Items</div>
        </div> {/* container__itemCount */}
        <NavLink
          className={styles.container__navlink}
          to={{
            pathname: '/items',
            state: {
              boxDetail: parseInt(boxId, 10),
            },
          }}>
          <button type="button" id="btn--edit-items" className={styles.container__navlinkBtn}>add/update items</button>
        </NavLink>
        <NavLink to={`/moves/${boxDetail?.moveId}`} className={styles.container__navlink__view}>
          <button type="button" id="btn--viewMove" className={styles.container__navlinkBtn__view}>view move</button>
        </NavLink>

        <fieldset className={styles.fragile__checkbox}>
          <label className={styles.fragile__checkboxLabel} htmlFor="isFragile">Fragile
            <input type="checkbox" id="isFragile" checked={boxDetail?.isFragile} className={styles.formControl} readOnly />
          </label>
        </fieldset>

        <button type="submit" className={styles.container__btn__submit} onClick={submitUpdate}>Update</button>
        <button type="button" className={styles.container__btn__delete} onClick={handleDelete} id={`btn--delete-${boxDetail?.id}`}>Delete</button>
      </form>
    </section>
  );
};
console.log('AFTER BOXDETAIL LOADS');
