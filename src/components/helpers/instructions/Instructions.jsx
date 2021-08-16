import React from 'react';
import { Box, Typography } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';

// import { Typography, FormControl, InputLabel, Input, FormHelperText, Grid }
// from '@material-ui/core';
// import { makeStyles } from '@material-ui/core/styles';

// import styles from './instructions.module.css';

export const Instructions = () => (
  <Box component="section" m={1}>
    <Paper>
      <Typography varient="h1" component="h1" align="center">
        Instructions
      </Typography>
      <Typography varient="p" component="p" gutterBottom>
        1. Create at least one move before adding boxes.
      </Typography>
      <Typography varient="p" component="p" gutterBottom>
        2. Create at least one box before adding items.
      </Typography>
      <Typography varient="p" component="p" gutterBottom>
        3. Create items.
      </Typography>
      <Typography varient="p" component="p">
        After creation, you are free to reassign items, boxes.
      </Typography>
    </Paper>
  </Box>
  // <section className={styles.instructions}>
  //   <h3 className={styles.instructions__header}>Instructions</h3>
  //   <p className={styles.instructions__text}>1. Create at least one move before adding boxes.</p>
  //   <p className={styles.instructions__text}>2 Create at least one box before adding items.</p>
  //   <p className={styles.instructions__text}>3. Create items.</p>
  //   <p className={styles.instructions__text}>
  //     After creation, you are free to reassign items, boxes.
  //   </p>
  // </section>
);
