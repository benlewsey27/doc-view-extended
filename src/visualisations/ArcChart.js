import { useEffect } from 'react';
import { draw } from './helpers/ArcChartD3';

const ArcChart = (props) => {
  useEffect(() => {
    const predictions = props.data.predictions.filter(
      (dp) => dp.label === props.filter,
    );

    let avgProbabilityRounded;
    if (predictions.length) {
      const avgProbability =
        predictions.reduce((i, data) => i + data.probability, 0) /
        predictions.length;
      avgProbabilityRounded = Math.round(avgProbability * 100) / 100;
    } else {
      avgProbabilityRounded = 1;
    }

    draw(props, avgProbabilityRounded);
  }, [props]);

  return <div className={`div_${props.id}`} />;
};

export default ArcChart;
