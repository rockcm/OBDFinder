// OBD Code Interface
export interface OBDCode {
  code: string;
  description?: string;
}

// YouTube Search Result Interface
export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  channelTitle: string;
  publishedAt: string;
}

// YouTube API Response Interface
export interface YouTubeSearchResponse {
  items: Array<{
    id: {
      videoId: string;
    };
    snippet: {
      title: string;
      description: string;
      thumbnails: {
        medium: {
          url: string;
        };
      };
      channelTitle: string;
      publishedAt: string;
    };
  }>;
}

// Navigation Types
export type RootStackParamList = {
  Home: undefined;
  SearchResults: { obdCode: string };
  VideoPlayer: { video: YouTubeVideo };
}; 