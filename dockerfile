# Giai đoạn build
FROM node:18-alpine AS builder
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
FROM node:18-alpine
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/package*.json ./
RUN npm install --prod
COPY --from=builder /usr/src/app/dist ./dist
EXPOSE 3000

CMD ["npm", "run", "start:prod"]
