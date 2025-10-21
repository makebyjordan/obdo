import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle2, Circle, TrendingUp } from 'lucide-react'

interface AnalyticsCardsProps {
  total: number
  completed: number
  pending: number
  percentage: number
}

export function AnalyticsCards({
  total,
  completed,
  pending,
  percentage
}: AnalyticsCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {/* Total Completadas */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Completadas
          </CardTitle>
          <CheckCircle2 className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{completed}</div>
          <p className="text-xs text-muted-foreground">
            objetivos finalizados
          </p>
        </CardContent>
      </Card>

      {/* Total Pendientes */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Pendientes
          </CardTitle>
          <Circle className="h-4 w-4 text-orange-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{pending}</div>
          <p className="text-xs text-muted-foreground">
            objetivos activos
          </p>
        </CardContent>
      </Card>

      {/* Porcentaje */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Progreso
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{percentage.toFixed(1)}%</div>
          <p className="text-xs text-muted-foreground">
            {percentage >= 80 ? '✅ Puedes añadir más' : '🔒 Completa más objetivos'}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
