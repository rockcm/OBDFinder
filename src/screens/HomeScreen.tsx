import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform,
  ScrollView,
  Animated,
  Dimensions
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import OBDLogo from '../components/OBDLogo';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';

type HomeScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'Home'>;
};

const { width } = Dimensions.get('window');

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [obdCode, setObdCode] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  
  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleSearch = () => {
    if (obdCode.trim()) {
      navigation.navigate('SearchResults', { obdCode: obdCode.trim() });
    }
  };

  return (
    <LinearGradient
      colors={['#1976D2', '#64B5F6']}
      style={styles.gradientContainer}
    >
      <StatusBar style="light" />
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View 
            style={[
              styles.header, 
              { 
                opacity: fadeAnim,
                transform: [{ translateY: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [50, 0]
                })}] 
              }
            ]}
          >
            <OBDLogo width={150} height={150} />
            <Text style={styles.title}>OBD Code Search</Text>
            <Text style={styles.subtitle}>Find video solutions for your vehicle</Text>
          </Animated.View>
          
          <Animated.View style={{ 
            opacity: fadeAnim, 
            transform: [{ translateY: fadeAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [100, 0]
            })}]
          }}>
            <View style={styles.card}>
              <Text style={styles.label}>Enter OBD Code:</Text>
              <View style={[
                styles.inputContainer, 
                isFocused && styles.inputContainerFocused
              ]}>
                <TextInput
                  style={styles.input}
                  value={obdCode}
                  onChangeText={setObdCode}
                  placeholder="e.g. P0300"
                  placeholderTextColor="#9E9E9E"
                  autoCapitalize="characters"
                  maxLength={5}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                />
              </View>
              
              <TouchableOpacity 
                style={[styles.button, !obdCode.trim() && styles.buttonDisabled]}
                onPress={handleSearch}
                disabled={!obdCode.trim()}
                activeOpacity={0.8}
              >
                <Text style={styles.buttonText}>Search YouTube</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.infoCard}>
              <View style={styles.infoHeader}>
                <Text style={styles.infoTitle}>What are OBD Codes?</Text>
              </View>
              <Text style={styles.infoText}>
                OBD (On-Board Diagnostic) codes are generated by your vehicle's computer to
                indicate problems with your car.
              </Text>
              <View style={styles.codeTypesContainer}>
                <View style={styles.codeType}>
                  <Text style={styles.codeTypeLabel}>P</Text>
                  <Text style={styles.codeTypeDescription}>Powertrain</Text>
                </View>
                <View style={styles.codeType}>
                  <Text style={styles.codeTypeLabel}>B</Text>
                  <Text style={styles.codeTypeDescription}>Body</Text>
                </View>
                <View style={styles.codeType}>
                  <Text style={styles.codeTypeLabel}>C</Text>
                  <Text style={styles.codeTypeDescription}>Chassis</Text>
                </View>
                <View style={styles.codeType}>
                  <Text style={styles.codeTypeLabel}>U</Text>
                  <Text style={styles.codeTypeDescription}>Network</Text>
                </View>
              </View>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 30,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 8,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#424242',
  },
  inputContainer: {
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
    height: 56,
    marginBottom: 24,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  inputContainerFocused: {
    borderColor: '#1976D2',
    backgroundColor: '#FFFFFF',
    shadowColor: '#1976D2',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  input: {
    fontSize: 18,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: '#212121',
    fontWeight: '500',
    letterSpacing: 1,
  },
  button: {
    backgroundColor: '#2196F3',
    borderRadius: 12,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonDisabled: {
    backgroundColor: '#B0BEC5',
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  infoHeader: {
    backgroundColor: '#E3F2FD',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#BBDEFB',
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1565C0',
  },
  infoText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#424242',
    padding: 16,
    paddingBottom: 8,
  },
  codeTypesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    padding: 8,
    paddingBottom: 16,
  },
  codeType: {
    alignItems: 'center',
    width: (width - 80) / 4,
    marginVertical: 8,
  },
  codeTypeLabel: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#1976D2',
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    textAlignVertical: 'center',
    lineHeight: 36,
    marginBottom: 6,
  },
  codeTypeDescription: {
    fontSize: 12,
    color: '#616161',
  }
});

export default HomeScreen; 