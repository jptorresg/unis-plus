// Helpers para el sistema de materialized path de comentarios
// Documentados en el schema: path = "parentPath + id + ."

export function buildCommentPath(parentPath: string | null, commentId: string): string {
  if (parentPath === null) {
    return `${commentId}.` // comentario raíz
  }
  return `${parentPath}${commentId}.`
}

export function getCommentDepth(path: string): number {
  // "abc." → 1, "abc.def." → 2
  return path.split('.').filter(Boolean).length
}

export function isDescendantOf(path: string, ancestorPath: string): boolean {
  return path.startsWith(ancestorPath) && path !== ancestorPath
}

export function getParentPath(path: string): string | null {
  const segments = path.split('.').filter(Boolean)
  if (segments.length <= 1) return null
  return segments.slice(0, -1).join('.') + '.'
}
