# Aplicación para la prueba de utilización de node-cron en la automatización de procesos.

Se creó una aplicación para enviar correos mediante Nodemailer, Utilizando la configuración Oauth2 de Google. Se crearon Clientes que son los que tienen los datos de correos a enviar. Por ej: Cliente 1, email cliente1@email.com , el correo se le envíaria a el. Se agrega todo el proceso de como gestionar la configuración de Google para configurar el correo de envios.y Se dockerizó la aplicación.

# Las tecnologías utilizadas para esta herramienta son 
 * Prisma + SQLite  (Base de datos para almacenar funciones y tareas)
 * NextJs - Con Server Actions -
 * NextAuth para la autentificación mediante Usuario y Contraseña tradicional
 * React Query
 * DaisyUi
 * Tailwind
 * Typescript
 * Docker 

<h1 align="center">
APP MAILING
</h1>

<p id='menu' align="center">
  <a href="#configuracionGoogle">Configurar Cuenta de Google</a> •
  <a href="#instalacion">Instalación de la aplicación</a> •
  <a href="#variables">Variables Entorno</a> •
  <a href="#creaDb">Creación de la Base de Datos.</a> •
  <a href="#ejecutarDev">Ejecución en Desarrollo</a> •
  <a href="#ejecutarProd">Ejecución en Producción</a>
</p>

<br> <br>

<div id='instalacion'>

## Instalar Aplicación. <a href=#menu >&crarr;</a> 
<br>

1 - Clonar app desde github. 
```bash
# Clonar este repositorio
$ git clone


<div id='variables'>
<br>

## Variables de Entorno. <a href=#menu >&crarr;</a>

>**Nota:**
>Es necesario que las variables de entorno se encuentren completas para el correcto funcionamiento de la aplicación

<br>

  ### Ubicarse dentro de `./APP_MAILING` en la carpeta raiz
  * Crear un archivo con el nombre `.env`.
  * Copiar la info de la carpeta `sample.env` que se encuentra dentro de la carpeta, en el archivo `.env`.

<br>

<div id='creaDb'>
<br>

## Creación de la Base de Datos.  <a href=#menu >&crarr;</a>
 <br>

1 - En la consola ubicarse en el directorio raiz  
<br>
 
 ```ps
  ../app_mailing> npx prisma generate
 ```
 <br>

>**Ejemplo :** debe aparecer de esta manera si se ejecuta correctamente y sin errores
<br>

```ps
  Environment variables loaded from .env
  Prisma schema loaded from prisma\schema.prisma
  
  ✔ Generated Prisma Client (v5.7.1) to .\node_modules\@prisma\client in 154ms

  Start using Prisma Client in Node.js (See: https://pris.ly/d/client)
  
  import { PrismaClient } from '@prisma/client'
  const prisma = new PrismaClient()
  or start using Prisma Client at the edge (See: https://pris.ly/d/accelerate)
  
  import { PrismaClient } from '@prisma/client/edge'
  const prisma = new PrismaClient()

```
<br>

2. - Migrar estructura de la Base de Datos.

<br>

 ```ps
  ../app_mailing> npx prisma migrate dev -n init
  
 ```
 <br>

> 
> **Nota:** 
> Al ejecutar este comando , si se encuentra informacion creada En la Base de Datos, Se eliminará todo al aceptar la confirmación.

>**Ejemplo :** debe aparecer de esta manera si se ejecuta correctamente y sin errores
<br>

```ps
Environment variables loaded from .env
Prisma schema loaded from prisma\schema.prisma
Datasource "db": SQLite database "appmailing.db" at "file:./db/appmailing.db"

SQLite database appmailing.db created at file:./db/appmailing.db

Applying migration `20240208162311_init`

The following migration(s) have been created and applied from new schema changes:

migrations/
  └─ 20240208162311_init/
    └─ migration.sql

Your database is now in sync with your schema.

✔ Generated Prisma Client (v5.7.1) to .\node_modules\@prisma\client in 149ms
```
<br>

3. - Creación de usuario inicial
>
> **Nota:** 
> Posicionarse dentro de la carpeta src/actions/. y ejecutar el archivo dataInit.mjs
 
 ```ps
  ../app_mailing/src/actions> node  dataInit.mjs
  
 ```
<br>

>**Ejemplo :** debe aparecer de esta manera si se ejecuta correctamente y sin errores
```ps
PS C:...\app_mailing> node .\src\actions\dataInit.mjs
Datos inicializados correctamente.
```
</div>

<div id='ejecutarDev'>

<br>

## Ejecución en Desarrollo.<a href=#menu >&crarr;</a>


1. ejecutar y correr 
<br>

 ```ps
  ../app_mailing> npm run dev
 ```
>**Ejemplo :** debe aparecer de esta manera si se ejecuta correctamente y sin errores
<br>

```ps
> nextjs-prisma-auth@0.1.0 dev
> next dev

   ▲ Next.js 14.0.4
   - Local:        http://localhost:3000
   - Environments: .env
```

> **Nota:** 
> Para acceder a la aplicación solo ir al link de acceso local   http://localhost:3000 
</div>






<div id='ejecutarProd'>

## Generación de Alta ( Build ).<a href=#menu >&crarr;</a>

<br>
Al ejecutar el siguiente comando, se creará un directorio de compilación con una compilación de producción de la aplicación.

 ```ps
  ../app_mailing> npm run build
 ```
</div>


## Ejecución en Producción.<a href=#menu >&crarr;</a>


1. ejecutar y correr 
 ```ps
  ../app_mailing> npm run start
 ```
>**Ejemplo :** debe aparecer de esta manera si se ejecuta correctamente y sin errores
```ps
PS C:...\app_mailing> npm run start

> nextjs-prisma-auth@0.1.0 start
> next start

   ▲ Next.js 14.0.4
   - Local:        http://localhost:3000

 ✓ Ready in 1554ms
```

> **Nota:** 
> Para acceder a la aplicación solo ir al link de acceso local   http://localhost:3000 
</div>
