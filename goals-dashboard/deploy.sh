#!/bin/bash

echo "🚀 Desplegando Goals Dashboard..."

# Instalar dependencias
echo "📦 Instalando dependencias..."
pnpm install

# Generar Prisma Client
echo "🗄️ Generando Prisma Client..."
npx prisma generate

# Ejecutar migraciones
echo "🔄 Ejecutando migraciones..."
npx prisma migrate deploy

# Construir aplicación
echo "🏗️ Construyendo aplicación..."
pnpm build

echo "✅ Despliegue completado!"
echo "🌐 Para iniciar el servidor ejecuta: pnpm start"
