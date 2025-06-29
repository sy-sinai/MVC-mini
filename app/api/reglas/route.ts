import { NextResponse } from "next/server"
import clientPromise, { isMongoDBAvailable } from "@/lib/mongodb"
import { reglasData, mockReglas } from "@/lib/seed-data"

export async function GET() {
  try {
    // Si no hay MongoDB disponible, usar datos mock
    if (!isMongoDBAvailable()) {
      return NextResponse.json(mockReglas)
    }

    const client = await clientPromise
    if (!client) {
      return NextResponse.json(mockReglas)
    }

    const db = client.db("sales_commission")
    const existingReglas = await db.collection("reglas").find({}).toArray()

    if (existingReglas.length === 0) {
      await db.collection("reglas").insertMany(reglasData)
      const reglas = await db.collection("reglas").find({}).toArray()
      return NextResponse.json(reglas)
    }

    return NextResponse.json(existingReglas)
  } catch (error) {
    console.error("Error fetching reglas:", error)
    // En caso de error, devolver datos mock
    return NextResponse.json(mockReglas)
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
    const regla = await request.json()

    const result = await db.collection("reglas").insertOne({
      ...regla,
      rangoMinimo: Number.parseFloat(regla.rangoMinimo),
      rangoMaximo: Number.parseFloat(regla.rangoMaximo),
      porcentajeComision: Number.parseFloat(regla.porcentajeComision),
    })

    return NextResponse.json({ _id: result.insertedId, ...regla })
  } catch (error) {
    console.error("Error creating regla:", error)
    return NextResponse.json({ error: "Error creating regla" }, { status: 500 })
  }
}
