import { useEffect } from 'react';
import { draw } from './helpers/TreeMapD3';

/**
 * React container component used to handle the Tree Map visualisation.
 * Renders the visualisation container and calls d3 graph operations.
 */
const TreeMap = (props) => {
  /**
   * React callback hook. Formats the document data and calls the d3 graph operations.
   *
   * Formats the data to retrieve the number of labels in labelled and unlabelled documents.
   */
  useEffect(() => {
    const { labelledDocs, predictions, labels } = props.data;

    const userLabels = labelledDocs ? labelledDocs.map((dp) => dp.label) : [];
    const predictedLabels = predictions
      ? predictions.map((dp) => dp.label)
      : [];
    const allLabels = userLabels.concat(predictedLabels);

    const data = [{ label: 'Origin' }];
    if (labels) {
      labels.forEach((label) => {
        const count = allLabels.reduce(
          (n, currentLabel) => n + (currentLabel === label),
          0,
        );

        data.push({
          label,
          parent: 'Origin',
          count,
        });
      });
    }

    draw(props, data);
  }, [props]);

  /**
   * Renders a <div> element to mount the SVG from d3.
   */
  return <div className={`div_${props.id}`} />;
};

export default TreeMap;
