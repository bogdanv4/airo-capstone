import { oauth2Client } from '../utils/oauth.js';

export const getGoogleAuthUrl = (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email',
    ],
    prompt: 'consent',
  });

  res.json({ url });
};

export const handleGoogleCallback = async (req, res) => {
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
};

export const verifyUser = async (req, res) => {
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
      try {
        const pictureUrl = userInfo.picture;
        const sizeParamRegex = /=s\d+(-c)?$/;

        if (sizeParamRegex.test(pictureUrl)) {
          userInfo.picture = pictureUrl.replace(sizeParamRegex, '=s400-c');
        } else {
          userInfo.picture = `${pictureUrl}=s400-c`;
        }

        try {
          new URL(userInfo.picture);
        } catch (urlError) {
          console.warn(
            'Invalid picture URL after modification, using original:',
            urlError,
          );
          userInfo.picture = pictureUrl;
        }
      } catch (error) {
        console.warn('Error modifying picture URL, using original:', error);
      }
    } else {
      console.warn('User info missing picture property:', {
        sub: userInfo.sub,
        email: userInfo.email,
      });
    }

    if (!userInfo.picture) {
      userInfo.picture = null;
    }

    res.json(userInfo);
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};

export const logout = async (req, res) => {
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
};
