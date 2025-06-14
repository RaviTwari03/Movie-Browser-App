# ShelfEx - Movie Browser App

A React Native app that allows users to browse, search, and favorite movies using the TMDB API.

## Features

- Browse popular movies
- Search for movies
- View movie details
- Save favorite movies
- Infinite scrolling
- Debounced search
- Beautiful UI with Material Design

## Prerequisites

- Node.js (v14 or newer)
- npm or yarn
- Expo CLI
- iOS Simulator (for Mac) or Android Emulator

## Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/shelfex.git
cd shelfex
```

2. Install dependencies:
```bash
npm install
```

3. Set up TMDB API access:
- Visit [TMDB website](https://www.themoviedb.org/)
- Create an account and log in
- Go to your account settings
- Click on the "API" section in the left sidebar
- Request an API read access token (v4 auth)
- Copy the access token
- Replace the API_KEY value in `src/constants/config.ts` with your access token

4. Start the development server:
```bash
npm start
```

5. Run on your preferred platform:
- Press `i` for iOS
- Press `a` for Android
- Scan QR code with Expo Go app on your device

## Project Structure

```
src/
  ├── components/      # Reusable components
  ├── screens/         # Screen components
  ├── navigation/      # Navigation configuration
  ├── services/        # API services
  ├── hooks/          # Custom hooks
  ├── constants/      # Constants and configuration
  └── utils/          # Utility functions
```

## Technologies Used

- React Native
- Expo
- React Navigation
- React Native Paper
- Axios
- AsyncStorage
- TypeScript

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 