import { Router } from 'express'
import { authenticate, authorizeRoles } from '../middlewares/authMiddleware'

const router = Router()

router.get(
  '/dashboard',
  authenticate,
  authorizeRoles('ORGANIZER'),
  (req, res) => {
    res.json({ message: 'Organizer dashboard', user: req.user })
  }
)

export default router
