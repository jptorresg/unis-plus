import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native'

import { colors, radius } from '../../theme/tokens'

interface ButtonProps {
  label: string
  onPress: () => void
  variant?: 'primary' | 'ghost'
  isLoading?: boolean
  disabled?: boolean
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  isLoading = false,
  disabled = false,
}: ButtonProps) {
  const isPrimary = variant === 'primary'
  const isDisabled = disabled || isLoading

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        isPrimary ? styles.primary : styles.ghost,
        isDisabled && styles.disabled,
        pressed && !isDisabled && (isPrimary ? styles.primaryPressed : styles.ghostPressed),
      ]}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: isLoading }}
    >
      {isLoading ? (
        <ActivityIndicator
          size="small"
          color={isPrimary ? colors.neutral[0] : colors.primary[700]}
        />
      ) : null}
      <Text style={[styles.label, isPrimary ? styles.labelPrimary : styles.labelGhost]}>
        {label}
      </Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  base: {
    height: 48,
    borderRadius: radius.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 20,
  },
  primary: {
    backgroundColor: colors.primary[700],
  },
  primaryPressed: {
    backgroundColor: colors.primary[800],
  },
  ghost: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.primary[700],
  },
  ghostPressed: {
    backgroundColor: colors.primary[50],
  },
  disabled: {
    opacity: 0.55,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
  },
  labelPrimary: {
    color: colors.neutral[0],
  },
  labelGhost: {
    color: colors.primary[700],
  },
})
