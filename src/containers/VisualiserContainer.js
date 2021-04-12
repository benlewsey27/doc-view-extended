import React from 'react';
import PropTypes from 'prop-types';

import HistoryChart from '../visualisations/HistoryChart';
import LabelBarChart from '../visualisations/LabelBarChart';
import PieChart from '../visualisations/PieChart';
import TreeMap from '../visualisations/TreeMap';

export class VisualiserContainer extends React.Component {
    constructor(props){
        super(props);
        this.state={
            isReady: false,
            activeLabel: null,
            data: {},
        };
    }

    componentDidMount(){
        setTimeout(() => { this.setState({isReady: true}) }, 10);

        if (this.props.labels && this.props.labels.length) {
            // Change Predictions Into Array Of Objects
            const newPredictions = [];
            for (const [key, value] of Object.entries(this.props.predictions)) {
                const newObject = {
                    'filename': key,
                    ...value
                }
                newPredictions.push(newObject);
            }

            // Change LabelledDocs Into Array Of Objects
            const newLabelledDocs = [];
            for (const [key, value] of Object.entries(this.props.labelledDocs)) {
                const newObject = {
                    'filename': key,
                    ...value
                }
                newLabelledDocs.push(newObject);
            }

            let data = {
                labelledDocs: newLabelledDocs,
                predictions: newPredictions,
                labels: this.props.labels,
                selectedLabel: this.getSelectedLabel()
            }
            
            this.setState({data: data});
        }
    }

    getWidth(cols) {
        const docListPanel = document.getElementById('doc-list');
        return ((Math.max(document.documentElement.clientWidth, window.innerWidth || 0) - docListPanel.offsetWidth) / cols) - 30;
    }

    getHeight(rows) {
        const navPanel = document.getElementById('nav-panel');
        const suggestionsPanel = document.getElementById('suggestions');
        return ((Math.max(document.documentElement.clientHeight, window.innerHeight || 0) - navPanel.offsetHeight - suggestionsPanel.offsetHeight) / rows) - 20;
    }

    getSelectedLabel() {
        if (this.props.activeDoc in this.props.labelledDocs) {
            return this.props.labelledDocs[this.props.activeDoc].label;
        }

        return this.props.predictions[this.props.activeDoc].label;
    }

    setActiveLabel(label) {
        this.setState({activeLabel: label});
    }
    
    render() {
        return (
            <div className='container-fluid'>
                {this.state.isReady && <div className='row'>
                    <TreeMap id='1' width={this.getWidth(2)} height={this.getHeight(1)} data={this.state.data} setActiveLabel={this.setActiveLabel.bind(this)} activeLabel={this.state.activeLabel}/>
                    <div className='row'>
                        <div className='container-fluid'>
                        <div className='row'>
                            <PieChart id='2' width={this.getWidth(4)} height={this.getHeight(2)} data={this.state.data} filter={this.state.activeLabel}/>
                            <HistoryChart id='3' width={this.getWidth(4)} height={this.getHeight(2)} data={this.state.data}/>
                        </div>
                        <div className='row'>
                            <LabelBarChart id='4' width={this.getWidth(2)} height={this.getHeight(2)} data={this.state.data}/>
                        </div>
                        </div>
                    </div>
                </div>}
            </div>
        )
    }
}

VisualiserContainer.propTypes = {
    labelledDocs: PropTypes.object,
    predictions: PropTypes.object,
    labels: PropTypes.array,
    activeDoc: PropTypes.string
}
