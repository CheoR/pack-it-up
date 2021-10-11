import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';

import { ItemContext } from './ItemProvider';

// import styles from './itemSummary.module.css';

export const ItemSummary = ({ item }) => {
  const { deleteItem } = useContext(ItemContext);
  const history = useHistory();

  /* eslint-disable-next-line */
  const handleDelete = (event) => {
    event.preventDefault();
    deleteItem(item.id).then(() => history.push('/items'));
  }; // handleDelete

  return (<div>ItemSummary</div>);
  // return (
  //   <Box component="section">
  //     <Paper className={styles.paper}>
  //       <Grid container className={styles.grid}>
  //         {/* COLUMN 1 */}
  //         <Grid item xs={2} className={styles.column} style={{ background: 'pink' }}>
  //           <Paper>
  //             <Image
  //               src={item.imagePath || 'https://via.placeholder.com/300'}
  //               alt="User-defined"
  //             />
  //           </Paper>
  //         </Grid>
  //         {/* COLUMN 2 */}
  //         <Grid item xs={3} className={styles.column} style={{ marginRight: '15px' }}>
  //           <FormGroup>
  //             <FormControlLabel
  //               labelPlacement="start"
  //               label="Move"
  //               control={
  //                 (
  //                   <Checkbox
  //                     checked={item.hasAssociatedMove}
  //                     name="summaryMove"
  //                     color="default"
  //                   />
  //                 )
  //               }
  //             />
  //           </FormGroup>
  //           <FormGroup>
  //             <FormControlLabel
  //               labelPlacement="start"
  //               label="Box"
  //               control={
  //                 (
  //                   <Checkbox
  //                     checked={item.hasAssociatedBox}
  //                     name="summaryBox"
  //                     color="default"
  //                   />
  //                 )
  //               }
  //             />
  //           </FormGroup>
  //           <FormGroup>
  //             <FormControlLabel
  //               labelPlacement="start"
  //               label="Fragile"
  //               control={
  //                 (
  //                   <Checkbox
  //                     checked={item.isFragile}
  //                     name="summaryFragile"
  //                     color="default"
  //                   />
  //                 )
  //               }
  //             />
  //           </FormGroup>
  //         </Grid>
  //         {/* COLUMN 3 */}
  //         <Grid item xs={6} className={styles.column}>
  //           <form>
  //             <TextField
  //               id="itemDescription"
  //               label="Description"
  //               defaultValue={`${item.description.substring(0, 13)}. . `}
  //               inputProps={{
  //                 readOnly: true,
  //                 style: {
  //                   textAlign: 'right',
  //                 },
  //               }}
  //               />
  //             <TextField
  //               id="value"
  //               label="Value"
  //               defaultValue={`$${item?.value ? item?.value : '0.00'}`}
  //               inputProps={{
  //                 readOnly: true,
  //                 style: {
  //                   textAlign: 'right',
  //                 },
  //               }}
  //               />
  //             <ButtonGroup
  //               color="default"
  //               aria-label="outlined secondary button group"
  //               style={{ marginLeft: '5px' }}
  //             >
  //               <Button
  //                 id={`btn--delete-${item?.id}`}
  //                 className={styles.delete}
  //                 type="button"
  //                 onClick={handleDelete}
  //               >
  //                 Delete
  //               </Button>
  //               <Button
  //                 id={`btn--edit-${item.id}`}
  //                 className={styles.edit}
  //                 type="button"
  //                 component={NavLink}
  //                 to={`/items/${item.id}`}
  //               >
  //                 Edit
  //               </Button>
  //             </ButtonGroup>
  //           </form>
  //         </Grid>
  //       </Grid>
  //     </Paper>
  //   </Box>
  // );
};
