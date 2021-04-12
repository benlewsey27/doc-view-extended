"""Flask server to allow React application to interact with python scripts"""

from flask import Flask
from flask import request
import json
import os

import file_handler

# Change imports to determine which classification script to use
#import naive_bayes_classification as classification
import logistic_regression_classification as classification

app = Flask(__name__)

FILE_ENCODING = 'utf-8'

if 'LABELS_FILE' not in os.environ:
    print("WARNING: LABELS_FILE not found in environment variables!")

if 'PREDS_FILE' not in os.environ:
    print("WARNING: PREDS_FILE not found in environment variables!")

LABELS_FILE = os.environ.get('LABELS_FILE')
PREDS_FILE = os.environ.get('PREDS_FILE')

@app.route('/api/health')
def health():
    return 'Hello, World', 200

@app.route('/api/get_data')
def get_data():
    """
    Return the current label and prediction data from json data files.

    :returns: Response object containing JSON data object. Object contains:\n
        - labelled: boolean, true if document label data is present\n
        - labelledDocs: object, contains document label data\n
        - predictions: object, contains document prediction data\n
        - docs: object, contains document text content\n
    """
    # Load labelled data
    labelled = True
    labels = dict()
    # Check if labels data file exists and load it
    try:
        with open(LABELS_FILE) as f:
            labels = json.load(f)
            if not labels:
                labelled = False
    except FileNotFoundError:
        labelled = False
        print("Labels file not found. Initialise some labels to create "
            "the file.")

    # Load predictions data
    predictions = dict()
    try:
        with open(PREDS_FILE) as f:
            predictions = json.load(f)
    except FileNotFoundError:
        print("Predictions file not found. Initialise some labels to create "
            "the file.")

    # Retrieve raw text data for each file
    files = file_handler.load_files()
    docs = dict()
    for i, file in enumerate(files):
        filepath = file_handler.DOC_DIRECTORY + file
        with open(filepath, encoding=FILE_ENCODING) as f:
            docs[files[i]]= f.read()
    
    # Return json response
    return json.dumps({
        "labelled": labelled,
        "labelledDocs": labels,
        "predictions": predictions,
        "docs": docs
    })

@app.route('/api/add_labels', methods=['POST'])
def add_labels():
    """
    Run classification with new labels and return predictions.

    :returns: Response object containing prediction data within JSON object
    """
    new_labels = request.get_json()
    
    # Write new labels to json data file
    with open(LABELS_FILE, 'w') as f:
        json.dump(new_labels, f)

    files = file_handler.load_files()
    # Add root directory to files
    for file in files:
        file = file_handler.DOC_DIRECTORY + file

    labelled_files = []
    labels = []
    for file, data in new_labels.items():
        # Add file and label to respective lists
        labelled_files.append(file_handler.DOC_DIRECTORY + file)
        labels.append(data['label'])
        # Remove file from files to predict
        files.remove(file)

    # Run classification using imported classification module
    predicted_labels, probabilities = \
        classification.classify(labelled_files, files, labels)

    # Create dictionary of predicted labels and their probabilities
    predictions = dict()
    for i, label in enumerate(predicted_labels):
        doc_prediction = {
            'label': label,
            'probability': probabilities[i]
        }
        predictions[files[i]] = doc_prediction

    # Write new predictions to json data file
    with open(PREDS_FILE, 'w') as f:
        json.dump(predictions, f)

    # Return json response
    return json.dumps(predictions)

@app.route('/api/reset_data')
def reset_data():
    """
    Reset the current label and prediction data.

    :returns: Empty 204 response object
    """
    # Remove json data files
    os.remove(LABELS_FILE)
    os.remove(PREDS_FILE)

    return ('', 204)

if __name__ == '__main__':
    app.run(host='0.0.0.0')
