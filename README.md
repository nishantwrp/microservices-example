## microservices-example
### Docker Images
#### frontend
- `cd frontend`
- `docker build -t todo-app-frontend:v1 .`

### Kubernetes Manifests
**NOTE** - Make sure a namespace called `todo-app` is present on your cluster.

#### frontend
- `cd kubernetes`
- `kubectl apply -f frontend.yaml`
