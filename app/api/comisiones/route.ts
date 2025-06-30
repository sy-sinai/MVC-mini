import { NextResponse } from "next/server"
import clientPromise, { isMongoDBAvailable } from "@/lib/mongodb"
import { mockVendedores, mockVentas, mockReglas } from "@/lib/seed-data"

export async function POST(request: Request) {
  try {
    const { fechaInicio, fechaFin } = await request.json()

    let vendedores, ventas, reglas

    if (!isMongoDBAvailable()) {
      vendedores = mockVendedores
      reglas = mockReglas.sort((a, b) => a.rangoMinimo - b.rangoMinimo)


      ventas = mockVentas.filter((venta) => {
        const fechaVenta = new Date(venta.fecha)
        const inicio = new Date(fechaInicio)
        const fin = new Date(fechaFin + "T23:59:59.999Z")
        return fechaVenta >= inicio && fechaVenta <= fin
      })
    } else {
      const client = await clientPromise
      if (!client) {

        vendedores = mockVendedores
        reglas = mockReglas.sort((a, b) => a.rangoMinimo - b.rangoMinimo)
        ventas = mockVentas.filter((venta) => {
          const fechaVenta = new Date(venta.fecha)
          const inicio = new Date(fechaInicio)
          const fin = new Date(fechaFin + "T23:59:59.999Z")
          return fechaVenta >= inicio && fechaVenta <= fin
        })
      } else {
        const db = client.db("sales_commission")


        vendedores = await db.collection("vendedores").find({}).toArray()
        reglas = await db.collection("reglas").find({}).sort({ rangoMinimo: 1 }).toArray()
        ventas = await db
          .collection("ventas")
          .find({
            fecha: {
              $gte: new Date(fechaInicio),
              $lte: new Date(fechaFin + "T23:59:59.999Z"),
            },
          })
          .toArray()
      }
    }


    const comisionesCalculadas = vendedores
      .map((vendedor) => {
        const ventasVendedor = ventas.filter((venta) => venta.vendedorId === vendedor._id.toString())

        const totalVentas = ventasVendedor.reduce((sum, venta) => sum + venta.monto, 0)

        let reglaAplicable = reglas[0] 
        for (const regla of reglas) {
          if (totalVentas >= regla.rangoMinimo && totalVentas <= regla.rangoMaximo) {
            reglaAplicable = regla
            break
          }
        }

        const comisionTotal = (totalVentas * reglaAplicable.porcentajeComision) / 100

        return {
          vendedor,
          totalVentas,
          comisionTotal,
          cantidadVentas: ventasVendedor.length,
          ventas: ventasVendedor,
          reglaAplicada: reglaAplicable,
        }
      })
      .filter((comision) => comision.cantidadVentas > 0) 

    return NextResponse.json(comisionesCalculadas)
  } catch (error) {
    console.error("Error calculating comisiones:", error)
    return NextResponse.json({ error: "Error calculating comisiones" }, { status: 500 })
  }
}
