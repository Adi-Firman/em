import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'
import { NextRequest, NextResponse } from 'next/server'

export interface AuthRequest extends Request {
  user?: {
    userId: string
    role: 'CUSTOMER' | 'ORGANIZER'
  }
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const token = authHeader.split(' ')[1]
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string; role: string }
    req.user = { userId: decoded.userId, role: decoded.role as 'CUSTOMER' | 'ORGANIZER' }
    next()
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' })
  }
}

export const authorizeRoles = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden' })
    }
    next()
  }
}

export function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value
  
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  
    // bisa tambah pengecekan role jika perlu
    return NextResponse.next()
  }
  
  export const config = {
    matcher: ['/dashboard/:path*', '/profile/:path*'],
  }
