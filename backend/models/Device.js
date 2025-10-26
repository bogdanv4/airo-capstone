// import mongoose from 'mongoose';

// const deviceSchema = new mongoose.Schema(
//   {
//     userId: {
//       type: String,
//       required: true,
//       index: true,
//     },
//     type: {
//       type: String,
//       enum: ['device', 'gateway'],
//       required: true,
//     },
//     name: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     description: {
//       type: String,
//       trim: true,
//     },
//     gatewayID: {
//       type: String,
//       default: null,
//     },
//     key: {
//       type: String,
//     },
//     location: {
//       type: {
//         type: String,
//         enum: ['Point'],
//         default: 'Point',
//       },
//       coordinates: {
//         type: [Number],
//       },
//       lat: {
//         type: Number,
//         required: true,
//       },
//       lng: {
//         type: Number,
//         required: true,
//       },
//     },
//     metrics: {
//       type: Map,
//       of: Number,
//       default: {},
//     },
//     airQuality: {
//       type: String,
//       enum: ['green', 'yellow', 'red'],
//       default: 'green',
//     },
//   },
//   {
//     timestamps: true,
//   },
// );

// deviceSchema.index({ 'location.coordinates': '2dsphere' });

// deviceSchema.index({ userId: 1, type: 1 });

// deviceSchema.methods.calculateAirQuality = function () {
//   const pm2_5 = this.metrics?.get('pm2_5');
//   if (!pm2_5) {
//     return 'green';
//   }

//   if (pm2_5 <= 12) {
//     return 'green';
//   }
//   if (pm2_5 <= 35.4) {
//     return 'yellow';
//   }
//   return 'red';
// };

// deviceSchema.pre('save', function (next) {
//   if (this.location.lat && this.location.lng) {
//     this.location.coordinates = [this.location.lng, this.location.lat];
//   }

//   if (this.metrics?.get('pm2_5')) {
//     this.airQuality = this.calculateAirQuality();
//   }

//   next();
// });

// const Device = mongoose.model('Device', deviceSchema);

// export default Device;

import mongoose from 'mongoose';

const deviceSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ['device', 'gateway'],
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    gatewayID: {
      type: String,
      default: null,
    },
    key: {
      type: String,
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number],
      },
      lat: {
        type: Number,
        required: true,
      },
      lng: {
        type: Number,
        required: true,
      },
    },
    metrics: {
      type: Map,
      of: Number,
      default: {},
    },
    pm25: {
      type: Number,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

deviceSchema.index({ 'location.coordinates': '2dsphere' });
deviceSchema.index({ userId: 1, type: 1 });

deviceSchema.methods.getAirQualityColor = function () {
  const pm25 = this.pm25;

  if (!pm25 && pm25 !== 0) {
    return 'green';
  }

  if (pm25 < 12) {
    return 'green';
  }
  if (pm25 < 35) {
    return 'yellow';
  }
  return 'red';
};

deviceSchema.virtual('airQuality').get(function () {
  return this.getAirQualityColor();
});

deviceSchema.set('toJSON', { virtuals: true });
deviceSchema.set('toObject', { virtuals: true });

deviceSchema.pre('save', function (next) {
  if (this.location.lat && this.location.lng) {
    this.location.coordinates = [this.location.lng, this.location.lat];
  }

  next();
});

const Device = mongoose.model('Device', deviceSchema);

export default Device;
