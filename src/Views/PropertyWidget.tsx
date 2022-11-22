import React from 'react';
import './PropertyWidget.css';
import { MultiValueProperty3 } from '../Controllers/Inspection';

export interface PropertyWidgetProps {
  property: string;
  values: MultiValueProperty3;
}

function PropertyWidget({ property, values }: PropertyWidgetProps) {
  return (
    <div className="PropertyWidget">
      <div id="id" className="PropertyLabel unselectable">
        {property}
      </div>
      <div className="PropertyValue-container">
        <div id="x-value" className="PropertyValue unselectable">
          {values[0]}
        </div>
        <div id="y-value" className="PropertyValue unselectable">
          {values[1]}
        </div>
        <div id="z-value" className="PropertyValue unselectable">
          {values[2]}
        </div>
      </div>
    </div>
  );
}

export default PropertyWidget;
