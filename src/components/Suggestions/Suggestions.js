import React from 'react';
import PropTypes from 'prop-types';

import './Suggestions.css';

/**
 * React Stateless Functional Component. Renders a list of suggested documents.
 * 
 * @param {Object} props - The React props passed down from the parent 
 * component
 */
export const Suggestions = (props) => {
    return (
        <div className="suggestions">
            <h2 className="pl-3">Suggested Documents:</h2>
            <div className="list-group">
                {props.suggestedDocs}
            </div>
        </div>
    )
}

// React PropTypes object
Suggestions.propTypes = {
    suggestedDocs: PropTypes.array
}
