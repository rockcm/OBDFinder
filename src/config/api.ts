// YouTube API Configuration
import { Platform } from 'react-native';

// Expo makes EXPO_PUBLIC_ prefixed vars available directly via process.env
// No special handling needed for web vs native with this approach.
const YOUTUBE_API_KEY = process.env.EXPO_PUBLIC_YOUTUBE_API_KEY || '';

if (Platform.OS === 'web') {
  console.log('Web: API Key from process.env.EXPO_PUBLIC_YOUTUBE_API_KEY:', YOUTUBE_API_KEY ? 'Exists' : 'Empty or Undefined');
} else {
  console.log('Native: API Key from process.env.EXPO_PUBLIC_YOUTUBE_API_KEY:', YOUTUBE_API_KEY ? 'Exists' : 'Empty or Undefined');
}

// Fallback for local development if using a .env file with react-native-dotenv
// This part is more for local native development if you're not using EXPO_PUBLIC_ prefix there.
let finalApiKey = YOUTUBE_API_KEY;
if (!finalApiKey && Platform.OS !== 'web') {
  try {
    const { YOUTUBE_API_KEY: ENV_API_KEY_DOTENV } = require('@env');
    if (ENV_API_KEY_DOTENV) {
      finalApiKey = ENV_API_KEY_DOTENV;
      console.log('Native: Using API Key from @env (react-native-dotenv) as fallback:', finalApiKey ? 'Exists' : 'Empty');
    }
  } catch (error) {
    // @env is not available or YOUTUBE_API_KEY is not in .env
    console.log('Native: @env not available or YOUTUBE_API_KEY not in .env for fallback.');
  }
}

export { finalApiKey as YOUTUBE_API_KEY };
export const YOUTUBE_API_URL = 'https://www.googleapis.com/youtube/v3/search';
export const YOUTUBE_COMMENTS_URL = 'https://www.googleapis.com/youtube/v3/commentThreads';
export const YOUTUBE_VIDEOS_URL = 'https://www.googleapis.com/youtube/v3/videos'; 