#!/bin/bash

echo "🚀 Desplegando Goals Dashboard..."

# Colores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Instalar dependencias
echo -e "${YELLOW}📦 Instalando dependencias...${NC}"
pnpm install

# Generar Prisma Client
echo -e "${YELLOW}🗄️ Generando Prisma Client...${NC}"
pnpm prisma generate

# Ejecutar migraciones
echo -e "${YELLOW}🔄 Ejecutando migraciones...${NC}"
pnpm prisma migrate deploy

# Construir aplicación
echo -e "${YELLOW}🏗️ Construyendo aplicación...${NC}"
pnpm build

# Reiniciar PM2
echo -e "${YELLOW}🔄 Reiniciando aplicación con PM2...${NC}"
pm2 reload ecosystem.config.js --update-env

# Guardar configuración PM2
pm2 save

echo -e "${GREEN}✅ Despliegue completado!${NC}"
echo -e "${GREEN}🌐 La aplicación está corriendo en PM2${NC}"
echo ""
echo "Comandos útiles:"
echo "  pm2 status          - Ver estado de la aplicación"
echo "  pm2 logs            - Ver logs en tiempo real"
echo "  pm2 restart all     - Reiniciar aplicación"
echo "  pm2 stop all        - Detener aplicación"
