import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './routes/auth'
import organizerRoutes from './routes/organizer'
import eventRoutes from './routes/event'
import bodyParser from 'body-parser'
import registerRoute from './routes/auth/register'

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/organizer', organizerRoutes)
app.use('/api/events', eventRoutes)
app.use('/auth', authRoutes)
app.use('/events', eventRoutes)
app.use(bodyParser.json())
app.use('/auth', registerRoute)

app.get('/health', (req, res) => {
  res.json({ message: 'API running' })
})

const PORT = process.env.PORT || 3000
// Start server
app.listen(3001, () => {
  console.log('Server running on http://localhost:3000')
})


