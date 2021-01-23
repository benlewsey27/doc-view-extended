import React from 'react';
import PropTypes from 'prop-types';

import { LabelModal } from '../components/Modals/LabelModal';


/**
 * React container component used to handle LabelModal operations.
 * Renders the LabelModal Component
 */
export class LabelModalContainer extends React.Component {
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
            currentDoc: null,
            isNewLabel: true,
            disableNext: true,
            index: 0,
            numDocs: 0,
            numLabelled: 0
        }
        this.handleLabelChange = this.handleLabelChange.bind(this);
        this.handleLabelDocClick = this.handleLabelDocClick.bind(this);
        this.handleTextChange = this.handleTextChange.bind(this);
        this.getNextDocToLabel = this.getRandomDocToLabel.bind(this);
    }

    /**
     * React callback function. Update the modal data on each component
     * update.
     */
    componentDidUpdate() {
        if (this.props.docs !== undefined) {
            if (this.props.repeatModal && this.state.currentDoc === null) {
                // Get random documents to label uncertainty not yet defined
                if (this.props.docsToLabel === undefined 
                        || this.props.docsToLabel.length === 0) {
                    this.getRandomDocToLabel();
                } else {
                    // Get first document in sorted document list
                    this.setState({
                        currentDoc: this.props.docsToLabel[this.state.index][0]
                    })
                }
            } else if (!this.props.repeatModal && 
                    this.state.currentDoc !== this.props.activeDoc) {
                // Set active document as the one to label
                this.setState({
                    currentDoc: this.props.activeDoc
                });
            }

            // Update the total documents counter
            if (this.state.numDocs !== Object.keys(this.props.docs).length) {
                this.setState({
                    numDocs: Object.keys(this.props.docs).length
                })
            }

            // Update the labelled documents counter
            if (this.props.labelledDocs !== undefined
                    && this.state.numLabelled !== 
                    Object.keys(this.props.labelledDocs).length) {
                this.setState({
                    numLabelled: Object.keys(this.props.labelledDocs).length
                })
            }
        }
    }

    /**
     * Handle modal changes on label selection change.
     * 
     * @param {Object} e - The onChange event 
     */
    handleLabelChange(e) {
        if (e.target.value === "newLabel") {
            this.setState({isNewLabel: true});
        } else {
            this.setState({
                isNewLabel: false,
                disableNext: false
            })
            document.getElementById("labelTextInput").value = "";
        }
    }

    /**
     * Handle modal changes on text input change.
     * 
     * @param {Object} e - The onChange event
     */
    handleTextChange(e) {
        if (e.target.value === "") {
            this.setState({disableNext: true})
        } else {
            this.setState({disableNext: false})
        }
    }

    /**
     * Register new label input.
     */
    handleLabelDocClick() {
        let label = '';
        if (this.state.isNewLabel) {
            label = document.getElementById("labelTextInput").value;
            if (!this.props.labels.includes(label)) {
                this.props.labels.push(label);
            }
        } else {
            label = document.getElementById("labelSelect").value;
        }
        this.props.labelledDocs[this.state.currentDoc] = label;

        this.setState({
            isNewLabel: true,
            disableNext: true
        });

        document.getElementById("labelTextInput").value = "";
        document.getElementById("labelSelect").value = "newLabel";
        
        // Get next to document to label if modal should repeat
        if (this.props.repeatModal) {
            // Get random document to label if uncertainty not yet defined
            if (this.props.docsToLabel === undefined
                        || this.props.docsToLabel.length === 0) {
                this.getRandomDocToLabel();
            } else {
                let newIndex = this.state.index + 1;
                this.setState({
                    currentDoc: this.props.docsToLabel[newIndex][0],
                    index: newIndex
                });
            }
        // Send new label to flask server if modal should not repeat
        } else {
            this.props.onSendLabels()
        }
    }

    /**
     * Set the current document to a random document from the unlabelled
     * documents.
     */
    getRandomDocToLabel() {
        let maxIndex = Object.keys(this.props.docs).length 
                - Object.keys(this.props.labelledDocs).length;
        let randomIndex = Math.floor(Math.random() * maxIndex);

        let docToLabel = Object.keys(this.props.docs)[randomIndex];

        // Check selected document has not already been labelled
        if (docToLabel in this.props.labelledDocs) {
            this.getRandomDocToLabel();
        } else {
            this.setState({currentDoc: docToLabel})
        }
    }

    /**
     * Render the LabelModal Component
     * 
     * @returns {React.Component} - LabelModal Component
     */
    render() {
        // Map labels to <option> elements.
        let selectLabels = null;
        if (this.props.labels !== null) {
            selectLabels = this.props.labels.map(label => {
                return <option
                    key={label}
                    value={label}>
                    {label}
                </option>;
            });
        }

        return (!this.props.loading)
            ? <LabelModal
                docs={this.props.docs}
                showModal={this.props.showModal}
                onHideModal={this.props.onHideModal} 
                labels={selectLabels} 
                onLabelChange={this.handleLabelChange}
                onTextChange={this.handleTextChange}
                isNewLabel={this.state.isNewLabel}
                disableNext={this.state.disableNext}
                labelDocIndex={this.state.labelDocIndex}
                currentDoc={this.state.currentDoc}
                onLabelDocClick={this.handleLabelDocClick}
                onFinishClick={this.props.onSendLabels}
                repeatModal={this.props.repeatModal}
                numDocs={this.state.numDocs}
                numLabelled={this.state.numLabelled} />
            : null;
    }
}

// React PropTypes object
LabelModalContainer.propTypes = {
    docs: PropTypes.object,
    activeDoc: PropTypes.string,
    showModal: PropTypes.bool.isRequired,
    onHideModal: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    onSendLabels: PropTypes.func.isRequired,
    labelledDocs: PropTypes.object,
    docsToLabel: PropTypes.array,
    labels: PropTypes.array,
    repeatModal: PropTypes.bool.isRequired
}
