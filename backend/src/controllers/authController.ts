import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { z } from 'zod'

const prisma = new PrismaClient()

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string(),
  referredBy: z.string().optional(),
  role: z.enum(['CUSTOMER', 'ORGANIZER']),
})

const generateCouponCode = () => 'DISC' + Math.random().toString(36).substring(2, 8).toUpperCase()

export const register = async (req, res) => {
    try {
      const data = registerSchema.parse(req.body)
      const hashedPassword = await bcrypt.hash(data.password, 10)
      const referral = Math.random().toString(36).substring(2, 8)
  
      const createdUser = await prisma.user.create({
        data: {
          email: data.email,
          password: hashedPassword,
          name: data.name,
          role: data.role,
          referral,
          referredBy: data.referredBy || null,
        },
      })
  
      // Jika pakai referral, berikan reward
      if (data.referredBy) {
        const referrer = await prisma.user.findUnique({ where: { referral: data.referredBy } })
        if (referrer) {
          const expiresAt = new Date()
          expiresAt.setMonth(expiresAt.getMonth() + 3)
  
          // Tambah 10.000 poin ke referrer
          await prisma.point.create({
            data: {
              userId: referrer.id,
              amount: 10000,
              expiresAt,
            },
          })
  
          // Tambah kupon ke user baru
          await prisma.coupon.create({
            data: {
              userId: createdUser.id,
              discount: 10000,
              code: generateCouponCode(),
              expiresAt,
            },
          })
        }
      }
  
      res.status(201).json({ message: 'User registered successfully', referral })
    } catch (err) {
      res.status(400).json({ error: err.message })
    }
  }