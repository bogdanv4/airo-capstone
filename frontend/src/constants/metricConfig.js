export const METRIC_CONFIG = {
  'PM2.5': {
    min: 0,
    max: 50,
    thresholds: {
      good: 12,
      moderate: 35,
    },
  },
  CO2: {
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

export const GRADIENTS = {
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

export function getMetricStatus(metric, value) {
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

export function normalizeValue(metric, value) {
  const config = METRIC_CONFIG[metric];
  if (!config) {
    return 50;
  }

  const { min, max } = config;
  const normalized = ((value - min) / (max - min)) * 100;

  return Math.max(0, Math.min(100, normalized));
}
