# Use the official Golang image as the base image
FROM golang:1.23-alpine AS builder

# CA certificates
RUN apk --no-cache add ca-certificates

# Set the Current Working Directory inside the container
WORKDIR /app

# Copy go mod and sum files
COPY go.mod go.sum ./

# Download all dependencies. Dependencies will be cached if the go.mod and go.sum files are not changed
RUN go mod download

# Copy the source from the current directory to the Working Directory inside the container
COPY . .

# Build the Go app
RUN CGO_ENABLED=0 go build cmd/db8/main.go

# Step 2: Create a minimal image to run the Go application
FROM ubuntu:latest  

# Set the working directory in the container
WORKDIR /root/

# CA certificates
COPY --from=builder /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/

# Copy the built binary from the builder stage
COPY --from=builder /app/db8 .

RUN chmod +x db8

# Expose the port the app will run on (change 8080 to whatever port your app uses)
EXPOSE 8080

# Command to run the application
CMD ["./db8"]