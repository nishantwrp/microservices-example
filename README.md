## microservices-example
### Docker Images
#### frontend
- `cd frontend`
- `docker build -t todo-app-frontend:v1 .`

#### auth-service
- `cd auth-service`
- `docker build -t todo-app-auth-service:v1 .`

#### auth-service
- `cd todo-service`
- `docker build -t todo-app-todo-service:v1 .`

### Kubernetes Manifests
**NOTE** - Make sure a namespace called `todo-app` is present on your cluster. Databases mainfests should be applied before services.
