import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './routes/auth'
import organizerRoutes from './routes/organizer'
import eventRoutes from './routes/event'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())
app.use('/api/auth', authRoutes)
app.use('/api/organizer', organizerRoutes)
app.use('/api/events', eventRoutes)
app.use('/auth', authRoutes)

app.get('/health', (req, res) => {
  res.json({ message: 'API running' })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
