import React, { useEffect, useRef, useState } from "react";
import Editor from "./Editor";
import Toolbar from "./Toolbar";
import "./App.css";

function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [editor, setEditor] = useState<Editor | null>(null);

  // Initialize the Editor on mount
  useEffect(() => {
    const canvas = canvasRef.current;
    //  Make sure we don't chnmge stage after the editor is set
    if (canvas && !editor) {
      setEditor( new Editor({
        canvas: canvas,
        width: canvas.clientWidth,
        height: canvas.clientHeight,
      }));
    }
  }, [editor]);

  // Start listening to windows resize event on mount,
  // and stop listening to it on unmount
  useEffect(() => {
    const canvas = canvasRef.current;

    function handleResize() {
      if (canvas && editor) {
        editor.handleResize(canvas.clientWidth, canvas.clientHeight);
      }
    }

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  });

  // Start listening to mouse down/up events on mount,
  // and stop listening to them on unmount
  useEffect(() => {
    const canvas = canvasRef.current;

    function handleMouseUp(event: MouseEvent) {
      if (canvas && editor) {
        editor.handleMouseUp(event.offsetX, event.offsetY, event.shiftKey);
      }
    }

    if (canvas) {
      canvas.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      if (canvas) {
        canvas.removeEventListener("mouseup", handleMouseUp);
      }
    };
  });

  return (
    <div className="App">
      <header className="App-header unselectable">Simple 3D Editor</header>
      <div className="flex-container">
        {editor && <Toolbar editor={editor} />}
        <div className="Canvas-container">
          <canvas id="editorCanvas" className="Canvas" ref={canvasRef} />
        </div>
      </div>
    </div>
  );
}

export default App;
