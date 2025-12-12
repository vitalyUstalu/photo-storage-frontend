# ---- build ----
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# ---- serve static ----
FROM node:20-alpine
WORKDIR /srv
RUN npm i -g serve
COPY --from=build /app/dist ./dist
EXPOSE 8080
CMD ["serve","-s","dist","-l","8080"]

