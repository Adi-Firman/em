export const login = async (req, res) => {
    const { email, password } = req.body
  
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) return res.status(401).json({ error: 'Invalid credentials' })
  
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' })
  
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )
  
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } })
  }
  