'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { ExternalLink, Edit3, Check } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { Goal } from '@/types/goals'

interface TopGoalsCardProps {
  goals: Goal[]
  onToggle: (id: string) => void
  onUpdateNotes: (id: string, notes: string) => void
}

export function TopGoalsCard({ goals, onToggle, onUpdateNotes }: TopGoalsCardProps) {
  const [editingNotes, setEditingNotes] = useState<string | null>(null)
  const [noteText, setNoteText] = useState('')
  const [saveTimeout, setSaveTimeout] = useState<NodeJS.Timeout | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  // Obtener solo los primeros 3 objetivos pendientes
  const topGoals = goals.filter(g => !g.completed).slice(0, 3)

  // Auto-guardar con debounce
  const debouncedSave = useCallback(
    (goalId: string, text: string) => {
      if (saveTimeout) {
        clearTimeout(saveTimeout)
      }
      
      setIsSaving(true)
      
      const timeout = setTimeout(async () => {
        await onUpdateNotes(goalId, text)
        setIsSaving(false)
      }, 1000) // Guardar después de 1 segundo de inactividad
      
      setSaveTimeout(timeout)
    },
    [onUpdateNotes, saveTimeout]
  )

  const handleEditNotes = (goal: Goal) => {
    setEditingNotes(goal.id)
    setNoteText(goal.notes || '')
  }

  const handleNotesChange = (goalId: string, text: string) => {
    setNoteText(text)
    debouncedSave(goalId, text)
  }

  const handleFinishEditing = () => {
    if (saveTimeout) {
      clearTimeout(saveTimeout)
    }
    setEditingNotes(null)
    setNoteText('')
  }

  // Limpiar timeout al desmontar
  useEffect(() => {
    return () => {
      if (saveTimeout) {
        clearTimeout(saveTimeout)
      }
    }
  }, [saveTimeout])

  const getBadgeForPosition = (index: number) => {
    const badges = [
      { emoji: '🥇', color: 'bg-yellow-400 text-yellow-900', label: 'Oro #1' },
      { emoji: '🥈', color: 'bg-gray-300 text-gray-900', label: 'Oro #2' },
      { emoji: '🥉', color: 'bg-orange-400 text-orange-900', label: 'Oro #3' }
    ]
    return badges[index] || null
  }

  if (topGoals.length === 0) {
    return (
      <Card className="border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🏆 Top 3 Objetivos Prioritarios
          </CardTitle>
          <CardDescription>
            Tus 3 objetivos más importantes aparecerán aquí
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-8">
            ¡Crea tus primeros objetivos para verlos aquí!
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🏆 Top 3 Objetivos Prioritarios
        </CardTitle>
        <CardDescription>
          Tus 3 objetivos más importantes con medallas de oro. Las notas se guardan automáticamente y se borran al completar. Cuando completes uno, el siguiente sube automáticamente.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {topGoals.map((goal, index) => {
          const badge = getBadgeForPosition(index)
          const isEditing = editingNotes === goal.id

          return (
            <motion.div
              key={goal.id}
              layout
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ 
                type: "spring", 
                stiffness: 100, 
                damping: 15,
                layout: { duration: 0.4 }
              }}
              className="p-4 bg-white rounded-lg border border-yellow-200 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-3">
                {/* Checkbox */}
                <Checkbox
                  checked={goal.completed}
                  onCheckedChange={() => onToggle(goal.id)}
                  className="mt-1"
                />

                {/* Badge de posición */}
                {badge && (
                  <Badge className={cn('text-xs font-semibold', badge.color)}>
                    {badge.emoji} {badge.label}
                  </Badge>
                )}

                {/* Contenido principal */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-medium text-sm">{goal.title}</h3>
                    {goal.url && (
                      <Button
                        variant="ghost"
                        size="icon"
                        asChild
                        className="h-6 w-6"
                      >
                        <a href={goal.url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </Button>
                    )}
                  </div>

                  {/* Sección de notas */}
                  <div className="space-y-2">
                    {isEditing ? (
                      <div className="space-y-2">
                        <Textarea
                          value={noteText}
                          onChange={(e) => handleNotesChange(goal.id, e.target.value)}
                          placeholder="Escribe tus notas aquí... (se guardan automáticamente)"
                          className="min-h-[80px] text-sm"
                          autoFocus
                        />
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-500">
                            {isSaving ? '💾 Guardando...' : '✅ Guardado automáticamente'}
                          </span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={handleFinishEditing}
                            className="h-7"
                          >
                            <Check className="h-3 w-3 mr-1" />
                            Listo
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {goal.notes ? (
                          <div className="bg-gray-50 p-3 rounded text-sm text-gray-700 whitespace-pre-wrap">
                            {goal.notes}
                          </div>
                        ) : (
                          <div className="text-xs text-gray-500 italic">
                            Sin notas
                          </div>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditNotes(goal)}
                          className="h-7 text-xs"
                        >
                          <Edit3 className="h-3 w-3 mr-1" />
                          {goal.notes ? 'Editar notas' : 'Añadir notas'}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )
        })}

        {topGoals.length < 3 && (
          <div className="text-center py-4 text-sm text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
            Crea más objetivos para llenar tu Top 3
          </div>
        )}
      </CardContent>
    </Card>
  )
}
