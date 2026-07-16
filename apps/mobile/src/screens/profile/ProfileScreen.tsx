import type { UserProfileResponse } from '@unis-plus/shared'
import * as ImagePicker from 'expo-image-picker'
import { useEffect, useState } from 'react'
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { Button } from '../../components/ui/Button'
import { usersApi } from '../../lib/users'
import { colors, radius, shadows, spacing } from '../../theme/tokens'

const CATEGORY_LABELS: Record<string, string> = {
  STUDENT: 'Estudiante',
  TEACHER: 'Docente',
  STAFF: 'Personal',
  ALUMNI: 'Alumni',
}

const MAX_DESCRIPTION = 300

function getInitials(firstName: string, lastName: string) {
  return `${firstName[0] ?? ''}${lastName[0] ?? ''}`.toUpperCase()
}

export function ProfileScreen() {
  const [profile, setProfile] = useState<UserProfileResponse | null>(null)
  const [description, setDescription] = useState('')
  const [isEditingDesc, setIsEditingDesc] = useState(false)
  const [isSavingDesc, setIsSavingDesc] = useState(false)
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
  const [isUploadingBanner, setIsUploadingBanner] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    void usersApi
      .getMe()
      .then(data => {
        setProfile(data)
        setDescription(data.description ?? '')
      })
      .catch(() => {
        setError('No se pudo cargar el perfil.')
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [])

  async function pickAndUpload(type: 'avatar' | 'banner') {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: type === 'avatar' ? [1, 1] : [3, 1],
      quality: 0.85,
    })

    if (result.canceled || !result.assets[0]) return

    const asset = result.assets[0]
    const uri = asset.uri
    const mimeType = asset.mimeType ?? 'image/jpeg'
    const fileName = uri.split('/').pop() ?? `upload.${mimeType.split('/')[1] ?? 'jpg'}`

    if (type === 'avatar') {
      setIsUploadingAvatar(true)
    } else {
      setIsUploadingBanner(true)
    }
    setError(null)

    try {
      if (type === 'avatar') {
        await usersApi.uploadAvatar(uri, mimeType, fileName)
      } else {
        await usersApi.uploadBanner(uri, mimeType, fileName)
      }
      const updated = await usersApi.getMe()
      setProfile(updated)
      setSuccessMsg(type === 'avatar' ? 'Foto actualizada.' : 'Banner actualizado.')
      setTimeout(() => {
        setSuccessMsg(null)
      }, 3000)
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error al subir imagen.'
      Alert.alert('Error', msg)
    } finally {
      setIsUploadingAvatar(false)
      setIsUploadingBanner(false)
    }
  }

  async function handleSaveDescription() {
    if (!profile) return
    setIsSavingDesc(true)
    setError(null)
    try {
      const updated = await usersApi.updateProfile({ description })
      setProfile(updated)
      setIsEditingDesc(false)
      setSuccessMsg('Descripción actualizada.')
      setTimeout(() => {
        setSuccessMsg(null)
      }, 3000)
    } catch {
      setError('No se pudo guardar la descripción.')
    } finally {
      setIsSavingDesc(false)
    }
  }

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary[700]} />
      </View>
    )
  }

  if (!profile) {
    return (
      <View style={styles.centered}>
        <Text style={{ color: colors.neutral[400] }}>No se pudo cargar el perfil.</Text>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Banner */}
        <Pressable
          onPress={() => {
            void pickAndUpload('banner')
          }}
          style={styles.banner}
          accessibilityLabel="Cambiar banner"
        >
          {profile.bannerUrl ? (
            <Image
              source={{ uri: profile.bannerUrl }}
              style={styles.bannerImage}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.bannerPlaceholder} />
          )}
          {isUploadingBanner ? (
            <View style={styles.uploadOverlay}>
              <ActivityIndicator color="white" />
            </View>
          ) : (
            <View style={styles.bannerEditBadge}>
              <Text style={styles.bannerEditText}>Cambiar banner</Text>
            </View>
          )}
        </Pressable>

        {/* Header del perfil */}
        <View style={styles.headerSection}>
          {/* Avatar */}
          <Pressable
            onPress={() => {
              void pickAndUpload('avatar')
            }}
            style={styles.avatarWrap}
            accessibilityLabel="Cambiar foto de perfil"
          >
            {profile.avatarUrl ? (
              <Image source={{ uri: profile.avatarUrl }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarInitials}>
                  {getInitials(profile.firstName, profile.lastName)}
                </Text>
              </View>
            )}
            {isUploadingAvatar ? (
              <View style={[styles.uploadOverlay, { borderRadius: 999 }]}>
                <ActivityIndicator color="white" />
              </View>
            ) : (
              <View style={styles.avatarEditDot}>
                <Text style={{ color: 'white', fontSize: 12 }}>📷</Text>
              </View>
            )}
          </Pressable>

          <View style={styles.nameBlock}>
            <Text style={styles.name}>
              {profile.firstName} {profile.lastName}
            </Text>
            <Text style={styles.email}>{profile.email}</Text>
            <View style={styles.badgeRow}>
              {profile.categories.map(cat => (
                <View key={cat} style={styles.badge}>
                  <Text style={styles.badgeText}>{CATEGORY_LABELS[cat] ?? cat}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Mensajes */}
        {error ? (
          <View style={[styles.card, styles.alertError]}>
            <Text style={{ color: colors.semantic.error, fontSize: 13 }}>{error}</Text>
          </View>
        ) : null}
        {successMsg ? (
          <View style={[styles.card, styles.alertSuccess]}>
            <Text style={{ color: colors.semantic.success, fontSize: 13 }}>{successMsg}</Text>
          </View>
        ) : null}

        {/* Sección: Descripción */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Acerca de mí</Text>
          {isEditingDesc ? (
            <>
              <TextInput
                style={styles.textarea}
                value={description}
                onChangeText={v => {
                  setDescription(v.slice(0, MAX_DESCRIPTION))
                }}
                placeholder="Cuéntanos algo sobre ti…"
                placeholderTextColor={colors.neutral[400]}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
              <Text style={styles.charCount}>
                {description.length}/{MAX_DESCRIPTION}
              </Text>
              <View style={styles.saveBar}>
                <View style={{ flex: 1 }}>
                  <Button
                    label="Cancelar"
                    variant="ghost"
                    onPress={() => {
                      setDescription(profile.description ?? '')
                      setIsEditingDesc(false)
                    }}
                    disabled={isSavingDesc}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Button
                    label="Guardar"
                    variant="primary"
                    isLoading={isSavingDesc}
                    onPress={() => {
                      void handleSaveDescription()
                    }}
                  />
                </View>
              </View>
            </>
          ) : (
            <>
              <Text style={styles.descriptionText}>
                {profile.description ?? 'Aún no has agregado una descripción.'}
              </Text>
              <Button
                label={profile.description ? 'Editar descripción' : 'Agregar descripción'}
                variant="ghost"
                onPress={() => {
                  setIsEditingDesc(true)
                }}
              />
            </>
          )}
        </View>

        {/* Sección: Información de cuenta */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Información de cuenta</Text>
          {[
            ['ID institucional', profile.institutionalId],
            ['Correo', profile.email],
            [
              'Rol',
              profile.role === 'SYSTEM_ADMIN'
                ? 'Administrador del sistema'
                : profile.role === 'INSTITUTIONAL_ADMIN'
                  ? 'Administrador institucional'
                  : 'Usuario',
            ],
            [
              'Miembro desde',
              new Date(profile.createdAt).toLocaleDateString('es-GT', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              }),
            ],
          ].map(([label, value]) => (
            <View key={label} style={styles.infoRow}>
              <Text style={styles.infoLabel}>{label}</Text>
              <Text style={styles.infoValue}>{value}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.neutral[100] },
  scroll: { paddingBottom: 48 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  /* Banner */
  banner: {
    height: 180,
    width: '100%',
    backgroundColor: colors.primary[700],
    position: 'relative',
  },
  bannerImage: { width: '100%', height: '100%' },
  bannerPlaceholder: {
    flex: 1,
    backgroundColor: colors.primary[700],
  },
  bannerEditBadge: {
    position: 'absolute',
    bottom: 10,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: radius.pill,
  },
  bannerEditText: { color: 'white', fontSize: 12, fontWeight: '600' },
  uploadOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(132,0,41,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  /* Header del perfil */
  headerSection: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: spacing.md,
    marginTop: -40,
    marginBottom: spacing.md,
    gap: spacing.md,
  },
  avatarWrap: { position: 'relative' },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 999,
    borderWidth: 4,
    borderColor: colors.neutral[0],
  },
  avatarPlaceholder: {
    width: 88,
    height: 88,
    borderRadius: 999,
    backgroundColor: colors.primary[700],
    borderWidth: 4,
    borderColor: colors.neutral[0],
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitials: { color: 'white', fontSize: 30, fontWeight: '700' },
  avatarEditDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 26,
    height: 26,
    borderRadius: 999,
    backgroundColor: colors.primary[700],
    borderWidth: 2,
    borderColor: colors.neutral[0],
    justifyContent: 'center',
    alignItems: 'center',
  },
  nameBlock: { flex: 1, paddingBottom: 4 },
  name: { fontSize: 20, fontWeight: '700', color: colors.neutral[950] },
  email: { fontSize: 13, color: colors.neutral[700], marginTop: 2 },
  badgeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 6 },
  badge: {
    backgroundColor: colors.primary[100],
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radius.pill,
  },
  badgeText: { fontSize: 11, color: colors.primary[700], fontWeight: '600' },

  /* Cards */
  card: {
    backgroundColor: colors.neutral[0],
    borderRadius: radius.lg,
    padding: spacing.md,
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    ...shadows.card,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.neutral[700],
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: spacing.md,
  },

  /* Descripción */
  descriptionText: {
    fontSize: 15,
    color: colors.neutral[700],
    lineHeight: 22,
    marginBottom: spacing.md,
  },
  textarea: {
    borderWidth: 1.5,
    borderColor: colors.neutral[200],
    borderRadius: radius.md,
    padding: 10,
    fontSize: 15,
    color: colors.neutral[950],
    minHeight: 100,
    lineHeight: 22,
  },
  charCount: {
    fontSize: 12,
    color: colors.neutral[400],
    textAlign: 'right',
    marginTop: 4,
    marginBottom: spacing.sm,
  },
  saveBar: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm },

  /* Info rows */
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
  },
  infoLabel: { fontSize: 13, color: colors.neutral[700], fontWeight: '500' },
  infoValue: {
    fontSize: 14,
    color: colors.neutral[950],
    fontWeight: '500',
    flexShrink: 1,
    textAlign: 'right',
  },

  /* Alertas */
  alertError: {
    backgroundColor: colors.semantic.errorBg,
    borderWidth: 1,
    borderColor: 'rgba(192,57,43,0.2)',
  },
  alertSuccess: {
    backgroundColor: colors.semantic.successBg,
    borderWidth: 1,
    borderColor: 'rgba(26,127,75,0.2)',
  },
})
