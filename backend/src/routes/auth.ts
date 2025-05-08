import { Router } from 'express'
const router = Router()

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body

  // TODO: Validasi input, cek email unik, hash password, simpan user
  return res.status(201).json({ message: 'User registered successfully' })
})

export default router
