"""
Basic implementation of Naive Bayes Classification

Uses a combination of CoutVectorizer (i.e. Bag of Words)
and TF-IDF for feature extractions
"""

import numpy as np

from sklearn.feature_extraction.text import CountVectorizer
from sklearn.feature_extraction.text import TfidfTransformer
from sklearn.naive_bayes import MultinomialNB


def classify(labelled_files, unlabelled_files, labels):
    """
    Run the classification on the given text file.

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

    # Transform counts using TF-IDF
    tfidf_transformer = TfidfTransformer()
    tfidf = tfidf_transformer.fit_transform(counts)

    # Fit classifier to training data (user labels)
    clf = MultinomialNB().fit(tfidf, labels)

    # Transform feature extractions to unlabelled files
    new_counts = count_vect.transform(unlabelled_files)
    new_tfidf = tfidf_transformer.transform(new_counts)

    # Run prediction on new features
    predicted_labels = clf.predict(new_tfidf)
    probabilities = clf.predict_proba(new_tfidf)

    # Reduce probabilities to only show for predicted label
    probabilities = np.amax(probabilities, axis=1)

    return predicted_labels, probabilities

