import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { OAuth2Client } from 'google-auth-library';
import connectDB from './config/database.js';
import Device from './models/Device.js';

dotenv.config();

const app = express();
const PORT = 3000;

connectDB();

const AVAILABLE_TYPES = {
  DEVICE: 'device',
  GATEWAY: 'gateway',
};

const oauth2Client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI,
);

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);
app.use(express.json());

// ============ AUTH ROUTES ============

app.get('/auth/google/url', (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email',
    ],
    prompt: 'consent',
  });

  res.json({ url });
});

app.get('/auth/google/callback', async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.redirect(`${process.env.FRONTEND_URL}?error=no_code`);
  }

  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    const redirectUrl = `${process.env.FRONTEND_URL}?token=${tokens.access_token}`;
    res.redirect(redirectUrl);
  } catch (error) {
    console.error('Error during OAuth callback:', error);
    res.redirect(`${process.env.FRONTEND_URL}?error=auth_failed`);
  }
});

app.get('/auth/verify', async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const userInfoResponse = await fetch(
      'https://www.googleapis.com/oauth2/v3/userinfo',
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    if (!userInfoResponse.ok) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const userInfo = await userInfoResponse.json();

    if (userInfo.picture) {
      const baseUrl = userInfo.picture.split('=')[0];
      userInfo.picture = `${baseUrl}=s400-c`;
    }

    res.json(userInfo);
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({ error: 'Invalid or expired token' });
  }
});

app.post('/auth/logout', async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ error: 'No token provided' });
  }

  try {
    await fetch(`https://oauth2.googleapis.com/revoke?token=${token}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Logout failed' });
  }
});

// ============ DEVICE/GATEWAY ROUTES ============

// Get all devices and gateways
app.get('/all', async (req, res) => {
  try {
    const devices = await Device.find().sort({ createdAt: -1 });
    res.status(200).json(devices);
  } catch (error) {
    console.error('Error fetching all devices:', error);
    res.status(500).json({ error: 'Failed to fetch devices' });
  }
});

// Get all devices only
app.get('/devices', async (req, res) => {
  try {
    const devices = await Device.find({ type: AVAILABLE_TYPES.DEVICE }).sort({
      createdAt: -1,
    });
    res.status(200).json(devices);
  } catch (error) {
    console.error('Error fetching devices:', error);
    res.status(500).json({ error: 'Failed to fetch devices' });
  }
});

// Get all gateways only
app.get('/gateways', async (req, res) => {
  try {
    const gateways = await Device.find({ type: AVAILABLE_TYPES.GATEWAY }).sort({
      createdAt: -1,
    });
    res.status(200).json(gateways);
  } catch (error) {
    console.error('Error fetching gateways:', error);
    res.status(500).json({ error: 'Failed to fetch gateways' });
  }
});

// Get all devices and gateways by userId
app.get('/all/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const devices = await Device.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json(devices);
  } catch (error) {
    console.error('Error fetching user devices:', error);
    res.status(500).json({ error: 'Failed to fetch devices' });
  }
});

// Get devices by userId
app.get('/devices/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const devices = await Device.find({
      userId,
      type: AVAILABLE_TYPES.DEVICE,
    }).sort({ createdAt: -1 });
    res.status(200).json(devices);
  } catch (error) {
    console.error('Error fetching user devices:', error);
    res.status(500).json({ error: 'Failed to fetch devices' });
  }
});

// Get gateways by userId
app.get('/gateways/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const gateways = await Device.find({
      userId,
      type: AVAILABLE_TYPES.GATEWAY,
    }).sort({ createdAt: -1 });
    res.status(200).json(gateways);
  } catch (error) {
    console.error('Error fetching user gateways:', error);
    res.status(500).json({ error: 'Failed to fetch gateways' });
  }
});

// Create new device
app.post('/device', async (req, res) => {
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
      type: AVAILABLE_TYPES.DEVICE,
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
});

// Create new gateway
app.post('/gateway', async (req, res) => {
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
      type: AVAILABLE_TYPES.GATEWAY,
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
});

// Get device by ID
app.get('/device/:id', async (req, res) => {
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
});

// Update device
app.put('/device/:id', async (req, res) => {
  try {
    const { name, description, gatewayID, location, metrics } = req.body;

    const device = await Device.findById(req.params.id);

    if (!device) {
      return res.status(404).json({ error: 'Device not found' });
    }

    if (name) {
      device.name = name;
    }
    if (description) device.description = description;
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
});

// Delete device
app.delete('/device/:id', async (req, res) => {
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
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
