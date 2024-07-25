import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prismadb = new PrismaClient()
const reset = async () => {
  await prismadb.user.deleteMany()
  await prismadb.todo.deleteMany()
}

const userSeed = async () => {
  await prismadb.user.create({
    data: {
      account: 'account',
      password: await bcrypt.hash('password', 12),
    },
  })
}
const todoSeed = async () => {
  await prismadb.todo.createMany({
    data: [
      {
        title: 'todo1',
        content: 'content',
        status: true,
      },
      {
        title: 'todo2',
        content: 'content2',
        status: true,
      },
    ],
  })
}

async function main() {
  try {
    await reset()
    console.log('reset done')
    console.log('Start seeding ...')
    await userSeed()
    await todoSeed()
    console.log('Seeding finished ...')
  } catch (err) {
    console.log(err)
  }
}

void main()
