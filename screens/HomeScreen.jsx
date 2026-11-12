import React, { useMemo } from 'react';
import { FlatList, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MovieCard from '../components/MovieCard';
import movies from '../data/movies';
import { useFavourites } from '../context/FavouritesContext';
import { COLORS, RADIUS, SPACING } from '../constants/theme';

const CARD_WIDTH = 140;

const QUICK_LINKS = [
  { label: 'All Movies', icon: 'film-outline', screen: 'AllMovies' },
  { label: 'Genres', icon: 'grid-outline', screen: 'Genres' },
  { label: 'Search', icon: 'search-outline', screen: 'Search' },
  { label: 'Favourites', icon: 'heart-outline', screen: 'Favourites' },
];

export default function HomeScreen({ navigation }) {
  const { favouriteIds } = useFavourites();

  const popularMovies = useMemo(
    () => [...movies].sort((a, b) => b.rating - a.rating).slice(0, 8),
    []
  );

  const recentMovies = useMemo(() => [...movies].reverse().slice(0, 8), []);

  const renderRow = (data) => (
    <FlatList
      data={data}
      horizontal
      showsHorizontalScrollIndicator={false}
      keyExtractor={(item) => String(item.id)}
      contentContainerStyle={styles.rowContent}
      ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
      renderItem={({ item }) => (
        <MovieCard
          movie={item}
          width={CARD_WIDTH}
          onPress={() => navigation.navigate('MovieDetails', { movieId: item.id })}
        />
      )}
    />
  );

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      
      <View style={styles.hero}>
        <View style={styles.logoRow}>
          <Ionicons name="film" size={30} color={COLORS.primary} />
          <Text style={styles.appName}>
            Movie<Text style={{ color: COLORS.primary }}>Shelf</Text>
          </Text>
        </View>
        <Text style={styles.welcome}>Welcome back, movie lover!</Text>
        <Text style={styles.subWelcome}>
          Browse {movies.length} movies, search by title and save your favourites in your own
          personal collection.
        </Text>
      </View>

      
      <View style={styles.quickRow}>
        {QUICK_LINKS.map((link) => (
          <Pressable
            key={link.screen}
            style={({ pressed }) => [styles.quickButton, pressed && { opacity: 0.7 }]}
            onPress={() => navigation.navigate(link.screen)}
          >
            <Ionicons name={link.icon} size={22} color={COLORS.primary} />
            <Text style={styles.quickLabel}>{link.label}</Text>
            {link.screen === 'Favourites' && favouriteIds.length > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{favouriteIds.length}</Text>
              </View>
            )}
          </Pressable>
        ))}
      </View>

      <Pressable
        style={({ pressed }) => [styles.moodBanner, pressed && { opacity: 0.8 }]}
        onPress={() => navigation.navigate('MoodMatcher')}
      >
        <Ionicons name="happy-outline" size={30} color={COLORS.primary} />
        <View style={{ flex: 1 }}>
          <Text style={styles.moodBannerTitle}>Movie Mood Matcher</Text>
          <Text style={styles.moodBannerText}>Not sure what to watch? Let your mood decide.</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
      </Pressable>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Popular Movies</Text>
        <Pressable onPress={() => navigation.navigate('AllMovies')}>
          <Text style={styles.seeAll}>See all</Text>
        </Pressable>
      </View>
      {renderRow(popularMovies)}

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recently Added</Text>
        <Pressable onPress={() => navigation.navigate('AllMovies')}>
          <Text style={styles.seeAll}>See all</Text>
        </Pressable>
      </View>
      {renderRow(recentMovies)}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  content: { paddingBottom: SPACING * 2 },
  hero: { padding: SPACING, paddingTop: SPACING * 1.5 },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  appName: { color: COLORS.text, fontSize: 32, fontWeight: '800' },
  welcome: { color: COLORS.text, fontSize: 18, fontWeight: '600', marginTop: 12 },
  subWelcome: { color: COLORS.textSecondary, fontSize: 14, lineHeight: 20, marginTop: 6 },
  quickRow: { flexDirection: 'row', gap: 10, paddingHorizontal: SPACING, marginBottom: 8 },
  quickButton: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: RADIUS,
    alignItems: 'center',
    paddingVertical: 12,
    gap: 6,
  },
  quickLabel: { color: COLORS.text, fontSize: 11, fontWeight: '600' },
  badge: {
    position: 'absolute',
    top: 6,
    right: 8,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: { color: COLORS.text, fontSize: 10, fontWeight: '700' },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING,
    marginTop: SPACING,
    marginBottom: 10,
  },
  sectionTitle: { color: COLORS.text, fontSize: 20, fontWeight: '700' },
  seeAll: { color: COLORS.primary, fontSize: 14, fontWeight: '600' },
  rowContent: { paddingHorizontal: SPACING },
  moodBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: COLORS.card,
    borderRadius: RADIUS,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
    marginHorizontal: SPACING,
    marginTop: SPACING,
    padding: 14,
  },
  moodBannerTitle: { color: COLORS.text, fontSize: 16, fontWeight: '700' },
  moodBannerText: { color: COLORS.textSecondary, fontSize: 13, marginTop: 2 },
});
