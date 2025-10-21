import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'

// PATCH - Actualizar solo las notas de un objetivo
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      )
    }

    const { id } = params
    const body = await req.json()
    const { notes } = body

    // Verificar que el objetivo pertenece al usuario
    const existingGoal = await prisma.goal.findFirst({
      where: {
        id,
        userId: session.user.id
      }
    })

    if (!existingGoal) {
      return NextResponse.json(
        { error: 'Objetivo no encontrado' },
        { status: 404 }
      )
    }

    // Actualizar solo las notas
    const updatedGoal = await prisma.goal.update({
      where: { id },
      data: { notes: notes || null }
    })

    return NextResponse.json({ goal: updatedGoal })
  } catch (error) {
    console.error('Error updating notes:', error)
    return NextResponse.json(
      { error: 'Error al actualizar notas' },
      { status: 500 }
    )
  }
}
