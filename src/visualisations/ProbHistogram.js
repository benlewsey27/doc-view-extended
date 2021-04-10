import { useEffect } from 'react';
import { draw } from './helpers/ProbHistogramD3.js';

const ProbHistogram = (props) => {  
  useEffect(() => {
    const predictions = props.data.predictions
    const data = predictions ? predictions.map(dp => dp.probability) : [];
    
    draw(props, data);
  }, [props]);

  return (
    <div className={`div_${props.id}`}/>
  )
}

export default ProbHistogram;