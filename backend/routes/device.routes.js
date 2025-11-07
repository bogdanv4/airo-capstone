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
  updateDeviceMetrics,
} from '../controllers/device.controller.js';

const router = express.Router();

router.get('/all', getAllDevicesAndGateways);
router.get('/devices', getAllDevices);
router.get('/gateways', getAllGateways);
router.get('/all/:userId', getUserDevicesAndGateways);
router.get('/devices/:userId', getUserDevices);
router.get('/gateways/:userId', getUserGateways);
router.get('/device/:id', getDeviceById);
router.post('/device', createDevice);
router.post('/gateway', createGateway);
router.put('/device/:id', updateDevice);
router.patch('/device/:id/metrics', updateDeviceMetrics);
router.delete('/device/:id', deleteDevice);

export default router;
