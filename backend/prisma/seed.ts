// prisma/seed.ts
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  await prisma.user.create({
    data: {
      name: 'Organizer 1',
      email: 'organizer1@mail.com',
      password: 'hashed_password',
      role: 'ORGANIZER',
    },
  })
  // Add more seeding
}

main()
