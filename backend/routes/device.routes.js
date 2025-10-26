import express from 'express';
import {
  getAllDevicesAndGateways,
  getAllDevices,
  getAllGateways,
  getUserDevicesAndGateways,
  getUserDevices,
  getUserGateways,
  createDevice,
  createGateway,
  getDeviceById,
  updateDevice,
  deleteDevice,
  updateDeviceAirQuality,
} from '../controllers/device.controller.js';

const router = express.Router();

// Get routes
router.get('/all', getAllDevicesAndGateways);
router.get('/devices', getAllDevices);
router.get('/gateways', getAllGateways);
router.get('/all/:userId', getUserDevicesAndGateways);
router.get('/devices/:userId', getUserDevices);
router.get('/gateways/:userId', getUserGateways);
router.get('/device/:id', getDeviceById);

// Create routes
router.post('/device', createDevice);
router.post('/gateway', createGateway);

// Update routes
router.put('/device/:id', updateDevice);
router.patch('/device/:id/air-quality', updateDeviceAirQuality);

// Delete route
router.delete('/device/:id', deleteDevice);

export default router;
