import React from 'react';
import QRCode from 'react-qr-code';
import logo from './logo.svg';
import './App.css';

function App() {
  // const test = [1, 2, 3, 4, 5]
  // const imgFilePath = "../images"

  /*
    this would be box object
    itemId will be expend
    userId will be expand
    moveId will be expand
  */

  const payloads = [
    {
      id: 1,
      userId: 1,
      itemId: 1,
    },
    {
      id: 2,
      userId: 1,
      itemId: 6,
    },
    {
      id: 3,
      userId: 2,
      itemId: 4,
    },
    {
      id: 4,
      userId: 1,
      itemId: 2,
    }
  ];

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
      cow

      {
        payloads.map((load) => {
          const code = <QRCode value={`move--${load.id}`} size="128" bgColor="#FF2" fgColor="#A23" />;

          return <li key={load.id}>Move-{load.id}<br />{code}</li>;
        })
      }
    </div>
  );
}

export default App;
