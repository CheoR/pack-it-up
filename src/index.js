import React from 'react';

import { BrowserRouter as Router } from 'react-router-dom';
import ReactDOM from 'react-dom';

import { PackItUp } from './components/PackItUp';
import './index.css';

ReactDOM.render(
  <React.StrictMode>
    <Router>
        <PackItUp />
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);
