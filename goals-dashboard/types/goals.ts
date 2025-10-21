export interface Goal {
  id: string
  userId: string
  title: string
  url?: string | null
  priority: number
  notes?: string | null
  completed: boolean
  completedAt?: Date | null
  order: number
  createdAt: Date
  updatedAt: Date
}

export interface GoalAnalytics {
  total: number
  completed: number
  pending: number
  percentage: number
  canAddMore: boolean
}

export interface GoalsResponse {
  goals: Goal[]
  analytics: GoalAnalytics
}

export type PriorityLevel = 'normal' | 'bronze' | 'silver' | 'gold'

export interface Badge {
  emoji: string
  color: string
  label: string
}
