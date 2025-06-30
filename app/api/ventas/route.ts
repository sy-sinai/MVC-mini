import { NextResponse } from "next/server"
import clientPromise, { isMongoDBAvailable } from "@/lib/mongodb"
import { generateVentasData, mockVentas } from "@/lib/seed-data"

export async function GET() {
  try {    if (!isMongoDBAvailable()) {
      return NextResponse.json(mockVentas)
    }

    const client = await clientPromise
    if (!client) {
      return NextResponse.json(mockVentas)
    }

    const db = client.db("sales_commission")
    const existingVentas = await db.collection("ventas").find({}).toArray()

    if (existingVentas.length === 0) {
      const vendedores = await db.collection("vendedores").find({}).toArray()

      if (vendedores.length > 0) {
        const vendedorIds = vendedores.map((v) => v._id.toString())
        const ventasData = generateVentasData(vendedorIds)
        await db.collection("ventas").insertMany(ventasData)
        const ventas = await db.collection("ventas").find({}).toArray()
        return NextResponse.json(ventas)
      }
    }

    return NextResponse.json(existingVentas)
  } catch (error) {
    console.error("Error fetching ventas:", error)
    return NextResponse.json(mockVentas)
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
    const venta = await request.json()

    const result = await db.collection("ventas").insertOne({
      ...venta,
      fecha: new Date(venta.fecha),
      monto: Number.parseFloat(venta.monto),
    })

    return NextResponse.json({ _id: result.insertedId, ...venta })
  } catch (error) {
    console.error("Error creating venta:", error)
    return NextResponse.json({ error: "Error creating venta" }, { status: 500 })
  }
}
