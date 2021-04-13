import { useEffect } from 'react';
import { draw } from './helpers/TreeMapD3';

const TreeMap = (props) => {
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

  return <div className={`div_${props.id}`} />;
};

export default TreeMap;
