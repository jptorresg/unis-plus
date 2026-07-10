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

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>

export function LoginScreen({ navigation }: Props) {
  const form = useAuthForm<{ email: string; password: string }>()

  async function handleLogin() {
    await form.submit(async () => {
      await authApi.login({
        email: form.fields.email ?? '',
        password: form.fields.password ?? '',
      })
      // TODO: persistir tokens con SecureStore (paso siguiente del sprint)
    })
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.kav}
      >
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <AuthCard title="Bienvenido a UNIS+" subtitle="Inicia sesión con tu correo institucional">
            {form.globalError ? (
              <View style={styles.alertError}>
                <Text style={styles.alertErrorText}>{form.globalError}</Text>
              </View>
            ) : null}

            <Input
              label="Correo institucional"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              placeholder="tu.nombre@unis.edu.gt"
              value={form.fields.email ?? ''}
              onChangeText={v => {
                form.handleChange('email', v)
              }}
            />

            <Input
              label="Contraseña"
              secureTextEntry
              autoComplete="current-password"
              placeholder="••••••••"
              value={form.fields.password ?? ''}
              onChangeText={v => {
                form.handleChange('password', v)
              }}
            />

            <Pressable
              onPress={() => {
                navigation.navigate('ForgotPassword')
              }}
              style={styles.forgotWrap}
            >
              <Text style={styles.forgotText}>¿Olvidaste tu contraseña?</Text>
            </Pressable>

            <Button
              label="Iniciar sesión"
              onPress={() => {
                void handleLogin()
              }}
              isLoading={form.isLoading}
            />

            <View style={styles.footer}>
              <Text style={styles.footerText}>¿No tienes cuenta? </Text>
              <Pressable
                onPress={() => {
                  navigation.navigate('Register')
                }}
              >
                <Text style={styles.footerLink}>Regístrate aquí</Text>
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
  alertErrorText: {
    fontSize: 13,
    color: colors.semantic.error,
    lineHeight: 18,
  },
  forgotWrap: { alignSelf: 'flex-end', marginTop: -8 },
  forgotText: { fontSize: 13, color: colors.primary[700], fontWeight: '600' },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
  },
  footerText: { fontSize: 13, color: colors.neutral[700] },
  footerLink: { fontSize: 13, color: colors.primary[700], fontWeight: '600' },
})
