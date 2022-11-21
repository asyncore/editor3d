import React, { useEffect, useRef } from "react";
import Editor from "./Editor";
import "./Toolbar.css";
import { ToolMode } from "./tools/types";

export interface ToolbarProps {
  editor: Editor;
}

function Toolbar({ editor }: ToolbarProps) {
  const selectButtonRef = useRef<HTMLButtonElement | null>(null);
  const boxButtonRef = useRef<HTMLButtonElement | null>(null);
  const sphereButtonRef = useRef<HTMLButtonElement | null>(null);

  const buttonRefs = useRef([selectButtonRef, boxButtonRef, sphereButtonRef]);

  // Activate Select Tool on mount
  useEffect(() => {
    handleSelectButton();
  });

  const changeButtonStyles = (tool: ToolMode) => {
    for (let ref of buttonRefs.current) {
      if (ref.current) {
        if (ref.current.id === tool) {
          ref.current?.classList.add("ToolButton-active");
          ref.current?.classList.remove("ToolButton-passive");
        } else {
          ref.current?.classList.add("ToolButton-passive");
          ref.current?.classList.remove("ToolButton-active");
        }
      }
    }
  };

  const handleSelectButton = () => {
    editor.activateTool("select");
    changeButtonStyles("select");
  };

  const handleBoxButton = () => {
    editor.activateTool("box");
    changeButtonStyles("box");
  };

  const handleSphereButton = () => {
    editor.activateTool("sphere");
    changeButtonStyles("sphere");
  };

  return (
    <div className="Toolbar">
      <button id="select" className="ToolButton unselectable" onClick={handleSelectButton} ref={selectButtonRef}>
        Select
      </button>
      <button id="box" className="ToolButton unselectable" onClick={handleBoxButton} ref={boxButtonRef}>
        Box
      </button>
      <button id="sphere" className="ToolButton unselectable" onClick={handleSphereButton} ref={sphereButtonRef}>
        Sphere
      </button>
    </div>
  );
}

export default Toolbar;
