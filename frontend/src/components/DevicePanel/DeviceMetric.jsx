import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge';
import styles from './devicePanel.module.css';

const METRIC_CONFIG = {
  'PM2.5': {
    min: 0,
    max: 50,
    thresholds: {
      good: 12,
      moderate: 35,
    },
  },
  CO: {
    min: 400,
    max: 2000,
    thresholds: {
      good: 1000,
      moderate: 1500,
    },
  },
  Temperature: {
    min: 0,
    max: 40,
    thresholds: {
      good: 18,
      moderate: 26,
    },
  },
  Humidity: {
    min: 0,
    max: 100,
    thresholds: {
      good: 30,
      moderate: 60,
    },
  },
};

const GRADIENTS = {
  green: {
    id: 'greenGradient',
    colors: ['#3E8525', '#ACF254'],
  },
  orange: {
    id: 'orangeGradient',
    colors: ['#FFC700', '#FF5C00'],
  },
  red: {
    id: 'redGradient',
    colors: ['#FF5C00', '#FF0000'],
  },
};

function getMetricStatus(metric, value) {
  const config = METRIC_CONFIG[metric];
  if (!config) {
    return 'green';
  }

  const { thresholds } = config;

  if (value <= thresholds.good) {
    return 'green';
  } else if (value <= thresholds.moderate) {
    return 'orange';
  } else {
    return 'red';
  }
}

function normalizeValue(metric, value) {
  const config = METRIC_CONFIG[metric];
  if (!config) {
    return 50;
  }

  const { min, max } = config;
  const normalized = ((value - min) / (max - min)) * 100;

  return Math.max(0, Math.min(100, normalized));
}

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
