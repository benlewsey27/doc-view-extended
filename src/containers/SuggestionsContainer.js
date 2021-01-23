import React from 'react';
import PropTypes from 'prop-types';

import { Suggestions } from '../components/Suggestions/Suggestions';


/**
 * React container component used to handle Suggestions operations.
 * Renders the Suggestions Component.
 */
export class SuggestionsContainer extends React.Component {
    /**
     * Render the Suggestions component.
     * 
     * @returns {React.Component} - Suggestions Component
     */
    render() {
        let suggestedDocs = [];
        if (this.props.docsToLabel !== undefined 
                && this.props.docsToLabel.length !== 0) {
            let topDocsToLabel = this.props.docsToLabel.slice(0, 10);
            
            // Map top 10 uncertain documents to <li> elements
            suggestedDocs = topDocsToLabel.map(doc => {
                return <li className="list-group-item" key={doc[0]}>
                    {doc[0]}
                    <button 
                        className="btn btn-primary float-right"
                        onClick={() => {
                            this.props.onLabelSelectedClick(doc[0])
                        }}>
                        Add Label
                    </button>
                </li>
            })
        }

        return <Suggestions suggestedDocs={suggestedDocs}/>;
    }
}

// React PropTypes object
SuggestionsContainer.propTypes = {
    docsToLabel: PropTypes.array,
    onLabelSelectedClick: PropTypes.func.isRequired
}