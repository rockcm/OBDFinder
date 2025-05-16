import axios from 'axios';
import { YOUTUBE_API_KEY, YOUTUBE_API_URL, YOUTUBE_COMMENTS_URL, YOUTUBE_VIDEOS_URL } from '../config/api';
import { YouTubeSearchResponse, YouTubeVideo, YouTubeComment, YouTubeCommentsResponse, YouTubeVideoDetailsResponse } from '../types';

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

/**
 * Fetch comments for a YouTube video
 * @param videoId The YouTube video ID
 * @param maxResults Maximum number of comments to return
 * @returns An array of YouTube comments
 */
export const fetchYouTubeComments = async (videoId: string, maxResults: number = 10): Promise<YouTubeComment[]> => {
  try {
    const response = await axios.get<YouTubeCommentsResponse>(YOUTUBE_COMMENTS_URL, {
      params: {
        part: 'snippet',
        videoId: videoId,
        maxResults: maxResults,
        textFormat: 'plainText',
        key: YOUTUBE_API_KEY,
      }
    });

    // Transform the API response to our YouTubeComment format
    return response.data.items.map(item => ({
      id: item.id,
      text: item.snippet.topLevelComment.snippet.textDisplay,
      authorDisplayName: item.snippet.topLevelComment.snippet.authorDisplayName,
      authorProfileImageUrl: item.snippet.topLevelComment.snippet.authorProfileImageUrl,
      likeCount: item.snippet.topLevelComment.snippet.likeCount,
      publishedAt: item.snippet.topLevelComment.snippet.publishedAt
    }));
  } catch (error) {
    console.error('Error fetching YouTube comments:', error);
    // Return empty array instead of throwing to prevent app crashes if comments can't be loaded
    return [];
  }
};

/**
 * Fetch video details including view count
 * @param videoId The YouTube video ID
 * @returns Object with video statistics like viewCount
 */
export const fetchVideoDetails = async (videoId: string): Promise<{viewCount: string} | null> => {
  try {
    const response = await axios.get<YouTubeVideoDetailsResponse>(YOUTUBE_VIDEOS_URL, {
      params: {
        part: 'statistics',
        id: videoId,
        key: YOUTUBE_API_KEY,
      }
    });

    if (response.data.items && response.data.items.length > 0) {
      return { 
        viewCount: response.data.items[0].statistics.viewCount 
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching video details:', error);
    return null;
  }
}; 