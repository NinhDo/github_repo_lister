import React, { Component } from 'react';
import './App.css';
import CustomTable from "./components/table.js";

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">GitHub's mest populære repoer</h1>
        </header>
		<CustomTable />
      </div>
    );
  }
}

export default App;
