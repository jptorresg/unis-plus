import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { AuthCard } from '../../components/ui/AuthCard'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { useAuthForm } from '../../hooks/useAuthForm'
import { authApi } from '../../lib/auth'
import type { AuthStackParamList } from '../../navigation/AuthNavigator'
import { colors, spacing } from '../../theme/tokens'

type Props = NativeStackScreenProps<AuthStackParamList, 'VerifyEmail'>

export function VerifyEmailScreen({ route, navigation }: Props) {
  const { email } = route.params
  const form = useAuthForm<{ code: string }>()

  async function handleVerify() {
    await form.submit(async () => {
      await authApi.verifyEmail({ email, code: form.fields.code ?? '' })
      form.setSuccessMessage('¡Correo verificado! Redirigiendo...')
      setTimeout(() => {
        navigation.navigate('Login')
      }, 1500)
    })
  }

  async function handleResend() {
    await form.submit(async () => {
      const res = await authApi.resendVerification({ email })
      form.setSuccessMessage(res.message)
    })
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.kav}
      >
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <AuthCard
            title="Verifica tu correo"
            subtitle={`Enviamos un código de 6 dígitos a ${email}`}
          >
            {form.globalError ? (
              <View style={styles.alertError}>
                <Text style={styles.alertErrorText}>{form.globalError}</Text>
              </View>
            ) : null}

            {form.successMessage ? (
              <View style={styles.alertSuccess}>
                <Text style={styles.alertSuccessText}>{form.successMessage}</Text>
              </View>
            ) : null}

            <Input
              label="Código de verificación"
              keyboardType="numeric"
              maxLength={6}
              placeholder="123456"
              value={form.fields.code ?? ''}
              onChangeText={v => {
                form.handleChange('code', v)
              }}
            />

            <Button
              label="Verificar correo"
              onPress={() => {
                void handleVerify()
              }}
              isLoading={form.isLoading}
            />

            <Button
              label="Reenviar código"
              variant="ghost"
              onPress={() => {
                void handleResend()
              }}
              isLoading={form.isLoading}
            />

            <View style={styles.footer}>
              <Pressable
                onPress={() => {
                  navigation.navigate('Login')
                }}
              >
                <Text style={styles.footerLink}>Volver al inicio de sesión</Text>
              </Pressable>
            </View>
          </AuthCard>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.neutral[100] },
  kav: { flex: 1 },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.md,
  },
  alertError: {
    backgroundColor: colors.semantic.errorBg,
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(192,57,43,0.2)',
  },
  alertErrorText: { fontSize: 13, color: colors.semantic.error, lineHeight: 18 },
  alertSuccess: {
    backgroundColor: colors.semantic.successBg,
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(26,127,75,0.2)',
  },
  alertSuccessText: { fontSize: 13, color: colors.semantic.success, lineHeight: 18 },
  footer: { alignItems: 'center', marginTop: 4 },
  footerLink: { fontSize: 13, color: colors.primary[700], fontWeight: '600' },
})
