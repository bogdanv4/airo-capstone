import express from 'express';
import {
  getGoogleAuthUrl,
  handleGoogleCallback,
  verifyUser,
  logout,
} from '../controllers/auth.controller.js';

const router = express.Router();

router.get('/google/url', getGoogleAuthUrl);
router.get('/google/callback', handleGoogleCallback);
router.get('/verify', verifyUser);
router.post('/logout', logout);

export default router;
