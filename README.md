# OBD Code Reader App

A React Native TypeScript application built with Expo that allows users to search for OBD (On-Board Diagnostic) codes on YouTube. Users can enter an OBD code, view search results from YouTube, and play videos related to the OBD code.

## Features

- Search for OBD codes on YouTube
- Display search results in a clean, user-friendly interface
- Play YouTube videos directly in the app
- View video details including title, channel, publish date, and description

## Technologies Used

- React Native
- TypeScript
- Expo
- YouTube API
- React Navigation
- React Native WebView
- Axios
- react-native-dotenv (for environment variable management)

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- YouTube API key

### Installation

1. Clone the repository
   ```
   git clone <repository-url>
   cd NativeTsOBD
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Configure the YouTube API key
   - Create a `.env` file in the root directory
   - Add your YouTube API key to the `.env` file:
     ```
     YOUTUBE_API_KEY=YOUR_YOUTUBE_API_KEY_HERE
     ```
   - Note: A `.env.example` file is included as a template
   - The `.env` file is already added to `.gitignore` to keep your API key secure

4. Start the Expo development server
   ```
   npm start
   ```

5. Run the app on a device or emulator
   - Follow the Expo CLI instructions to run on iOS/Android

## How to Use

1. Launch the app
2. Enter an OBD code (e.g., P0300) in the input field
3. Tap "Search YouTube" to find videos related to the OBD code
4. Browse the search results and tap on a video to play it
5. Watch the video and read the video description for helpful information

## API Configuration

The app uses the YouTube Data API v3 to search for videos. You need to obtain an API key from the [Google Cloud Console](https://console.cloud.google.com/).

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Acknowledgements

- YouTube Data API
- Expo framework
- React Navigation 