import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AuthInput from '../components/AuthInput';
import { useAuth } from '../context/AuthContext';
import { validateEmail } from '../utils/validation';
import { COLORS, RADIUS, SPACING } from '../constants/theme';

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [busy, setBusy] = useState(false);

  const handleLogin = async () => {
    const newErrors = {
      email: validateEmail(email),
      password: password ? '' : 'Please enter your password.',
    };
    setErrors(newErrors);
    setFormError('');
    if (newErrors.email || newErrors.password) return;

    setBusy(true);
    const result = await login({ email, password });
    setBusy(false);
    if (!result.ok) setFormError(result.error); // on success the navigator switches to the app
  };

  return (
    <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.logoRow}>
          <Ionicons name="film" size={38} color={COLORS.primary} />
          <Text style={styles.appName}>
            Movie<Text style={{ color: COLORS.primary }}>Shelf</Text>
          </Text>
        </View>
        <Text style={styles.heading}>Welcome back</Text>
        <Text style={styles.sub}>Log in to continue to your movie collection.</Text>

        <AuthInput
          label="Email"
          icon="mail-outline"
          placeholder="you@example.com"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          error={errors.email}
        />
        <AuthInput
          label="Password"
          icon="lock-closed-outline"
          placeholder="Your password"
          secure
          value={password}
          onChangeText={setPassword}
          error={errors.password}
          onSubmitEditing={handleLogin}
        />

        <Pressable onPress={() => navigation.navigate('ForgotPassword')} style={styles.forgot} hitSlop={8}>
          <Text style={styles.switchLink}>Forgot password?</Text>
        </Pressable>

        {!!formError && <Text style={styles.formError}>{formError}</Text>}

        <Pressable
          style={({ pressed }) => [styles.button, (pressed || busy) && { opacity: 0.8 }]}
          onPress={handleLogin}
          disabled={busy}
        >
          <Text style={styles.buttonText}>{busy ? 'Logging in...' : 'Log In'}</Text>
        </Pressable>

        <View style={styles.switchRow}>
          <Text style={styles.switchText}>New to MovieShelf? </Text>
          <Pressable onPress={() => navigation.navigate('Register')}>
            <Text style={styles.switchLink}>Create an account</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  content: { flexGrow: 1, justifyContent: 'center', padding: SPACING * 1.5 },
  logoRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 24 },
  appName: { color: COLORS.text, fontSize: 34, fontWeight: '800' },
  heading: { color: COLORS.text, fontSize: 24, fontWeight: '800' },
  sub: { color: COLORS.textSecondary, fontSize: 14, marginTop: 4 },
  forgot: { alignSelf: 'flex-end', marginTop: 12 },
  formError: { color: COLORS.primary, fontSize: 14, fontWeight: '600', marginTop: 14, textAlign: 'center' },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 22,
  },
  buttonText: { color: COLORS.text, fontSize: 17, fontWeight: '700' },
  switchRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
  switchText: { color: COLORS.textSecondary, fontSize: 14 },
  switchLink: { color: COLORS.primary, fontSize: 14, fontWeight: '700' },
});
