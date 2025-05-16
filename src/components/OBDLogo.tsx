import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle, Rect, Path, Text as SvgText } from 'react-native-svg';

interface OBDLogoProps {
  width?: number;
  height?: number;
}

const OBDLogo: React.FC<OBDLogoProps> = ({ width = 100, height = 100 }) => {
  return (
    <View style={[styles.container, { width, height }]}>
      <Svg width={width} height={height} viewBox="0 0 100 100">
        {/* Background Circle */}
        <Circle cx="50" cy="50" r="45" fill="#2196F3" />
        
        {/* OBD Text */}
        <SvgText
          x="50"
          y="45"
          fontSize="22"
          fontWeight="bold"
          fill="white"
          textAnchor="middle"
        >
          OBD
        </SvgText>
        
        {/* Code Reader Text */}
        <SvgText
          x="50"
          y="65"
          fontSize="10"
          fill="white"
          textAnchor="middle"
        >
          CODE READER
        </SvgText>
        
        {/* Stylized Car Icon */}
        <Path
          d="M30,35 L70,35 L65,20 L35,20 Z"
          fill="#FFC107"
          stroke="white"
          strokeWidth="1"
        />
        <Rect x="25" y="30" width="50" height="15" rx="5" fill="#FFC107" />
        <Circle cx="35" cy="45" r="5" fill="#444" />
        <Circle cx="65" cy="45" r="5" fill="#444" />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default OBDLogo; 