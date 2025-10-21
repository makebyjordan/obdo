'use client'

import { useGoals } from '@/hooks/use-goals'
import { CreateGoalForm } from '@/components/dashboard/create-goal-form'
import { GoalList } from '@/components/dashboard/goal-list'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function ListaPage() {
  const { goals, loading, analytics, toggleGoal, deleteGoal, refetch } = useGoals()

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="h-96 bg-gray-200 rounded"></div>
            <div className="h-96 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Lista de Objetivos</h1>
        <p className="text-muted-foreground">
          Crea y gestiona tus objetivos personales
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Create Goal Form */}
        <Card>
          <CardHeader>
            <CardTitle>➕ Crear Nuevo Objetivo</CardTitle>
            <CardDescription>
              {analytics.canAddMore 
                ? `Puedes crear hasta ${50 - analytics.total} objetivos más`
                : `Máximo alcanzado (50/50). Has llegado al límite de objetivos.`
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CreateGoalForm
              canAddMore={analytics.canAddMore}
              currentPercentage={analytics.percentage}
              onSuccess={refetch}
            />
          </CardContent>
        </Card>

        {/* Current Goals */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              📋 Objetivos Actuales
              <span className="text-sm font-normal text-muted-foreground">
                ({analytics.total}/20)
              </span>
            </CardTitle>
            <CardDescription>
              Gestiona tus objetivos existentes
            </CardDescription>
          </CardHeader>
          <CardContent>
            {goals.length > 0 ? (
              <div className="max-h-96 overflow-y-auto">
                <GoalList
                  goals={goals}
                  onToggle={toggleGoal}
                  onDelete={deleteGoal}
                  onEdit={refetch}
                />
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>No tienes objetivos aún.</p>
                <p className="text-sm">¡Crea tu primer objetivo usando el formulario!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
