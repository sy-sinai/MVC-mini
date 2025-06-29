import type { Vendedor, Venta, Regla } from "./models"

export const vendedoresData: Omit<Vendedor, "_id">[] = [
  {
    nombre: "Juan Pérez",
    email: "juan.perez@empresa.com",
    telefono: "+1234567890",
    fechaIngreso: new Date("2023-01-15"),
  },
  {
    nombre: "María García",
    email: "maria.garcia@empresa.com",
    telefono: "+1234567891",
    fechaIngreso: new Date("2023-03-20"),
  },
  {
    nombre: "Carlos López",
    email: "carlos.lopez@empresa.com",
    telefono: "+1234567892",
    fechaIngreso: new Date("2023-02-10"),
  },
  {
    nombre: "Ana Martínez",
    email: "ana.martinez@empresa.com",
    telefono: "+1234567893",
    fechaIngreso: new Date("2023-04-05"),
  },
]

export const reglasData: Omit<Regla, "_id">[] = [
  {
    rangoMinimo: 0,
    rangoMaximo: 10000,
    porcentajeComision: 3,
    descripcion: "Comisión básica para ventas hasta $10,000",
  },
  {
    rangoMinimo: 10001,
    rangoMaximo: 25000,
    porcentajeComision: 5,
    descripcion: "Comisión intermedia para ventas de $10,001 a $25,000",
  },
  {
    rangoMinimo: 25001,
    rangoMaximo: 50000,
    porcentajeComision: 7,
    descripcion: "Comisión alta para ventas de $25,001 a $50,000",
  },
  {
    rangoMinimo: 50001,
    rangoMaximo: 999999999,
    porcentajeComision: 10,
    descripcion: "Comisión premium para ventas superiores a $50,000",
  },
]

// Esta función generará ventas con IDs de vendedores reales
export const generateVentasData = (vendedorIds: string[]): Omit<Venta, "_id">[] => {
  const productos = [
    "Laptop Dell XPS 13",
    "iPhone 15 Pro",
    "Samsung Galaxy S24",
    "MacBook Air M2",
    "iPad Pro 12.9",
    "Surface Pro 9",
    "AirPods Pro",
    "Sony WH-1000XM5",
    "Canon EOS R6",
    "Nintendo Switch OLED",
  ]

  const clientes = [
    "Empresa ABC S.A.",
    "Corporación XYZ",
    "Startup Innovadora",
    "Comercial Los Andes",
    "Tecnología Avanzada",
    "Soluciones Digitales",
    "Grupo Empresarial",
    "Compañía Global",
    "Negocios Modernos",
    "Industrias del Futuro",
  ]

  const ventas: Omit<Venta, "_id">[] = []

  // Generar ventas para los últimos 6 meses
  const fechaInicio = new Date()
  fechaInicio.setMonth(fechaInicio.getMonth() - 6)

  for (let i = 0; i < 50; i++) {
    const fechaVenta = new Date(fechaInicio)
    fechaVenta.setDate(fechaInicio.getDate() + Math.floor(Math.random() * 180))

    ventas.push({
      vendedorId: vendedorIds[Math.floor(Math.random() * vendedorIds.length)],
      monto: Math.floor(Math.random() * 80000) + 1000, // Entre $1,000 y $81,000
      fecha: fechaVenta,
      cliente: clientes[Math.floor(Math.random() * clientes.length)],
      producto: productos[Math.floor(Math.random() * productos.length)],
    })
  }

  return ventas
}

// Datos mock para cuando no hay conexión a MongoDB
export const mockVendedores = [
  {
    _id: "507f1f77bcf86cd799439011",
    nombre: "Juan Pérez",
    email: "juan.perez@empresa.com",
    telefono: "+1234567890",
    fechaIngreso: "2023-01-15T00:00:00.000Z",
  },
  {
    _id: "507f1f77bcf86cd799439012",
    nombre: "María García",
    email: "maria.garcia@empresa.com",
    telefono: "+1234567891",
    fechaIngreso: "2023-03-20T00:00:00.000Z",
  },
  {
    _id: "507f1f77bcf86cd799439013",
    nombre: "Carlos López",
    email: "carlos.lopez@empresa.com",
    telefono: "+1234567892",
    fechaIngreso: "2023-02-10T00:00:00.000Z",
  },
  {
    _id: "507f1f77bcf86cd799439014",
    nombre: "Ana Martínez",
    email: "ana.martinez@empresa.com",
    telefono: "+1234567893",
    fechaIngreso: "2023-04-05T00:00:00.000Z",
  },
]

export const mockReglas = [
  {
    _id: "507f1f77bcf86cd799439021",
    rangoMinimo: 0,
    rangoMaximo: 10000,
    porcentajeComision: 3,
    descripcion: "Comisión básica para ventas hasta $10,000",
  },
  {
    _id: "507f1f77bcf86cd799439022",
    rangoMinimo: 10001,
    rangoMaximo: 25000,
    porcentajeComision: 5,
    descripcion: "Comisión intermedia para ventas de $10,001 a $25,000",
  },
  {
    _id: "507f1f77bcf86cd799439023",
    rangoMinimo: 25001,
    rangoMaximo: 50000,
    porcentajeComision: 7,
    descripcion: "Comisión alta para ventas de $25,001 a $50,000",
  },
  {
    _id: "507f1f77bcf86cd799439024",
    rangoMinimo: 50001,
    rangoMaximo: 999999999,
    porcentajeComision: 10,
    descripcion: "Comisión premium para ventas superiores a $50,000",
  },
]

export const mockVentas = [
  {
    _id: "507f1f77bcf86cd799439031",
    vendedorId: "507f1f77bcf86cd799439011",
    monto: 15000,
    fecha: "2024-01-15T00:00:00.000Z",
    cliente: "Empresa ABC S.A.",
    producto: "Laptop Dell XPS 13",
  },
  {
    _id: "507f1f77bcf86cd799439032",
    vendedorId: "507f1f77bcf86cd799439012",
    monto: 8500,
    fecha: "2024-01-20T00:00:00.000Z",
    cliente: "Corporación XYZ",
    producto: "iPhone 15 Pro",
  },
  {
    _id: "507f1f77bcf86cd799439033",
    vendedorId: "507f1f77bcf86cd799439011",
    monto: 32000,
    fecha: "2024-02-10T00:00:00.000Z",
    cliente: "Startup Innovadora",
    producto: "MacBook Air M2",
  },
  {
    _id: "507f1f77bcf86cd799439034",
    vendedorId: "507f1f77bcf86cd799439013",
    monto: 12000,
    fecha: "2024-02-15T00:00:00.000Z",
    cliente: "Comercial Los Andes",
    producto: "Samsung Galaxy S24",
  },
  {
    _id: "507f1f77bcf86cd799439035",
    vendedorId: "507f1f77bcf86cd799439014",
    monto: 65000,
    fecha: "2024-03-01T00:00:00.000Z",
    cliente: "Tecnología Avanzada",
    producto: "Surface Pro 9",
  },
  {
    _id: "507f1f77bcf86cd799439036",
    vendedorId: "507f1f77bcf86cd799439012",
    monto: 4500,
    fecha: "2024-03-10T00:00:00.000Z",
    cliente: "Soluciones Digitales",
    producto: "AirPods Pro",
  },
]

