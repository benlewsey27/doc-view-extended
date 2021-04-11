import { useEffect } from 'react';
import { draw } from './helpers/TreeMapD3.js';

const TreeMap = (props) => {  
  useEffect(() => {
    const labelledDocs = props.data.labelledDocs;
    const predictions = props.data.predictions;
    const labels = props.data.labels;

    const userLabels = labelledDocs ? labelledDocs.map(dp => dp.label) : [];
    const predictedLabels = predictions ? predictions.map(dp => dp.label) : [];
    const allLabels = userLabels.concat(predictedLabels);

    let data = [{ label: 'Origin'}];
    if (labels) {
      labels.forEach((label) => {
        const count = allLabels.reduce((n, currentLabel) => n + (currentLabel === label), 0);

        data.push({
          label,
          parent: 'Origin', 
          count,
        });
      });
    }

    draw(props, data);
  }, [props]);

  return (
    <div className={`div_${props.id}`}/>
  )
}

export default TreeMap;