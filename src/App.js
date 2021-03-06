import logo from './logo.svg';
import './App.css';
import QRCode from "react-qr-code"

function App() {
  const test = [1, 2, 3, 4, 5]
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
        test.map(num => <li key={num}><QRCode value={`cow--${num}`} size="128" bgColor="#FF2" fgColor="#A23"/></li>)
      }
    </div>
  );
}

export default App;
