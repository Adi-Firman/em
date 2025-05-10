import express from 'express'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const router = express.Router()
const prisma = new PrismaClient()

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body

  // Validasi input
  if (!email || !password || !name) {
    return res.status(400).json({ message: 'Name, email, and password are required' })
  }

  // Cek email sudah terdaftar
  const existingUser = await prisma.user.findUnique({ where: { email } })
  if (existingUser) {
    return res.status(400).json({ message: 'Email already exists' })
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10)

  // Buat user baru
  try {
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'CUSTOMER',  // Atur role default
      },
    })
    return res.status(201).json({ message: 'User registered successfully', user: newUser })
  } catch (error) {
    console.error('Registration error:', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
})

export default router
