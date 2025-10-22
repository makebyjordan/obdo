import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { createGoalSchema } from '@/lib/validations/goals'
import { z } from 'zod'

// GET - Obtener todos los objetivos del usuario
export async function GET(req: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      )
    }

    const goals = await prisma.goal.findMany({
      where: { userId: session.user.id },
      orderBy: [
        { completed: 'asc' },  // Pendientes primero
        { order: 'asc' }       // Luego por orden
      ]
    })

    const total = goals.length
    const completed = goals.filter((g: { completed: boolean }) => g.completed).length
    const pending = total - completed
    const percentage = total > 0 ? (completed / total) * 100 : 0
    // Puede añadir más si tiene menos de 50 objetivos (sin restricciones)
    const canAddMore = total < 50

    return NextResponse.json({
      goals,
      total,
      completed,
      pending,
      percentage,
      canAddMore
    })
  } catch (error) {
    console.error('Error fetching goals:', error)
    return NextResponse.json(
      { error: 'Error al obtener objetivos' },
      { status: 500 }
    )
  }
}

// POST - Crear nuevo objetivo
export async function POST(req: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      )
    }

    const body = await req.json()

    // Validar con Zod
    const validatedData = createGoalSchema.parse(body)

    // Obtener objetivos existentes
    const existingGoals = await prisma.goal.findMany({
      where: { userId: session.user.id }
    })

    // Validar máximo 50 objetivos
    if (existingGoals.length >= 50) {
      return NextResponse.json(
        { error: 'Máximo 50 objetivos permitidos' },
        { status: 400 }
      )
    }

    // Calcular order (último + 1)
    const maxOrder = existingGoals.reduce(
      (max: number, goal: { order: number }) => Math.max(max, goal.order),
      -1
    )

    // Mapear prioridad a número
    const priorityMap: Record<string, number> = {
      normal: 0,
      bronze: 1,
      silver: 2,
      gold: 3
    }

    const goal = await prisma.goal.create({
      data: {
        userId: session.user.id,
        title: validatedData.title,
        url: validatedData.url || null,
        priority: priorityMap[validatedData.priority || 'normal'],
        order: maxOrder + 1
      }
    })

    return NextResponse.json({ goal }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.issues },
        { status: 400 }
      )
    }

    console.error('Error creating goal:', error)
    return NextResponse.json(
      { error: 'Error al crear objetivo' },
      { status: 500 }
    )
  }
}
