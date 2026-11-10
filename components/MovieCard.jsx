import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS } from '../constants/theme';

export default function MovieCard({ movie, width, onPress, onRemove }) {
  return (
    <Pressable
      style={({ pressed }) => [styles.card, { width }, pressed && styles.pressed]}
      onPress={onPress}
    >
      <Image source={movie.poster} style={[styles.poster, { width, height: width * 1.5 }]} />

      {onRemove && (
        <Pressable style={styles.removeButton} onPress={onRemove} hitSlop={8}>
          <Ionicons name="close" size={18} color={COLORS.text} />
        </Pressable>
      )}

      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>
          {movie.title}
        </Text>
        <View style={styles.row}>
          <Text style={styles.subText}>{movie.year}</Text>
          <Text style={styles.dot}>•</Text>
          <Text style={[styles.subText, styles.genre]} numberOfLines={1}>
            {movie.genre}
          </Text>
        </View>
        <View style={styles.row}>
          <Ionicons name="star" size={12} color={COLORS.star} />
          <Text style={styles.rating}>{movie.rating.toFixed(1)}</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS,
    overflow: 'hidden', 
  },
  pressed: { opacity: 0.75 },
  poster: { backgroundColor: COLORS.card },
  info: { padding: 10, gap: 3 },
  title: { color: COLORS.text, fontSize: 14, fontWeight: '700' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  subText: { color: COLORS.textSecondary, fontSize: 12 },
  genre: { flexShrink: 1 },
  dot: { color: COLORS.textSecondary, fontSize: 12 },
  rating: { color: COLORS.text, fontSize: 12, fontWeight: '600' },
  removeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(229, 9, 20, 0.95)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
