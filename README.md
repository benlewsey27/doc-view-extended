# DocView - Text classification and visualisation tool

This tool is meant for researchers to test different methods of text-classification (using active learning) and visualisation of said classification. The application does not give an example of the best solution to these problems, but instead provides out of the box functionality and modularity to allow testing different methods with very few changes to the underlying code.

## Contributors

- Thomas Torsney-Weir - Project Supervisor
- Etienne Badoche - DocView Creator (Initial Commit)
- Benjamin Lewsey - Extended Visualisations

## Setup

These instructions assume you have either downloaded or cloned the source code from its available repository.

### Environment Variables

Environment Variables are used to set the data directory and label file paths in the docker-compose configuration. Defaults are stable, but change if required.

```
environment:
    - DOC_DIRECTORY=./data/research_papers/
    - LABELS_FILE=./data/labels.json
    - PREDS_FILE=./data/predictions.json
```

Note: If using relative filepaths, the code reads the path from the src/classification directory. For example, if the document directory is `src/classification/data/research_papers/`, the relative filepath would be `./data/research_papers/`.

**Data Directory**

For the application to run correctly, a document dataset needs to be added.

1. Create a directory to store the documents (e.g. classification/data/research_papers/).
2. Store the documents (.txt files) in the directory created in step 1.
3. Set the directory path using an environment variable called `DOC_DIRECTORY`.

**Label File Paths**

The backend will store the current label state in json files, one for labels and one for predictions.

1. Ensure the directory structure exists for each filepath.
2. Set the label file path in `LABELS_FILE`.
3. Set the prediction file path in `PREDS_FILE`.

## Running the application

The application uses docker and docker-compose to handle local deployment.

Ensure docker is installed and is running on your device. Then run the following in the terminal:

```bash
docker-compose build
docker-compose up

# Open the application on localhost:8000
# Exit the application in the terminal with Ctrl+C

docker-compose down
```

## Using the application

The application is fairly simple in its usage. If you are running it for the first time, you will be prompted to label some documents. It is up to you how many to label initially, **but a minimum of two different labels is required**. Once you are done labelling, simply press the **Finish Labelling** button to send the labels to the classification algorithm. Depending on the size of your dataset and the chosen algorithm, it may take some time to return the predictions.

Once the predictions have returned, you will see a list of your documents on the left, with their labels. Documents you have labelled will show green labels, whereas predicted labels will show as blue. Using the search bar allows you to filter the documents by filename.

On the right hand side, you will see one or more visualisations as well as a list of suggested documents below. The suggested documents sections will show 10 documents the algorithm is most unsure of. More information regarding the visualisations can be found in the `Extended Visualisations` section below.

By clicking on `View` in the navigation bar, you have the option to show or hide the text content of the selected document.

The `File` button of the navigation bar offers several options.

- `Label selected`: Add a label to the selected document. The popup will close once the label is added and the classification will run again.
- `Label uncertain`: Label documents the algorithm is uncertain of. Just like the initial labelling, this will continue until you press **Finish Labelling**.
- `Reset data`: This will reset the label and prediction data, and refresh the application. You will be prompted to label documents again.

## Changing the classification

Adding a new classification algorithm to the application is straightforward. Simply write a new python script which contains the following function:

`classify (labelled_files, unlabelled_files, labels)` where:

- `labelled_files` is the list of files that have been labelled by the user
- `unlabelled_files` is the list of files to run classification on
- `labels` is the list of labels given by the user for the labelled files

This function should return two lists:

- `predictions` the list of predicted labels matching the unlabelled files
- `probabilities` the list of probabilities that the classifier has predicted the correct label for each file.

Once the script is ready, you can import it in `server.py`, and comment out the current classification import (or remove it if you won't be using it again). If you `import <new_classification_name> as classification`, you will not need to update any references within the server itself.

You can find the documentation for the python modules in `src\classification\docs\build\html\index.html`.

## Changing the visualisations

Changing the visualisation is also simple, although a couple more changes need to be made to the application code.

Within the `visualisations` subfolder in `src`, you will find the different visualisation components to provide to the application. To create a new one you will need to create a new component, as well as a D3 script within the `helpers` subfolder.

To finish setting up your new visualisation component, you will need to edit `VisualiserContainer`, found in `src\containers`.

## Extended Visualisations

The aim of these visualisations is to provide the everyday user with the tools required to gain a better understanding of a document collection.

### Collection Overview Visualisations

In the visualisations section of the user interface the user will initially see five different visualisaions in a dashboard format. Please find a description of each visualisation below.

**Tree Map**
The Tree Map shows the distribution of documents per label. The size of each rectange relates to the relational size of each label within the document collection. The relational size of each label is also shown as a percentage along side the text. The tree map is the main form of interaction within the visualisations.

**Pie Chart**
When viewing the collection overview visualisations, the Pie Chart shows the total number of labelled and unlabelled documents in the document collection as a whole. The number of documents is also shown in text below the Pie Chart. The two colours represent the difference between the labelled documents (blue) and unlabelled documents (grey).

**History Chart**
The History Chart uses document metadata to show the number of user labelled documents for the current month. The x-axis shows the day of the week (Mon-Sun) and the y-axis shows the week number (0-5, top to bottom). The more documents labelled, the darker the colour. The colour scheme is spread out over all the dates that month.

**Stacked Bar Chart**
The Stacked Bar Chart shows the total number of labelled and unlabelled documents in the document collection per label. The x-axis shows the document labels and the y-axis shows the total number of documents per label. The two colours represent the difference between the labelled documents (blue) and unlabelled documents (grey).

### Label-Specific Visualisations

When a label is selected on the Tree Map, some different visualisations are shown on the right hand side. Please find a description of each visualisation below.

> Note: From here, the user can select another label, or return to the collection overview visualisations by clicking on the already selected rectange, coloured in grey.

**Label-Specific Pie Chart**
The Label-Specific Pie Chart is simular to the collection overview Pie Chart, but is filtered to show the number of labelled and unlabelled documents for a specific label.

**Arc Chart**
The Arc Chart shows the average strength of predictions for a specific label. The average percentage is also shown in text below the Arc Chart. The blue colour visually represents the average strength of predictions, where 100% probability is a full blue arc.

> Note: A full arc may also represent that all documents with a specific label is already labelled. This can be verified by looking at the Label-Specific Pie Chart.

**Recommendation Chart**
The recommendation chart shows the top three strongest and unlabelled documents. This visualisation aims to provide the user with the most likely documents if they are researching a specific label.

> Note: This visualisation may display less then three rectanges, specifically if there are less than three documents unlabelled with the same estimated label. If all documents are labelled with a specific label, no rectanges will be displayed.
