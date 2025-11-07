import Device from '../models/Device.js';
import { DEVICE_TYPES } from '../constants/deviceTypes.js';

export const getAllDevicesAndGateways = async (req, res) => {
  try {
    const devices = await Device.find().sort({ createdAt: -1 });
    res.status(200).json(devices);
  } catch (error) {
    console.error('Error fetching all devices:', error);
    res.status(500).json({ error: 'Failed to fetch devices' });
  }
};

export const getAllDevices = async (req, res) => {
  try {
    const devices = await Device.find({ type: DEVICE_TYPES.DEVICE }).sort({
      createdAt: -1,
    });
    res.status(200).json(devices);
  } catch (error) {
    console.error('Error fetching devices:', error);
    res.status(500).json({ error: 'Failed to fetch devices' });
  }
};

export const getAllGateways = async (req, res) => {
  try {
    const gateways = await Device.find({ type: DEVICE_TYPES.GATEWAY }).sort({
      createdAt: -1,
    });
    res.status(200).json(gateways);
  } catch (error) {
    console.error('Error fetching gateways:', error);
    res.status(500).json({ error: 'Failed to fetch gateways' });
  }
};

export const getUserDevicesAndGateways = async (req, res) => {
  try {
    const { userId } = req.params;
    const devices = await Device.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json(devices);
  } catch (error) {
    console.error('Error fetching user devices:', error);
    res.status(500).json({ error: 'Failed to fetch devices' });
  }
};

export const getUserDevices = async (req, res) => {
  try {
    const { userId } = req.params;
    const devices = await Device.find({
      userId,
      type: DEVICE_TYPES.DEVICE,
    }).sort({ createdAt: -1 });
    res.status(200).json(devices);
  } catch (error) {
    console.error('Error fetching user devices:', error);
    res.status(500).json({ error: 'Failed to fetch devices' });
  }
};

export const getUserGateways = async (req, res) => {
  try {
    const { userId } = req.params;
    const gateways = await Device.find({
      userId,
      type: DEVICE_TYPES.GATEWAY,
    }).sort({ createdAt: -1 });
    res.status(200).json(gateways);
  } catch (error) {
    console.error('Error fetching user gateways:', error);
    res.status(500).json({ error: 'Failed to fetch gateways' });
  }
};

export const createDevice = async (req, res) => {
  try {
    const { userId, name, description, gatewayID, location, metrics } =
      req.body;

    if (!name || !description || !location || !userId) {
      return res.status(400).json({ error: 'Missing required fields!' });
    }

    if (!location.lat || !location.lng) {
      return res.status(400).json({ error: 'Invalid location format!' });
    }

    const newDevice = new Device({
      userId,
      type: DEVICE_TYPES.DEVICE,
      name,
      description,
      gatewayID: gatewayID || null,
      location: {
        lat: parseFloat(location.lat),
        lng: parseFloat(location.lng),
      },
      metrics: metrics || {},
    });

    await newDevice.save();

    res.status(201).json({
      message: 'Device added successfully!',
      device: newDevice,
    });
  } catch (error) {
    console.error('Error creating device:', error);
    res.status(500).json({ error: 'Failed to create device' });
  }
};

export const createGateway = async (req, res) => {
  try {
    const { userId, name, key, location } = req.body;

    if (!userId || !name || !key || !location) {
      return res.status(400).json({ error: 'Missing required fields!' });
    }

    if (!location.lat || !location.lng) {
      return res.status(400).json({ error: 'Invalid location format!' });
    }

    const newGateway = new Device({
      userId,
      type: DEVICE_TYPES.GATEWAY,
      name,
      key,
      location: {
        lat: parseFloat(location.lat),
        lng: parseFloat(location.lng),
      },
      metrics: {},
    });

    await newGateway.save();

    res.status(201).json({
      message: 'Gateway added successfully!',
      gateway: newGateway,
    });
  } catch (error) {
    console.error('Error creating gateway:', error);
    res.status(500).json({ error: 'Failed to create gateway' });
  }
};

export const getDeviceById = async (req, res) => {
  try {
    const device = await Device.findById(req.params.id);

    if (!device) {
      return res.status(404).json({ error: 'Device not found' });
    }

    res.status(200).json(device);
  } catch (error) {
    console.error('Error fetching device:', error);
    res.status(500).json({ error: 'Failed to fetch device' });
  }
};

export const updateDevice = async (req, res) => {
  try {
    const { name, description, gatewayID, location, metrics } = req.body;

    const device = await Device.findById(req.params.id);

    if (!device) {
      return res.status(404).json({ error: 'Device not found' });
    }

    if (name) {
      device.name = name;
    }
    if (description) {
      device.description = description;
    }
    if (gatewayID !== undefined) {
      device.gatewayID = gatewayID;
    }
    if (location) {
      device.location.lat = parseFloat(location.lat);
      device.location.lng = parseFloat(location.lng);
    }
    if (metrics) {
      device.metrics = metrics;
    }

    await device.save();

    res.status(200).json({
      message: 'Device updated successfully!',
      device,
    });
  } catch (error) {
    console.error('Error updating device:', error);
    res.status(500).json({ error: 'Failed to update device' });
  }
};

export const deleteDevice = async (req, res) => {
  try {
    const device = await Device.findByIdAndDelete(req.params.id);

    if (!device) {
      return res.status(404).json({ error: 'Device not found' });
    }

    res.status(200).json({ message: 'Device deleted successfully!' });
  } catch (error) {
    console.error('Error deleting device:', error);
    res.status(500).json({ error: 'Failed to delete device' });
  }
};

export const updateDeviceMetrics = async (req, res) => {
  try {
    const { id } = req.params;
    const { pm25, co, temp, humidity } = req.body;

    if (
      pm25 === undefined &&
      co === undefined &&
      temp === undefined &&
      humidity === undefined
    ) {
      return res.status(400).json({ error: 'At least one metric is required' });
    }

    const device = await Device.findById(id);

    if (!device) {
      return res.status(404).json({ error: 'Device not found' });
    }

    if (pm25 !== undefined) {
      device.metrics.set('pm2_5', pm25);
      device.pm25 = pm25;
    }
    if (co !== undefined) {
      device.metrics.set('co', co);
    }
    if (temp !== undefined) {
      device.metrics.set('temp', temp);
    }
    if (humidity !== undefined) {
      device.metrics.set('humidity', humidity);
    }

    await device.save();

    res.status(200).json({
      message: 'Metrics updated successfully',
      device,
    });
  } catch (error) {
    console.error('Error updating metrics:', error);
    res.status(500).json({ error: 'Failed to update metrics' });
  }
};
