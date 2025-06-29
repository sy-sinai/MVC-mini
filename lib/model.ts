export interface Vendedor {
  _id?: string
  nombre: string
  email: string
  telefono: string
  fechaIngreso: Date
}

export interface Venta {
  _id?: string
  vendedorId: string
  monto: number
  fecha: Date
  cliente: string
  producto: string
}

export interface Regla {
  _id?: string
  rangoMinimo: number
  rangoMaximo: number
  porcentajeComision: number
  descripcion: string
}
