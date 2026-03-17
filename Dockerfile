FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

ARG VITE_API_URL=https://backend-production-b055.up.railway.app
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

FROM node:22-alpine AS runner

WORKDIR /app

COPY server.cjs ./
COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["node", "server.cjs"]
