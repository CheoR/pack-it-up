import React, { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { userStorageKey } from '../auth/authSettings';
import { BoxContext } from '../boxes/BoxProvider';
import { ItemContext } from './ItemProvider';
// import { ItemSummary } from './ItemSummary';
// import { Counter } from '../counter/Counter';

// import styles from './itemList.module.css';

export const ItemList = () => {
  const loggedInUserId = parseInt(sessionStorage.getItem(userStorageKey), 10);
  // const loggedInUserName = sessionStorage.getItem(userStorageUserName);
  const { items, getItemsByUserId, addItem } = useContext(ItemContext);
  const { boxes, setBoxes, getBoxesByUserId } = useContext(BoxContext);
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectionMade, setSelectionMade] = useState(false);
  const [newItem, setNewItem] = useState({});
  const location = useLocation();
  console.log(`firt box id: ${boxes[0].id}`);
  const [setSelected] = useState(boxes[0].id || 0);

  useEffect(() => {
    getBoxesByUserId()
      .then(getItemsByUserId)
      .then(() => setIsLoaded(true))
      .then(() => setSelectionMade(false));
  }, []); // useEffect

  useEffect(() => {
    if (isLoaded) {
      /*
      So following references to boxes only pertain to those linked to logged in user.
      */
      const userBoxes = boxes.filter((box) => box.userId === loggedInUserId);
      setBoxes(userBoxes);

      /*
      If user comes from box detail page, assign new items to that box.
      */

      const defaultBoxId = location.state && location.state.box
        ? location.state.box
        : userBoxes[0].id;

      setNewItem({
        type: {
          userId: loggedInUserId,
          boxId: defaultBoxId,
          description: 'Change Item Description',
          value: 0,
          isFragile: false,
          imagePath: '',
        },
        addObj: addItem,
      }); // setNewItem
    } // if
  }, [isLoaded, selectionMade]);

  const itemsData = items.filter((item) => item.userId === loggedInUserId);

  /* eslint-disable no-param-reassign */
  itemsData.forEach((item) => {
    /*
    item.hasAssociatedBox = item.boxId ? true : false
    item.hasAssociatedMove = item?.box.moveId ? true : false
    Neat way to turn number into a boolean
    */
    item.hasAssociatedBox = !!item.boxId;
    item.hasAssociatedMove = !!item?.box?.moveId;
  });

  /* eslint-disable-next-line */
  const handleControlledDropDownChange = (event) => {
    /*
    boxid - boxid, not option value.
    if user does not make a selection, select first box by default since
    items can only be created when there is at least one box made.
    */

    // const selectedIndex = parseInt(event.target.options.selectedIndex, 10) || 1;
    // const optionId = event.target.options[selectedIndex].getAttribute('boxid');
    const optionId = event.target.value;
    const updatedItem = { ...newItem };

    setSelected(parseInt(optionId, 10));
    updatedItem.type.boxId = parseInt(optionId, 10);
    setNewItem(updatedItem);
    setSelectionMade(true);
  }; // handleControlledDropDownChange

  if (!isLoaded) return null;

  return (<div>ItemList</div>);
  // return (
  //   <>
  //     { isLoaded
  //       ? (
  //         <Container>
  //           <Box>
  //             <Typography variant="h4" component="h1" align="center">
  //              {`${loggedInUserName}'s Items`}
  //             </Typography>
  //             {
  //               itemsData.map((item) => <ItemSummary key={item.id} item={item} />)
  //             }
  //             <FormControl fullWidth>
  //               <InputLabel>Add Item To Box</InputLabel>
  //               <Select
  //                 className={styles.select}
  //                 value={selected}
  //                 onChange={handleControlledDropDownChange}
  //               >
  //                 <MenuItem value="" disabled>
  //                   Boxes
  //                 </MenuItem>
  //                 {
  //                   boxes.map((box) => (
  //                     <MenuItem boxid={box.id} key={box.id} value={box.id}>
  //                       { box.location }
  //                     </MenuItem>
  //                   ))
  //                 }
  //               </Select>
  //             </FormControl>
  //             <Counter objType={newItem} />
  //           </Box>
  //         </Container>
  //       )
  //       : (
  //         <Container>
  //           <Box>
  //             <Paper>
  //               <Typography>
  //                 Loading . . .
  //               </Typography>
  //             </Paper>
  //           </Box>
  //         </Container>
  //       )}
  //   </>
  // );
};
