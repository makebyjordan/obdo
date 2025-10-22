#!/bin/bash

echo "🔧 Configurando Nginx para Goals Dashboard..."

# Colores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Verificar si se ejecuta como root
if [ "$EUID" -ne 0 ]; then 
    echo -e "${RED}❌ Este script debe ejecutarse como root (usa sudo)${NC}"
    exit 1
fi

# Copiar configuración a sites-available
echo -e "${YELLOW}📋 Copiando configuración de Nginx...${NC}"
cp nginx.conf /etc/nginx/sites-available/goals-dashboard

# Crear enlace simbólico en sites-enabled
echo -e "${YELLOW}🔗 Creando enlace simbólico...${NC}"
ln -sf /etc/nginx/sites-available/goals-dashboard /etc/nginx/sites-enabled/

# Eliminar configuración default si existe
if [ -f /etc/nginx/sites-enabled/default ]; then
    echo -e "${YELLOW}🗑️ Eliminando configuración default...${NC}"
    rm /etc/nginx/sites-enabled/default
fi

# Probar configuración de Nginx
echo -e "${YELLOW}✅ Probando configuración de Nginx...${NC}"
nginx -t

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Configuración de Nginx válida${NC}"
    
    # Reiniciar Nginx
    echo -e "${YELLOW}🔄 Reiniciando Nginx...${NC}"
    systemctl restart nginx
    
    echo -e "${GREEN}✅ Nginx configurado correctamente!${NC}"
    echo ""
    echo "Estado de Nginx:"
    systemctl status nginx --no-pager -l
else
    echo -e "${RED}❌ Error en la configuración de Nginx${NC}"
    exit 1
fi
