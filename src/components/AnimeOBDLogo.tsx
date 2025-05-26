import React from 'react';
import { View, Image, StyleSheet, ImageSourcePropType } from 'react-native';

interface AnimeOBDLogoProps {
  width?: number;
  height?: number;
  style?: any;
}

// Using the image from the root folder
const AnimeOBDLogo: React.FC<AnimeOBDLogoProps> = ({ width = 150, height = 150, style }) => {
  return (
    <View style={[styles.container, { width, height }, style]}>
      <Image
        source={require('../../5a7bcc96-8379-4b89-9057-89adad62f7d8.png')}
        style={styles.image}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});

export default AnimeOBDLogo; 