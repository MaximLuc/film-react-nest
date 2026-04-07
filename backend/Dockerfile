FROM node:20 AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/scripts ./scripts

RUN mkdir -p ./test

COPY --from=builder /app/test/mongodb_initial_stub.json ./test/mongodb_initial_stub.json
COPY --from=builder /app/public ./public

EXPOSE 3000

CMD ["node", "dist/main"]