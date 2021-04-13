import React from 'react';
import './Visualiser.css';

/**
 * Use forwardRef to create a React Component which gives a reference to the
 * div element back to the parent component.
 */
export const Visualiser = React.forwardRef((props, ref) => (
  <div ref={ref} className="visualiser" id="visualiser"></div>
));

// Using forwardRef creates component so add display name
Visualiser.displayName = 'Visualiser';
