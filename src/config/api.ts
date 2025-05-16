// YouTube API Configuration
import { YOUTUBE_API_KEY as ENV_API_KEY } from '@env';

// For debugging - comparing environment variable vs hardcoded value
const apiKeyFromEnv = ENV_API_KEY;
console.log('API Key from env:', apiKeyFromEnv ? 'Exists' : 'Empty');

// Use the environment variable, but fallback to hardcoded key for testing
export const YOUTUBE_API_KEY = apiKeyFromEnv;
export const YOUTUBE_API_URL = 'https://www.googleapis.com/youtube/v3/search';
export const YOUTUBE_COMMENTS_URL = 'https://www.googleapis.com/youtube/v3/commentThreads'; 