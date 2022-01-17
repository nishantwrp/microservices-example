package main

import (
	"context"
	"flag"
	"fmt"
	"log"
	"net"

	"google.golang.org/grpc"
	// "github.com/golang/protobuf/proto"
	pb "microservices/auth-service/protobuf"
)

var (
	port = flag.Int("port", 3005, "The server port")
)

type authService struct {
	pb.UnimplementedAuthServiceServer
}

func (s *authService) RegisterUser(context context.Context, regForm *pb.UserRegistrationForm) (*pb.Token, error) {
	log.Printf("%v", regForm)
	return &pb.Token{Token: "testing"}, nil
}

func main() {
	flag.Parse()
	lis, err := net.Listen("tcp", fmt.Sprintf("localhost:%d", *port))
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}

	grpcServer := grpc.NewServer()
	pb.RegisterAuthServiceServer(grpcServer, &authService{})
	log.Printf("server listening at %v", lis.Addr())
	if err := grpcServer.Serve(lis); err != nil {
		log.Fatalf("failed to serve: %v", err)
	}
}
