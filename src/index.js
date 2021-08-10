import React from 'react';
import {  ThemeProvider } from '@material-ui/core';
import CssBaseline from '@material-ui/core/CssBaseline';
import { BrowserRouter as Router } from 'react-router-dom';
import ReactDOM from 'react-dom';

import { defaultTheme } from './components/themes/themes';
import { PackItUp } from './components/PackItUp';
import './index.css';

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <ThemeProvider theme={defaultTheme}>
        <CssBaseline />
        <PackItUp />
      </ThemeProvider>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);
