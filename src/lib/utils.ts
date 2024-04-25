import mongoose from "mongoose"

export function mongoConnect() {
  mongoose.connect(process.env.MONGO_URL!);
}

export function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ')
}