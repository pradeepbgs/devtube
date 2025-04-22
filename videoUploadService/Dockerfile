FROM golang:1.23-alpine AS builder

WORKDIR /app

COPY go.mod go.sum ./

RUN go mod download

COPY . .
RUN go build -o main main.go

# Final stage: Minimal image with compiled binary
FROM alpine:latest

WORKDIR /root/

COPY --from=builder /app/main .
# COPY --from=builder /app/.env .env

EXPOSE 3001

ENTRYPOINT ["./main"]