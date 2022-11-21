import React, { useEffect, useRef, useState, useCallback } from 'react';
import Editor from './Editor';
import Toolbar from './Toolbar';
import './App.css';
import { ToolMode } from './tools/types';

function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rectRef = useRef<DOMRect | null>(null);

  const [editor, setEditor] = useState<Editor | null>(null);

  // Initialize the Editor on mount (editor doesn't change once set)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const newEditor = new Editor({
      canvas: canvas,
    });
    setEditor(newEditor);

    // Select tool is activated by default
    newEditor.activateTool('select');

    const handleResize = () => {
      newEditor.handleResize(canvas.clientWidth, canvas.clientHeight);
      rectRef.current = canvas.getBoundingClientRect();
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleButton = useCallback(
    (tool: ToolMode) => {
      editor?.activateTool(tool);
    },
    [editor],
  );

  const handleMouseUp = useCallback(
    (event: React.MouseEvent<HTMLCanvasElement>) => {
      if (!rectRef.current) return;
      const { x, y } = rectRef.current;
      editor?.handleMouseUp(event.clientX - x, event.clientY - y, event.shiftKey);
    },
    [editor],
  );

  return (
    <div className="App">
      <header className="App-header unselectable">Simple 3D Editor</header>
      <div className="flex-container">
        <Toolbar handleButton={handleButton} />
        <div className="Canvas-container">
          <canvas id="editorCanvas" className="Canvas" ref={canvasRef} onMouseUp={handleMouseUp} />
        </div>
      </div>
    </div>
  );
}

export default App;
