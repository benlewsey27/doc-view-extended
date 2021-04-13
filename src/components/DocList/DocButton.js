import React from 'react';
import PropTypes from 'prop-types';

/**
 * React Stateless Functional Component. Renders a button with a filename
 * and label.
 *
 * @param {Object} props - The React props passed down from the parent
 * component
 */
export const DocButton = (props) => (
  <button
    type="button"
    className={
      props.active
        ? 'list-group-item list-group-item-action active'
        : 'list-group-item list-group-item-action'
    }
    onClick={props.onItemClick}
  >
    <span>{props.fileName}</span>
    <span
      className={
        props.userLabelled
          ? 'badge badge-pill badge-success float-right'
          : 'badge badge-pill badge-info float-right'
      }
    >
      {props.label}
    </span>
  </button>
);

// React PropTypes object
DocButton.propTypes = {
  fileName: PropTypes.string.isRequired,
  onItemClick: PropTypes.func.isRequired,
  active: PropTypes.bool.isRequired,
  userLabelled: PropTypes.bool.isRequired,
  label: PropTypes.string.isRequired,
};
