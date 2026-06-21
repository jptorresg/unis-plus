/**
 * Shape que retorna Prisma al usar userVisibilitySelect.
 * Se usa como tipo intermedio antes de transformar a PublicAuthorDto.
 */
export interface UserVisibilityRaw {
  id: string;
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
  isDeactivated: boolean;
  keepContentOnDelete: boolean;
  deletedAt: Date | null;
}

/**
 * Representación pública de un autor en posts y comentarios.
 * Si el usuario está desactivado y no eligió mantener contenido visible,
 * sus datos personales se ocultan.
 */
export interface PublicAuthorDto {
  id: string | null;
  displayName: string;
  avatarUrl: string | null;
  isDeactivated: boolean;
}

/**
 * Select de Prisma reutilizable para recuperar los campos
 * necesarios para evaluar la visibilidad de un autor.
 * Usar en includes de Post y Comment queries.
 */
export const userVisibilitySelect = {
  id: true,
  firstName: true,
  lastName: true,
  avatarUrl: true,
  isDeactivated: true,
  keepContentOnDelete: true,
  deletedAt: true,
} as const;

/**
 * Transforma un usuario raw de Prisma en su representación pública,
 * aplicando la lógica de visibilidad de contenido.
 *
 * Reglas:
 * - Usuario activo → muestra nombre completo, avatar e id reales.
 * - Usuario desactivado + keepContentOnDelete = true → igual que activo,
 *   pero con isDeactivated: true para que el frontend pueda indicarlo.
 * - Usuario desactivado + keepContentOnDelete = false → oculta id, nombre
 *   y avatar. Muestra "Usuario desactivado".
 */
export function resolvePublicAuthor(user: UserVisibilityRaw): PublicAuthorDto {
  if (!user.isDeactivated) {
    return {
      id: user.id,
      displayName: `${user.firstName} ${user.lastName}`,
      avatarUrl: user.avatarUrl,
      isDeactivated: false,
    };
  }

  if (user.keepContentOnDelete) {
    return {
      id: user.id,
      displayName: `${user.firstName} ${user.lastName}`,
      avatarUrl: user.avatarUrl,
      isDeactivated: true,
    };
  }

  return {
    id: null,
    displayName: 'Usuario desactivado',
    avatarUrl: null,
    isDeactivated: true,
  };
}
