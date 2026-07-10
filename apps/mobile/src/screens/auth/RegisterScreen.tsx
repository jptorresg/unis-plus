import { Picker } from '@react-native-picker/picker'
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
import { colors, radius, spacing } from '../../theme/tokens'

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>

type Category = 'STUDENT' | 'TEACHER' | 'STAFF' | 'ALUMNI'

const CATEGORY_LABELS: Record<Category, string> = {
  STUDENT: 'Estudiante',
  TEACHER: 'Docente',
  STAFF: 'Personal administrativo',
  ALUMNI: 'Alumni',
}

interface RegisterFields {
  firstName: string
  lastName: string
  email: string
  institutionalId: string
  category: string
  password: string
}

export function RegisterScreen({ navigation }: Props) {
  const form = useAuthForm<RegisterFields>()

  async function handleRegister() {
    await form.submit(async () => {
      await authApi.register({
        firstName: form.fields.firstName ?? '',
        lastName: form.fields.lastName ?? '',
        email: form.fields.email ?? '',
        institutionalId: form.fields.institutionalId ?? '',
        category: (form.fields.category ?? 'STUDENT') as Category,
        password: form.fields.password ?? '',
      })
      navigation.navigate('VerifyEmail', {
        email: form.fields.email ?? '',
      })
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
            title="Crear cuenta"
            subtitle="Únete a la comunidad UNIS+ con tu correo institucional"
          >
            {form.globalError ? (
              <View style={styles.alertError}>
                <Text style={styles.alertErrorText}>{form.globalError}</Text>
              </View>
            ) : null}

            <View style={styles.row}>
              <View style={styles.col}>
                <Input
                  label="Nombre(s)"
                  placeholder="María"
                  autoCapitalize="words"
                  value={form.fields.firstName ?? ''}
                  onChangeText={v => {
                    form.handleChange('firstName', v)
                  }}
                />
              </View>
              <View style={styles.col}>
                <Input
                  label="Apellidos"
                  placeholder="García"
                  autoCapitalize="words"
                  value={form.fields.lastName ?? ''}
                  onChangeText={v => {
                    form.handleChange('lastName', v)
                  }}
                />
              </View>
            </View>

            <Input
              label="Correo institucional"
              keyboardType="email-address"
              autoCapitalize="none"
              placeholder="maria.garcia@unis.edu.gt"
              hint="Solo se aceptan correos @unis.edu.gt"
              value={form.fields.email ?? ''}
              onChangeText={v => {
                form.handleChange('email', v)
              }}
            />

            <Input
              label="ID institucional"
              keyboardType="numeric"
              placeholder="20230001"
              value={form.fields.institutionalId ?? ''}
              onChangeText={v => {
                form.handleChange('institutionalId', v)
              }}
            />

            <View style={styles.pickerWrapper}>
              <Text style={styles.pickerLabel}>Categoría institucional</Text>
              <View style={styles.pickerBox}>
                <Picker
                  selectedValue={form.fields.category ?? 'STUDENT'}
                  onValueChange={v => {
                    form.handleChange('category', v)
                  }}
                  style={styles.picker}
                >
                  {(Object.entries(CATEGORY_LABELS) as [Category, string][]).map(
                    ([value, label]) => (
                      <Picker.Item key={value} label={label} value={value} />
                    ),
                  )}
                </Picker>
              </View>
            </View>

            <Input
              label="Contraseña"
              secureTextEntry
              placeholder="Mínimo 8 caracteres"
              hint="Mínimo 8 caracteres"
              value={form.fields.password ?? ''}
              onChangeText={v => {
                form.handleChange('password', v)
              }}
            />

            <Button
              label="Crear cuenta"
              onPress={() => {
                void handleRegister()
              }}
              isLoading={form.isLoading}
            />

            <View style={styles.footer}>
              <Text style={styles.footerText}>¿Ya tienes cuenta? </Text>
              <Pressable
                onPress={() => {
                  navigation.navigate('Login')
                }}
              >
                <Text style={styles.footerLink}>Inicia sesión</Text>
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
  row: { flexDirection: 'row', gap: spacing.sm },
  col: { flex: 1 },
  pickerWrapper: { gap: 6 },
  pickerLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.neutral[700],
    letterSpacing: 0.1,
  },
  pickerBox: {
    borderWidth: 1.5,
    borderColor: colors.neutral[200],
    borderRadius: radius.md,
    overflow: 'hidden',
  },
  picker: { height: 48, color: colors.neutral[950] },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
  },
  footerText: { fontSize: 13, color: colors.neutral[700] },
  footerLink: { fontSize: 13, color: colors.primary[700], fontWeight: '600' },
})
