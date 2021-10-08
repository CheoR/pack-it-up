import React, { useContext, useEffect, useState } from 'react';
// useRef
import { NavLink, useHistory, useLocation, useParams } from 'react-router-dom';

import { Button, ButtonGroup, Container, Grid, Box, Paper, Typography, FormControl, Input, FormGroup, FormControlLabel, Checkbox, Select, MenuItem } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import Image from 'material-ui-image';

import { userStorageKey } from '../auth/authSettings';
import { BoxContext } from '../boxes/BoxProvider';
import { ItemContext } from './ItemProvider';

const useStyles = makeStyles(() => ({
  paper: {
    background: 'lightgray',
  },
  update: {
    background: 'lightgreen',
    paddingLeft: '10px',
    paddingRight: '10px',
  },
  delete: {
    background: 'salmon',
  },
  grid: {
    gridRowGap: '10px',
    alignItems: 'center',
    borderBottom: '1px solid black',
    marginBottom: '5px',
  },
  formGroup: {
    textAlign: 'center',
  },
  edit: {
    minWidth: '100%',
    margin: '25px 0',
  },
  view: {
    minWidth: '100%',
  },
  imgInputFile: {
    display: 'none',
  },
}));

const defaultItem = {
  userId: 0,
  boxId: 0,
  description: 'loading',
  value: 0,
  isFragile: false,
  imagePath: 'loading',
  box: {
    id: 0,
    location: 'loading',
  },
};

