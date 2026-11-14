import React, { useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AuthInput from '../components/AuthInput';
import MovieCard from '../components/MovieCard';
import movies from '../data/movies';
import { useAuth } from '../context/AuthContext';
import { useFavourites } from '../context/FavouritesContext';
import { validateName, validatePassword } from '../utils/validation';
import { COLORS, RADIUS, SPACING } from '../constants/theme';

export default function ProfileScreen({ navigation }) {
  const { user, logout, updateName, changePassword } = useAuth();
  const { favouriteIds } = useFavourites();

  // Same list the Favourites tab uses, so both always stay in sync
  const favouriteMovies = movies.filter((movie) => favouriteIds.includes(movie.id));
  const openFavourites = () => navigation.navigate('MainTabs', { screen: 'Favourites' });

  const [name, setName] = useState(user.name);
  const [nameMsg, setNameMsg] = useState({ text: '', ok: true });

  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [pwErrors, setPwErrors] = useState({});
  const [pwMsg, setPwMsg] = useState({ text: '', ok: true });

  const memberSince = new Date(user.createdAt).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const handleSaveName = async () => {
    const error = validateName(name);
    if (error) return setNameMsg({ text: error, ok: false });
    const result = await updateName(name);
    setNameMsg(result.ok ? { text: 'Name updated.', ok: true } : { text: result.error, ok: false });
  };

  const handleChangePassword = async () => {
    const errors = {
      current: currentPw ? '' : 'Enter your current password.',
      next: validatePassword(newPw),
      confirm: confirmPw === newPw ? '' : 'Passwords do not match.',
    };
    setPwErrors(errors);
    setPwMsg({ text: '', ok: true });
    if (Object.values(errors).some(Boolean)) return;

    const result = await changePassword(currentPw, newPw);
    if (result.ok) {
      setCurrentPw('');
      setNewPw('');
      setConfirmPw('');
      setPwMsg({ text: 'Password changed successfully.', ok: true });
    } else {
      setPwMsg({ text: result.error, ok: false });
    }
  };

  return (
    <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{user.name.trim().charAt(0).toUpperCase()}</Text>
          </View>
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
        </View>

        <View style={styles.statsRow}>
          <Pressable
            style={({ pressed }) => [styles.statCard, pressed && { opacity: 0.7 }]}
            onPress={openFavourites}
          >
            <Ionicons name="heart" size={22} color={COLORS.primary} />
            <Text style={styles.statValue}>{favouriteIds.length}</Text>
            <Text style={styles.statLabel}>Favourites</Text>
          </Pressable>
          <View style={styles.statCard}>
            <Ionicons name="calendar-outline" size={22} color={COLORS.primary} />
            <Text style={styles.statValueSmall}>{memberSince}</Text>
            <Text style={styles.statLabel}>Member since</Text>
          </View>
        </View>

        <View style={styles.favHeader}>
          <Text style={[styles.sectionTitle, { marginTop: 0 }]}>My favourites</Text>
          {favouriteMovies.length > 0 && (
            <Pressable onPress={openFavourites} hitSlop={8}>
              <Text style={styles.seeAll}>See all</Text>
            </Pressable>
          )}
        </View>
        {favouriteMovies.length > 0 ? (
          <FlatList
            data={favouriteMovies}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => String(item.id)}
            ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
            renderItem={({ item }) => (
              <MovieCard
                movie={item}
                width={120}
                onPress={() => navigation.navigate('MovieDetails', { movieId: item.id })}
              />
            )}
          />
        ) : (
          <View style={styles.emptyFav}>
            <Text style={styles.emptyFavText}>You have not saved any favourites yet.</Text>
            <Pressable onPress={() => navigation.navigate('MainTabs', { screen: 'AllMovies' })}>
              <Text style={styles.seeAll}>Browse movies</Text>
            </Pressable>
          </View>
        )}

        <Text style={styles.sectionTitle}>Edit profile</Text>
        <AuthInput
          label="Full name"
          icon="person-outline"
          autoCapitalize="words"
          value={name}
          onChangeText={(t) => {
            setName(t);
            setNameMsg({ text: '', ok: true });
          }}
        />
        {!!nameMsg.text && (
          <Text style={[styles.message, { color: nameMsg.ok ? COLORS.star : COLORS.primary }]}>{nameMsg.text}</Text>
        )}
        <Pressable style={({ pressed }) => [styles.button, pressed && { opacity: 0.8 }]} onPress={handleSaveName}>
          <Text style={styles.buttonText}>Save Name</Text>
        </Pressable>

        <Text style={styles.sectionTitle}>Change password</Text>
        <AuthInput
          label="Current password"
          icon="lock-closed-outline"
          secure
          value={currentPw}
          onChangeText={setCurrentPw}
          error={pwErrors.current}
        />
        <AuthInput
          label="New password"
          icon="key-outline"
          secure
          placeholder="At least 6 characters"
          value={newPw}
          onChangeText={setNewPw}
          error={pwErrors.next}
        />
        <AuthInput
          label="Confirm new password"
          icon="shield-checkmark-outline"
          secure
          value={confirmPw}
          onChangeText={setConfirmPw}
          error={pwErrors.confirm}
        />
        {!!pwMsg.text && (
          <Text style={[styles.message, { color: pwMsg.ok ? COLORS.star : COLORS.primary }]}>{pwMsg.text}</Text>
        )}
        <Pressable style={({ pressed }) => [styles.button, pressed && { opacity: 0.8 }]} onPress={handleChangePassword}>
          <Text style={styles.buttonText}>Update Password</Text>
        </Pressable>

        <Pressable style={({ pressed }) => [styles.logoutButton, pressed && { opacity: 0.8 }]} onPress={logout}>
          <Ionicons name="log-out-outline" size={20} color={COLORS.primary} />
          <Text style={styles.logoutText}>Log Out</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING, paddingBottom: SPACING * 3 },
  header: { alignItems: 'center', marginTop: 8 },
  avatar: {
    width: 86,
    height: 86,
    borderRadius: 43,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: COLORS.text, fontSize: 38, fontWeight: '800' },
  userName: { color: COLORS.text, fontSize: 22, fontWeight: '800', marginTop: 12 },
  userEmail: { color: COLORS.textSecondary, fontSize: 14, marginTop: 2 },
  statsRow: { flexDirection: 'row', gap: 12, marginTop: 20 },
  statCard: { flex: 1, backgroundColor: COLORS.card, borderRadius: RADIUS, alignItems: 'center', padding: 14, gap: 4 },
  statValue: { color: COLORS.text, fontSize: 22, fontWeight: '800' },
  statValueSmall: { color: COLORS.text, fontSize: 13, fontWeight: '700', textAlign: 'center', marginTop: 4 },
  statLabel: { color: COLORS.textSecondary, fontSize: 12 },
  sectionTitle: { color: COLORS.primary, fontSize: 14, fontWeight: '700', textTransform: 'uppercase', marginTop: 28 },
  favHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 28, marginBottom: 12 },
  seeAll: { color: COLORS.primary, fontSize: 14, fontWeight: '600' },
  emptyFav: { backgroundColor: COLORS.card, borderRadius: RADIUS, padding: 16, alignItems: 'center', gap: 8 },
  emptyFavText: { color: COLORS.textSecondary, fontSize: 14 },
  message: { fontSize: 13, fontWeight: '600', marginTop: 10 },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: { color: COLORS.text, fontSize: 16, fontWeight: '700' },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderRadius: RADIUS,
    paddingVertical: 13,
    marginTop: 32,
  },
  logoutText: { color: COLORS.primary, fontSize: 16, fontWeight: '700' },
});
