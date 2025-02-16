FROM oven/bun:latest

WORKDIR /app

COPY package.json tsconfig.json ./

COPY . .

RUN bun install


EXPOSE 3000

ENTRYPOINT ["bun", "run", "start"]