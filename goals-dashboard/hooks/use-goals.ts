import { useState, useEffect } from 'react'
import { Goal } from '@/types/goals'

interface Analytics {
  total: number
  completed: number
  pending: number
  percentage: number
  canAddMore: boolean
}

export function useGoals() {
  const [goals, setGoals] = useState<Goal[]>([])
  const [loading, setLoading] = useState(true)
  const [analytics, setAnalytics] = useState<Analytics>({
    total: 0,
    completed: 0,
    pending: 0,
    percentage: 0,
    canAddMore: true
  })

  const fetchGoals = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/goals')
      const data = await res.json()
      
      setGoals(data.goals)
      setAnalytics({
        total: data.total,
        completed: data.completed,
        pending: data.pending,
        percentage: data.percentage,
        canAddMore: data.canAddMore
      })
    } catch (error) {
      console.error('Error fetching goals:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleGoal = async (id: string) => {
    try {
      const goal = goals.find(g => g.id === id)
      if (!goal) return

      // Optimistic update
      setGoals(prev => 
        prev.map(g => g.id === id ? { ...g, completed: !g.completed } : g)
      )

      const res = await fetch(`/api/goals/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !goal.completed })
      })

      if (!res.ok) {
        // Revert on error
        setGoals(prev => 
          prev.map(g => g.id === id ? { ...g, completed: goal.completed } : g)
        )
      } else {
        // Refetch para actualizar orden y analytics
        await fetchGoals()
      }
    } catch (error) {
      console.error('Error toggling goal:', error)
    }
  }

  const createGoal = async (data: { title: string; url?: string; priority?: string }) => {
    try {
      const res = await fetch('/api/goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Error al crear objetivo')
      }

      await fetchGoals()
      return { success: true }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error desconocido' 
      }
    }
  }

  const deleteGoal = async (id: string) => {
    try {
      const res = await fetch(`/api/goals/${id}`, {
        method: 'DELETE'
      })

      if (res.ok) {
        await fetchGoals()
      }
    } catch (error) {
      console.error('Error deleting goal:', error)
    }
  }

  const updateNotes = async (id: string, notes: string) => {
    try {
      const res = await fetch(`/api/goals/${id}/notes`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes })
      })

      if (res.ok) {
        await fetchGoals()
      }
    } catch (error) {
      console.error('Error updating notes:', error)
    }
  }

  useEffect(() => {
    fetchGoals()
  }, [])

  return {
    goals,
    loading,
    analytics,
    toggleGoal,
    createGoal,
    deleteGoal,
    updateNotes,
    refetch: fetchGoals
  }
}
