"""
Module for handling dataset files.

Edit this module if your directory structure has changed.
"""

import os

if 'DOC_DIRECTORY' not in os.environ:
    print("WARNING: DOC_DIRECTORY not found in environment variables!")

# The directory of documents to classify
DOC_DIRECTORY = os.environ.get('DOC_DIRECTORY')

def load_files():
    """
    Return a list of files in the DOC_DIRECTORY.

    :returns: A list of file names
    """
    files = []
    # Get list of files in directory with relative paths
    for file in os.listdir(DOC_DIRECTORY):
        files.append(file)

    return files