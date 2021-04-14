/* eslint-disable no-restricted-syntax */
/* eslint-disable class-methods-use-this */

import React from 'react';

import { App } from '../App';

/**
 * React container component used to handle application level operations.
 * Renders the App Component.
 */
export class AppContainer extends React.Component {
  /**
   * Set the initial state and bind methods.
   *
   * @constructor
   * @param {Object} props - The React props passed down from the parent
   * component
   */
  constructor(props) {
    super(props);
    this.state = {
      docs: {},
      activeDoc: '',
      showText: false,
      loading: true,
      showModal: false,
      labelledDocs: {},
      predictions: {},
      docsToLabel: [],
      labels: [],
      repeatModal: true,
    };
    this.handleDocChange = this.handleDocChange.bind(this);
    this.handleShowTextClick = this.handleShowTextClick.bind(this);
    this.handleLabelUncertainClick = this.handleLabelUncertainClick.bind(this);
    this.handleHideModal = this.handleHideModal.bind(this);
    this.sendLabels = this.sendLabels.bind(this);
    this.handleLabelSelectedClick = this.handleLabelSelectedClick.bind(this);
    this.resetData = this.resetData.bind(this);
  }

  /**
   * Change the active document.
   *
   * @param {String} filename - Name of the new active document
   */
  handleDocChange(filename) {
    this.setState({ activeDoc: filename });
  }

  /**
   * Show or hide text view on click event.
   */
  handleShowTextClick() {
    this.setState({ showText: !this.state.showText });
  }

  /**
   * Show label modal for uncertain documents on click event.
   */
  handleLabelUncertainClick() {
    this.setState({
      showModal: true,
      repeatModal: true,
    });
  }

  /**
   * Show label modal for selected document on click event.
   *
   * @param {String} selected - Selected document filename
   */
  handleLabelSelectedClick(selected = this.state.activeDoc) {
    if (this.state.showModal === false) {
      this.setState({
        showModal: true,
        repeatModal: false,
        activeDoc: selected,
      });
    }
  }

  /**
   * Hide label modal on click event.
   */
  handleHideModal() {
    this.setState({ showModal: false });
  }

  /**
   * React callback function. Fetch data when component mounts.
   */
  componentDidMount() {
    this.getData();
  }

  /**
   * Fetch data from Python Flask server.
   */
  getData() {
    fetch('/api/get_data')
      .then((response) => response.json())
      .then((data) => {
        const { docs } = data;

        // Generate list of unique label values
        const labelledDocValues = Object.values(data.labelledDocs);
        const labels = [];
        for (let i = 0; i < labelledDocValues.length; i += 1) {
          if (!labels.includes(labelledDocValues[i].label)) {
            labels.push(labelledDocValues[i].label);
          }
        }

        // Generate list of documents sorted by uncertainty
        const docsToLabel = this.getDocsToLabel(data.predictions);

        this.setState({
          docs,
          labelledDocs: data.labelledDocs,
          activeDoc: Object.keys(docs)[0],
          loading: false,
          showModal: !data.labelled,
          predictions: data.predictions,
          docsToLabel,
          labels,
        });
      });
  }

  /**
   * Send new labels to Python Flask server, which returns prediction data.
   */
  sendLabels() {
    if (this.state.labels.length < 2) {
      // eslint-disable-next-line no-alert
      alert('There must be at least 2 unique labels! Please continue.');
      return;
    }

    this.handleHideModal();
    this.setState({ loading: true });

    // Use fetch with POST header to send data
    fetch('/api/add_labels', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(this.state.labelledDocs),
    })
      .then((response) => response.json())
      .then((data) => {
        const docsToLabel = this.getDocsToLabel(data);

        this.setState({
          activeDoc: Object.keys(this.state.docs)[0],
          predictions: data,
          docsToLabel,
          loading: false,
        });
      });
  }

  /**
   * Sort through predictions data to return list of documents sorted
   * by uncertainty.
   *
   * @param {Object} predictions - Unsorted predictions object
   * @returns {Array} - List of documents sorted by uncertainty
   */
  getDocsToLabel(predictions) {
    const docsToLabel = [];
    for (const [doc, prediction] of Object.entries(predictions)) {
      docsToLabel.push([doc, prediction.probability]);
    }
    docsToLabel.sort((a, b) => a[1] - b[1]);

    return docsToLabel;
  }

  /**
   * Send request to Python Flask server to reset label and prediction data.
   */
  resetData() {
    fetch('/api/reset_data').then(() => {
      // Add 1 second delay to ensure the files are deleted.
      setTimeout(this.getData(), 1000);
    });
  }

  /**
   * Render the App component.
   * @returns {React.Component} - App Component
   */
  render() {
    return (
      <App
        docs={this.state.docs}
        activeDoc={this.state.activeDoc}
        onDocChange={this.handleDocChange}
        onShowTextClick={this.handleShowTextClick}
        onLabelUncertainClick={this.handleLabelUncertainClick}
        onHideModal={this.handleHideModal}
        showText={this.state.showText}
        showModal={this.state.showModal}
        loading={this.state.loading}
        onSendLabels={this.sendLabels}
        labelledDocs={this.state.labelledDocs}
        predictions={this.state.predictions}
        docsToLabel={this.state.docsToLabel}
        labels={this.state.labels}
        onLabelSelectedClick={this.handleLabelSelectedClick}
        repeatModal={this.state.repeatModal}
        onResetData={this.resetData}
      />
    );
  }
}
