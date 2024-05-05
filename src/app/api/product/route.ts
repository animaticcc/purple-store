import { mongoConnect } from '@/lib/utils'
import { Product } from '@/models/product'

export async function POST(req: any) {
  mongoConnect()
  const data = await req.json()
  const productDoc = await Product.create(data)
  return Response.json(productDoc)
}

export async function PUT(req: any) {
  mongoConnect()
  const { _id, ...data } = await req.json()
  await Product.findByIdAndUpdate(_id, data)
  return Response.json(true)
}

export async function GET(req: any) {
  mongoConnect()
  const url = new URL(req.url)
  const _id = url.searchParams.get('id')

  return Response.json(await Product.findOne({ _id }))
}

export async function DELETE(req: any) {
  mongoConnect()
  const url = new URL(req.url)
  const _id = url.searchParams.get('id')

  await Product.deleteOne({ _id })
  return Response.json(true)
}
