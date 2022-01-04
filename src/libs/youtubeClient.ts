import { google } from 'googleapis';

const jwt = new google.auth.JWT({
  scopes: ['https://www.googleapis.com/auth/youtube.readonly'],
});

jwt.fromJSON(JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JWT));

export default {
  client: google.youtube('v3'),
  auth: jwt,
};
