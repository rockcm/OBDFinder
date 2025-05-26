import React, { useEffect, useState, useRef } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  ActivityIndicator, 
  TouchableOpacity, 
  Image,
  Animated,
  Dimensions,
  StatusBar as RNStatusBar,
  Platform
} from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { RootStackParamList, YouTubeVideo } from '../types';
import { searchYouTubeVideos, fetchVideoDetails } from '../services/youtubeApi';
import { LinearGradient } from 'expo-linear-gradient';

type SearchResultsScreenProps = {
  route: RouteProp<RootStackParamList, 'SearchResults'>;
  navigation: StackNavigationProp<RootStackParamList, 'SearchResults'>;
};

const { width } = Dimensions.get('window');
const ITEM_HEIGHT = 110;

// Format view count with commas
const formatViewCount = (viewCount: string | undefined): string => {
  if (!viewCount) return '';
  return parseInt(viewCount).toLocaleString();
};

const SearchResultsScreen: React.FC<SearchResultsScreenProps> = ({ route, navigation }) => {
  const { obdCode } = route.params;
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const scrollY = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
    
    const fetchVideos = async () => {
      try {
        const results = await searchYouTubeVideos(obdCode);
        
        // Fetch view counts for each video
        const updatedResults = await Promise.all(
          results.map(async (video) => {
            try {
              const details = await fetchVideoDetails(video.id);
              return {
                ...video,
                viewCount: details?.viewCount || undefined
              };
            } catch (error) {
              return video;
            }
          })
        );

        setVideos(updatedResults);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch videos. Please try again.');
        setLoading(false);
      }
    };

    fetchVideos();
  }, [obdCode]);

  const handleVideoSelect = (video: YouTubeVideo) => {
    navigation.navigate('VideoPlayer', { video });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const renderVideoItem = ({ item, index }: { item: YouTubeVideo; index: number }) => {
    const inputRange = [
      -1, 
      0,
      ITEM_HEIGHT * index,
      ITEM_HEIGHT * (index + 2)
    ];
    
    const opacity = scrollY.interpolate({
      inputRange,
      outputRange: [1, 1, 1, 0]
    });
    
    const scale = scrollY.interpolate({
      inputRange,
      outputRange: [1, 1, 1, 0.8],
      extrapolate: 'clamp'
    });

    return (
      <Animated.View style={[
        { opacity, transform: [{ scale }] }
      ]}>
        <TouchableOpacity 
          style={styles.videoItem} 
          onPress={() => handleVideoSelect(item)}
          activeOpacity={0.7}
        >
          <Image 
            source={{ uri: item.thumbnail }} 
            style={styles.thumbnail} 
            resizeMode="cover"
          />
          <View style={styles.videoInfo}>
            <Text style={styles.videoTitle} numberOfLines={2}>{item.title}</Text>
            <Text style={styles.channelTitle}>{item.channelTitle}</Text>
            <View style={styles.videoMetaRow}>
            <Text style={styles.date}>Published: {formatDate(item.publishedAt)}</Text>
              {item.viewCount && (
                <>
                  <Text style={styles.dot}>•</Text>
                  <Text style={styles.viewCount}>{formatViewCount(item.viewCount)} views</Text>
                </>
              )}
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar style="light" />
        <LinearGradient
          colors={['#1976D2', '#64B5F6']}
          style={styles.loadingGradient}
        >
          <View style={styles.loadingContent}>
            <ActivityIndicator size="large" color="#FFFFFF" />
            <Text style={styles.loadingText}>Searching for "{obdCode}" videos...</Text>
          </View>
        </LinearGradient>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <StatusBar style="light" />
        <LinearGradient
          colors={['#1976D2', '#64B5F6']}
          style={StyleSheet.absoluteFill}
        >
          <View style={styles.errorContent}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity 
              style={styles.button} 
              onPress={() => navigation.goBack()}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>Go Back</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Animated.View style={[
        styles.header,
        { opacity: fadeAnim }
      ]}>
        <LinearGradient
          colors={['#1976D2', '#2196F3']}
          style={StyleSheet.absoluteFillObject}
        />
        <View style={styles.headerContent}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>Results for OBD Code</Text>
            <Text style={styles.obdCodeText}>{obdCode}</Text>
          </View>
        </View>
        
        <View style={styles.resultsBar}>
          <Text style={styles.resultsCount}>
            {videos.length} {videos.length === 1 ? 'video' : 'videos'} found
          </Text>
        </View>
      </Animated.View>
      
      {videos.length === 0 ? (
        <Animated.View style={[styles.noResults, { opacity: fadeAnim }]}>
          <Text style={styles.noResultsText}>No videos found for this code.</Text>
          <TouchableOpacity 
            style={styles.tryAgainButton} 
            onPress={() => navigation.goBack()}
            activeOpacity={0.8}
          >
            <Text style={styles.tryAgainButtonText}>Try Another Code</Text>
          </TouchableOpacity>
        </Animated.View>
      ) : (
        <Animated.FlatList
          data={videos}
          renderItem={renderVideoItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: true }
          )}
          scrollEventThrottle={16}
          style={{ opacity: fadeAnim }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 50 : (RNStatusBar.currentHeight || 20) + 10,
    overflow: 'hidden',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  headerTitleContainer: {
    flex: 1,
    marginLeft: 10,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: 'white',
  },
  obdCodeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  },
  resultsBar: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    padding: 10,
    paddingHorizontal: 16,
  },
  resultsCount: {
    fontSize: 14,
    color: 'white',
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
  },
  loadingGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContent: {
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 18,
    color: 'white',
    fontWeight: '500',
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
  },
  errorContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 18,
    fontWeight: '500',
  },
  listContainer: {
    padding: 16,
    paddingTop: 8,
  },
  videoItem: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    height: ITEM_HEIGHT,
  },
  thumbnail: {
    width: 160,
    height: ITEM_HEIGHT,
  },
  videoInfo: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  videoTitle: {
    fontWeight: '600',
    fontSize: 15,
    marginBottom: 4,
    color: '#333',
    lineHeight: 20,
  },
  channelTitle: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
  },
  videoMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  date: {
    fontSize: 12,
    color: '#888',
  },
  dot: {
    fontSize: 12,
    color: '#888',
    marginHorizontal: 4,
  },
  viewCount: {
    fontSize: 12,
    color: '#888',
  },
  button: {
    backgroundColor: 'white',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
  },
  buttonText: {
    color: '#1976D2',
    fontWeight: '600',
    fontSize: 16,
  },
  noResults: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noResultsText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  tryAgainButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tryAgainButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default SearchResultsScreen; 