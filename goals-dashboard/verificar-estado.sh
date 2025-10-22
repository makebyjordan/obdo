#!/bin/bash

echo "════════════════════════════════════════════════════════════════"
echo "  🔍 Verificación del Estado - Goals Dashboard"
echo "════════════════════════════════════════════════════════════════"
echo ""

# Colores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Verificar PM2
echo "📊 Estado de PM2:"
pm2 status | grep goals-dashboard
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ PM2 está corriendo${NC}"
else
    echo -e "${RED}❌ PM2 no está corriendo${NC}"
fi
echo ""

# Verificar Apache
echo "🌐 Estado de Apache:"
sudo systemctl is-active apache2 > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Apache está activo${NC}"
else
    echo -e "${RED}❌ Apache no está activo${NC}"
fi
echo ""

# Verificar puerto 3000
echo "🔌 Puerto 3000 (Aplicación):"
sudo ss -tlnp | grep :3000 > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Puerto 3000 está escuchando${NC}"
else
    echo -e "${RED}❌ Puerto 3000 no está escuchando${NC}"
fi
echo ""

# Verificar puerto 80
echo "🔌 Puerto 80 (HTTP):"
sudo ss -tlnp | grep :80 > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Puerto 80 está escuchando${NC}"
else
    echo -e "${RED}❌ Puerto 80 no está escuchando${NC}"
fi
echo ""

# Verificar puerto 443
echo "🔌 Puerto 443 (HTTPS):"
sudo ss -tlnp | grep :443 > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Puerto 443 está escuchando${NC}"
else
    echo -e "${RED}❌ Puerto 443 no está escuchando${NC}"
fi
echo ""

# Verificar firewall
echo "🔥 Firewall (UFW):"
sudo ufw status | grep -E "80|443" > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Puertos 80 y 443 están abiertos en el firewall${NC}"
else
    echo -e "${YELLOW}⚠️  Verifica la configuración del firewall${NC}"
fi
echo ""

# Probar aplicación localmente
echo "🧪 Prueba Local (localhost:3000):"
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 2>/dev/null)
if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "303" ] || [ "$HTTP_CODE" = "307" ]; then
    echo -e "${GREEN}✅ Aplicación responde correctamente (HTTP $HTTP_CODE)${NC}"
else
    echo -e "${RED}❌ Aplicación no responde (HTTP $HTTP_CODE)${NC}"
fi
echo ""

# Verificar DNS
echo "🌍 DNS (evolapps.pro):"
DNS_IP=$(dig +short evolapps.pro | tail -n1)
if [ ! -z "$DNS_IP" ]; then
    echo -e "${GREEN}✅ DNS configurado: $DNS_IP${NC}"
else
    echo -e "${RED}❌ DNS no resuelve${NC}"
fi
echo ""

# Verificar configuración de Apache
echo "⚙️  Configuración de Apache:"
sudo apache2ctl -S 2>/dev/null | grep "evolapps.pro" > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Virtual host de evolapps.pro configurado${NC}"
else
    echo -e "${RED}❌ Virtual host no encontrado${NC}"
fi
echo ""

echo "════════════════════════════════════════════════════════════════"
echo "  📝 Resumen"
echo "════════════════════════════════════════════════════════════════"
echo ""
echo "Si todos los checks están en verde ✅, tu servidor está"
echo "configurado correctamente."
echo ""
echo "Si ves Plesk al acceder a https://evolapps.pro:"
echo "  1. Ve a Cloudflare Dashboard"
echo "  2. Purga el caché (Caching → Purge Everything)"
echo "  3. Espera 2-3 minutos"
echo "  4. Prueba en navegador incógnito"
echo ""
echo "Documentación:"
echo "  - SOLUCION_CLOUDFLARE.md"
echo "  - ESTADO_FINAL.md"
echo ""
echo "════════════════════════════════════════════════════════════════"
