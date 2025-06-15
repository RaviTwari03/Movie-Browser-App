import React from 'react';
import { StyleSheet, View, Image, TouchableOpacity, Dimensions, Platform, Animated } from 'react-native';
import { Text, IconButton } from 'react-native-paper';
import { Movie } from '../services/api';
import { API_CONFIG } from '../constants/config';
import { useTheme } from '../context/ThemeContext';

const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_MARGIN = 8;
const CARD_WIDTH = (SCREEN_WIDTH - (32 + CARD_MARGIN * 2)) / 2;

interface MovieCardProps {
  movie: Movie;
  onPress: (movie: Movie) => void;
  onFavoritePress: () => void;
  isFavorite: boolean;
}

export const MovieCard: React.FC<MovieCardProps> = ({
  movie,
  onPress,
  onFavoritePress,
  isFavorite,
}) => {
  const { paperTheme, isDarkMode } = useTheme();
  const scale = new Animated.Value(1);

  const onPressIn = () => {
    Animated.spring(scale, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const onPressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const cardStyle = [
    styles.container,
    {
      backgroundColor: paperTheme.colors.surface,
      transform: [{ scale }],
    },
    isDarkMode ? styles.darkCard : styles.lightCard,
  ];

  return (
    <Animated.View style={cardStyle}>
    <TouchableOpacity
      onPress={() => onPress(movie)}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        activeOpacity={0.9}
    >
      <Image
        source={{
          uri: `${API_CONFIG.imageBaseURL}/${API_CONFIG.posterSize}${movie.poster_path}`,
        }}
        style={styles.poster}
        resizeMode="cover"
      />
      <View style={styles.content}>
        <View style={styles.titleContainer}>
          <Text
            numberOfLines={2}
            style={[styles.title, { color: paperTheme.colors.text }]}
          >
            {movie.title}
          </Text>
          <IconButton
            icon={isFavorite ? 'heart' : 'heart-outline'}
            size={20}
            onPress={onFavoritePress}
            style={styles.favoriteButton}
            iconColor={isFavorite ? '#ff6b6b' : paperTheme.colors.primary}
          />
        </View>
        <View style={styles.ratingContainer}>
          <IconButton
            icon="star"
            size={16}
            iconColor="#ffd700"
            style={styles.starIcon}
          />
          <Text style={[styles.rating, { color: paperTheme.colors.text }]}>
            {movie.vote_average.toFixed(1)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    margin: CARD_MARGIN,
    borderRadius: 12,
    overflow: 'hidden',
  },
  darkCard: {
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  lightCard: {
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
    borderWidth: Platform.OS === 'ios' ? 0 : 0,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  poster: {
    width: '100%',
    height: CARD_WIDTH * 1.5,
  },
  content: {
    padding: 12,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  title: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    marginRight: 8,
  },
  favoriteButton: {
    margin: -8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  starIcon: {
    margin: 0,
    marginLeft: -8,
  },
  rating: {
    fontSize: 14,
    marginLeft: -4,
  },
}); 