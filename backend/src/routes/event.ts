// routes/event.ts
import { Router } from 'express'
import prisma from '../../../frontend/src/lib/prisma'

const router = Router()

router.get('/', async (req, res) => {
  const { search, category, location } = req.query

  const events = await prisma.event.findMany({
    where: {
      name: {
        contains: search?.toString() || '',
        mode: 'insensitive',
      },
      category: category ? category.toString() : undefined,
      location: location ? location.toString() : undefined,
      startDate: {
        gte: new Date(),
      },
    },
    orderBy: {
      startDate: 'asc',
    },
  })

  res.json(events)
})

export default router
