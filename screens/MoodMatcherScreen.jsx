import React, { useRef, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import EmptyState from '../components/EmptyState';
import movies from '../data/movies';
import { COLORS, RADIUS, SPACING } from '../constants/theme';

const MOODS = [
  { key: 'Happy', icon: 'happy-outline', hint: 'Light and fun' },
  { key: 'Relaxed', icon: 'leaf-outline', hint: 'Calm and cosy' },
  { key: 'Excited', icon: 'flash-outline', hint: 'Fast and energetic' },
  { key: 'Thrilled', icon: 'pulse-outline', hint: 'Edge of your seat' },
];

const DURATIONS = [
  { key: 'under90', label: 'Under 90 minutes', test: (m) => m.duration < 90 },
  { key: '90to120', label: '90–120 minutes', test: (m) => m.duration >= 90 && m.duration <= 120 },
  { key: 'any', label: 'Any duration', test: () => true },
];

export default function MoodMatcherScreen({ navigation }) {
  const { width } = useWindowDimensions();
  const scrollRef = useRef(null);

  const [mood, setMood] = useState(null);
  const [duration, setDuration] = useState('any');
  const [result, setResult] = useState(null);
  const [searched, setSearched] = useState(false);

  const posterWidth = Math.min(width * 0.5, 200);

  const findMovie = () => {
    if (!mood) return;
    const durationRule = DURATIONS.find((d) => d.key === duration);
    const matches = movies.filter(
      (movie) => movie.mood.includes(mood) && durationRule.test(movie)
    );

    // Avoid showing the same movie twice in a row when there are other choices
    const pool = matches.length > 1 && result ? matches.filter((m) => m.id !== result.id) : matches;
    const pick = pool.length > 0 ? pool[Math.floor(Math.random() * pool.length)] : null;

    setResult(pick);
    setSearched(true);
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
  };

  const resetResult = (setter) => (value) => {
    setter(value);
    setSearched(false);
    setResult(null);
  };

  return (
    <ScrollView ref={scrollRef} style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>
        Movie <Text style={{ color: COLORS.primary }}>Mood Matcher</Text>
      </Text>
      <Text style={styles.sub}>Tell us how you feel and how long you have. We'll pick a movie for you.</Text>

      <Text style={styles.sectionTitle}>1. How are you feeling?</Text>
      <View style={styles.moodGrid}>
        {MOODS.map((item) => {
          const active = mood === item.key;
          return (
            <Pressable
              key={item.key}
              onPress={() => resetResult(setMood)(item.key)}
              style={({ pressed }) => [
                styles.moodCard,
                active && styles.moodCardActive,
                pressed && { opacity: 0.8 },
              ]}
            >
              <Ionicons name={item.icon} size={34} color={active ? COLORS.text : COLORS.primary} />
              <Text style={styles.moodLabel}>{item.key}</Text>
              <Text style={[styles.moodHint, active && { color: COLORS.text }]}>{item.hint}</Text>
            </Pressable>
          );
        })}
      </View>

      <Text style={styles.sectionTitle}>2. How long do you have?</Text>
      <View style={styles.chipRow}>
        {DURATIONS.map((item) => {
          const active = duration === item.key;
          return (
            <Pressable
              key={item.key}
              onPress={() => resetResult(setDuration)(item.key)}
              style={[styles.chip, active && styles.chipActive]}
            >
              <Text style={[styles.chipText, active && styles.chipTextActive]}>{item.label}</Text>
            </Pressable>
          );
        })}
      </View>

      <Pressable
        onPress={findMovie}
        disabled={!mood}
        style={({ pressed }) => [
          styles.findButton,
          !mood && styles.findButtonDisabled,
          pressed && { opacity: 0.85 },
        ]}
      >
        <Ionicons name="search" size={20} color={COLORS.text} />
        <Text style={styles.findText}>{result ? 'Find Another Movie' : 'Find My Movie'}</Text>
      </Pressable>
      {!mood && <Text style={styles.hint}>Pick a mood to get started.</Text>}

      {searched && !result && (
        <View style={styles.resultBox}>
          <EmptyState
            icon="sad-outline"
            title="No matching movie found"
            message="We couldn't find a movie for that mood and duration. Try a different mood or choose 'Any duration'."
          />
        </View>
      )}

      {result && (
        <View style={styles.resultBox}>
          <Text style={styles.resultLabel}>Tonight's pick for you</Text>
          <Image
            source={result.poster}
            style={[styles.poster, { width: posterWidth, height: posterWidth * 1.5 }]}
          />
          <Text style={styles.title}>{result.title}</Text>

          <View style={styles.badgeRow}>
            <View style={styles.badge}>
              <Ionicons name="pricetag-outline" size={14} color={COLORS.textSecondary} />
              <Text style={styles.badgeText}>{result.genre}</Text>
            </View>
            <View style={styles.badge}>
              <Ionicons name="star" size={14} color={COLORS.star} />
              <Text style={styles.badgeText}>{result.rating.toFixed(1)} / 10</Text>
            </View>
            <View style={styles.badge}>
              <Ionicons name="time-outline" size={14} color={COLORS.textSecondary} />
              <Text style={styles.badgeText}>{result.duration} min</Text>
            </View>
          </View>

          <Text style={styles.description}>{result.description}</Text>

          <Pressable
            style={({ pressed }) => [styles.detailsButton, pressed && { opacity: 0.8 }]}
            onPress={() => navigation.navigate('MovieDetails', { movieId: result.id })}
          >
            <Text style={styles.detailsText}>View Full Details</Text>
            <Ionicons name="chevron-forward" size={18} color={COLORS.primary} />
          </Pressable>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING, paddingBottom: SPACING * 3 },
  heading: { color: COLORS.text, fontSize: 26, fontWeight: '800' },
  sub: { color: COLORS.textSecondary, fontSize: 14, lineHeight: 20, marginTop: 6 },
  sectionTitle: { color: COLORS.text, fontSize: 18, fontWeight: '700', marginTop: 24, marginBottom: 12 },
  moodGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  moodCard: {
    width: '48%',
    flexGrow: 1,
    backgroundColor: COLORS.card,
    borderRadius: RADIUS,
    borderWidth: 2,
    borderColor: 'transparent',
    alignItems: 'center',
    paddingVertical: 18,
    gap: 4,
  },
  moodCardActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  moodLabel: { color: COLORS.text, fontSize: 17, fontWeight: '700', marginTop: 4 },
  moodHint: { color: COLORS.textSecondary, fontSize: 12 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  chip: {
    backgroundColor: COLORS.card,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#333333',
  },
  chipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  chipText: { color: COLORS.textSecondary, fontSize: 14, fontWeight: '600' },
  chipTextActive: { color: COLORS.text },
  findButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS,
    paddingVertical: 15,
    marginTop: 28,
  },
  findButtonDisabled: { opacity: 0.4 },
  findText: { color: COLORS.text, fontSize: 17, fontWeight: '700' },
  hint: { color: COLORS.textSecondary, fontSize: 13, textAlign: 'center', marginTop: 8 },
  resultBox: {
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: RADIUS,
    padding: SPACING,
    marginTop: 24,
  },
  resultLabel: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: 14,
  },
  poster: { borderRadius: RADIUS, backgroundColor: COLORS.background },
  title: { color: COLORS.text, fontSize: 22, fontWeight: '800', textAlign: 'center', marginTop: 14 },
  badgeRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 8, marginTop: 12 },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: COLORS.background,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  badgeText: { color: COLORS.text, fontSize: 13, fontWeight: '600' },
  description: { color: COLORS.text, fontSize: 15, lineHeight: 22, textAlign: 'center', marginTop: 14 },
  detailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    alignSelf: 'stretch',
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderRadius: RADIUS,
    paddingVertical: 12,
    marginTop: 18,
  },
  detailsText: { color: COLORS.primary, fontSize: 16, fontWeight: '700' },
});
