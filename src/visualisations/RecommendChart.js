import { useEffect } from 'react';
import { draw } from './helpers/RecommendChartD3.js';

const RecommendChart = (props) => {  
  useEffect(() => {
    let predictions = props.data.predictions;

    if (predictions) {
      predictions = predictions.filter(dp => dp.label === props.filter);
    }

    const data = predictions.sort((a, b) => {
      if (a.probability > b.probability) return -1;
      if (a.probability < b.probability) return 1;
      return 0;
    }).slice(0,3);

    data.forEach(dp => {
      dp.id = data.indexOf(dp) + 1;
    });

    draw(props, data);
  }, [props]);

  return (
    <div className={`div_${props.id}`}/>
  )
}

export default RecommendChart;