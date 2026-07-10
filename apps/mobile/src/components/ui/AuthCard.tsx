import type { ReactNode } from 'react'
import { StyleSheet, Text, View } from 'react-native'

import { colors, radius, shadows, spacing } from '../../theme/tokens'

interface AuthCardProps {
  title: string
  subtitle?: string
  children: ReactNode
}

export function AuthCard({ title, subtitle, children }: AuthCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.logoMark}>
          <Text style={styles.logoText}>U+</Text>
        </View>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      <View style={styles.body}>{children}</View>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.neutral[0],
    borderRadius: radius.lg,
    padding: spacing.xl,
    width: '100%',
    maxWidth: 420,
    ...shadows.card,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  logoMark: {
    width: 52,
    height: 52,
    backgroundColor: colors.primary[700],
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  logoText: {
    color: colors.neutral[0],
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.neutral[950],
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 6,
    fontSize: 14,
    color: colors.neutral[700],
    textAlign: 'center',
    lineHeight: 20,
  },
  body: {
    gap: spacing.md,
  },
})
