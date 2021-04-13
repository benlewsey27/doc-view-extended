import { useEffect } from 'react';
import { draw } from './helpers/PieChartD3';

/**
 * React container component used to handle the Pie Chart visualisation.
 * Renders the visualisation container and calls d3 graph operations.
 */
const PieChart = (props) => {
  /**
   * React callback hook. Formats the document data and calls the d3 graph operations.
   *
   * Formats the data to retrieve the number of labelled and unlabelled documents.
   * Optionally, filters by a specific label.
   */
  useEffect(() => {
    let { labelledDocs, predictions } = props.data;

    if (labelledDocs) {
      labelledDocs = labelledDocs.filter((dp) =>
        props.filter ? dp.label === props.filter : true,
      );
    }

    if (predictions) {
      predictions = predictions.filter((dp) =>
        props.filter ? dp.label === props.filter : true,
      );
    }

    const data = [
      {
        type: 'labelled',
        count: labelledDocs ? labelledDocs.length : 0,
      },
      {
        type: 'unlabelled',
        count: predictions ? predictions.length : 0,
      },
    ];

    draw(props, data);
  }, [props]);

  /**
   * Renders a <div> element to mount the SVG from d3.
   */
  return <div className={`div_${props.id}`} />;
};

export default PieChart;
