import { useEffect } from 'react';
import { draw } from './helpers/RecommendChartD3';

/**
 * React container component used to handle the Recommended Documents visualisation.
 * Renders the visualisation container and calls d3 graph operations.
 */
const RecommendChart = (props) => {
  /**
   * React callback hook. Formats the document data and calls the d3 graph operations.
   *
   * Formats the data to retrieve the top three most probable documents with a specific label.
   */
  useEffect(() => {
    let { predictions } = props.data;

    if (predictions) {
      predictions = predictions.filter((dp) => dp.label === props.filter);
    }

    const data = predictions
      .sort((a, b) => {
        if (a.probability > b.probability) return -1;
        if (a.probability < b.probability) return 1;
        return 0;
      })
      .slice(0, 3);

    data.map((dp) => {
      const tmp = dp;
      tmp.id = data.indexOf(dp) + 1;

      return tmp;
    });

    draw(props, data);
  }, [props]);

  /**
   * Renders a <div> element to mount the SVG from d3.
   */
  return <div className={`div_${props.id}`} />;
};

export default RecommendChart;
