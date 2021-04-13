import React from 'react';
import PropTypes from 'prop-types';

/**
 * React Stateless Functional Component. Renders the top navigation bar.
 *
 * @param {Object} props - The React props passed down from the parent
 * component
 */
export const Navbar = (props) => (
  <nav className="nav navbar-expand navbar-light bg-light" id="nav-panel">
    <ul className="navbar-nav">
      <li className="nav-item dropdown">
        <a
          className="nav-link dropdown-toggle"
          role="button"
          href="/#"
          data-toggle="dropdown"
        >
          File
        </a>
        <div className="dropdown-menu">
          <a
            className="dropdown-item"
            href="/#"
            onClick={() => props.onLabelSelectedClick()}
          >
            Label selected
          </a>
          <a
            className="dropdown-item"
            href="/#"
            onClick={props.onLabelUncertainClick}
          >
            Label uncertain
          </a>
          <a className="dropdown-item" href="/#" onClick={props.onResetData}>
            Reset data
          </a>
        </div>
      </li>
      <li className="nav-item dropdown">
        <a
          className="nav-link dropdown-toggle"
          role="button"
          href="/#"
          data-toggle="dropdown"
        >
          View
        </a>
        <div className="dropdown-menu">
          <a
            className="dropdown-item"
            href="/#"
            onClick={props.onShowTextClick}
          >
            {props.showText ? <span>Hide text</span> : <span>Show text</span>}
          </a>
        </div>
      </li>
    </ul>
  </nav>
);

// React PropTypes object
Navbar.propTypes = {
  onShowTextClick: PropTypes.func.isRequired,
  onLabelUncertainClick: PropTypes.func.isRequired,
  showText: PropTypes.bool.isRequired,
  onLabelSelectedClick: PropTypes.func.isRequired,
  onResetData: PropTypes.func.isRequired,
};
