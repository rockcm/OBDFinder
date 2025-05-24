// YouTube API Configuration
import { Platform } from 'react-native';

// For web builds, we need to use process.env, for native we use @env
let YOUTUBE_API_KEY: string;

if (Platform.OS === 'web') {
  // @ts-ignore - process.env is available at build time for web
  YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY || '';
  console.log('Web: API Key from process.env:', YOUTUBE_API_KEY ? 'Exists' : 'Empty');
} else {
  // For native platforms, use react-native-dotenv
  try {
    const { YOUTUBE_API_KEY: ENV_API_KEY } = require('@env');
    YOUTUBE_API_KEY = ENV_API_KEY || '';
    console.log('Native: API Key from @env:', YOUTUBE_API_KEY ? 'Exists' : 'Empty');
  } catch (error) {
    console.log('Error importing from @env:', error);
    YOUTUBE_API_KEY = '';
  }
}

export { YOUTUBE_API_KEY };
export const YOUTUBE_API_URL = 'https://www.googleapis.com/youtube/v3/search';
export const YOUTUBE_COMMENTS_URL = 'https://www.googleapis.com/youtube/v3/commentThreads';
export const YOUTUBE_VIDEOS_URL = 'https://www.googleapis.com/youtube/v3/videos'; 