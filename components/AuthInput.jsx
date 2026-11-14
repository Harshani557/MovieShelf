import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS } from '../constants/theme';

export default function AuthInput({ label, icon, error, secure, ...inputProps }) {
  const [hidden, setHidden] = useState(!!secure);

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.box, !!error && styles.boxError]}>
        <Ionicons name={icon} size={20} color={COLORS.textSecondary} />
        <TextInput
          style={styles.input}
          placeholderTextColor={COLORS.textSecondary}
          secureTextEntry={hidden}
          autoCapitalize="none"
          autoCorrect={false}
          {...inputProps}
        />
        {secure && (
          <Pressable onPress={() => setHidden((h) => !h)} hitSlop={10}>
            <Ionicons name={hidden ? 'eye-outline' : 'eye-off-outline'} size={20} color={COLORS.textSecondary} />
          </Pressable>
        )}
      </View>
      {!!error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginTop: 14 },
  label: { color: COLORS.text, fontSize: 14, fontWeight: '600', marginBottom: 6 },
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: COLORS.card,
    borderRadius: RADIUS,
    borderWidth: 1,
    borderColor: '#333333',
    paddingHorizontal: 14,
  },
  boxError: { borderColor: COLORS.primary },
  input: { flex: 1, color: COLORS.text, fontSize: 16, paddingVertical: 13 },
  error: { color: COLORS.primary, fontSize: 12, marginTop: 5 },
});
