import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import './InspectorPanel.css';
import Editor from '../Controllers/Editor';
import { MultiValueProperty3 } from '../Controllers/Inspection';
import PropertyWidget from './PropertyWidget';

export interface InspectorPanelProps {
  selectedIds: number[];
  editor: Editor | null;
}

function InspectorPanel({ selectedIds, editor }: InspectorPanelProps) {
  const label = useRef('Selected Object Id(s)');
  const [id, setId] = useState<string>('');
  const [position, setPosition] = useState<MultiValueProperty3>([0, 0, 0]);
  const [scaling, setScaling] = useState<MultiValueProperty3>([0, 0, 0]);
  const [rotation, setRotation] = useState<MultiValueProperty3>([0, 0, 0]);

  useEffect(() => {
    if (selectedIds.length > 0) {
      setId(selectedIds.join(','));
    }
    if (!editor) return;

    const multiPosition = editor.getInspection().getMultiPosition(...selectedIds);
    if (multiPosition) {
      setPosition(multiPosition);
    }
    const multiScaling = editor.getInspection().getMultiScaling(...selectedIds);
    if (multiScaling) {
      setScaling(multiScaling);
    }
    const multiRotation = editor.getInspection().getMultiRotation(...selectedIds);
    if (multiRotation) {
      setRotation(multiRotation);
    }
  }, [editor, selectedIds]);

  return (
    <div className="InspectorPanel">
      {selectedIds.length > 0 && (
        <div id="idl" className="IdLabel unselectable">
          {label.current}
        </div>
      )}
      {selectedIds.length > 0 && (
        <div id="idw" className="IdWidget unselectable">
          {id}{' '}
        </div>
      )}
      {selectedIds.length > 0 && <PropertyWidget property="Position" values={position} />}
      {selectedIds.length > 0 && <PropertyWidget property="Rotation" values={rotation} />}
      {selectedIds.length > 0 && <PropertyWidget property="Scaling" values={scaling} />}
    </div>
  );
}

export default InspectorPanel;
