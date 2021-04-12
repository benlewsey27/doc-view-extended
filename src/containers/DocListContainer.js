import React from 'react';
import PropTypes from 'prop-types';

import { DocList } from '../components/DocList/DocList';
import { DocButton } from '../components/DocList/DocButton';


/**
 * React container component used to handle DocList operations.
 * Renders the DocList Component.
 */
export class DocListContainer extends React.Component {
    /**
     * Set the initial state and bind methods.
     * 
     * @param {Object} props - The React props passed down from the parent
     * component
     * @constructor
     */
    constructor(props) {
        super(props);
        this.state = {
            activeIndex: 0,
            searchValue: '',
        }
        this.handleClick = this.handleClick.bind(this);
        this.handleSearchChange = this.handleSearchChange.bind(this);
    }

    /**
     * Change active document on click event.
     * 
     * @param {String} filename - Name of the file that was clicked on
     * @param {Number} i - The index of the file that was clicked on
     */
    handleClick(filename, i) {
        this.setState({activeIndex: i})
        this.props.onDocChange(filename);
    }

    /**
     * Update search string on input change event. 
     * 
     * @param {Object} event - The onChange event 
     */
    handleSearchChange(event) {
        this.setState({searchValue: event.target.value})
    }

    /**
     * Render the DocList component.
     * 
     * @returns {React.Component} - DocList Component
     */
    render() {
        let fileList = [];
        
        // Check if docs object has been initialised
        if (this.props.docs !== undefined) {
            let filenames = Object.keys(this.props.docs);
            
            // Filter files based on search string
            let filteredFilenames = filenames.filter(filename => {
                return filename.toLowerCase()
                    .includes(this.state.searchValue.toLowerCase());    
            })
            
            // Map DocButton Component to each file in file list
            fileList = filteredFilenames.map((filename, i) => {
                let userLabelled = false;
                let docLabel = '';
                if (filename in this.props.labelledDocs) {
                    userLabelled = true;
                    docLabel = this.props.labelledDocs[filename].label;
                } else if (filename in this.props.predictions) {
                    docLabel = this.props.predictions[filename].label;
                }

                return(
                    <DocButton
                        fileName={filename}
                        key={filename}
                        active={this.state.activeIndex === i}
                        onItemClick={() => this.handleClick(filename, i)}
                        userLabelled={userLabelled}
                        label={docLabel}
                    />
                )
            })
        }
        
        return <DocList 
            docList={fileList} 
            onSearchChange={this.handleSearchChange} />;
    }
}

// React PropTypes object
DocListContainer.propTypes = {
    docs: PropTypes.object,
    onDocChange: PropTypes.func.isRequired,
    labelledDocs: PropTypes.object,
    predictions: PropTypes.object
}