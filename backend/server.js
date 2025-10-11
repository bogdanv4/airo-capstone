import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { OAuth2Client } from 'google-auth-library';

dotenv.config();

const app = express();
const PORT = 3000;

import { data, freeId } from './data/data.js';

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

// ============ EXISTING ROUTES ============

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
