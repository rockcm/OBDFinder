import React, { useRef, useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Dimensions,
  Animated,
  Share,
  Platform,
  useWindowDimensions
} from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootStackParamList } from '../types';

// Only import WebView for non-web platforms
const WebViewComponent = Platform.select({
  native: () => require('react-native-webview').WebView,
  default: () => null,
})();

type VideoPlayerScreenProps = {
  route: RouteProp<RootStackParamList, 'VideoPlayer'>;
  navigation: StackNavigationProp<RootStackParamList, 'VideoPlayer'>;
};

// Super simplified web player
const WebPlayer = ({ video, navigation }: { video: any, navigation: any }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };
  
  return (
    <div id="video-player-container" style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      maxWidth: '100%',
      overflow: 'hidden'
    }}>
      {/* Video Section - Fixed height */}
      <div style={{
        width: '100%',
        height: '40vh',
        backgroundColor: 'black',
        position: 'relative'
      }}>
        <iframe
          src={`https://www.youtube.com/embed/${video.id}`}
          width="100%"
          height="100%"
          frameBorder="0"
          allowFullScreen
          style={{ border: 'none' }}
        />
      </div>

      {/* Content Section - Takes remaining height */}
      <div style={{
        backgroundColor: 'white',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        borderTopLeftRadius: '20px',
        borderTopRightRadius: '20px',
        marginTop: '-10px',
        height: 'calc(60vh - 20px)',
        overflow: 'hidden'
      }}>
        {/* Title and Metadata */}
        <div style={{
          padding: '16px',
          borderBottom: '1px solid #f0f0f0'
        }}>
          <h3 style={{ margin: '0 0 8px 0', fontSize: '18px' }}>{video.title}</h3>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ fontSize: '14px', color: '#666' }}>{video.channelTitle}</span>
            <span style={{ margin: '0 6px', color: '#666' }}>•</span>
            <span style={{ fontSize: '14px', color: '#666' }}>{formatDate(video.publishedAt)}</span>
          </div>
        </div>

        {/* Description - Scrollable */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '16px',
          paddingBottom: '80px'
        }}>
          <h4 style={{ margin: '0 0 8px 0', fontSize: '16px' }}>Description</h4>
          <p style={{ 
            margin: 0, 
            fontSize: '14px', 
            lineHeight: '1.5', 
            whiteSpace: 'pre-line' 
          }}>
            {video.description}
          </p>
        </div>
      </div>

      {/* Back Button */}
      <button
        onClick={() => navigation.goBack()}
        style={{
          position: 'fixed',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: '#2196F3',
          color: 'white',
          border: 'none',
          borderRadius: '30px',
          padding: '12px 40px',
          fontSize: '16px',
          fontWeight: 'bold',
          cursor: 'pointer',
          zIndex: 1000
        }}
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
        
        {/* Description section - scrollable */}
        <View style={styles.descriptionWrapper}>
          <ScrollView 
            style={styles.descriptionContainer}
            contentContainerStyle={styles.descriptionContent}
            showsVerticalScrollIndicator={true}
          >
            <Text style={styles.descriptionTitle}>Description</Text>
            <Text style={styles.description}>{video.description}</Text>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  videoSection: {
    backgroundColor: '#000',
    paddingBottom: 15, // Extra padding to prevent overlap
  },
  videoContainer: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: '#000',
  },
  webview: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 10,
  },
  titleSection: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  channelInfo: {
    fontSize: 14,
    color: '#666',
  },
  dot: {
    fontSize: 14,
    color: '#666',
    marginHorizontal: 6,
  },
  dateInfo: {
    fontSize: 14,
    color: '#666',
  },
  actionsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
  },
  actionButtonText: {
    fontSize: 14,
    color: '#212121',
    fontWeight: '500',
  },
  descriptionWrapper: {
    flex: 1, // Take remaining space
  },
  descriptionContainer: {
    flex: 1,
  },
  descriptionContent: {
    padding: 16,
    paddingBottom: 80, // Extra padding at bottom for scrolling past the button
  },
  descriptionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    color: '#616161',
  },
  backButton: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 30 : 20,
    alignSelf: 'center',
    backgroundColor: '#2196F3',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    zIndex: 10,
  },
  backButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default VideoPlayerScreen; 