"""
Basic implementation of Logistic Regression Classification

Uses CountVectorizer (i.e. Bag of Words) for feature extraction.
"""

import numpy as np

from sklearn.feature_extraction.text import CountVectorizer
from sklearn.linear_model import LogisticRegression


def classify(labelled_files, unlabelled_files, labels):
    """
    Run the classification on the given text files.

    :param List labelled_files: The files labelled by the user 
        (i.e. training set)
    :param List unlabelled_files: The files to run classification on
    :param List labels: The labels given for each file in labelled_files

    :returns: - (List) predicted_labels: The list of predicted labels
        - (List) probabilities: The list of probabilities representing 
            certainty for predicted label
    """
    # Extract features using CountVectorizer (Bag of Words)
    count_vect = CountVectorizer()
    counts = count_vect.fit_transform(labelled_files)

    # Fit classifier to training data (user labels)
    clf = LogisticRegression().fit(counts, labels)

    # Transform CountVectorizer to unlabelled files
    new_counts = count_vect.transform(unlabelled_files)

    # Run prediction on new counts
    predicted_labels = clf.predict(new_counts)
    probabilities = clf.predict_proba(new_counts)

    # Reduce probabilities to only show for predicted label
    probabilities = np.amax(probabilities, axis=1)

    return predicted_labels, probabilities