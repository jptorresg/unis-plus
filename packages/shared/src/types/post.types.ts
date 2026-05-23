import type { PublicUser } from './user.types'

export type PostStatus = 'ACTIVE' | 'DELETED'
export type CommentStatus = 'ACTIVE' | 'DELETED'
export type ReportTargetType = 'POST' | 'COMMENT'
export type ReportStatus = 'PENDING' | 'REVIEWED' | 'RESOLVED' | 'DISMISSED'

export interface PostImage {
  id: string
  url: string
  order: number
}

export interface Post {
  id: string
  forumId: string
  author: PublicUser
  content: string
  status: PostStatus
  images: PostImage[]
  likesCount: number
  commentsCount: number
  likedByMe: boolean
  createdAt: string
  updatedAt: string
}

export interface Comment {
  id: string
  postId: string
  parentId: string | null
  author: PublicUser
  content: string
  status: CommentStatus
  depth: number
  likesCount: number
  likedByMe: boolean
  repliesCount: number
  createdAt: string
  updatedAt: string
}

export interface ReportPayload {
  targetType: ReportTargetType
  targetId: string
  reason: string
}
