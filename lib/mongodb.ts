import { MongoClient } from "mongodb"

// Hacer la verificación más flexible para el deployment
const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/sales_commission_local"
const options = {}

let client: MongoClient
let clientPromise: Promise<MongoClient>

// Función para verificar si MongoDB está disponible
export const isMongoDBAvailable = () => {
  return !!process.env.MONGODB_URI
}

if (process.env.NODE_ENV === "development") {
  const globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>
  }

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options)
    globalWithMongo._mongoClientPromise = client.connect().catch(() => {
      console.warn("MongoDB connection failed, using mock data")
      return null as any
    })
  }
  clientPromise = globalWithMongo._mongoClientPromise
} else {
  client = new MongoClient(uri, options)
  clientPromise = client.connect().catch(() => {
    console.warn("MongoDB connection failed, using mock data")
    return null as any
  })
}

export default clientPromise
