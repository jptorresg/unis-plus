export type ForumType = 'GENERAL' | 'PUBLIC' | 'PRIVATE' | 'RESTRICTED'

export type ForumMembershipStatus = 'ACTIVE' | 'PENDING' | 'BANNED' | 'INVITED'

export interface ForumSummary {
  id: string
  name: string
  description: string | null
  type: ForumType
  avatarUrl: string | null
  membershipStatus: ForumMembershipStatus | null // null = no es miembro
  createdAt: string
}

export interface ForumDetail extends ForumSummary {
  bannerUrl: string | null
  adminId: string | null
  isActive: boolean
}
