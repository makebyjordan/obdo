'use client'

import { useGoals } from '@/hooks/use-goals'
import { AnalyticsCards } from '@/components/dashboard/analytics-cards'
import { GoalList } from '@/components/dashboard/goal-list'
import { TopGoalsCard } from '@/components/dashboard/top-goals-card'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function OverviewPage() {
  const { goals, loading, analytics, toggleGoal, deleteGoal, updateNotes } = useGoals()

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid gap-4 md:grid-cols-3 mb-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Vista General</h1>
        <p className="text-muted-foreground">
          Resumen de tus objetivos y progreso
        </p>
      </div>

      {/* Analytics Cards */}
      <AnalyticsCards
        total={analytics.total}
        completed={analytics.completed}
        pending={analytics.pending}
        percentage={analytics.percentage}
      />

      {/* Top 3 Goals Card */}
      <TopGoalsCard
        goals={goals}
        onToggle={toggleGoal}
        onUpdateNotes={updateNotes}
      />

      {/* Goals List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🎯 Tus Objetivos
            {goals.length > 0 && (
              <span className="text-sm font-normal text-muted-foreground">
                ({goals.filter(g => !g.completed).length} pendientes)
              </span>
            )}
          </CardTitle>
          <CardDescription>
            Los primeros 3 objetivos pendientes obtienen medallas automáticamente
          </CardDescription>
        </CardHeader>
        <CardContent>
          <GoalList
            goals={goals}
            onToggle={toggleGoal}
            onDelete={deleteGoal}
            onEdit={() => window.location.reload()}
          />
        </CardContent>
      </Card>
    </div>
  )
}
