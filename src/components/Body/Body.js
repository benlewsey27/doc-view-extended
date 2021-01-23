import React from 'react';
import PropTypes from 'prop-types';

import './Body.css';
import { DocListContainer } from '../../containers/DocListContainer';
import { VisualiserContainer } from '../../containers/VisualiserContainer';
import { SuggestionsContainer } from '../../containers/SuggestionsContainer';
import { TextReader } from '../TextReader/TextReader';

/**
 * React Stateless Functional Component. Renders the Body of the application,
 * which includes DocList, Visualiser, Suggestions and TextReader
 * 
 * @param {Object} props - The React props passed down from the parent 
 * component
 */
export const Body = (props) => {
    let container = 'container-fluid col-10';
    let textReader = null;

    // Render the TextReader if props.showText is true
    if (props.showText) {
        container = 'container-fluid col-6 mr-0';
        textReader = (
            <div className="col-4 pl-0">
                <TextReader 
                    docs={props.docs}
                    activeDoc={props.activeDoc}/>
            </div>
        );
    }

    // Render the Body contents, or show a spinner if content is loading
    return (!props.loading) ? (
        <div className="container-fluid" id="container">
            <div className="row">
                <div className="col-2 pr-0">
                    <DocListContainer 
                        docs={props.docs}
                        onDocChange={props.onDocChange}
                        labelledDocs={props.labelledDocs}
                        predictions={props.predictions} />
                </div>
                <div className={container}>
                    <div className="row">
                        <VisualiserContainer 
                            labelledDocs={props.labelledDocs}
                            predictions={props.predictions}
                            labels={props.labels}
                            activeDoc={props.activeDoc} />
                        <SuggestionsContainer
                            docsToLabel={props.docsToLabel}
                            onLabelSelectedClick={props.onLabelSelectedClick} />
                    </div>
                </div>
                {textReader}
            </div>  
        </div>
    ) : (
        <div className="d-flex justify-content-center">
            <div className="spinner-border text-primary"></div>
        </div>
    );
}

// React PropTypes object
Body.propTypes = {
    docs: PropTypes.object,
    activeDoc: PropTypes.string,
    onDocChange: PropTypes.func.isRequired,
    showText: PropTypes.bool.isRequired,
    loading: PropTypes.bool.isRequired,
    labelledDocs: PropTypes.object,
    predictions: PropTypes.object,
    docsToLabel: PropTypes.array,
    onLabelSelectedClick: PropTypes.func.isRequired,
    labels: PropTypes.array
}
