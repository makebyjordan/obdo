'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ExternalLink, Trash2 } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { Goal } from '@/types/goals'
import { EditGoalDialog } from './edit-goal-dialog'

interface GoalCardProps {
  goal: Goal
  index: number
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  onEdit?: () => void
  isTop3?: boolean
}

const getBadge = (priority: number, index: number) => {
  // Prioridad 3 = oro, o primera posición
  if (priority === 3 || index === 0) {
    return { emoji: '🥇', color: 'bg-yellow-400 text-yellow-900', label: 'Oro' }
  }
  // Prioridad 2 = plata, o segunda posición
  if (priority === 2 || index === 1) {
    return { emoji: '🥈', color: 'bg-gray-300 text-gray-900', label: 'Plata' }
  }
  // Prioridad 1 = bronce, o tercera posición
  if (priority === 1 || index === 2) {
    return { emoji: '🥉', color: 'bg-orange-400 text-orange-900', label: 'Bronce' }
  }
  return null
}

export function GoalCard({
  goal,
  index,
  onToggle,
  onDelete,
  onEdit,
  isTop3 = false
}: GoalCardProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const badge = getBadge(goal.priority, index)

  const handleDelete = async () => {
    if (confirm('¿Estás seguro de eliminar este objetivo?')) {
      setIsDeleting(true)
      await onDelete(goal.id)
    }
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ scale: 1.01 }}
      className={cn(
        'p-4 bg-white rounded-lg border shadow-sm transition-all duration-200',
        goal.completed && 'opacity-60 bg-gray-50',
        isDeleting && 'opacity-50'
      )}
    >
      <div className="flex items-center gap-3">
        <Checkbox
          checked={goal.completed}
          onCheckedChange={() => onToggle(goal.id)}
        />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className={cn(
              'font-medium text-sm',
              goal.completed && 'line-through text-muted-foreground'
            )}>
              {goal.title}
            </h3>
            
            {badge && !goal.completed && (
              <Badge className={cn('text-xs', badge.color)}>
                {badge.emoji} {badge.label}
              </Badge>
            )}
          </div>
          
          {goal.url && (
            <Button
              variant="link"
              size="sm"
              className="h-auto p-0 text-xs text-blue-600 hover:text-blue-800"
              asChild
            >
              <a href={goal.url} target="_blank" rel="noopener noreferrer">
                Ver enlace <ExternalLink className="ml-1 h-3 w-3" />
              </a>
            </Button>
          )}
        </div>
        
        {/* Botones de acción */}
        <div className="flex gap-1">
          {/* Editar (deshabilitado para top 3) */}
          <EditGoalDialog
            goal={goal}
            onSuccess={onEdit || (() => {})}
            disabled={isTop3}
          />
          
          {/* Eliminar */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDelete}
            className="h-8 w-8 shrink-0 text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  )
}
