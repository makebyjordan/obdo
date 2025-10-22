# 🚀 Inicio Rápido - Goals Dashboard

## ⚡ Pasos para Desplegar

### 1️⃣ Configurar Variables de Entorno

```bash
# Copiar el template
cp env.template .env

# Editar con tus valores reales
nano .env
```

**Valores que debes configurar:**
- `DATABASE_URL`: Tu conexión a PostgreSQL
- `NEXTAUTH_URL`: URL de tu aplicación (ej: http://tu-dominio.com)
- `NEXTAUTH_SECRET`: Genera uno con: `openssl rand -base64 32`

### 2️⃣ Desplegar con PM2

```bash
# Ejecutar script de despliegue
./deploy.sh
```

Este script automáticamente:
- ✅ Instala dependencias
- ✅ Genera Prisma Client
- ✅ Ejecuta migraciones
- ✅ Construye la aplicación
- ✅ Inicia/reinicia con PM2

### 3️⃣ Configurar Nginx (Opcional)

```bash
# Editar configuración (cambiar 'localhost' por tu dominio)
nano nginx.conf

# Aplicar configuración (requiere sudo)
sudo ./setup-nginx.sh
```

### 4️⃣ Configurar Auto-inicio de PM2

```bash
# Generar script de startup
pm2 startup

# Ejecutar el comando que PM2 muestre (con sudo)
# Guardar configuración
pm2 save
```

## ✅ Verificar que Todo Funciona

```bash
# Ver estado de PM2
pm2 status

# Ver logs en tiempo real
pm2 logs goals-dashboard

# Probar la aplicación
curl http://localhost:3000
```

## 🔧 Comandos Rápidos

```bash
# Ver logs
pm2 logs

# Reiniciar aplicación
pm2 restart goals-dashboard

# Detener aplicación
pm2 stop goals-dashboard

# Ver estado
pm2 status

# Monitorear recursos
pm2 monit
```

## 📚 Documentación Completa

Para más detalles, consulta [DEPLOYMENT.md](./DEPLOYMENT.md)

## 🆘 Problemas Comunes

### Error: "Failed to start server"
- Verifica que el archivo `.env` existe y tiene las variables correctas
- Revisa los logs: `pm2 logs goals-dashboard`

### Error 502 en Nginx
- Verifica que PM2 está corriendo: `pm2 status`
- Verifica que el puerto 3000 está escuchando: `netstat -tlnp | grep 3000`

### Error de base de datos
- Verifica la conexión: `psql $DATABASE_URL`
- Ejecuta las migraciones: `pnpm prisma migrate deploy`
