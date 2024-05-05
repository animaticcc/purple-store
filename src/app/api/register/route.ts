import { User } from '@/models/user'
import bcrypt from 'bcrypt'
import { mongoConnect } from '@/lib/utils'

export async function POST(req: any) {
  const body = await req.json()
  mongoConnect()
  const pass = body.password
  // if (!pass?.length || pass?.length < 5) {
  //   new Error('Password must be at least 5 characters');
  // }

  const salt = bcrypt.genSaltSync(10)
  body.password = bcrypt.hashSync(pass, salt)

  const createdUser = await User.create(body)
  return Response.json(createdUser)
}
