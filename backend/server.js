import express from 'express';
import cors from 'cors';
const app = express();
const PORT = 3000;

import { data, freeId } from './data/data.js';

const AVAILABLE_TYPES = {
  DEVICE: 'device',
  GATEWAY: 'gateway',
};

app.use(cors());

app.get('/devices', (req, res) => {
  const devices = data.filter((item) => item.type === AVAILABLE_TYPES.DEVICE);
  res.status(200).json(devices);
});

app.get('/gateways', (req, res) => {
  const gateways = data.filter((item) => item.type === AVAILABLE_TYPES.GATEWAY);
  res.status(200).json(gateways);
});

app.get('/devices/:userId', (req, res) => {
  const userId = req.params.userId;
  const devices = data.filter(
    (item) => item.type === AVAILABLE_TYPES.DEVICE && item.userId === userId,
  );
  res.status(200).json(devices);
});

app.get('/gateways/:userId', (req, res) => {
  const userId = req.params.userId;
  const gateways = data.filter(
    (item) => item.type === AVAILABLE_TYPES.GATEWAY && item.userId == userId,
  );
  res.status(200).json(gateways);
});

app.post('/device', (req, res) => {
  const { userId, name, description, gatewayID, location, metrics } = req.body;

  if (!name || !description || !location || !userId) {
    return res.status(400).json({ error: 'Missing required fields!' });
  }

  let customId = freeId.length ? freeId.shift() : (data.length + 1).toString();

  const newDevice = {
    id: customId,
    userId,
    type: AVAILABLE_TYPES.DEVICE,
    name,
    description,
    gatewayID,
    location,
    metrics,
  };

  data.push(newDevice);
  res
    .status(201)
    .json({ message: 'Device added successfully!', device: newDevice });
});

app.post('/gateway', (req, res) => {
  const { userId, name, key, location } = req.body;

  if (!userId || !name || !key || !location) {
    return res.status(400).json({ error: 'Missing required fields!' });
  }

  let customId = freeId.length ? freeId.shift() : (data.length + 1).toString();

  const newGateway = {
    id: customId,
    userId,
    type: AVAILABLE_TYPES.GATEWAY,
    name,
    key,
    location,
  };

  data.push(newGateway);

  res
    .status(201)
    .json({ message: 'Gateway added successfully!', gateway: newGateway });
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
