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

// Update route
router.put('/device/:id', updateDevice);

// Delete route
router.delete('/device/:id', deleteDevice);

export default router;
