# Goals Dashboard - Setup Instructions

## 🚀 Configuración Inicial

### 1. Instalar Dependencias
```bash
pnpm install
```

### 2. Configurar Variables de Entorno
Copia el archivo de ejemplo y configura las variables:
```bash
cp env.example .env
```

Edita `.env` con tus valores:
```env
# Database (PostgreSQL)
DATABASE_URL="postgresql://user:password@localhost:5432/goals_dashboard?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="tu-secret-key-aqui"

# Google OAuth (opcional)
GOOGLE_CLIENT_ID="tu-google-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="tu-google-client-secret"
```

### 3. Configurar Base de Datos

#### Opción A: PostgreSQL Local
```bash
# Instalar PostgreSQL (macOS)
brew install postgresql
brew services start postgresql

# Crear base de datos
createdb goals_dashboard
```

#### Opción B: PostgreSQL con Docker
```bash
docker run --name goals-postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=goals_dashboard \
  -p 5432:5432 \
  -d postgres:16
```

### 4. Configurar Prisma
```bash
# Generar cliente de Prisma
npx prisma generate

# Ejecutar migraciones
npx prisma migrate dev --name init

# (Opcional) Ver base de datos
npx prisma studio
```

### 5. Configurar Google OAuth (Opcional)

1. Ve a [Google Cloud Console](https://console.cloud.google.com)
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita la Google+ API
4. Ve a "Credenciales" → "Crear credenciales" → "ID de cliente OAuth 2.0"
5. Configura:
   - Tipo de aplicación: Aplicación web
   - URIs de redirección autorizados: `http://localhost:3000/api/auth/callback/google`
6. Copia el Client ID y Client Secret al archivo `.env`

### 6. Generar Secret para NextAuth
```bash
# Generar secret seguro
openssl rand -base64 32
```
Copia el resultado a `NEXTAUTH_SECRET` en `.env`

### 7. Ejecutar en Desarrollo
```bash
pnpm dev
```

La aplicación estará disponible en: http://localhost:3000

## 🎯 Funcionalidades Principales

- ✅ **Autenticación**: Email/Password + Google OAuth
- ✅ **Gestión de Objetivos**: CRUD completo con validaciones
- ✅ **Gamificación**: Medallas oro/plata/bronce para top 3
- ✅ **Sistema de Bloqueo**: Requiere 80% completitud para añadir más
- ✅ **Reordenamiento**: Automático al completar objetivos
- ✅ **Analytics**: Métricas en tiempo real
- ✅ **Responsive**: Funciona en móvil, tablet y desktop

## 🔧 Scripts Disponibles

```bash
# Desarrollo
pnpm dev

# Build para producción
pnpm build

# Iniciar en producción
pnpm start

# Linting
pnpm lint

# Base de datos
npx prisma studio          # Interfaz visual
npx prisma migrate dev     # Nueva migración
npx prisma migrate reset   # Resetear DB (desarrollo)
npx prisma generate        # Regenerar cliente
```

## 📁 Estructura del Proyecto

```
goals-dashboard/
├── app/                    # App Router de Next.js
│   ├── (auth)/            # Páginas de autenticación
│   ├── (dashboard)/       # Páginas del dashboard
│   └── api/               # API routes
├── components/            # Componentes React
│   ├── ui/                # Componentes de shadcn/ui
│   ├── auth/              # Formularios de auth
│   └── dashboard/         # Componentes del dashboard
├── lib/                   # Utilidades y configuración
├── hooks/                 # Custom hooks
├── types/                 # Tipos de TypeScript
└── prisma/               # Schema y migraciones
```

## 🚀 Deploy a Producción

### Vercel (Recomendado)
```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel

# Configurar variables de entorno en Vercel Dashboard:
# - DATABASE_URL (PostgreSQL producción)
# - NEXTAUTH_SECRET
# - NEXTAUTH_URL (tu dominio)
# - GOOGLE_CLIENT_ID
# - GOOGLE_CLIENT_SECRET
```

### Otras Plataformas
- **Railway**: Conecta tu repo de GitHub
- **PlanetScale**: Para base de datos MySQL
- **Supabase**: Para PostgreSQL managed

## 🐛 Troubleshooting

### Error: "Prisma Client not generated"
```bash
npx prisma generate
```

### Error: "DATABASE_URL not found"
- Verifica que `.env` existe y tiene `DATABASE_URL`
- Reinicia el servidor de desarrollo

### Error: "NextAuth session null"
- Verifica `NEXTAUTH_SECRET` y `NEXTAUTH_URL` en `.env`
- Limpia cookies del navegador

### Error: "Cannot connect to database"
- Verifica que PostgreSQL está corriendo
- Verifica la URL de conexión en `DATABASE_URL`

## 📚 Tecnologías Utilizadas

- **Frontend**: Next.js 15, React 18, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Base de Datos**: PostgreSQL
- **Autenticación**: NextAuth.js v5
- **UI**: shadcn/ui, Lucide React, Framer Motion
- **Validación**: Zod
- **Formularios**: React Hook Form

## 🎨 Personalización

### Colores
Los colores de las medallas están definidos en los componentes:
- 🥇 Oro: `bg-yellow-400 text-yellow-900`
- 🥈 Plata: `bg-gray-300 text-gray-900`  
- 🥉 Bronce: `bg-orange-400 text-orange-900`

### Límites
- Máximo objetivos: 20 (modificar en `/api/goals/route.ts`)
- Porcentaje requerido: 80% (modificar en `/api/goals/route.ts`)

¡Listo! Tu Goals Dashboard está configurado y funcionando. 🎉
