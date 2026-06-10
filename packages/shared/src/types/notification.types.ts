export type NotificationEventType =
  | 'POST_CREATED'
  | 'COMMENT_CREATED'
  | 'LIKE_POST'
  | 'LIKE_COMMENT'
  | 'MENTION'
  | 'FORUM_CHANGE'
  | 'MODERATION'
  | 'REPORT_RESOLVED'

export type NotificationTargetType = 'POST' | 'COMMENT' | 'FORUM' | 'REPORT'

export interface Notification {
  id: string
  eventType: NotificationEventType
  targetType: NotificationTargetType
  targetId: string | null
  actorName: string | null // nombre del actor, null si es acción del sistema
  forumName: string | null
  read: boolean
  createdAt: string
}
