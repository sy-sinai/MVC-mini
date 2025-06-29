"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { X, Calculator, Calendar } from "lucide-react"

// Importar los datos simulados
import vendedoresData from "../data/vendedores.json"
import ventasData from "../data/ventas.json"
import reglasData from "../data/reglas.json"

// Definir los tipos de datos que vamos a manejar
interface Vendedor {
  id: number
  nombre: string
}

interface Venta {
  id: number
  id_vendedor: number
  fecha: string
  monto: number
}

interface Regla {
  minimo: number
  maximo: number
  porcentaje: number
}

interface ResultadoComision {
  vendedor: Vendedor
  totalVentas: number
  cantidadVentas: number
  comision: number
}

export default function SistemaComisiones() {
  // Estados para manejar las fechas seleccionadas y los resultados
  const [fechaInicio, setFechaInicio] = useState("")
  const [fechaFin, setFechaFin] = useState("")
  const [resultados, setResultados] = useState<ResultadoComision[]>([])
  const [mostrarResultados, setMostrarResultados] = useState(false)

  // Función para calcular las comisiones
  const calcularComisiones = () => {
    // Validar que se hayan seleccionado ambas fechas
    if (!fechaInicio || !fechaFin) {
      alert("Por favor selecciona ambas fechas")
      return
    }

    // Validar que la fecha de inicio no sea mayor que la fecha de fin
    if (new Date(fechaInicio) > new Date(fechaFin)) {
      alert("La fecha de inicio no puede ser mayor que la fecha de fin")
      return
    }

    // Convertir las fechas de string a objetos Date para poder compararlas
    const fechaInicioDate = new Date(fechaInicio)
    const fechaFinDate = new Date(fechaFin)

    // Filtrar las ventas que están dentro del rango de fechas seleccionado
    const ventasFiltradas = ventasData.filter((venta) => {
      const fechaVenta = new Date(venta.fecha)
      return fechaVenta >= fechaInicioDate && fechaVenta <= fechaFinDate
    })

    // Agrupar las ventas por vendedor y calcular totales
    const ventasPorVendedor: { [key: number]: Venta[] } = {}

    // Organizar las ventas filtradas por vendedor
    ventasFiltradas.forEach((venta) => {
      if (!ventasPorVendedor[venta.id_vendedor]) {
        ventasPorVendedor[venta.id_vendedor] = []
      }
      ventasPorVendedor[venta.id_vendedor].push(venta)
    })

    // Calcular comisiones para cada vendedor que tenga ventas
    const resultadosCalculados: ResultadoComision[] = []

    Object.keys(ventasPorVendedor).forEach((vendedorId) => {
      const id = Number.parseInt(vendedorId)
      const vendedor = vendedoresData.find((v) => v.id === id)
      const ventasVendedor = ventasPorVendedor[id]

      if (vendedor && ventasVendedor.length > 0) {
        // Sumar el total de ventas del vendedor
        const totalVentas = ventasVendedor.reduce((sum, venta) => sum + venta.monto, 0)

        // Encontrar la regla de comisión que aplica según el total de ventas
        const reglaAplicable = reglasData.find((regla) => totalVentas >= regla.minimo && totalVentas <= regla.maximo)

        // Calcular la comisión usando la regla encontrada
        const porcentajeComision = reglaAplicable ? reglaAplicable.porcentaje : 0
        const comision = (totalVentas * porcentajeComision) / 100

        resultadosCalculados.push({
          vendedor,
          totalVentas,
          cantidadVentas: ventasVendedor.length,
          comision,
        })
      }
    })

    // Ordenar los resultados por total de ventas (mayor a menor)
    resultadosCalculados.sort((a, b) => b.totalVentas - a.totalVentas)

    // Actualizar el estado con los resultados y mostrarlos
    setResultados(resultadosCalculados)
    setMostrarResultados(true)
  }

  // Función para limpiar filtros y resultados
  const limpiarFiltros = () => {
    setFechaInicio("")
    setFechaFin("")
    setResultados([])
    setMostrarResultados(false)
  }

  // Función para establecer fechas rápidas
  const establecerFechasRapidas = (inicio: string, fin: string) => {
    setFechaInicio(inicio)
    setFechaFin(fin)
  }

  // Función para formatear números como moneda
  const formatearMoneda = (cantidad: number) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(cantidad)
  }

  // Función para obtener el color de la regla aplicada
  const obtenerColorRegla = (totalVentas: number) => {
    if (totalVentas <= 10000) return "text-blue-600 bg-blue-50"
    if (totalVentas <= 25000) return "text-green-600 bg-green-50"
    if (totalVentas <= 50000) return "text-orange-600 bg-orange-50"
    return "text-purple-600 bg-purple-50"
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      {/* Título principal */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Sistema de Comisiones de Ventas</h1>
        <p className="text-gray-600">Selecciona un rango de fechas para calcular las comisiones de tus vendedores</p>
        <div className="mt-2 text-sm text-blue-600 bg-blue-50 inline-block px-3 py-1 rounded-full">
          Datos disponibles para Junio 2025
        </div>
      </div>

      {/* Formulario para seleccionar fechas */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Seleccionar Período
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            {/* Campo fecha inicio */}
            <div>
              <Label htmlFor="fechaInicio">Fecha de Inicio</Label>
              <Input
                id="fechaInicio"
                type="date"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
                className="mt-1"
                placeholder="Selecciona fecha inicial"
              />
            </div>

            {/* Campo fecha fin */}
            <div>
              <Label htmlFor="fechaFin">Fecha de Fin</Label>
              <Input
                id="fechaFin"
                type="date"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
                className="mt-1"
                placeholder="Selecciona fecha final"
              />
            </div>

            {/* Botón para calcular */}
            <Button onClick={calcularComisiones} className="w-full md:w-auto" disabled={!fechaInicio || !fechaFin}>
              <Calculator className="h-4 w-4 mr-2" />
              Calcular Comisiones
            </Button>

            {/* Botón para limpiar filtros */}
            <Button
              onClick={limpiarFiltros}
              variant="outline"
              className="w-full md:w-auto bg-transparent"
              disabled={!fechaInicio && !fechaFin && !mostrarResultados}
            >
              <X className="h-4 w-4 mr-2" />
              Limpiar Filtros
            </Button>
          </div>

          {/* Botones de acceso rápido */}
          <div className="flex flex-wrap gap-2 mt-4">
            <Button variant="outline" size="sm" onClick={() => establecerFechasRapidas("2025-06-01", "2025-06-30")}>
              Todo Junio 2025
            </Button>
            <Button variant="outline" size="sm" onClick={() => establecerFechasRapidas("2025-06-01", "2025-06-15")}>
              Primera Quincena
            </Button>
            <Button variant="outline" size="sm" onClick={() => establecerFechasRapidas("2025-06-16", "2025-06-30")}>
              Segunda Quincena
            </Button>
            <Button variant="outline" size="sm" onClick={() => establecerFechasRapidas("2025-06-01", "2025-06-07")}>
              Primera Semana
            </Button>
            <Button variant="outline" size="sm" onClick={() => establecerFechasRapidas("2025-06-24", "2025-06-30")}>
              Última Semana
            </Button>
          </div>

          {/* Indicador de estado */}
          {!mostrarResultados && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg text-center">
              <p className="text-sm text-gray-600">
                {!fechaInicio || !fechaFin
                  ? "Selecciona las fechas y haz clic en 'Calcular Comisiones' para ver los resultados"
                  : "Haz clic en 'Calcular Comisiones' para procesar los datos"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Mostrar reglas de comisión */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Reglas de Comisión</CardTitle>
          <p className="text-sm text-gray-600">Porcentajes aplicados según el total de ventas por vendedor</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {reglasData.map((regla, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg border">
                <div className="text-sm text-gray-600 mb-1">
                  {formatearMoneda(regla.minimo)} -{" "}
                  {regla.maximo === 999999999 ? "Sin límite" : formatearMoneda(regla.maximo)}
                </div>
                <div className="text-lg font-bold text-blue-600">{regla.porcentaje}%</div>
                <div className="text-xs text-gray-500 mt-1">de comisión</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Mostrar resultados solo si se han calculado */}
      {mostrarResultados && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Resultados de Comisiones</span>
              <Button onClick={limpiarFiltros} variant="outline" size="sm">
                <X className="h-4 w-4 mr-2" />
                Limpiar
              </Button>
            </CardTitle>
            <p className="text-sm text-gray-600">
              Período: {fechaInicio} al {fechaFin}
            </p>
          </CardHeader>
          <CardContent>
            {resultados.length > 0 ? (
              <>
                {/* Resumen general */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="text-sm text-blue-600 mb-1">Vendedores Activos</div>
                    <div className="text-2xl font-bold text-blue-800">{resultados.length}</div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="text-sm text-green-600 mb-1">Total Ventas</div>
                    <div className="text-2xl font-bold text-green-800">
                      {formatearMoneda(resultados.reduce((sum, r) => sum + r.totalVentas, 0))}
                    </div>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="text-sm text-purple-600 mb-1">Total Comisiones</div>
                    <div className="text-2xl font-bold text-purple-800">
                      {formatearMoneda(resultados.reduce((sum, r) => sum + r.comision, 0))}
                    </div>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <div className="text-sm text-orange-600 mb-1">Promedio por Vendedor</div>
                    <div className="text-2xl font-bold text-orange-800">
                      {formatearMoneda(resultados.reduce((sum, r) => sum + r.comision, 0) / resultados.length)}
                    </div>
                  </div>
                </div>

                {/* Tabla detallada de resultados */}
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Vendedor</TableHead>
                      <TableHead className="text-center">Cantidad de Ventas</TableHead>
                      <TableHead className="text-right">Total Vendido</TableHead>
                      <TableHead className="text-right">% Comisión</TableHead>
                      <TableHead className="text-right">Comisión</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {resultados.map((resultado) => {
                      // Encontrar la regla aplicada para mostrar el porcentaje
                      const reglaAplicada = reglasData.find(
                        (regla) => resultado.totalVentas >= regla.minimo && resultado.totalVentas <= regla.maximo,
                      )
                      return (
                        <TableRow key={resultado.vendedor.id}>
                          <TableCell className="font-medium">{resultado.vendedor.nombre}</TableCell>
                          <TableCell className="text-center">{resultado.cantidadVentas}</TableCell>
                          <TableCell className="text-right font-medium">
                            {formatearMoneda(resultado.totalVentas)}
                          </TableCell>
                          <TableCell className="text-right">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${obtenerColorRegla(resultado.totalVentas)}`}
                            >
                              {reglaAplicada?.porcentaje || 0}%
                            </span>
                          </TableCell>
                          <TableCell className="text-right font-bold text-green-600">
                            {formatearMoneda(resultado.comision)}
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </>
            ) : (
              // Mensaje cuando no hay ventas en el período seleccionado
              <div className="text-center py-8">
                <div className="text-gray-400 mb-4">
                  <Calendar className="h-12 w-12 mx-auto mb-2" />
                </div>
                <p className="text-gray-500 text-lg mb-2">No se encontraron ventas en el período seleccionado</p>
                <p className="text-sm text-gray-400">
                  Intenta seleccionar fechas en junio de 2025 donde hay datos disponibles.
                </p>
                <Button onClick={limpiarFiltros} variant="outline" className="mt-4 bg-transparent">
                  <X className="h-4 w-4 mr-2" />
                  Limpiar y Seleccionar Nuevas Fechas
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
