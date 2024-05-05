import { model, models, Schema } from 'mongoose'

const sizesSchema = new Schema({
  name: String,
  inStock: Boolean,
})

const colorsSchema = new Schema({
  name: String,
  inStock: Boolean,
})

const productSchema = new Schema(
  {
    name: { type: String },
    description: { type: String },
    image: { type: String },
    price: { type: Number },
    category: { type: String },
    sizes: { type: [sizesSchema] },
    colors: { type: [colorsSchema] },
  },
  { timestamps: true }
)

export const Product = models?.Product || model('Product', productSchema)
