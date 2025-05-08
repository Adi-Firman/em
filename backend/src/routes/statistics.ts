// routes/statistics.ts
import { Router } from 'express'
import prisma from '../../../frontend/src/lib/prisma'
import { authenticate } from '../middlewares/authMiddleware'

const router = Router()

// Endpoint untuk mendapatkan statistik event
router.get('/event-statistics', authenticate, async (req, res) => {
  const userId = req.user?.userId

  try {
    // Ambil data statistik event
    const events = await prisma.event.findMany({
      where: { organizerId: userId },
    })

    const statistics = await Promise.all(
      events.map(async (event) => {
        const transactions = await prisma.transaction.findMany({
          where: { eventId: event.id, status: 'done' },
        })

        const totalRevenue = transactions.reduce((sum, transaction) => sum + transaction.totalPrice, 0)
        const totalTicketsSold = transactions.reduce((sum, transaction) => sum + transaction.quantity, 0)

        return {
          eventName: event.name,
          totalRevenue,
          totalTicketsSold,
          averageRating: await prisma.review.aggregate({
            _avg: {
              rating: true,
            },
            where: {
              eventId: event.id,
            },
          }).then((res) => res._avg.rating ?? 0),
        }
      })
    )

    res.json(statistics)
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router
