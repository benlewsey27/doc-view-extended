# DocView - Text classification and visualisation tool

This tool is meant for researchers to test different methods of text-classification (using active learning) and visualisation of said classification. The application does not give an example of the best solution to these problems, but instead provides out of the box functionality and modularity to allow testing different methods with very few changes to the underlying code.

## Contributors
- Thomas Torsney-Weir - Project Supervisor
- Etienne Badoche - DocView Creator (Initial Commit)
- Benjamin Lewsey - Extended Visualisations

## Setup

These instructions assume you have either downloaded or cloned the source code from its available repository.

### Adding a dataset

For the application to run correctly, a document dataset needs to be added. Navigate to the `classification` directory and create a new `data` folder. Within this folder, add your documents (these should be .txt files).

Open `file_handler.py` for editing and change the `DOC_DIRECTORY` variable to be the root directory of your new dataset. You may wish to have several document directories within `data`, to then pick and choose the one you want to use by changing this variable. 

## Running the application

The application uses docker and docker-compose to handle local deployment.

Ensure docker is installed and running on your device. Then run the following in the terminal:

``` bash
docker-compose build
docker-compose up

# Open the application on localhost:8000
# Exit the application in the terminal with Ctrl+C

docker-compose down
```

## Using the application

The application is fairly simple in its usage. If you are running it for the first time, you will be prompted to label some documents. It is up to you how many to label initially. Once you are done labelling, simply press **Finish Labelling** to send the labels to the classification algorithm. Depending on the size of your dataset and the chosen algorithm, it may take some time to return the predictions. 

Once the predictions have returned, you will see a list of your documents on the left, with their labels. Documents you have labelled will show green labels, whereas predicted labels will show as blue. Using the search bar allows you to filter the documents by filename.

By default a bar chart will show the number of documents for each label, which takes both user labels and predictions into account. The suggested documents sections will show 10 documents the algorithm is most unsure of.

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

## Changing the visualisation

Changing the visualisation is also simple, although a couple more changes need to be made to the application code.

Within the `visualisation` subfolder in `src`, you will find the different visualisation classes to provide to the application. To create a new one you will need to create a new class. The class constructor should accept:

- `DOMElementId`, the id for the parent DOM element to append to
- `width`, the width of the DOM element
- `height`, the height of the DOM element
- `data`, the data object needed to create the graph

The class should draw the graph on construction.

The class should also have an `updateChart` method which updates the `width`, `height` and `data`, as well as update the the graph itself.

The `DOMElementId` is supplied so that the created graph can be directly appended to the document upon creation. 

To finish setting up your new visualisation class, you will need to edit `VisualiserContainer`, found in `src\containers`.

Import your new class at the top as "Visualisation" and comment the previous visualisation import (or remove it if you no will no longer need it).

If your class requires a different set of data, make sure to change the `data` object in both `componentDidMount()` and `componentDidUpdate()`. The `getSelectedLabel()` allows you to get the label for the selected document if you wish for your visualisation to change depending on this.

## Changing the app

Here is some guidance if you wish to make modifications or improvements to the application itself.

The React logic is separated into containers and components. Containers handle the business logic, whereas components handle the presentation logic.

If you wish to change the look of the application, each component has an associated `.css` file, and the bootstrap framework has been included and used in most places. 

Here is an overview of the component hierarchy (wherever a container class is provided, it will be called first and will call its corresponding component):

- App
    - Navbar
    - Body
        - DocList
            - DocButton
        - Visualiser
        - Suggestions
        - TextReader
    - Modal

JsDoc documentation is provided for every class and function, which you can find in `docs\index.html`.

## Extended Visualisations Notes

Coming Soon!