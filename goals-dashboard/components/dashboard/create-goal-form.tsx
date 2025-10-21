'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Loader2, AlertCircle } from 'lucide-react'

const formSchema = z.object({
  title: z
    .string()
    .min(1, 'El título es obligatorio')
    .max(100, 'Máximo 100 caracteres'),
  url: z
    .string()
    .url('URL inválida')
    .optional()
    .or(z.literal('')),
  priority: z.enum(['normal', 'bronze', 'silver', 'gold'])
})

type FormValues = z.infer<typeof formSchema>

interface CreateGoalFormProps {
  canAddMore: boolean
  currentPercentage: number
  onSuccess: () => void
}

export function CreateGoalForm({
  canAddMore,
  currentPercentage,
  onSuccess
}: CreateGoalFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      url: '',
      priority: 'normal'
    }
  })

  const onSubmit = async (data: FormValues) => {
    if (!canAddMore) {
      setError('Debes completar al menos el 80% de tus objetivos antes de añadir más')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const res = await fetch('/api/goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      const result = await res.json()

      if (!res.ok) {
        throw new Error(result.error || 'Error al crear objetivo')
      }

      form.reset()
      onSuccess()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Mensaje de bloqueo */}
      {!canAddMore && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>🔒 Bloqueado</AlertTitle>
          <AlertDescription>
            Has alcanzado el máximo de 50 objetivos. No puedes crear más objetivos por ahora.
          </AlertDescription>
        </Alert>
      )}

      {/* Formulario */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Título */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Título del Objetivo *</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Ej: Aprender Next.js"
                    disabled={!canAddMore || isSubmitting}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* URL (opcional) */}
          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>URL (opcional)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="https://ejemplo.com"
                    disabled={!canAddMore || isSubmitting}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Prioridad */}
          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prioridad</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={!canAddMore || isSubmitting}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona prioridad" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="bronze">🥉 Bronce</SelectItem>
                    <SelectItem value="silver">🥈 Plata</SelectItem>
                    <SelectItem value="gold">🥇 Oro</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Error message */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Submit */}
          <Button
            type="submit"
            disabled={!canAddMore || isSubmitting}
            className="w-full"
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSubmitting ? 'Creando...' : 'Crear Objetivo'}
          </Button>
        </form>
      </Form>
    </div>
  )
}
