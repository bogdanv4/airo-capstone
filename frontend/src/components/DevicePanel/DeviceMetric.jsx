import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge';
import styles from './devicePanel.module.css';
import {
  GRADIENTS,
  getMetricStatus,
  normalizeValue,
} from 'src/constants/metricConfig';

export default function DeviceMetric({ metric, normalRange, value = 0 }) {
  const status = getMetricStatus(metric, value);
  const normalizedValue = normalizeValue(metric, value);
  const gradient = GRADIENTS[status];
  const settings = {
    width: 100,
    height: 90,
    value: normalizedValue,
    startAngle: -130,
    endAngle: 130,
    innerRadius: '75%',
    outerRadius: '100%',
  };

  return (
    <div className={styles.metric}>
      <div className={styles.metric__title}>
        <h2>{metric}</h2>
        <p className={normalRange ? '' : styles.metric__rangeInvisible}>
          Normal range: {normalRange}
        </p>
      </div>

      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <defs>
          {Object.values(GRADIENTS).map((grad) => (
            <linearGradient
              key={grad.id}
              id={grad.id}
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor={grad.colors[0]} />
              <stop offset="100%" stopColor={grad.colors[1]} />
            </linearGradient>
          ))}
        </defs>
      </svg>

      <Gauge
        {...settings}
        text={() => `${value.toFixed(1)}`}
        sx={(theme) => ({
          [`& .${gaugeClasses.valueText}`]: {
            fontSize: 16,
          },
          [`& .${gaugeClasses.valueArc}`]: {
            fill: `url(#${gradient.id})`,
          },
          [`& .${gaugeClasses.referenceArc}`]: {
            fill: theme.palette.text.disabled,
          },
        })}
      />
    </div>
  );
}
