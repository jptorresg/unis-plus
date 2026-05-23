// Types
export type {
  UserProfile,
  DeactivatedUserProfile,
  PublicUser,
  UserRole,
  InstitutionalCategory,
} from './types/user.types'
export { isDeactivatedUser } from './types/user.types'

export type {
  ForumSummary,
  ForumDetail,
  ForumType,
  ForumMembershipStatus,
} from './types/forum.types'

export type {
  Post,
  Comment,
  PostImage,
  PostStatus,
  CommentStatus,
  ReportPayload,
  ReportTargetType,
  ReportStatus,
} from './types/post.types'

export type {
  Notification,
  NotificationEventType,
  NotificationTargetType,
} from './types/notification.types'

export type { PaginatedResponse, ApiResponse, ApiError } from './types/api.types'

// Constants
export { UPLOAD_LIMITS } from './constants/upload.constants'
export { PAGINATION } from './constants/pagination.constants'
export { FORUM_MEMBERSHIP_BEHAVIOR, COMMENT_MAX_VISUAL_DEPTH } from './constants/forum.constants'

// Utils
export {
  buildCommentPath,
  getCommentDepth,
  isDescendantOf,
  getParentPath,
} from './utils/comment-path.utils'
