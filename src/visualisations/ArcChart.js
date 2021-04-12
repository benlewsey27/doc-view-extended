import { useEffect } from 'react';
import { draw } from './helpers/ArcChartD3.js';

const ArcChart = (props) => {  
  useEffect(() => {
    const predictions = props.data.predictions.filter(dp => dp.label === props.filter);
    
    const avgProbability = predictions.reduce((i, data) => i + data.probability, 0) / predictions.length;
    const avgProbabilityRounded = Math.round(avgProbability * 100) / 100;
    
    draw(props, avgProbabilityRounded);
  }, [props]);

  return (
    <div className={`div_${props.id}`}/>
  )
}

export default ArcChart;
