import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme as usePaperTheme } from 'react-native-paper';
import { IconButton } from 'react-native-paper';
import HomeScreen from '../screens/HomeScreen';
import MovieDetailsScreen from '../screens/MovieDetailsScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import { Movie } from '../services/api';
import { useTheme } from '../context/ThemeContext';

export type RootStackParamList = {
  DrawerStack: undefined;
  MovieDetails: { movie: Movie };
};

export type DrawerParamList = {
  Home: undefined;
  Favorites: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Drawer = createDrawerNavigator<DrawerParamList>();

const DrawerNavigator = () => {
  const theme = usePaperTheme();
  const { toggleTheme, isDarkMode } = useTheme();
  
  return (
    <Drawer.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.background,
        },
        headerTintColor: theme.colors.primary,
        drawerStyle: {
          backgroundColor: theme.colors.background,
        },
        drawerActiveTintColor: theme.colors.primary,
        drawerInactiveTintColor: theme.colors.secondary,
        sceneContainerStyle: {
          backgroundColor: theme.colors.background,
        },
        headerRight: () => (
          <IconButton
            icon={isDarkMode ? 'white-balance-sunny' : 'moon-waning-crescent'}
            onPress={toggleTheme}
            iconColor={theme.colors.primary}
          />
        ),
      }}
    >
      <Drawer.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Movies',
        }}
      />
      <Drawer.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{
          title: 'My Favorites',
        }}
      />
    </Drawer.Navigator>
  );
};

export const AppNavigator = () => {
  const theme = usePaperTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.background,
        },
        headerTintColor: theme.colors.primary,
        contentStyle: {
          backgroundColor: theme.colors.background,
        },
      }}
    >
      <Stack.Screen
        name="DrawerStack"
        component={DrawerNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="MovieDetails"
        component={MovieDetailsScreen}
        options={({ route }) => ({
          title: route.params?.movie.title || 'Movie Details',
          headerBackTitle: 'Back',
        })}
      />
    </Stack.Navigator>
  );
}; 