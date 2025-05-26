// Theme file for the OBDFinder app
// Provides consistent colors and styles across the app

export const theme = {
  // Primary colors
  primary: {
    main: '#FF5722',     // Vibrant Orange
    light: '#FF8A65',    // Light Orange
    dark: '#E64A19',     // Dark Orange
  },
  
  // Secondary colors
  secondary: {
    main: '#212B38',     // Dark Navy
    light: '#34495E',    // Medium Navy
    dark: '#1A1E23',     // Darker Navy
  },
  
  // Accent colors
  accent: {
    main: '#00BCD4',     // Cyan
    light: '#4DD0E1',    // Light Cyan
    dark: '#0097A7',     // Dark Cyan
  },
  
  // Background colors
  background: {
    light: '#F5F7FA',    // Light Background
    dark: '#1A1E23',     // Dark Background
    card: '#FFFFFF',     // Card Background
    input: '#F0F2F5',    // Input Background
  },
  
  // Text colors
  text: {
    light: '#FFFFFF',    // Light Text
    dark: '#212B38',     // Dark Text
    muted: '#707070',    // Muted Text
    subtitle: 'rgba(255, 255, 255, 0.8)',   // Subtitle Text
  },
  
  // Status colors
  status: {
    success: '#4CAF50',  // Success (Green)
    error: '#F44336',    // Error (Red)
    warning: '#FFC107',  // Warning (Amber)
    info: '#2196F3',     // Info (Blue)
  },
  
  // Gradients
  gradients: {
    primary: ['#FF5722', '#FF8A65'],   // Orange Gradient
    secondary: ['#212B38', '#34495E'], // Navy Gradient
    accent: ['#00BCD4', '#4DD0E1'],    // Cyan Gradient
  },
  
  // Shadows
  shadows: {
    small: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 4,
    },
    large: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 16,
      elevation: 8,
    },
  },
  
  // Border radius
  borderRadius: {
    small: 8,
    medium: 12,
    large: 16,
    pill: 50,
  },
  
  // Spacing
  spacing: {
    xs: 4,
    s: 8,
    m: 16,
    l: 24,
    xl: 32,
    xxl: 48,
  }
}; 