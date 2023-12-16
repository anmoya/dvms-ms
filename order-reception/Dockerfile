# Fase de construcción
FROM node:18 as builder
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Fase de ejecución
FROM node:18
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/dist ./dist
COPY package*.json ./
RUN npm install
EXPOSE 3000
CMD ["node", "dist/app.js"]