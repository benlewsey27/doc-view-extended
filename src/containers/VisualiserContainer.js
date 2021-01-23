import React from 'react';
import PropTypes from 'prop-types';

import { Visualiser } from '../components/Visualiser/Visualiser';
//import { LabelBarChart as Visualisation } from '../visualisation/LabelBarChart';
import { ProbHistogram as Visualisation } from '../visualisation/ProbHistogram';

const VISUALISER_ID = "visualiser";


/**
 * React container component used to handle Visualiser operations.
 * Renders the Visualiser component and calls d3 graph operations.
 */
export class VisualiserContainer extends React.Component {
    /**
     * Set the initial state.
     * 
     * @param {Object} props - The React props passed down from the parent
     * component
     * @constructor
     */
    constructor(props) {
        super(props);
        this.state = {
            svg: null
        }

        // Use ref to access rendered DOM node for width and height
        this.ref = React.createRef();
    }

    /**
     * React callback function. Create chart when component mounts.
     */
    componentDidMount() {
        // Get DOM node width and height
        let width = this.ref.current.offsetWidth;
        let height = this.ref.current.offsetHeight;

        if (this.props.labels !== undefined
                && this.props.labels.length !== 0) {
            // Target appropriate data for visualisation object.
            let data = {
                labelledDocs: this.props.labelledDocs,
                predictions: this.props.predictions,
                labels: this.props.labels,
                selectedLabel: this.getSelectedLabel()
            }

            // Create chart
            let svg = new Visualisation(VISUALISER_ID, width, height, data);
            this.setState({svg: svg});
        }
    }

    /**
     * React callback function. Update chart on every component update.
     */
    componentDidUpdate() {
        // Get updated DOM node width and height
        let width = this.ref.current.offsetWidth;
        let height = this.ref.current.offsetHeight;
        
        if (this.props.labels !== undefined 
                && this.props.labels.length !== 0) {
            // Target appropriate data for visualisation object
            let data = {
                labelledDocs: this.props.labelledDocs,
                predictions: this.props.predictions,
                labels: this.props.labels,
                selectedLabel: this.getSelectedLabel()
            }

            // Update chart
            this.state.svg.updateChart(width, height, data);
        }
    }

    /**
     * React callback function. Remove DOM element when component unmounts
     * to avoid any issues.
     */
    componentWillUnmount() {
        // Remove graph from DOM
        let element = document.getElementById(VISUALISER_ID);
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        }
    }


    /**
     * Get the label for the currently active doc (used in LabelBarChart for
     * example).
     * 
     * @returns {String} - The active document's label
     */
    getSelectedLabel() {
        // Get label for selected doc
        let selectedLabel = '';
        if (this.props.activeDoc in this.props.labelledDocs) {
            selectedLabel = this.props.labelledDocs[this.props.activeDoc];
        } else {
            selectedLabel = this.props.predictions[this.props.activeDoc]
                .label;
        }

        return selectedLabel;
    }

    /**
     * Render the Visualiser component.
     * 
     * @returns {React.Component} - Visualiser Component
     */
    render() {
        return <Visualiser 
            ref={this.ref} />;
    }
}

// React PropTypes object
VisualiserContainer.propTypes = {
    labelledDocs: PropTypes.object,
    predictions: PropTypes.object,
    labels: PropTypes.array,
    activeDoc: PropTypes.string
}