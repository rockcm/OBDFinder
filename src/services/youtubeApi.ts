import axios from 'axios';
import { YOUTUBE_API_KEY, YOUTUBE_API_URL } from '../config/api';
import { YouTubeSearchResponse, YouTubeVideo } from '../types';

/**
 * Search YouTube videos for the given OBD code
 * @param obdCode The OBD code to search for
 * @returns An array of YouTube videos
 */
export const searchYouTubeVideos = async (obdCode: string): Promise<YouTubeVideo[]> => {
  try {
    console.log('API Key being used:', YOUTUBE_API_KEY ? 'Key exists' : 'Key is empty');
    
    const response = await axios.get<YouTubeSearchResponse>(YOUTUBE_API_URL, {
      params: {
        part: 'snippet',
        maxResults: 20,
        q: `OBD code ${obdCode} repair`,
        type: 'video',
        key: YOUTUBE_API_KEY,
      }
    });

    return response.data.items.map(item => ({
      id: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.medium.url,
      channelTitle: item.snippet.channelTitle,
      publishedAt: item.snippet.publishedAt
    }));
  } catch (error) {
    console.error('Error searching YouTube videos:', error);
    throw error;
  }
}; 