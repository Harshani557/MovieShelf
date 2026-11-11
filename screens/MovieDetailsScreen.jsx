import React from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import EmptyState from '../components/EmptyState';
import movies from '../data/movies';
import { useFavourites } from '../context/FavouritesContext';
import { COLORS, RADIUS, SPACING } from '../constants/theme';

export default function MovieDetailsScreen({ route }) {
  const { movieId } = route.params;         
  const { width } = useWindowDimensions();
  const { isFavourite, toggleFavourite } = useFavourites();

  const movie = movies.find((item) => item.id === movieId);

  if (!movie) {
    return <EmptyState title="Movie not found" message="This movie is not in the dataset." />;
  }

  const favourite = isFavourite(movie.id);
  const posterWidth = Math.min(width * 0.7, 320);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
    
      <Image
        source={movie.poster}
        style={[styles.poster, { width: posterWidth, height: posterWidth * 1.5 }]}
      />

      <Text style={styles.title}>{movie.title}</Text>

      <View style={styles.badgeRow}>
        <View style={styles.badge}>
          <Ionicons name="calendar-outline" size={14} color={COLORS.textSecondary} />
          <Text style={styles.badgeText}>{movie.year}</Text>
        </View>
        <View style={styles.badge}>
          <Ionicons name="pricetag-outline" size={14} color={COLORS.textSecondary} />
          <Text style={styles.badgeText}>{movie.genre}</Text>
        </View>
        <View style={styles.badge}>
          <Ionicons name="star" size={14} color={COLORS.star} />
          <Text style={styles.badgeText}>{movie.rating.toFixed(1)} / 10</Text>
        </View>
      </View>

      <Pressable
        style={({ pressed }) => [
          styles.favButton,
          favourite && styles.favButtonActive,
          pressed && { opacity: 0.8 },
        ]}
        onPress={() => toggleFavourite(movie.id)}
      >
        <Ionicons
          name={favourite ? 'heart' : 'heart-outline'}
          size={22}
          color={favourite ? COLORS.primary : COLORS.text}
        />
        <Text style={[styles.favText, favourite && { color: COLORS.primary }]}>
          {favourite ? 'Remove from Favourites' : 'Add to Favourites'}
        </Text>
      </Pressable>

      <View style={styles.section}>
        <Text style={styles.label}>Director</Text>
        <Text style={styles.value}>{movie.director}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>Main Cast</Text>
        <Text style={styles.value}>{movie.cast.join(', ')}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>Description</Text>
        <Text style={styles.value}>{movie.description}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  content: { alignItems: 'center', padding: SPACING, paddingBottom: SPACING * 3 },
  poster: { borderRadius: RADIUS, backgroundColor: COLORS.card },
  title: { color: COLORS.text, fontSize: 26, fontWeight: '800', textAlign: 'center', marginTop: 18 },
  badgeRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 8, marginTop: 12 },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: COLORS.card,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  badgeText: { color: COLORS.text, fontSize: 13, fontWeight: '600' },
  favButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    alignSelf: 'stretch',
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS,
    paddingVertical: 14,
    marginTop: 20,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  favButtonActive: { backgroundColor: 'transparent' },
  favText: { color: COLORS.text, fontSize: 16, fontWeight: '700' },
  section: { alignSelf: 'stretch', marginTop: 20 },
  label: { color: COLORS.primary, fontSize: 13, fontWeight: '700', textTransform: 'uppercase', marginBottom: 4 },
  value: { color: COLORS.text, fontSize: 16, lineHeight: 24 },
});
