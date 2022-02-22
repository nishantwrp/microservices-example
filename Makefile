.PHONY: compile-protos

protoc_binary = ${PROTOC_BINARY}
ifndef PROTOC_BINARY
    protoc_binary = protoc
endif


compile-protos:
	python -m grpc_tools.protoc -I=. --python_out=./api-service --grpc_python_out=./api-service ./protobuf/auth.proto ./protobuf/todo.proto && \
	$(protoc_binary) -I=. --go_out=./auth-service --go_opt=paths=source_relative --go-grpc_out=./auth-service --go-grpc_opt=paths=source_relative ./protobuf/auth.proto && \
	mkdir -p todo-service/protobuf && cp protobuf/todo.proto todo-service/protobuf/todo.proto
