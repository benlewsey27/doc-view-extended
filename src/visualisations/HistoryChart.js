import { useEffect } from 'react';
import { draw } from './helpers/HistoryChartD3';

const HistoryChart = (props) => {
  useEffect(() => {
    const { labelledDocs } = props.data;

    let tmp = [];
    if (labelledDocs) {
      tmp = labelledDocs.map((dp) => {
        const today = new Date();
        const date = new Date(dp.timestamp);

        if (date.getMonth() !== today.getMonth()) {
          return null;
        }

        const first = new Date(
          Date.parse(`${date.getFullYear()}-${date.getMonth() + 1}-1`),
        );
        const firstDay = first.getDay();
        let currentSunday = 7 - firstDay + 1;

        let week = 0;
        let isDone = false;

        while (!isDone) {
          if (date.getDate() <= currentSunday) {
            week += 1;
            isDone = true;
          } else {
            currentSunday += 7;
            week += 1;
          }
        }

        let day = '';
        switch (date.getDay()) {
          case 0:
            day = 'Sun';
            break;
          case 1:
            day = 'Mon';
            break;
          case 2:
            day = 'Tues';
            break;
          case 3:
            day = 'Wed';
            break;
          case 4:
            day = 'Thurs';
            break;
          case 5:
            day = 'Fri';
            break;
          case 6:
            day = 'Sat';
            break;
          default:
            day = null;
            break;
        }

        return {
          week,
          day,
          label: dp.label,
          timestamp: dp.timestamp,
        };
      });
    }

    const data = [];
    tmp.forEach((dp) => {
      if (dp) {
        const { week, day } = dp;

        let isFound = false;
        data.forEach((d) => {
          if (d.week === week && d.day === day) {
            // eslint-disable-next-line no-param-reassign
            d.count += 1;
            isFound = true;
          }
        });

        if (!isFound) {
          data.push({
            week,
            day,
            count: 1,
          });
        }
      }
    });

    let maxCount = 0;
    data.forEach((dp) => {
      if (dp.count > maxCount) {
        maxCount = dp.count;
      }
    });

    draw(props, data, maxCount);
  }, [props]);

  return <div className={`div_${props.id}`} />;
};

export default HistoryChart;
