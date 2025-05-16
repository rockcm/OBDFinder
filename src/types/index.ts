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
  viewCount?: string;
}

// YouTube Comment Interface
export interface YouTubeComment {
  id: string;
  text: string;
  authorDisplayName: string;
  authorProfileImageUrl: string;
  likeCount: number;
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

// YouTube Comments Response Interface
export interface YouTubeCommentsResponse {
  items: Array<{
    id: string;
    snippet: {
      topLevelComment: {
        id: string;
        snippet: {
          textDisplay: string;
          authorDisplayName: string;
          authorProfileImageUrl: string;
          likeCount: number;
          publishedAt: string;
        };
      };
    };
  }>;
  nextPageToken?: string;
}

// YouTube Video Details Response Interface
export interface YouTubeVideoDetailsResponse {
  items: Array<{
    id: string;
    statistics: {
      viewCount: string;
      likeCount: string;
      commentCount: string;
    };
  }>;
}

// Navigation Types
export type RootStackParamList = {
  Home: undefined;
  SearchResults: { obdCode: string };
  VideoPlayer: { video: YouTubeVideo };
}; 