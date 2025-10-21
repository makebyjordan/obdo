'use client'

import { useSession, signOut } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { LogOut, User, Mail, Calendar } from 'lucide-react'

export default function SettingsPage() {
  const { data: session } = useSession()

  const handleSignOut = () => {
    signOut({ callbackUrl: '/login' })
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Configuración</h1>
        <p className="text-muted-foreground">
          Gestiona tu perfil y preferencias de la aplicación
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Profile Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Información del Perfil
            </CardTitle>
            <CardDescription>
              Detalles de tu cuenta y perfil
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={session?.user?.image || ''} alt={session?.user?.name || ''} />
                <AvatarFallback className="text-lg">
                  {session?.user?.name?.charAt(0) || session?.user?.email?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-lg font-semibold">
                  {session?.user?.name || 'Usuario'}
                </h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  {session?.user?.email}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Tipo de cuenta:</span>
                <Badge variant="secondary">
                  {session?.user?.image ? 'Google' : 'Email'}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Estado:</span>
                <Badge variant="default">Activo</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Acciones de Cuenta</CardTitle>
            <CardDescription>
              Gestiona tu sesión y configuraciones
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Sesión</h4>
              <p className="text-sm text-muted-foreground">
                Cierra tu sesión actual de forma segura
              </p>
              <Button 
                variant="outline" 
                onClick={handleSignOut}
                className="w-full"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Cerrar Sesión
              </Button>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium">Información</h4>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>• Máximo 20 objetivos por cuenta</p>
                <p>• Requiere 80% de completitud para añadir más</p>
                <p>• Top 3 objetivos obtienen medallas automáticamente</p>
                <p>• Reordenamiento automático al completar</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* App Information */}
      <Card>
        <CardHeader>
          <CardTitle>Información de la Aplicación</CardTitle>
          <CardDescription>
            Detalles sobre Goals Dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center p-4 border rounded-lg">
              <h3 className="font-semibold text-lg">🎯</h3>
              <p className="text-sm font-medium">Gestión de Objetivos</p>
              <p className="text-xs text-muted-foreground">Organiza y prioriza tus metas</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <h3 className="font-semibold text-lg">🏆</h3>
              <p className="text-sm font-medium">Gamificación</p>
              <p className="text-xs text-muted-foreground">Medallas y sistema de progreso</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <h3 className="font-semibold text-lg">📊</h3>
              <p className="text-sm font-medium">Analytics</p>
              <p className="text-xs text-muted-foreground">Métricas y seguimiento</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
