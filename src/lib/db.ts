import { MongoClient } from "mongodb"
 
if (!process.env.MONGO_URL) {
  throw new Error('Invalid/Missing environment variable: "MONGO_URL"')
}
 
const uri = process.env.MONGO_URL
const options = {}
 
let client
let clientPromise: Promise<MongoClient>

let globalMongo = global as typeof globalThis & {
  _mongoClientPromise: Promise<MongoClient>
}
 
if (process.env.NODE_ENV === "development") {
  if (!globalMongo._mongoClientPromise) {
    client = new MongoClient(uri, options)
    globalMongo._mongoClientPromise = client.connect()
  }
  clientPromise = globalMongo._mongoClientPromise
} else {
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
}

export default clientPromise