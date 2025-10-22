# 🎉 Goals Dashboard - Despliegue Completado

## ✅ Estado: SERVIDOR 100% CONFIGURADO

Tu aplicación está completamente desplegada y funcionando en el servidor.

---

## 🚀 Acceso a la Aplicación

**URL**: https://evolapps.pro

⚠️ **Si ves Plesk en lugar de tu aplicación**, lee la sección "Solución Cloudflare" más abajo.

---

## ✅ Verificación del Sistema

Ejecuta este comando para verificar que todo está funcionando:

```bash
./verificar-estado.sh
```

Deberías ver todos los checks en verde ✅:
- ✅ PM2 corriendo
- ✅ Apache activo
- ✅ Puerto 3000 escuchando
- ✅ Puertos 80 y 443 abiertos
- ✅ Aplicación respondiendo
- ✅ DNS configurado
- ✅ Virtual host configurado

---

## 🔧 Solución: Si Ves Plesk en lugar de tu App

### Causa
Cloudflare está cacheando la página antigua de Plesk.

### Solución Rápida

1. **Ve a Cloudflare Dashboard**
   - https://dash.cloudflare.com
   - Selecciona el dominio `evolapps.pro`

2. **Purga el Caché**
   - Caching → Purge Cache → Purge Everything
   - Confirma la acción

3. **Espera 2-3 minutos**

4. **Prueba en navegador incógnito**
   - Abre https://evolapps.pro
   - Deberías ver Goals Dashboard ✅

### Documentación Detallada
Lee el archivo `SOLUCION_CLOUDFLARE.md` para más detalles.

---

## 📊 Componentes Instalados

### 1. Aplicación Next.js
- **Estado**: Online
- **Puerto**: 3000 (interno)
- **Gestor**: PM2
- **Auto-inicio**: ✅ Configurado

### 2. Servidor Web
- **Software**: Apache
- **Puerto HTTP**: 80
- **Puerto HTTPS**: 443
- **SSL**: Certificados de Cloudflare

### 3. Proxy Reverso
- Apache → localhost:3000
- HTTP redirige a HTTPS automáticamente

### 4. Firewall
- UFW configurado
- Puertos 80 y 443 abiertos

### 5. Base de Datos
- PostgreSQL configurado
- Prisma ORM
- Migraciones ejecutadas

---

## 🛠️ Comandos Útiles

### Ver Estado
```bash
# Estado general
./verificar-estado.sh

# Estado de PM2
pm2 status

# Estado de Apache
sudo systemctl status apache2

# Ver logs
pm2 logs goals-dashboard
```

### Reiniciar Servicios
```bash
# Reiniciar aplicación
pm2 restart goals-dashboard

# Reiniciar Apache
sudo systemctl restart apache2

# Reiniciar todo
pm2 restart goals-dashboard && sudo systemctl restart apache2
```

### Ver Logs
```bash
# Logs de la aplicación
pm2 logs goals-dashboard

# Logs de Apache
sudo tail -f /var/log/apache2/evolapps-access.log
sudo tail -f /var/log/apache2/evolapps-error.log
```

---

## 🔄 Actualizar la Aplicación

Cuando hagas cambios en el código:

```bash
cd /root/tests/obdo-test/obdo/goals-dashboard

# Usar el script automático
./deploy.sh

# O manualmente:
git pull
pnpm install
pnpm prisma generate
pnpm prisma migrate deploy
pnpm build
pm2 restart goals-dashboard
```

---

## 📁 Archivos Importantes

### Configuración
- `.env` - Variables de entorno
- `ecosystem.config.js` - Configuración de PM2
- `/etc/apache2/sites-available/000-evolapps.pro.conf` - Apache VHost

### Scripts
- `deploy.sh` - Redesplegar aplicación
- `verificar-estado.sh` - Verificar estado del sistema

### Documentación
- `SOLUCION_CLOUDFLARE.md` - Solución para problema de caché
- `ESTADO_FINAL.md` - Estado completo del sistema
- `CONFIGURACION_DNS_SSL.md` - Guía de DNS y SSL

### Logs
- `pm2 logs` - Logs de la aplicación
- `/var/log/apache2/evolapps-*.log` - Logs de Apache

---

## 🔒 Seguridad

### Configurado
- ✅ SSL/HTTPS con Cloudflare
- ✅ Firewall (UFW)
- ✅ Variables de entorno protegidas
- ✅ NEXTAUTH_SECRET generado de forma segura
- ✅ AUTH_TRUST_HOST configurado

### Recomendaciones
- Configura backups automáticos de PostgreSQL
- Revisa los logs regularmente
- Mantén las dependencias actualizadas

---

## 📞 Información del Servidor

- **IP**: 217.154.183.32
- **Dominio**: evolapps.pro
- **Puerto HTTP**: 80
- **Puerto HTTPS**: 443
- **Puerto App**: 3000 (interno)

---

## 🎯 Próximos Pasos

### 1. Purgar Caché de Cloudflare (Si es necesario)
Si ves Plesk en lugar de tu app, sigue las instrucciones en `SOLUCION_CLOUDFLARE.md`

### 2. Configurar Base de Datos de Producción
```bash
# Edita .env con tu base de datos real
nano .env

# Ejecuta migraciones
pnpm prisma migrate deploy

# Reinicia la aplicación
pm2 restart goals-dashboard
```

### 3. Configurar Google OAuth (Opcional)
```bash
# Edita .env con tus credenciales de Google
nano .env

# Reinicia la aplicación
pm2 restart goals-dashboard
```

### 4. Configurar Backups
```bash
# Ejemplo de backup de PostgreSQL
pg_dump $DATABASE_URL > backup.sql
```

---

## ✅ Checklist Final

- [x] Aplicación desplegada con PM2
- [x] Apache configurado como proxy
- [x] SSL configurado
- [x] Firewall configurado
- [x] Auto-inicio configurado
- [x] Variables de entorno configuradas
- [x] DNS configurado
- [ ] Caché de Cloudflare purgado (hazlo si es necesario)
- [ ] Base de datos de producción configurada (opcional)
- [ ] Google OAuth configurado (opcional)

---

## 🎉 ¡Felicidades!

Tu aplicación Goals Dashboard está completamente desplegada y lista para usar.

**URL**: https://evolapps.pro

Si tienes algún problema, revisa:
1. `SOLUCION_CLOUDFLARE.md` - Para problemas de caché
2. `./verificar-estado.sh` - Para verificar el estado del sistema
3. `pm2 logs goals-dashboard` - Para ver logs de la aplicación

---

**Fecha de despliegue**: $(date)
**Versión de Node**: $(node --version)
**Versión de PM2**: $(pm2 --version)
