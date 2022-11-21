import React, { useEffect, useRef } from 'react';
import Editor from './Editor';
import './App.css';

function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const editorRef = useRef<Editor | null>(null);

  // Initialize the Editor on mount
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      editorRef.current = new Editor({
        canvas: canvas,
        width: canvas.clientWidth,
        height: canvas.clientHeight
      })
    }
  })

  // Start listening to windows resize event on mount,
  // and stop listening to it on unmount
  useEffect(() => {
    const canvas = canvasRef.current;
    const editor = editorRef.current;

    function handleResize() {
      if (canvas && editor) {
        editor.handleResize(canvas.clientWidth, canvas.clientHeight);
      }
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  })

  // Start listening to mouse click events on mount,
  // and stop listening to it on unmount
  useEffect(() => {
    const canvas = canvasRef.current;
    const editor = editorRef.current;

    function handleMouseClick(event: MouseEvent) {
      if (canvas && editor) {
        editor.handleClick(event.offsetX, event.offsetY, event.shiftKey);
      }
    }

    if (canvas) {
      canvas.addEventListener('click', handleMouseClick)
    }

    return () => {
      if (canvas) {
        canvas.removeEventListener('click', handleMouseClick)
      }
    }
  })

  return (
    <div className="App">
      <header className="App-header unselectable">
        Simple 3D Editor
      </header>
      <div className="Canvas-container">
        <canvas id="editorCanvas" className="Canvas" title="canvas" ref={canvasRef}/>
      </div>
    </div>
  );
}

export default App;
