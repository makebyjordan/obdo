import { z } from 'zod'

export const createGoalSchema = z.object({
  title: z.string().min(1, 'Título requerido').max(100, 'Máximo 100 caracteres'),
  url: z.string().url('URL inválida').optional().or(z.literal('')),
  priority: z.enum(['normal', 'bronze', 'silver', 'gold']).default('normal')
})

export const updateGoalSchema = z.object({
  title: z.string().min(1).max(100).optional(),
  url: z.string().url().optional().or(z.literal('')),
  completed: z.boolean().optional(),
  order: z.number().int().optional(),
  notes: z.string().optional()
})

export type CreateGoalInput = z.infer<typeof createGoalSchema>
export type UpdateGoalInput = z.infer<typeof updateGoalSchema>
