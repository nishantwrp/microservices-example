.PHONY: compile-protos

protoc_binary = ${PROTOC_BINARY}
ifndef PROTOC_BINARY
    protoc_binary = protoc
endif


compile-protos:
	$(protoc_binary) -I=. --python_out=./api-service ./protobuf/auth.proto
