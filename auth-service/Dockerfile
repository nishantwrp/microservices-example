FROM golang:alpine
RUN apk add --no-cache git bash
WORKDIR /app
COPY . .
RUN go mod tidy
RUN go build server.go
ENTRYPOINT ["bash", "-c", "/app/server"]
