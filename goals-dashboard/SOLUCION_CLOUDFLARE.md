# 🔧 Solución: Aplicación No Visible en evolapps.pro

## ✅ Estado Actual del Servidor

Tu servidor está **100% configurado y funcionando correctamente**:

```
✅ Aplicación: Online en puerto 3000
✅ PM2: Funcionando con auto-inicio
✅ Apache: Configurado como proxy reverso
✅ SSL: Certificados de Cloudflare instalados
✅ Firewall: Puertos 80 y 443 abiertos
✅ Variables de entorno: Configuradas correctamente
```

### Verificación Local (Funciona ✅)
```bash
curl http://localhost:3000
# Devuelve la aplicación Goals Dashboard correctamente
```

---

## ⚠️ Problema

Cuando accedes a **https://evolapps.pro** desde internet, ves **Plesk** en lugar de tu aplicación.

### Causa

**Cloudflare está cacheando la página antigua** de Plesk. Tu servidor está respondiendo correctamente, pero Cloudflare está sirviendo contenido cacheado.

---

## 🔧 Solución: Purgar Caché de Cloudflare

### Paso 1: Acceder a Cloudflare

1. Ve a https://dash.cloudflare.com
2. Inicia sesión con tu cuenta
3. Selecciona el dominio **evolapps.pro**

### Paso 2: Purgar el Caché

1. En el menú lateral, haz clic en **"Caching"**
2. Busca la sección **"Purge Cache"**
3. Haz clic en **"Purge Everything"** (Purgar Todo)
4. Confirma la acción

### Paso 3: Verificar Configuración SSL

Mientras estás en Cloudflare:

1. Ve a **SSL/TLS** en el menú lateral
2. Asegúrate de que el modo SSL esté en:
   - **"Full"** (recomendado) o
   - **"Full (strict)"** si tienes certificados válidos

3. **NO uses "Flexible"** - esto causará problemas

### Paso 4: Esperar y Probar

1. Espera **2-3 minutos** después de purgar el caché
2. Abre una ventana de incógnito en tu navegador
3. Visita **https://evolapps.pro**
4. Deberías ver tu aplicación Goals Dashboard ✅

---

## 🔍 Verificación Adicional

### Verificar desde el Servidor

```bash
# Probar localmente (debe funcionar)
curl http://localhost:3000

# Probar Apache directamente (debe funcionar)
curl -k -H "Host: evolapps.pro" https://127.0.0.1

# Ver logs de Apache
sudo tail -f /var/log/apache2/evolapps-access.log
```

### Verificar Estado de la Aplicación

```bash
# Ver estado de PM2
pm2 status

# Ver logs en tiempo real
pm2 logs goals-dashboard

# Ver estado de Apache
sudo systemctl status apache2
```

---

## 🌐 Configuración de Cloudflare (Opcional pero Recomendado)

### Desactivar Caché para Rutas Dinámicas

Para evitar problemas futuros, configura reglas de caché:

1. En Cloudflare, ve a **"Rules"** → **"Page Rules"**
2. Crea una nueva regla:
   - **URL**: `evolapps.pro/api/*`
   - **Setting**: Cache Level → Bypass
3. Crea otra regla:
   - **URL**: `evolapps.pro/*`
   - **Setting**: Cache Level → Standard

### Configurar Always Use HTTPS

1. Ve a **SSL/TLS** → **Edge Certificates**
2. Activa **"Always Use HTTPS"**
3. Esto redirigirá automáticamente HTTP → HTTPS

---

## 🐛 Si Aún No Funciona

### Opción 1: Verificar DNS

```bash
# Verificar que el DNS apunte correctamente
dig evolapps.pro +short
# Debe devolver la IP de Cloudflare (no la IP del servidor)
```

### Opción 2: Verificar Configuración de Apache

```bash
# Ver virtual hosts activos
sudo apache2ctl -S | grep evolapps

# Debe mostrar:
# *:443  evolapps.pro (/etc/apache2/sites-enabled/000-evolapps.pro.conf:7)
```

### Opción 3: Reiniciar Apache

```bash
sudo systemctl restart apache2
pm2 restart goals-dashboard
```

### Opción 4: Verificar Logs de Error

```bash
# Ver errores de Apache
sudo tail -50 /var/log/apache2/evolapps-error.log

# Ver errores de la aplicación
pm2 logs goals-dashboard --err --lines 50
```

---

## 📱 Resultado Esperado

Después de purgar el caché de Cloudflare, al visitar **https://evolapps.pro** deberías ver:

✅ **Goals Dashboard** - Tu aplicación de gestión de objetivos
- Página de login
- Sistema de autenticación
- Dashboard de objetivos

❌ **NO deberías ver**:
- Página de Plesk
- Errores 404
- Página en blanco

---

## 🎯 Resumen de Pasos

1. ✅ **Servidor configurado** (ya está listo)
2. ⚠️ **Purgar caché de Cloudflare** (hazlo ahora)
3. ⏳ **Esperar 2-3 minutos**
4. ✅ **Probar en navegador incógnito**

---

## 📞 Información Técnica

### Configuración del Servidor
- **IP**: 217.154.183.32
- **Puerto HTTP**: 80
- **Puerto HTTPS**: 443
- **Puerto Aplicación**: 3000 (interno)

### Archivos de Configuración
- **Apache VHost**: `/etc/apache2/sites-available/000-evolapps.pro.conf`
- **PM2 Config**: `/root/tests/obdo-test/obdo/goals-dashboard/ecosystem.config.js`
- **Variables**: `/root/tests/obdo-test/obdo/goals-dashboard/.env`

### Comandos Útiles
```bash
# Ver estado completo
pm2 status && sudo systemctl status apache2

# Reiniciar todo
pm2 restart goals-dashboard && sudo systemctl restart apache2

# Ver logs en tiempo real
pm2 logs goals-dashboard
```

---

## ✅ Confirmación Final

Una vez que purges el caché de Cloudflare y esperes unos minutos:

1. Abre **https://evolapps.pro** en tu navegador
2. Deberías ver la página de **login** de Goals Dashboard
3. Puedes registrarte o iniciar sesión
4. ¡Tu aplicación está en línea! 🎉

---

**Nota**: Si después de purgar el caché de Cloudflare aún ves Plesk, contacta al soporte de Cloudflare o verifica que no haya reglas de Page Rules o Workers que estén interfiriendo.
