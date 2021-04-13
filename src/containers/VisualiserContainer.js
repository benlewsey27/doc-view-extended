/* eslint-disable no-restricted-syntax */
/* eslint-disable class-methods-use-this */

import React from 'react';
import PropTypes from 'prop-types';

import HistoryChart from '../visualisations/HistoryChart';
import BarChart from '../visualisations/BarChart';
import PieChart from '../visualisations/PieChart';
import TreeMap from '../visualisations/TreeMap';
import ArcChart from '../visualisations/ArcChart';
import RecommendChart from '../visualisations/RecommendChart';

/**
 * React container component used to handle Visualiser operations.
 * Renders the Visualiser component and calls d3 graph operations.
 */
export class VisualiserContainer extends React.Component {
  /**
   * Set the initial state.
   *
   * @param {Object} props - The React props passed down from the parent component
   * @constructor
   */
  constructor(props) {
    super(props);
    this.state = {
      isReady: false,
      activeLabel: null,
      data: {},
    };
  }

  /**
   * React callback function. Set data and ensure data is ready when component mounts.
   */
  componentDidMount() {
    // Add delay to ensure data is ready.
    setTimeout(() => {
      this.setState({ isReady: true });
    }, 10);

    if (this.props.labels && this.props.labels.length) {
      // Convert prediction data from nested object to array of objects.
      const newPredictions = [];
      for (const [key, value] of Object.entries(this.props.predictions)) {
        const newObject = {
          filename: key,
          ...value,
        };
        newPredictions.push(newObject);
      }

      // Convert labelled data from nested object to array of objects.
      const newLabelledDocs = [];
      for (const [key, value] of Object.entries(this.props.labelledDocs)) {
        const newObject = {
          filename: key,
          ...value,
        };
        newLabelledDocs.push(newObject);
      }

      const data = {
        labelledDocs: newLabelledDocs,
        predictions: newPredictions,
        labels: this.props.labels,
        selectedLabel: this.getSelectedLabel(),
      };

      this.setState({ data });
    }
  }

  /**
   * Calculates the desired width of the visualisation
   * based from the number of columns.
   *
   * @param {Number} cols - The number of columns.
   * @returns {Number} - The desired width of the visualisaion.
   */
  getWidth(cols) {
    const docListPanel = document.getElementById('doc-list');

    return (
      (Math.max(document.documentElement.clientWidth, window.innerWidth || 0) -
        docListPanel.offsetWidth) /
        cols -
      30
    );
  }

  /**
   * Calculates the desired height of the visualisation
   * based from the number of rows.
   *
   * @param {Number} rows - The number of rows.
   * @returns {Number} - The desired height of the visualisaion.
   */
  getHeight(rows) {
    const navPanel = document.getElementById('nav-panel');
    const suggestionsPanel = document.getElementById('suggestions');

    return (
      (Math.max(
        document.documentElement.clientHeight,
        window.innerHeight || 0,
      ) -
        navPanel.offsetHeight -
        suggestionsPanel.offsetHeight) /
        rows -
      20
    );
  }

  /**
   * Gets the label for the currently active doc
   *
   * @returns {String} - The active document's label
   */
  getSelectedLabel() {
    if (this.props.activeDoc in this.props.labelledDocs) {
      return this.props.labelledDocs[this.props.activeDoc].label;
    }

    return this.props.predictions[this.props.activeDoc].label;
  }

  /**
   * Sets the active label from the TreeMap Component
   *
   * @param {String} label - The active label.
   */
  setActiveLabel(label) {
    this.setState({ activeLabel: label });
  }

  /**
   * Render the Visualiser component.
   *
   * @returns {React.Component} - Visualiser Component
   */
  render() {
    return (
      <div className="container-fluid">
        {this.state.isReady && (
          <div className="row">
            <TreeMap
              id="1"
              width={this.getWidth(2)}
              height={this.getHeight(1)}
              data={this.state.data}
              setActiveLabel={this.setActiveLabel.bind(this)}
              activeLabel={this.state.activeLabel}
            />
            <div className="row">
              <div className="container-fluid">
                <div className="row">
                  <PieChart
                    id="2"
                    width={this.getWidth(4)}
                    height={this.getHeight(2)}
                    data={this.state.data}
                    filter={this.state.activeLabel}
                  />
                  {!this.state.activeLabel ? (
                    <HistoryChart
                      id="3"
                      width={this.getWidth(4)}
                      height={this.getHeight(2)}
                      data={this.state.data}
                    />
                  ) : (
                    <ArcChart
                      id="3"
                      width={this.getWidth(4)}
                      height={this.getHeight(2)}
                      data={this.state.data}
                      filter={this.state.activeLabel}
                    />
                  )}
                </div>
                <div className="row">
                  {!this.state.activeLabel ? (
                    <BarChart
                      id="4"
                      width={this.getWidth(2)}
                      height={this.getHeight(2)}
                      data={this.state.data}
                    />
                  ) : (
                    <RecommendChart
                      id="4"
                      width={this.getWidth(2)}
                      height={this.getHeight(2)}
                      data={this.state.data}
                      filter={this.state.activeLabel}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

// React PropTypes object
VisualiserContainer.propTypes = {
  labelledDocs: PropTypes.object,
  predictions: PropTypes.object,
  labels: PropTypes.array,
  activeDoc: PropTypes.string,
};
