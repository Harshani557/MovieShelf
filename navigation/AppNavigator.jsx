import React from 'react';
import { ActivityIndicator, Pressable, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from '../screens/HomeScreen';
import AllMoviesScreen from '../screens/AllMoviesScreen';
import GenresScreen from '../screens/GenresScreen';
import SearchScreen from '../screens/SearchScreen';
import FavouritesScreen from '../screens/FavouritesScreen';
import MoodMatcherScreen from '../screens/MoodMatcherScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { useAuth } from '../context/AuthContext';
import MovieDetailsScreen from '../screens/MovieDetailsScreen';
import { COLORS } from '../constants/theme';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const TAB_ICONS = {
  Home: ['home', 'home-outline'],
  AllMovies: ['film', 'film-outline'],
  Genres: ['grid', 'grid-outline'],
  Search: ['search', 'search-outline'],
  MoodMatcher: ['happy', 'happy-outline'],
  Favourites: ['heart', 'heart-outline'],
};

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route, navigation }) => ({
        headerLeft:
          route.name === 'Home'
            ? undefined
            : () => (
                <Pressable onPress={() => navigation.navigate('Home')} hitSlop={10} style={{ marginLeft: 16 }}>
                  <Ionicons name="arrow-back" size={24} color={COLORS.text} />
                </Pressable>
              ),
        headerRight: () => (
          <Pressable onPress={() => navigation.getParent()?.navigate('Profile')} hitSlop={10} style={{ marginRight: 16 }}>
            <Ionicons name="person-circle-outline" size={28} color={COLORS.text} />
          </Pressable>
        ),
        headerStyle: { backgroundColor: COLORS.background },
        headerTintColor: COLORS.text,
        headerTitleStyle: { fontWeight: '700' },
        tabBarStyle: { backgroundColor: COLORS.card, borderTopColor: '#333333' },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textSecondary,
        tabBarIcon: ({ focused, color, size }) => {
          const [filled, outline] = TAB_ICONS[route.name];
          return <Ionicons name={focused ? filled : outline} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'MovieShelf' }} />
      <Tab.Screen name="AllMovies" component={AllMoviesScreen} options={{ title: 'All Movies', tabBarLabel: 'All Movies' }} />
      <Tab.Screen name="Genres" component={GenresScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="MoodMatcher" component={MoodMatcherScreen} options={{ title: 'Mood Matcher', tabBarLabel: 'Mood' }} />
      <Tab.Screen name="Favourites" component={FavouritesScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { user, loading } = useAuth();

  // Wait while the saved login session is being restored
  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: COLORS.background, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: COLORS.background },
        headerTintColor: COLORS.text,
        contentStyle: { backgroundColor: COLORS.background },
      }}
    >
      {user ? (
        <>
          <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
          <Stack.Screen name="MovieDetails" component={MovieDetailsScreen} options={{ title: 'Movie Details' }} />
          <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: 'My Profile' }} />
        </>
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Register" component={RegisterScreen} options={{ title: 'Create Account' }} />
          <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} options={{ title: 'Reset Password' }} />
        </>
      )}
    </Stack.Navigator>
  );
}
