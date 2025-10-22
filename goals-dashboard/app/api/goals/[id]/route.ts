import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'

// PATCH - Actualizar objetivo (toggle completed principalmente)
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      )
    }

    const { id } = await params
    const body = await req.json()
    const { completed } = body

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

    // Si se marca como completado
    if (completed === true && !existingGoal.completed) {
      // Obtener el máximo order actual
      const maxOrderGoal = await prisma.goal.findFirst({
        where: { userId: session.user.id },
        orderBy: { order: 'desc' }
      })

      const newOrder = (maxOrderGoal?.order || 0) + 1

      // Actualizar el objetivo y borrar las notas al completar
      const updatedGoal = await prisma.goal.update({
        where: { id },
        data: {
          completed: true,
          completedAt: new Date(),
          order: newOrder,
          notes: null // Borrar notas al completar
        }
      })

      return NextResponse.json({ goal: updatedGoal })
    }

    // Si se desmarca como completado
    if (completed === false && existingGoal.completed) {
      // Colocar al principio de pendientes
      const firstPendingOrder = await prisma.goal.findFirst({
        where: {
          userId: session.user.id,
          completed: false
        },
        orderBy: { order: 'asc' }
      })

      const newOrder = firstPendingOrder ? firstPendingOrder.order - 1 : 0

      const updatedGoal = await prisma.goal.update({
        where: { id },
        data: {
          completed: false,
          completedAt: null,
          order: newOrder
        }
      })

      return NextResponse.json({ goal: updatedGoal })
    }

    // Otros updates (título, url, etc.)
    const updatedGoal = await prisma.goal.update({
      where: { id },
      data: body
    })

    return NextResponse.json({ goal: updatedGoal })
  } catch (error) {
    console.error('Error updating goal:', error)
    return NextResponse.json(
      { error: 'Error al actualizar objetivo' },
      { status: 500 }
    )
  }
}

// DELETE - Eliminar objetivo
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      )
    }

    const { id } = await params

    // Verificar propiedad
    const goal = await prisma.goal.findFirst({
      where: {
        id,
        userId: session.user.id
      }
    })

    if (!goal) {
      return NextResponse.json(
        { error: 'Objetivo no encontrado' },
        { status: 404 }
      )
    }

    // Eliminar
    await prisma.goal.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting goal:', error)
    return NextResponse.json(
      { error: 'Error al eliminar objetivo' },
      { status: 500 }
    )
  }
}
