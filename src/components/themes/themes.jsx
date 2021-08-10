import { createTheme } from '@material-ui/core';
// import purple from '@material-ui/core/colors/purple';
import green from '@material-ui/core/colors/green';
import red from '@material-ui/core/colors/red';
import blue from '@material-ui/core/colors/blue';
import brown from '@material-ui/core/colors/brown';

export const defaultTheme = createTheme({
  palette: {
    primary: {
      main: green[500],
    },
    secondary: {
      main: red[500],
    },
    background: {
      default: 'lightgray',
      paper: brown,
    },
    root: {
      backgroundColor: blue,
    },
  },
});
