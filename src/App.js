import logo from './logo.svg';
import './App.css';
import { AwesomeButton } from "react-awesome-button";
import "react-awesome-button/dist/styles.css";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <span>
          <AwesomeButton type="primary">Primary</AwesomeButton>
          <div class='divider'></div>
          <AwesomeButton type="secondary">Primary</AwesomeButton>
        </span>
      </header>
    </div>
  );
}

export default App;
