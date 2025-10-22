#!/bin/bash

echo "🔒 Configurando SSL para evolapps.pro..."

# Colores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Verificar DNS primero
echo -e "${YELLOW}📡 Verificando configuración DNS...${NC}"
IP_ACTUAL=$(dig +short evolapps.pro | tail -n1)
IP_SERVIDOR="217.154.183.32"

if [ "$IP_ACTUAL" != "$IP_SERVIDOR" ]; then
    echo -e "${RED}❌ Error: El DNS no está configurado correctamente${NC}"
    echo -e "${YELLOW}IP actual de evolapps.pro: ${IP_ACTUAL}${NC}"
    echo -e "${YELLOW}IP esperada: ${IP_SERVIDOR}${NC}"
    echo ""
    echo "Por favor, configura los registros DNS primero:"
    echo "  Tipo: A"
    echo "  Nombre: @"
    echo "  Valor: ${IP_SERVIDOR}"
    echo ""
    echo "  Tipo: A"
    echo "  Nombre: www"
    echo "  Valor: ${IP_SERVIDOR}"
    echo ""
    echo "Espera 5-30 minutos para la propagación DNS y ejecuta este script nuevamente."
    exit 1
fi

echo -e "${GREEN}✅ DNS configurado correctamente${NC}"
echo ""

# Obtener certificado SSL
echo -e "${YELLOW}🔐 Obteniendo certificado SSL de Let's Encrypt...${NC}"
certbot --apache -d evolapps.pro -d www.evolapps.pro \
    --non-interactive \
    --agree-tos \
    --email admin@evolapps.pro \
    --redirect

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Certificado SSL instalado correctamente!${NC}"
    echo ""
    echo -e "${GREEN}🎉 Tu sitio ahora está disponible en:${NC}"
    echo -e "${GREEN}   https://evolapps.pro${NC}"
    echo -e "${GREEN}   https://www.evolapps.pro${NC}"
    echo ""
    echo "Comandos útiles:"
    echo "  sudo certbot certificates      - Ver certificados"
    echo "  sudo certbot renew --dry-run   - Probar renovación"
else
    echo -e "${RED}❌ Error al obtener el certificado SSL${NC}"
    echo "Verifica los logs en: /var/log/letsencrypt/letsencrypt.log"
    exit 1
fi
