# 🚀 Guía de Despliegue - Goals Dashboard

Esta guía te ayudará a desplegar la aplicación Goals Dashboard usando PM2 y Nginx.

## 📋 Requisitos Previos

- Node.js 18+ instalado
- pnpm instalado
- PM2 instalado (`npm install -g pm2`)
- Nginx instalado
- PostgreSQL configurado
- Archivo `.env` configurado con las variables de entorno

## 🔧 Variables de Entorno

Asegúrate de tener un archivo `.env` con las siguientes variables:

```env
DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/goals_dashboard"
NEXTAUTH_URL="http://tu-dominio.com"
NEXTAUTH_SECRET="tu-secret-key-aqui"
```

## 📦 Instalación y Configuración

### 1. Preparar la aplicación

```bash
# Dar permisos de ejecución a los scripts
chmod +x deploy.sh setup-nginx.sh

# Ejecutar el script de despliegue
./deploy.sh
```

Este script realizará:
- ✅ Instalación de dependencias
- ✅ Generación de Prisma Client
- ✅ Ejecución de migraciones
- ✅ Build de la aplicación
- ✅ Inicio/reinicio con PM2

### 2. Configurar Nginx (requiere sudo)

```bash
# Editar nginx.conf y cambiar 'localhost' por tu dominio
nano nginx.conf

# Ejecutar el script de configuración de Nginx
sudo ./setup-nginx.sh
```

### 3. Configurar PM2 para auto-inicio

```bash
# Generar script de startup
pm2 startup

# Ejecutar el comando que PM2 te muestre (requiere sudo)
# Ejemplo: sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u usuario --hp /home/usuario

# Guardar la configuración actual
pm2 save
```

## 🎯 Comandos Útiles

### PM2

```bash
# Ver estado de las aplicaciones
pm2 status

# Ver logs en tiempo real
pm2 logs

# Ver logs de una aplicación específica
pm2 logs goals-dashboard

# Reiniciar aplicación
pm2 restart goals-dashboard

# Detener aplicación
pm2 stop goals-dashboard

# Eliminar aplicación de PM2
pm2 delete goals-dashboard

# Monitorear recursos
pm2 monit
```

### Nginx

```bash
# Probar configuración
sudo nginx -t

# Reiniciar Nginx
sudo systemctl restart nginx

# Ver estado de Nginx
sudo systemctl status nginx

# Ver logs de Nginx
sudo tail -f /var/log/nginx/goals-dashboard-access.log
sudo tail -f /var/log/nginx/goals-dashboard-error.log
```

### Base de Datos

```bash
# Ejecutar migraciones
pnpm prisma migrate deploy

# Ver estado de migraciones
pnpm prisma migrate status

# Abrir Prisma Studio
pnpm prisma studio
```

## 🔄 Actualizar la Aplicación

Para actualizar la aplicación después de hacer cambios:

```bash
# Opción 1: Usar el script de despliegue (recomendado)
./deploy.sh

# Opción 2: Manual
git pull
pnpm install
pnpm prisma generate
pnpm prisma migrate deploy
pnpm build
pm2 reload ecosystem.config.js
```

## 🔒 Configurar HTTPS con Let's Encrypt (Opcional)

```bash
# Instalar certbot
sudo apt install certbot python3-certbot-nginx

# Obtener certificado SSL
sudo certbot --nginx -d tu-dominio.com

# Renovación automática (ya configurada por certbot)
sudo certbot renew --dry-run
```

## 📊 Monitoreo

### Ver logs de la aplicación

```bash
# Logs de PM2
pm2 logs goals-dashboard

# Logs guardados en archivos
tail -f logs/pm2-out.log
tail -f logs/pm2-error.log
```

### Verificar que todo funciona

```bash
# Verificar que la aplicación responde
curl http://localhost:3000

# Verificar a través de Nginx
curl http://localhost
```

## 🐛 Solución de Problemas

### La aplicación no inicia

```bash
# Ver logs detallados
pm2 logs goals-dashboard --lines 100

# Verificar variables de entorno
pm2 env 0

# Reiniciar desde cero
pm2 delete goals-dashboard
pm2 start ecosystem.config.js
```

### Nginx muestra error 502

```bash
# Verificar que la aplicación está corriendo
pm2 status

# Verificar que el puerto 3000 está escuchando
netstat -tlnp | grep 3000

# Ver logs de Nginx
sudo tail -f /var/log/nginx/error.log
```

### Error de base de datos

```bash
# Verificar conexión a PostgreSQL
psql $DATABASE_URL

# Regenerar Prisma Client
pnpm prisma generate

# Resetear migraciones (¡CUIDADO! Borra datos)
pnpm prisma migrate reset
```

## 📝 Estructura de Archivos

```
goals-dashboard/
├── ecosystem.config.js    # Configuración de PM2
├── nginx.conf            # Configuración de Nginx
├── deploy.sh             # Script de despliegue
├── setup-nginx.sh        # Script de configuración de Nginx
├── logs/                 # Logs de PM2
│   ├── pm2-out.log
│   └── pm2-error.log
└── .env                  # Variables de entorno
```

## 🎉 ¡Listo!

Tu aplicación debería estar corriendo en:
- **Aplicación**: http://tu-dominio.com
- **Puerto directo**: http://localhost:3000

Para cualquier problema, revisa los logs con `pm2 logs` o `sudo tail -f /var/log/nginx/error.log`
