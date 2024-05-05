import mongoose from 'mongoose'

export function mongoConnect() {
  mongoose.connect(process.env.MONGODB_URI!)
}

export function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ')
}
