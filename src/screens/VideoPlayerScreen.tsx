import React, { useRef, useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Dimensions,
  Animated,
  Share,
  Platform,
  useWindowDimensions,
  Image,
  ActivityIndicator
} from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootStackParamList } from '../types';
import { fetchYouTubeComments } from '../services/youtubeApi';
import { YouTubeComment } from '../types';
import { styles } from '../styles/VideoPlayerStyles';
import * as webStyles from '../styles/WebVideoPlayerStyles';

// Only import WebView for non-web platforms
const WebViewComponent = Platform.select({
  native: () => require('react-native-webview').WebView,
  default: () => null,
})();

type VideoPlayerScreenProps = {
  route: RouteProp<RootStackParamList, 'VideoPlayer'>;
  navigation: StackNavigationProp<RootStackParamList, 'VideoPlayer'>;
};

// Comment component for mobile
const CommentItem = ({ comment }: { comment: YouTubeComment }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { 
      year: 'numeric', 
      month: 'short',
      day: 'numeric' 
    });
  };

  return (
    <View style={styles.commentItem}>
      <Image source={{ uri: comment.authorProfileImageUrl }} style={styles.commentAvatar} />
      <View style={styles.commentContent}>
        <View style={styles.commentHeader}>
          <Text style={styles.commentAuthor}>{comment.authorDisplayName}</Text>
          <Text style={styles.commentDate}>{formatDate(comment.publishedAt)}</Text>
        </View>
        <Text style={styles.commentText}>{comment.text}</Text>
        <View style={styles.commentFooter}>
          <Text style={styles.likeCount}>
            {comment.likeCount > 0 ? `${comment.likeCount} ${comment.likeCount === 1 ? 'like' : 'likes'}` : ''}
          </Text>
        </View>
      </View>
    </View>
  );
};

// Web comment component
const WebCommentItem = ({ comment }: { comment: YouTubeComment }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { 
      year: 'numeric', 
      month: 'short',
      day: 'numeric' 
    });
  };
  
  return (
    <div style={webStyles.commentItemStyle}>
      <img 
        src={comment.authorProfileImageUrl} 
        style={webStyles.commentAvatarStyle} 
      />
      <div style={webStyles.commentContentStyle}>
        <div style={webStyles.commentHeaderStyle}>
          <span style={webStyles.commentAuthorStyle}>
            {comment.authorDisplayName}
          </span>
          <span style={webStyles.commentDateStyle}>
            {formatDate(comment.publishedAt)}
          </span>
        </div>
        <p style={webStyles.commentTextStyle}>
          {comment.text}
        </p>
        {comment.likeCount > 0 && (
          <div style={webStyles.likesStyle}>
            {comment.likeCount} {comment.likeCount === 1 ? 'like' : 'likes'}
          </div>
        )}
      </div>
    </div>
  );
};

