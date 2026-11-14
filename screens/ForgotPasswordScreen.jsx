import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AuthInput from '../components/AuthInput';
import { useAuth } from '../context/AuthContext';
import { validateEmail, validatePassword } from '../utils/validation';
import { COLORS, RADIUS, SPACING } from '../constants/theme';

export default function ForgotPasswordScreen({ navigation }) {
  const { getSecurityQuestion, resetPassword } = useAuth();

  const [step, setStep] = useState('email'); // 'email' -> 'reset' -> 'done'
  const [email, setEmail] = useState('');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [busy, setBusy] = useState(false);

  const handleFindAccount = async () => {
    const emailError = validateEmail(email);
    setErrors({ email: emailError });
    setFormError('');
    if (emailError) return;

    setBusy(true);
    const result = await getSecurityQuestion(email);
    setBusy(false);
    if (result.ok) {
      setQuestion(result.question);
      setStep('reset');
    } else {
      setFormError(result.error);
    }
  };

  const handleReset = async () => {
    const newErrors = {
      answer: answer.trim() ? '' : 'Please enter your answer.',
      next: validatePassword(newPw),
      confirm: confirmPw === newPw ? '' : 'Passwords do not match.',
    };
    setErrors(newErrors);
    setFormError('');
    if (Object.values(newErrors).some(Boolean)) return;

    setBusy(true);
    const result = await resetPassword({ email, answer, newPassword: newPw });
    setBusy(false);
    if (result.ok) setStep('done');
    else setFormError(result.error);
  };

  return (
    <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {step === 'email' && (
          <>
            <Text style={styles.heading}>Forgot your password?</Text>
            <Text style={styles.sub}>Enter the email you registered with and we will ask your security question.</Text>
            <AuthInput
              label="Email"
              icon="mail-outline"
              placeholder="you@example.com"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
              error={errors.email}
              onSubmitEditing={handleFindAccount}
            />
            {!!formError && <Text style={styles.formError}>{formError}</Text>}
            <Pressable
              style={({ pressed }) => [styles.button, (pressed || busy) && { opacity: 0.8 }]}
              onPress={handleFindAccount}
              disabled={busy}
            >
              <Text style={styles.buttonText}>Continue</Text>
            </Pressable>
          </>
        )}

        {step === 'reset' && (
          <>
            <Text style={styles.heading}>Reset password</Text>
            <View style={styles.questionBox}>
              <Text style={styles.questionLabel}>Your security question</Text>
              <Text style={styles.questionText}>{question}</Text>
            </View>
            <AuthInput
              label="Your answer"
              icon="help-circle-outline"
              placeholder="Type your answer"
              value={answer}
              onChangeText={setAnswer}
              error={errors.answer}
            />
            <AuthInput
              label="New password"
              icon="key-outline"
              secure
              placeholder="At least 6 characters"
              value={newPw}
              onChangeText={setNewPw}
              error={errors.next}
            />
            <AuthInput
              label="Confirm new password"
              icon="shield-checkmark-outline"
              secure
              value={confirmPw}
              onChangeText={setConfirmPw}
              error={errors.confirm}
              onSubmitEditing={handleReset}
            />
            {!!formError && <Text style={styles.formError}>{formError}</Text>}
            <Pressable
              style={({ pressed }) => [styles.button, (pressed || busy) && { opacity: 0.8 }]}
              onPress={handleReset}
              disabled={busy}
            >
              <Text style={styles.buttonText}>{busy ? 'Saving...' : 'Reset Password'}</Text>
            </Pressable>
          </>
        )}

        {step === 'done' && (
          <View style={styles.doneBox}>
            <Ionicons name="checkmark-circle" size={72} color={COLORS.primary} />
            <Text style={styles.heading}>Password updated</Text>
            <Text style={[styles.sub, { textAlign: 'center' }]}>You can now log in with your new password.</Text>
            <Pressable
              style={({ pressed }) => [styles.button, { alignSelf: 'stretch' }, pressed && { opacity: 0.8 }]}
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={styles.buttonText}>Back to Login</Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  content: { flexGrow: 1, padding: SPACING * 1.5, paddingBottom: SPACING * 3 },
  heading: { color: COLORS.text, fontSize: 24, fontWeight: '800' },
  sub: { color: COLORS.textSecondary, fontSize: 14, lineHeight: 20, marginTop: 4 },
  questionBox: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
    padding: 14,
    marginTop: 16,
  },
  questionLabel: { color: COLORS.primary, fontSize: 12, fontWeight: '700', textTransform: 'uppercase' },
  questionText: { color: COLORS.text, fontSize: 16, fontWeight: '600', marginTop: 4 },
  formError: { color: COLORS.primary, fontSize: 14, fontWeight: '600', marginTop: 14, textAlign: 'center' },
  button: { backgroundColor: COLORS.primary, borderRadius: RADIUS, paddingVertical: 15, alignItems: 'center', marginTop: 22 },
  buttonText: { color: COLORS.text, fontSize: 17, fontWeight: '700' },
  doneBox: { alignItems: 'center', gap: 8, marginTop: 40 },
});
