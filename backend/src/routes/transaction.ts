// routes/transaction.ts
import { Router } from 'express'
import prisma from '../../../frontend/src/lib/prisma'
import { authenticate } from '../middlewares/authMiddleware'
import { sendEmail } from '../../../frontend/src/lib/email'

const router = Router()

router.post('/', authenticate, async (req, res) => {
  const { eventId, quantity, couponCode } = req.body
  const userId = req.user?.userId

  try {
    const event = await prisma.event.findUnique({
      where: { id: eventId },
    })

    if (!event || event.availableSeat < quantity) {
      return res.status(400).json({ error: 'Not enough available seats' })
    }

    // Periksa kupon
    let discount = 0
    if (couponCode) {
      const coupon = await prisma.coupon.findUnique({
        where: { code: couponCode, userId },
      })
      if (coupon && coupon.expiresAt > new Date()) {
        discount = coupon.discount
      } else {
        return res.status(400).json({ error: 'Invalid or expired coupon' })
      }
    }

    const totalPrice = event.price * quantity - discount

    // Buat transaksi
    const transaction = await prisma.transaction.create({
      data: {
        userId,
        eventId,
        quantity,
        totalPrice,
        status: 'waiting for payment',
        couponCode,
      },
    })

    // Kurangi jumlah kursi yang tersedia
    await prisma.event.update({
      where: { id: eventId },
      data: {
        availableSeat: event.availableSeat - quantity,
      },
    })

    res.status(201).json(transaction)
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Update status transaksi (terima atau tolak)
router.post('/:transactionId/status', authenticate, async (req, res) => {
    const { transactionId } = req.params
    const { status } = req.body
    const userId = req.user?.userId
  
    try {
      // Ambil transaksi yang dimaksud
      const transaction = await prisma.transaction.findUnique({
        where: { id: transactionId },
        include: { event: true },
      })
  
      if (!transaction || transaction.event.organizerId !== userId) {
        return res.status(403).json({ error: 'Unauthorized' })
      }
  
      // Update status transaksi
      const updatedTransaction = await prisma.transaction.update({
        where: { id: transactionId },
        data: { status },
      })
  
      // Kirim email notifikasi ke pengguna
      const user = await prisma.user.findUnique({ where: { id: transaction.userId } })
      if (user) {
        const subject = `Your transaction has been ${status}`
        const text = `Dear ${user.name},\n\nYour transaction for event ${transaction.event.name} has been ${status.toLowerCase()}.\n\nRegards,\nEvent Management Team`
        await sendEmail(user.email, subject, text)
      }
  
      // Jika transaksi ditolak, kembalikan kursi yang tersedia dan poin/voucher
      if (status === 'rejected') {
        await prisma.event.update({
          where: { id: transaction.eventId },
          data: {
            availableSeat: transaction.event.availableSeat + transaction.quantity,
          },
        })
  
        // Logika pengembalian poin/voucher bisa ditambahkan di sini
      }
  
      res.json(updatedTransaction)
    } catch (err) {
      res.status(500).json({ error: 'Internal server error' })
    }
  })
  
  // Menandai transaksi sebagai kadaluarsa setelah 2 jam
  router.post('/:transactionId/expire', async (req, res) => {
    const { transactionId } = req.params
  
    try {
      const transaction = await prisma.transaction.findUnique({
        where: { id: transactionId },
      })
  
      if (!transaction || transaction.status !== 'waiting for payment') {
        return res.status(400).json({ error: 'Transaction is not in valid status' })
      }
  
      const expirationDate = new Date(transaction.createdAt)
      expirationDate.setHours(expirationDate.getHours() + 2)
  
      // Jika transaksi melebihi 2 jam, batalkan transaksi
      if (new Date() > expirationDate) {
        await prisma.transaction.update({
          where: { id: transactionId },
          data: { status: 'expired' },
        })
  
        // Kembalikan kursi dan poin/voucher
        await prisma.event.update({
          where: { id: transaction.eventId },
          data: {
            availableSeat: transaction.event.availableSeat + transaction.quantity,
          },
        })
  
        res.json({ message: 'Transaction expired and seats restored' })
      } else {
        res.status(400).json({ error: 'Transaction is not expired yet' })
      }
    } catch (err) {
      res.status(500).json({ error: 'Internal server error' })
    }
  })

export default router
