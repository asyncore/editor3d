import React, { useEffect, useRef, useState, useCallback } from 'react';
import Editor from '../Controllers/Editor';
import Toolbar from './Toolbar';
import InspectorPanel from './InspectorPanel';
import './App.css';
import { ToolMode } from '../Tools/types';

function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rectRef = useRef<DOMRect | null>(null);

  const [editor, setEditor] = useState<Editor | null>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  // Initialize the Editor on mount (editor doesn't change once set)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const thisEditor = new Editor({
      canvas: canvas,
    });
    setEditor(thisEditor);
    thisEditor.getSelection().setSelectionChanged((selectedIds) => {
      setSelectedIds(selectedIds);
    });

    // Select tool is activated by default
    thisEditor.activateTool('select');

    const handleResize = () => {
      thisEditor.handleResize(canvas.clientWidth, canvas.clientHeight);
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
        <Toolbar handleButton={handleButton} toolMode="select" />
        <div className="Canvas-container">
          <canvas id="editorCanvas" className="Canvas" ref={canvasRef} onMouseUp={handleMouseUp} />
        </div>
        <InspectorPanel selectedIds={selectedIds} editor={editor} />
      </div>
    </div>
  );
}

export default App;
