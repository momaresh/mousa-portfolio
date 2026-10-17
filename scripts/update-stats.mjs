import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

await prisma.stat.deleteMany()
const result = await prisma.stat.createMany({
  data: [
    { value: '4', label: 'Enterprise Platforms', color: 'primary', sortOrder: 1 },
    { value: '4+', label: 'Years Experience', color: 'secondary', sortOrder: 2 },
    { value: '7', label: 'Shipped Products', color: 'accent', sortOrder: 3 },
    { value: '2', label: 'Languages AR / EN', color: 'success', sortOrder: 4 },
  ],
})

console.log('stats updated', result)
await prisma.$disconnect()