// Super simplified web player
const WebPlayer = ({ video, navigation }: { video: any, navigation: any }) => {
  const [comments, setComments] = useState<YouTubeComment[]>([]);
  const [isLoadingComments, setIsLoadingComments] = useState<boolean>(true);
  const [tab, setTab] = useState<'description' | 'comments'>('description');
  
  useEffect(() => {
    const loadComments = async () => {
      setIsLoadingComments(true);
      const videoComments = await fetchYouTubeComments(video.id);
      setComments(videoComments);
      setIsLoadingComments(false);
    };
    
    loadComments();
  }, [video.id]);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };
  
  return (
    <div style={webStyles.containerStyle}>
      {/* Video Section - Fixed height */}
      <div style={webStyles.videoSectionStyle}>
        <iframe
          src={`https://www.youtube.com/embed/${video.id}`}
          width="100%"
          height="100%"
          frameBorder="0"
          allowFullScreen
          style={webStyles.videoFrameStyle}
        />
      </div>

      {/* Content Section - Takes remaining height */}
      <div style={webStyles.contentSectionStyle}>
        {/* Title and Metadata */}
        <div style={webStyles.titleSectionStyle}>
          <h3 style={webStyles.titleStyle}>{video.title}</h3>
          <div style={webStyles.metaRowStyle}>
            <span style={webStyles.channelStyle}>{video.channelTitle}</span>
            <span style={webStyles.dotStyle}>•</span>
            <span style={webStyles.dateStyle}>{formatDate(video.publishedAt)}</span>
          </div>
        </div>

        {/* Tab Selector */}
        <div style={webStyles.tabContainerStyle}>
          <div 
            onClick={() => setTab('description')}
            style={webStyles.tabStyle(tab === 'description')}
          >
            Description
          </div>
          <div 
            onClick={() => setTab('comments')}
            style={webStyles.tabStyle(tab === 'comments')}
          >
            Comments
          </div>
        </div>

        {/* Content Based on Selected Tab */}
        <div style={webStyles.contentStyle}>
          {tab === 'description' ? (
            <div>
              <p style={webStyles.textStyle}>
                {video.description}
              </p>
            </div>
          ) : (
            <div>
              {isLoadingComments ? (
                <div style={webStyles.loadingContainerStyle}>
                  <span>Loading comments...</span>
                </div>
              ) : comments.length > 0 ? (
                comments.map(comment => (
                  <WebCommentItem key={comment.id} comment={comment} />
                ))
              ) : (
                <div style={webStyles.noCommentsStyle}>
                  No comments available for this video.
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Back Button */}
      <button
        onClick={() => navigation.goBack()}
        style={webStyles.backButtonStyle}
      >
        Back
      </button>
    </div>
  );
};

// Mobile-specific YouTube player component
const MobileYouTubePlayer = ({ videoId }: { videoId: string }) => {
  if (WebViewComponent) {
    return (
      <WebViewComponent
        source={{ uri: `https://www.youtube.com/embed/${videoId}` }}
        allowsFullscreenVideo
        style={styles.webview}
      />
    );
  }
  return null;
};

const VideoPlayerScreen: React.FC<VideoPlayerScreenProps> = ({ route, navigation }) => {
  const { video } = route.params;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(100)).current;
  const [activeTab, setActiveTab] = useState<'description' | 'comments'>('description');
  const [comments, setComments] = useState<YouTubeComment[]>([]);
  const [isLoadingComments, setIsLoadingComments] = useState<boolean>(false);
  
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true
      })
    ]).start();
  }, []);
  
  useEffect(() => {
    const loadComments = async () => {
      if (activeTab === 'comments') {
        setIsLoadingComments(true);
        const videoComments = await fetchYouTubeComments(video.id);
        setComments(videoComments);
        setIsLoadingComments(false);
      }
    };
    
    loadComments();
  }, [video.id, activeTab]);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this video about OBD code: ${video.title}\nhttps://www.youtube.com/watch?v=${video.id}`,
      });
    } catch (error) {
      console.log('Error sharing video:', error);
    }
  };

  // Web-specific rendering
  if (Platform.OS === 'web') {
    // Simple web player with fixed layout
    return <WebPlayer video={video} navigation={navigation} />;
  }

  // Mobile rendering
  return (
    <SafeAreaView style={styles.container} edges={['right', 'left']}>
      <StatusBar style="light" />
      
      {/* Video section with extra padding for separation */}
      <View style={styles.videoSection}>
        <View style={styles.videoContainer}>
          <MobileYouTubePlayer videoId={video.id} />
        </View>
      </View>
      
      {/* Content section with animation */}
      <Animated.View 
        style={[
          styles.contentContainer,
          { 
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        {/* Title and metadata section */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>{video.title}</Text>
          <View style={styles.metaRow}>
            <Text style={styles.channelInfo}>
              {video.channelTitle}
            </Text>
            <Text style={styles.dot}>•</Text>
            <Text style={styles.dateInfo}>
              {formatDate(video.publishedAt)}
            </Text>
          </View>
        </View>
        
        {/* Tab selector */}
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'description' && styles.activeTab]} 
            onPress={() => setActiveTab('description')}
          >
            <Text style={[
              styles.tabText, 
              activeTab === 'description' && styles.activeTabText
            ]}>
              Description
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'comments' && styles.activeTab]} 
            onPress={() => setActiveTab('comments')}
          >
            <Text style={[
              styles.tabText, 
              activeTab === 'comments' && styles.activeTabText
            ]}>
              Comments
            </Text>
          </TouchableOpacity>
        </View>
        
        {/* Actions section */}
        <View style={styles.actionsRow}>
          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={handleShare}
            activeOpacity={0.7}
          >
            <Text style={styles.actionButtonText}>Share</Text>
          </TouchableOpacity>
        </View>
        
        {/* Content based on selected tab */}
        <View style={styles.descriptionWrapper}>
          <ScrollView 
            style={styles.descriptionContainer}
            contentContainerStyle={styles.descriptionContent}
            showsVerticalScrollIndicator={true}
          >
            {activeTab === 'description' ? (
              <>
                <Text style={styles.descriptionTitle}>Description</Text>
                <Text style={styles.description}>{video.description}</Text>
              </>
            ) : (
              <>
                <Text style={styles.descriptionTitle}>Comments</Text>
                {isLoadingComments ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="small" color="#2196F3" />
                    <Text style={styles.loadingText}>Loading comments...</Text>
                  </View>
                ) : comments.length > 0 ? (
                  comments.map(comment => (
                    <CommentItem key={comment.id} comment={comment} />
                  ))
                ) : (
                  <Text style={styles.noCommentsText}>
                    No comments available for this video.
                  </Text>
                )}
              </>
            )}
            {/* Extra space at bottom to ensure content is scrollable past the back button */}
            <View style={{ height: 100 }} />
          </ScrollView>
        </View>
      </Animated.View>
      
      {/* Back button */}
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => navigation.goBack()}
        activeOpacity={0.8}
      >
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default VideoPlayerScreen; 