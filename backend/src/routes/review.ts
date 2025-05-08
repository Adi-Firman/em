// routes/review.ts
import { Router } from 'express'
import prisma from '../../../frontend/src/lib/prisma'
import { authenticate } from '../middlewares/authMiddleware'

const router = Router()

// Endpoint untuk menambahkan review setelah menghadiri acara
router.post('/:eventId', authenticate, async (req, res) => {
  const { eventId } = req.params
  const { rating, comment } = req.body
  const userId = req.user?.userId

  try {
    // Cek apakah pengguna sudah membeli tiket untuk acara ini
    const transaction = await prisma.transaction.findFirst({
      where: {
        eventId: parseInt(eventId),
        userId,
        status: 'done',
      },
    })

    if (!transaction) {
      return res.status(400).json({ error: 'You must attend the event to leave a review' })
    }

    // Menambahkan review ke database
    const review = await prisma.review.create({
      data: {
        rating,
        comment,
        userId,
        eventId: parseInt(eventId),
      },
    })

    res.status(201).json(review)
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router
