import { mongoConnect } from '@/lib/utils'
import { Product } from '@/models/product'

export async function GET(req: any) {
  mongoConnect()
  const url = new URL(req.url)
  const category = url.searchParams.get('category') || ''
  const search = url.searchParams.get('search') || ''
  const sort = url.searchParams.get('sort') || '-createdAt'
  const page = Number(url.searchParams.get('page')) || 1

  const productsLimit = Number(url.searchParams.get('products-limit')) || 16

  return Response.json({
    result: await Product.find({
      name: { $regex: search, $options: 'i' },
      category: { $regex: category, $options: 'i' },
    })
      .sort(sort)
      .skip(Math.max((page - 1) * productsLimit, 0))
      .limit(productsLimit),
    pages: Math.ceil(
      (await Product.find({
        name: { $regex: search, $options: 'i' },
        category: { $regex: category, $options: 'i' },
      }).countDocuments()) / productsLimit
    ),
  })
}
