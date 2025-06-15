import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MD3DarkTheme, MD3LightTheme } from 'react-native-paper';
import { DarkTheme, DefaultTheme } from '@react-navigation/native';
import { STORAGE_KEYS } from '../constants/config';
import { Appearance, ColorSchemeName, useColorScheme } from 'react-native';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  isDarkMode: boolean;
  paperTheme: typeof MD3DarkTheme;
  navigationTheme: typeof DarkTheme;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#2196F3',
    background: '#121212',
    surface: '#1e1e1e',
    text: '#ffffff',
    secondary: '#666666',
  },
  animation: {
    scale: 1.0,
  },
};

const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#2196F3',
    background: '#e0e0e0',
    surface: '#f5f5f5',
    text: '#000000',
    secondary: '#666666',
  },
  animation: {
    scale: 1.0,
  },
};

const darkNavigationTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: '#121212',
    card: '#1e1e1e',
    text: '#ffffff',
    border: '#333333',
  },
};

const lightNavigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#e0e0e0',
    card: '#f5f5f5',
    text: '#000000',
    border: '#cccccc',
  },
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [theme, setTheme] = useState<Theme>('system');
  const [isInitialized, setIsInitialized] = useState(false);

  // Load saved theme preference
  useEffect(() => {
    const initializeTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem(STORAGE_KEYS.theme);
      if (savedTheme) {
        setTheme(savedTheme as Theme);
      }
        setIsInitialized(true);
    } catch (error) {
      console.error('Error loading theme:', error);
        setIsInitialized(true);
    }
  };
    initializeTheme();
  }, []);

  const toggleTheme = async () => {
    const themeMap: Record<Theme, Theme> = {
      light: 'dark',
      dark: 'system',
      system: 'light',
    };
    const newTheme = themeMap[theme];
    setTheme(newTheme);
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.theme, newTheme);
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  const isDarkMode = 
    theme === 'system' 
      ? systemColorScheme === 'dark'
      : theme === 'dark';

  const paperTheme = isDarkMode ? darkTheme : lightTheme;
  const navigationTheme = isDarkMode ? darkNavigationTheme : lightNavigationTheme;

  if (!isInitialized) {
    // Return a loading state or initial theme based on system
    return (
      <ThemeContext.Provider 
        value={{ 
          theme: 'system', 
          toggleTheme, 
          isDarkMode: systemColorScheme === 'dark',
          paperTheme: systemColorScheme === 'dark' ? darkTheme : lightTheme,
          navigationTheme: systemColorScheme === 'dark' ? darkNavigationTheme : lightNavigationTheme,
        }}
      >
        {children}
      </ThemeContext.Provider>
    );
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isDarkMode, paperTheme, navigationTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}; 