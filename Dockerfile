FROM node:20-alpine

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos de tu proyecto al contenedor
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia los archivos restantes del proyecto al contenedor
COPY . .

# Borra la cache y elimina node_modules
RUN npm cache clean --force && rm -rf node_modules

# Instala Prisma globalmente
RUN npm install -g prisma

# Instala SQLite y crea la base de datos
RUN apk add --no-cache sqlite && \
    mkdir /db && \
    sqlite3 /db/test.db

# Copia el archivo Prisma schema al contenedor
COPY ./prisma/schema.prisma ./prisma/

# Genera el cliente de Prisma
RUN npx prisma generate

# Genera realizo el migrate de Prisma
RUN  npx prisma migrate dev -n init

# Ejecuta el script de inicialización de datos
RUN node src/actions/dataInit.mjs

# Construye la aplicación
RUN npm run build

# Expone el puerto 3000
EXPOSE 3000

# Inicia la aplicación
CMD ["npm", "run", "start"]
