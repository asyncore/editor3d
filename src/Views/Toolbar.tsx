import React, { useCallback, useEffect, useRef } from 'react';
import './Toolbar.css';
import { ToolMode } from '../Tools/types';

export interface ToolbarProps {
  handleButton: (tool: ToolMode) => void;
  toolMode: ToolMode;
}

function Toolbar({ handleButton, toolMode }: ToolbarProps) {
  const selectButtonRef = useRef<HTMLButtonElement | null>(null);
  const boxButtonRef = useRef<HTMLButtonElement | null>(null);
  const sphereButtonRef = useRef<HTMLButtonElement | null>(null);

  const buttonRefs = useRef([selectButtonRef, boxButtonRef, sphereButtonRef]);

  const changeButtonStyles = (tool: ToolMode) => {
    for (let ref of buttonRefs.current) {
      if (ref.current) {
        if (ref.current.id === tool) {
          ref.current?.classList.add('ToolButton-active');
          ref.current?.classList.remove('ToolButton-passive');
        } else {
          ref.current?.classList.add('ToolButton-passive');
          ref.current?.classList.remove('ToolButton-active');
        }
      }
    }
  };

  // Update the button sate, if tool mode changes outside the toolbar
  useEffect(() => {
    changeButtonStyles(toolMode);
  }, [toolMode]);

  const handleSelectButton = useCallback(() => {
    handleButton('select');
    changeButtonStyles('select');
  }, [handleButton]);

  const handleBoxButton = useCallback(() => {
    handleButton('box');
    changeButtonStyles('box');
  }, [handleButton]);

  const handleSphereButton = useCallback(() => {
    handleButton('sphere');
    changeButtonStyles('sphere');
  }, [handleButton]);

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
