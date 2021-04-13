import { useEffect } from 'react';
import { draw } from './helpers/PieChartD3';

const PieChart = (props) => {
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

  return <div className={`div_${props.id}`} />;
};

export default PieChart;
