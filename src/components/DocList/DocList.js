import React from 'react';
import PropTypes from 'prop-types';
import './DocList.css';

/**
 * React Stateless Functional Component. Renders a list with a search box.
 *
 * @param {Object} props - The React props passed down from the parent
 * component
 */
export const DocList = (props) => (
  <div className="doc-list" id="doc-list">
    <input
      className="form-control"
      type="text"
      placeholder="Search..."
      onChange={props.onSearchChange}
    />
    <div className="list-group">{props.docList}</div>
  </div>
);

// React PropTypes Object
DocList.propTypes = {
  docList: PropTypes.array.isRequired,
  onSearchChange: PropTypes.func.isRequired,
};
