import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AuthInput from '../components/AuthInput';
import { SECURITY_QUESTIONS } from '../utils/securityQuestions';
import { useAuth } from '../context/AuthContext';
import { validateEmail, validateName, validatePassword } from '../utils/validation';
import { COLORS, RADIUS, SPACING } from '../constants/theme';

export default function RegisterScreen({ navigation }) {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [busy, setBusy] = useState(false);

  const handleRegister = async () => {
    const newErrors = {
      name: validateName(name),
      email: validateEmail(email),
      password: validatePassword(password),
      confirm: confirm === password ? '' : 'Passwords do not match.',
      question: question ? '' : 'Please choose a security question.',
      answer: answer.trim().length >= 2 ? '' : 'Please enter an answer.',
    };
    setErrors(newErrors);
    setFormError('');
    if (Object.values(newErrors).some(Boolean)) return;

    setBusy(true);
    const result = await register({ name, email, password, securityQuestion: question, securityAnswer: answer });
    setBusy(false);
    if (!result.ok) setFormError(result.error); // on success the navigator switches to the app
  };

  return (
    <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.heading}>Create your account</Text>
        <Text style={styles.sub}>Join MovieShelf and build your own movie collection.</Text>

        <AuthInput
          label="Full name"
          icon="person-outline"
          placeholder="Your name"
          autoCapitalize="words"
          value={name}
          onChangeText={setName}
          error={errors.name}
        />
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
          placeholder="At least 6 characters"
          secure
          value={password}
          onChangeText={setPassword}
          error={errors.password}
        />
        <AuthInput
          label="Confirm password"
          icon="shield-checkmark-outline"
          placeholder="Repeat your password"
          secure
          value={confirm}
          onChangeText={setConfirm}
          error={errors.confirm}
          onSubmitEditing={handleRegister}
        />

        <Text style={styles.questionTitle}>Security question (used to reset your password)</Text>
        {SECURITY_QUESTIONS.map((q) => {
          const active = question === q;
          return (
            <Pressable key={q} style={[styles.option, active && styles.optionActive]} onPress={() => setQuestion(q)}>
              <Ionicons
                name={active ? 'radio-button-on' : 'radio-button-off'}
                size={20}
                color={active ? COLORS.primary : COLORS.textSecondary}
              />
              <Text style={styles.optionText}>{q}</Text>
            </Pressable>
          );
        })}
        {!!errors.question && <Text style={styles.fieldError}>{errors.question}</Text>}
        <AuthInput
          label="Your answer"
          icon="help-circle-outline"
          placeholder="Remember this answer"
          value={answer}
          onChangeText={setAnswer}
          error={errors.answer}
          onSubmitEditing={handleRegister}
        />

        {!!formError && <Text style={styles.formError}>{formError}</Text>}

        <Pressable
          style={({ pressed }) => [styles.button, (pressed || busy) && { opacity: 0.8 }]}
          onPress={handleRegister}
          disabled={busy}
        >
          <Text style={styles.buttonText}>{busy ? 'Creating account...' : 'Register'}</Text>
        </Pressable>

        <View style={styles.switchRow}>
          <Text style={styles.switchText}>Already have an account? </Text>
          <Pressable onPress={() => navigation.navigate('Login')}>
            <Text style={styles.switchLink}>Log in</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING * 1.5, paddingBottom: SPACING * 3 },
  heading: { color: COLORS.text, fontSize: 24, fontWeight: '800' },
  sub: { color: COLORS.textSecondary, fontSize: 14, marginTop: 4 },
  questionTitle: { color: COLORS.text, fontSize: 14, fontWeight: '600', marginTop: 20, marginBottom: 4 },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: COLORS.card,
    borderRadius: RADIUS,
    borderWidth: 1,
    borderColor: '#333333',
    padding: 12,
    marginTop: 8,
  },
  optionActive: { borderColor: COLORS.primary },
  optionText: { color: COLORS.text, fontSize: 14, flex: 1 },
  fieldError: { color: COLORS.primary, fontSize: 12, marginTop: 6 },
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
