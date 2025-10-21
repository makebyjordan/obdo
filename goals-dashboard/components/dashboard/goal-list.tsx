'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { GoalCard } from './goal-card'
import { Goal } from '@/types/goals'

interface GoalListProps {
  goals: Goal[]
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  onEdit?: () => void
}

export function GoalList({ goals, onToggle, onDelete, onEdit }: GoalListProps) {
  if (goals.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No tienes objetivos aún. ¡Crea tu primer objetivo!</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <AnimatePresence>
        {goals.map((goal, index) => (
          <GoalCard
            key={goal.id}
            goal={goal}
            index={index}
            onToggle={onToggle}
            onDelete={onDelete}
            onEdit={onEdit}
            isTop3={index < 3 && !goal.completed}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}
