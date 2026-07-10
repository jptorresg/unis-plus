import { useState } from 'react'
import { StyleSheet, Text, TextInput, type TextInputProps, View } from 'react-native'

import { colors, radius } from '../../theme/tokens'

interface InputProps extends TextInputProps {
  label: string
  error?: string
  hint?: string
}

export function Input({ label, error, hint, ...props }: InputProps) {
  const [focused, setFocused] = useState(false)

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, focused && styles.inputFocused, error ? styles.inputError : null]}
        placeholderTextColor={colors.neutral[400]}
        onFocus={() => {
          setFocused(true)
        }}
        onBlur={() => {
          setFocused(false)
        }}
        {...props}
      />
      {hint && !error ? <Text style={styles.hint}>{hint}</Text> : null}
      {error ? (
        <Text style={styles.error} accessibilityRole="alert">
          {error}
        </Text>
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.neutral[700],
    letterSpacing: 0.1,
  },
  input: {
    height: 48,
    paddingHorizontal: 12,
    borderWidth: 1.5,
    borderColor: colors.neutral[200],
    borderRadius: radius.md,
    fontSize: 15,
    color: colors.neutral[950],
    backgroundColor: colors.neutral[0],
  },
  inputFocused: {
    borderColor: colors.primary[700],
  },
  inputError: {
    borderColor: colors.semantic.error,
  },
  hint: {
    fontSize: 12,
    color: colors.neutral[400],
  },
  error: {
    fontSize: 12,
    color: colors.semantic.error,
  },
})
