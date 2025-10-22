# 🌐 Configuración Final para evolapps.pro

## ✅ Estado Actual del Servidor

### Aplicación Desplegada
- ✅ **PM2**: Aplicación corriendo en puerto 3000
- ✅ **Apache**: Configurado como proxy reverso
- ✅ **Variables de entorno**: Configuradas para producción
- ✅ **Build**: Completado exitosamente

### Verificar Estado
```bash
# Ver estado de PM2
pm2 status

# Ver logs de la aplicación
pm2 logs goals-dashboard

# Ver estado de Apache
sudo systemctl status apache2
```

---

## 📍 Paso 1: Configurar DNS

**IP del servidor:** `217.154.183.32`

Ve a tu proveedor de dominio (donde compraste evolapps.pro) y agrega estos registros DNS:

### Registros DNS Requeridos:

```
Tipo: A
Nombre: @
Valor: 217.154.183.32
TTL: 3600 (o el mínimo permitido)

Tipo: A
Nombre: www
Valor: 217.154.183.32
TTL: 3600 (o el mínimo permitido)
```

### Verificar Propagación DNS

Después de configurar los registros DNS, espera 5-30 minutos y verifica:

```bash
# Verificar dominio principal
dig evolapps.pro +short

# Verificar subdominio www
dig www.evolapps.pro +short

# Ambos deben devolver: 217.154.183.32
```

O usa herramientas online:
- https://dnschecker.org
- https://www.whatsmydns.net

---

## 🔒 Paso 2: Configurar SSL (Después de DNS)

Una vez que el DNS esté propagado y apuntando correctamente, ejecuta:

```bash
cd /root/tests/obdo-test/obdo/goals-dashboard

# Obtener certificado SSL
sudo certbot --apache -d evolapps.pro -d www.evolapps.pro --non-interactive --agree-tos --email admin@evolapps.pro --redirect
```

### Verificar SSL
```bash
# Ver certificados instalados
sudo certbot certificates

# Probar renovación automática
sudo certbot renew --dry-run
```

---

## 🎯 Paso 3: Verificar Funcionamiento

Una vez configurado DNS y SSL:

```bash
# Verificar que el sitio responde
curl -I https://evolapps.pro

# Debería devolver: HTTP/2 200
```

Abre en tu navegador:
- https://evolapps.pro
- https://www.evolapps.pro

---

## 🔧 Comandos Útiles

### PM2
```bash
# Ver estado
pm2 status

# Ver logs en tiempo real
pm2 logs goals-dashboard

# Reiniciar aplicación
pm2 restart goals-dashboard

# Detener aplicación
pm2 stop goals-dashboard

# Ver uso de recursos
pm2 monit
```

### Apache
```bash
# Ver estado
sudo systemctl status apache2

# Reiniciar Apache
sudo systemctl restart apache2

# Ver logs de error
sudo tail -f /var/log/apache2/evolapps-error.log

# Ver logs de acceso
sudo tail -f /var/log/apache2/evolapps-access.log
```

### Base de Datos
```bash
# Ver estado de migraciones
pnpm prisma migrate status

# Ejecutar nuevas migraciones
pnpm prisma migrate deploy

# Abrir Prisma Studio
pnpm prisma studio
```

---

## 🔄 Actualizar la Aplicación

Cuando hagas cambios en el código:

```bash
cd /root/tests/obdo-test/obdo/goals-dashboard

# Opción 1: Usar el script automático
./deploy.sh

# Opción 2: Manual
git pull
pnpm install
pnpm prisma generate
pnpm prisma migrate deploy
pnpm build
pm2 reload goals-dashboard
```

---

## 🐛 Solución de Problemas

### La aplicación no responde
```bash
# Verificar que PM2 está corriendo
pm2 status

# Ver logs de errores
pm2 logs goals-dashboard --err

# Reiniciar
pm2 restart goals-dashboard
```

### Error 502 Bad Gateway
```bash
# Verificar que la app está en puerto 3000
sudo ss -tlnp | grep :3000

# Verificar logs de Apache
sudo tail -f /var/log/apache2/evolapps-error.log
```

### Error de base de datos
```bash
# Verificar conexión
pnpm prisma db pull

# Regenerar cliente
pnpm prisma generate

# Ver logs
pm2 logs goals-dashboard
```

---

## 📝 Notas Importantes

1. **Backup de Base de Datos**: Configura backups automáticos de PostgreSQL
2. **Monitoreo**: Considera usar herramientas como PM2 Plus o New Relic
3. **Firewall**: Asegúrate de que los puertos 80 y 443 estén abiertos
4. **Renovación SSL**: Certbot renueva automáticamente, pero verifica con `sudo certbot renew --dry-run`

---

## 🎉 ¡Listo!

Una vez completados los pasos 1 y 2, tu aplicación estará disponible en:
- **https://evolapps.pro**
- **https://www.evolapps.pro**

Con SSL/HTTPS automático y renovación automática de certificados.