export const ItemDetail = () => {
  const classes = useStyles();

  const loggedInUserId = parseInt(sessionStorage.getItem(userStorageKey), 10);

  // uploadItemImage
  const { items, getItemsByUserId, updateItem, deleteItem } = useContext(
    ItemContext
  );
  const { boxes, getBoxesByUserId, setBoxes } = useContext(BoxContext);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasSaved, setHasSaved] = useState(false);
  const [item, setItem] = useState(defaultItem);
  const [selected, setSelected] = useState('');

  // const imgInputFile = useRef(null);
  let { itemId } = useParams();
  const location = useLocation();
  const history = useHistory();

  /*
    In case user does a hard refresh, otherwise app will error out due to missing itemId.
  */
  itemId = parseInt(itemId, 10) || parseInt(location.pathname.split('/')[2], 10);

  useEffect(() => {
    getBoxesByUserId()
      .then(getItemsByUserId)
      .then(() => {
        if (items && boxes) {
          const _item = items.find((thisItem) => thisItem.id === itemId);
          const _box = boxes.find((thisBox) => _item.boxId === thisBox.id);

          setBoxes(boxes.filter((thisBox) => thisBox.userId === loggedInUserId));
          setItem(items.find((thisItem) => thisItem.id === itemId));
          setSelected(_box.location);
          setItem(_item);
          setIsLoaded(true);
        }
      });
  }, []); // useEffect

  useEffect(() => {
    if (hasSaved) {
      window.alert('Updated');
    }
  }, [hasSaved, isLoaded]); // useEffect

  const handleDelete = (event) => {
    event.preventDefault();
    deleteItem(item.id).then(() => history.push('/items'));
  }; // handleDelete

  // const handleImageUpload = (event) => {
  //   event.preventDefault();
  //   imgInputFile.current.click();
  // }; // handleImageUpload

  const handleControlledInputChange = (event) => {
    const newItem = { ...item };

    newItem[event.target.id] = event.target.value;
    newItem.value = parseInt(newItem.value, 10) || 0;

    setItem(newItem);
    setHasSaved(false);
  }; // handleControlledInputChange

  const handleCheckboxChange = (event) => {
    const newformField = { ...item };
    newformField[event.target.id] = event.target.checked;
    setItem(newformField);
    setHasSaved(false);
  }; // handleCheckboxChange

  const handleControlledDropDownChange = (event) => {
    // const selectedIndex = parseInt(event.target.options.selectedIndex, 10);
    // const updatedBoxId = event.target.options[selectedIndex].getAttribute('boxid');
    const updatedBoxId = event.target.value;
    const newItem = { ...item };

    newItem[event.target.id] = event.target.value;
    newItem.boxId = parseInt(updatedBoxId, 10);

    setSelected(event.target.value);
    setItem(newItem);
    setHasSaved(false);
  }; // handleControlledDropDownChange

  // const imageInputChange = (event) => {
  //   event.stopPropagation();
  //   event.preventDefault();

  //   const file = event.target.files[0];
  //   const formData = new FormData();

  //   formData.append('file', file); // files[0]);
  //   formData.append('upload_preset', 'packItUp__upload');

  //   uploadItemImage(formData)
  //     .then((res) => {
  //       const newItem = { ...item };
  //       // res.original_filename,
  //       newItem.imagePath = res.secure_url;

  //       setItem(newItem);
  //       setHasSaved(false);
  //     })
  //     .catch((err) => console.log(err));
  // }; // imageInputChange

  const submitUpdate = (event) => {
    event.preventDefault();
    const newItem = { ...item };
    /*
    Remove attributes not matching ERD.
    */
    delete newItem.container__dropdown;
    delete newItem.hasAssociatedMove;
    delete newItem.hasAssociatedBox;
    delete newItem.box;

    updateItem(newItem);
    setHasSaved(true);
  }; // updateMove

  if (item && !item.imagePath) {
    item.imagePath = 'https://unsplash.com/photos/YXWoEn5uOvg';
  }
  return (
    <>
      { isLoaded
        ? (
          <Container>
            <Paper className={classes.paper}>
              <Image
                src={`${item.imagePath}`}
                alt={`${item?.description}`}
                />
              <form>
                <Grid container>
                  <Grid item xs={3} />
                  <Grid item xs={3}>
                    <Typography style={{ height: '100%' }}>
                      Description
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <FormControl>
                      <Input
                        type="text"
                        id="description"
                        name="description"
                        aria-describedby="description"
                        value={item.description}
                        onChange={(e) => { handleControlledInputChange(e); }}
                        inputProps={{
                          readOnly: true,
                          style: {
                            textAlign: 'right',
                          },
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={3} />
                  <Grid item xs={3}>
                    <Typography style={{ height: '100%' }}>
                      Value
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <FormControl>
                      <Input
                        type="text"
                        id="value"
                        name="value"
                        aria-describedby="value"
                        value={`$${item?.value || '0.00'}`}
                        onChange={(e) => { handleControlledInputChange(e); }}
                        inputProps={{
                          readOnly: true,
                          style: {
                            textAlign: 'right',
                          },
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={3} />
                  <Grid item xs={3}>
                    <Typography style={{ height: '100%', display: 'flex', align: 'center', justifyContent: 'center' }}>
                      Box
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <FormControl fullWidth>
                      <Select
                        value={selected}
                        onChange={handleControlledDropDownChange}
                        >
                        <MenuItem value="" disabled>
                          Boxes
                        </MenuItem>
                        {
                          boxes.map((box) => (
                            <MenuItem
                              boxid={box.id}
                              key={box.id}
                              value={box.id}
                            >
                              { box.location }
                            </MenuItem>
                          ))
                        }
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item>
                    <FormGroup>
                      <FormControlLabel
                        labelPlacement="start"
                        label="Fragile"
                        control={
                          (
                            <Checkbox
                              id="isFragile"
                              checked={item.isFragile}
                              color="default"
                              onChange={handleCheckboxChange}
                            />
                            )
                          }
                          />
                    </FormGroup>
                  </Grid>
                  <Grid item>
                    <ButtonGroup
                      color="default"
                      aria-label="outlined secondary button group"
                      style={{ marginLeft: '5px' }}
                    >
                      {/*
                        <input className={classes.imgInputFile}
                         id={`imageForItemId--${item.id}`}
                          type="file" ref={imgInputFile}
                           onChange={imageInputChange} */}
                      {/* <input
                        accept="image/*"
                        style={{ display: 'none' }}
                        id="raised-button-file"
                        multiple
                        type="file"
                        onChange={handlePhotoChange}
                      /> */}
                      <Button
                        id="camera"
                        type="file"
                      >
                        Camera
                      </Button>
                      <Button
                        className={classes.delete}
                        id={`btn--delete-${item.id}`}
                        type="button"
                        onClick={handleDelete}
                      >
                        Delete
                      </Button>
                      <Button
                        id={`btn--update-${item.id}`}
                        className={classes.update}
                        type="submit"
                        onClick={submitUpdate}
                      >
                        Update
                      </Button>
                    </ButtonGroup>
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <Button
                    id={`btn--view-${item.boxId}`}
                    className={classes.view}
                    variant="contained"
                    type="button"
                    component={NavLink}
                    to={{
                      pathname: `/boxes/${item.boxId}`,
                    }}
                  >
                    View Box
                  </Button>
                </Grid>
              </form>

            </Paper>
          </Container>
        )
        : (
          <Container>
            <Box>
              <Paper>
                <Typography>
                  Loading . . .
                </Typography>
              </Paper>
            </Box>
          </Container>
        )}
    </>
  );
};
