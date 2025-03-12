# Base image for building
FROM oven/bun:latest AS builder

WORKDIR /app

COPY package*.json bun.lock ./

RUN bun install 

COPY . .

RUN bun run build

FROM oven/bun:latest AS production

WORKDIR /production

COPY --from=builder /app/dist .
COPY --from=builder /app/package.json .
COPY --from=builder /app/bun.lock .

RUN bun install

EXPOSE 4173

ENTRYPOINT ["bun", "run", "preview"]
