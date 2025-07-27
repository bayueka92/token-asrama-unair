# --- Tahap 1: Build Aplikasi React ---
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:stable-alpine

# Salin konfigurasi nginx custom
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Salin hasil build React
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
