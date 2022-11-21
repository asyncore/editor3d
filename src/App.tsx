import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        Simple 3D Editor
      </header>
      <div className="Canvas-container">
        <canvas id="editorCanvas" className="Canvas"/>
      </div>
    </div>
  );
}

export default App;
