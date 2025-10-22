# Configuración del Servidor

## Requisitos previos en el servidor:
```bash
# Actualizar sistema
apt update && apt upgrade -y

# Instalar Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt-get install -y nodejs

# Instalar pnpm
npm install -g pnpm

# Instalar PostgreSQL
apt install postgresql postgresql-contrib -y

# Instalar PM2 para gestión de procesos
npm install -g pm2
```

## Configurar PostgreSQL:
```bash
# Cambiar a usuario postgres
sudo -u postgres psql

# Crear base de datos y usuario
CREATE DATABASE goals_dashboard;
CREATE USER goals_user WITH PASSWORD 'tu_password_segura';
GRANT ALL PRIVILEGES ON DATABASE goals_dashboard TO goals_user;
\q
```

## Configurar variables de entorno:
1. Copiar `.env.production` a `.env`
2. Actualizar DATABASE_URL con credenciales reales
3. Actualizar NEXTAUTH_URL con tu dominio/IP

## Iniciar aplicación:
```bash
# Desarrollo
pnpm dev

# Producción con PM2
pm2 start "pnpm start" --name "goals-dashboard"
pm2 save
pm2 startup
```
