declare module 'expo-linear-gradient' {
  import { ViewProps } from 'react-native';
  import * as React from 'react';

  export interface LinearGradientProps extends ViewProps {
    colors: string[];
    start?: { x: number; y: number };
    end?: { x: number; y: number };
    locations?: number[];
  }

  export class LinearGradient extends React.Component<LinearGradientProps> {}
} 