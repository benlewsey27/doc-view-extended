import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import './Modal.css';

/**
 * React Stateless Functional Component. Renders a modal with document text
 * and options for labelling the document.
 *
 * @param {Object} props - The React props passed down from the parent
 * component
 */
export const LabelModal = (props) => {
  const modalRoot = document.getElementById('modal-root');

  // Render the modal if props.showModal is true
  const modalHTML = props.showModal ? (
    <div className="modal d-inline" tabIndex="-1" role="dialog">
      <div className="modal-dialog modal-lg" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5>{props.currentDoc}</h5>
            {props.repeatModal ? (
              <button
                type="button"
                className="btn btn-success ml-2"
                onClick={props.onFinishClick}
              >
                Finish labelling
              </button>
            ) : null}
          </div>
          <div className="modal-body">
            <p>
              User-labelled: {props.numLabelled} /<span> </span>
              {props.numDocs}
            </p>
            <div className="form-inline">
              <div className="form-group">
                <label htmlFor="labelSelect">Select Label</label>
                <select
                  className="form-control ml-2"
                  id="labelSelect"
                  onChange={props.onLabelChange}
                >
                  <option value="newLabel">New label...</option>
                  {props.labels}
                </select>
                <input
                  id="labelTextInput"
                  className="form-control ml-2"
                  type="text"
                  placeholder="label name"
                  onChange={props.onTextChange}
                  disabled={!props.isNewLabel}
                ></input>
                <button
                  type="button"
                  className="btn btn-primary ml-2"
                  onClick={props.onLabelDocClick}
                  disabled={props.disableNext}
                >
                  Add Label
                </button>
              </div>
            </div>
            <br />
            {props.docs[props.currentDoc]}
          </div>
          <div className="modal-footer"></div>
        </div>
      </div>
    </div>
  ) : null;

  // Use createPortal for rendering the modal in React
  return ReactDOM.createPortal(modalHTML, modalRoot);
};

// React PropTypes object
LabelModal.propTypes = {
  docs: PropTypes.object,
  showModal: PropTypes.bool.isRequired,
  onHideModal: PropTypes.func.isRequired,
  labels: PropTypes.array,
  onLabelChange: PropTypes.func.isRequired,
  onTextChange: PropTypes.func.isRequired,
  isNewLabel: PropTypes.bool.isRequired,
  disableNext: PropTypes.bool.isRequired,
  currentDoc: PropTypes.string,
  onLabelDocClick: PropTypes.func.isRequired,
  onFinishClick: PropTypes.func.isRequired,
  repeatModal: PropTypes.bool.isRequired,
  numDocs: PropTypes.number.isRequired,
  numLabelled: PropTypes.number.isRequired,
};
