import { Target } from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      {/* Theme Toggle en la esquina superior derecha */}
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <div className="flex justify-center">
            <Target className="h-12 w-12 text-primary" />
          </div>
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-foreground">
            Goals Dashboard
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Gestión de objetivos gamificada
          </p>
        </div>
        {children}
      </div>
    </div>
  )
}
