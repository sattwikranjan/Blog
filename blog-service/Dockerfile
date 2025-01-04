# Stage 1: Build dependencies
FROM node:18 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Stage 2: Runtime
FROM node:18-slim
WORKDIR /app
COPY --from=builder /app .
EXPOSE 3002
CMD ["node", "index.js"]
