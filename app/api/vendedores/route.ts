import { NextResponse } from "next/server"
import clientPromise, { isMongoDBAvailable } from "@/lib/mongodb"
import { vendedoresData, mockVendedores } from "@/lib/seed-data"

export async function GET() {
  try {
    // Si no hay MongoDB disponible, usar datos mock
    if (!isMongoDBAvailable()) {
      return NextResponse.json(mockVendedores)
    }

    const client = await clientPromise
    if (!client) {
      return NextResponse.json(mockVendedores)
    }

    const db = client.db("sales_commission")
    const existingVendedores = await db.collection("vendedores").find({}).toArray()

    if (existingVendedores.length === 0) {
      await db.collection("vendedores").insertMany(vendedoresData)
      const vendedores = await db.collection("vendedores").find({}).toArray()
      return NextResponse.json(vendedores)
    }

    return NextResponse.json(existingVendedores)
  } catch (error) {
    console.error("Error fetching vendedores:", error)
    // En caso de error, devolver datos mock
    return NextResponse.json(mockVendedores)
  }
}

export async function POST(request: Request) {
  try {
    if (!isMongoDBAvailable()) {
      return NextResponse.json({ error: "Database not available in demo mode" }, { status: 400 })
    }

    const client = await clientPromise
    if (!client) {
      return NextResponse.json({ error: "Database connection failed" }, { status: 500 })
    }

    const db = client.db("sales_commission")
    const vendedor = await request.json()

    const result = await db.collection("vendedores").insertOne({
      ...vendedor,
      fechaIngreso: new Date(vendedor.fechaIngreso),
    })

    return NextResponse.json({ _id: result.insertedId, ...vendedor })
  } catch (error) {
    console.error("Error creating vendedor:", error)
    return NextResponse.json({ error: "Error creating vendedor" }, { status: 500 })
  }
}
