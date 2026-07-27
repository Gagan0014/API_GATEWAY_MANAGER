# GenAI API Gateway - Cloud Deployment Guide

## Overview
This guide covers deploying the Multi-LLM API Gateway on major cloud platforms.

## Architecture
- **Backend**: Node.js/Express
- **Database**: PostgreSQL
- **LLM Providers**: OpenAI, Hugging Face, Cohere
- **Containerization**: Docker
- **Orchestration**: Kubernetes (Optional)

---

## AWS Deployment

### Prerequisites
- AWS Account with EC2/ECS access
- Docker installed
- AWS CLI configured

### Steps

1. **Build Docker Image**
   ```bash
   docker build -t genai-api-gateway:latest .
   ```

2. **Push to ECR**
   ```bash
   aws ecr create-repository --repository-name genai-api-gateway
   aws ecr get-login-password | docker login --username AWS --password-stdin <account>.dkr.ecr.<region>.amazonaws.com
   docker tag genai-api-gateway:latest <account>.dkr.ecr.<region>.amazonaws.com/genai-api-gateway:latest
   docker push <account>.dkr.ecr.<region>.amazonaws.com/genai-api-gateway:latest
   ```

3. **Deploy with ECS/Fargate**
   - Create ECS Cluster
   - Define Task Definition
   - Create Service with Load Balancer
   - Configure RDS PostgreSQL

4. **Environment Variables**
   - Store secrets in AWS Secrets Manager
   - Configure in Task Definition

---

## Azure Deployment

### Prerequisites
- Azure Subscription
- Azure CLI installed
- Container Registry access

### Steps

1. **Create Resource Group**
   ```bash
   az group create --name genai-rg --location eastus
   ```

2. **Create Container Registry**
   ```bash
   az acr create --resource-group genai-rg --name genairegistry --sku Basic
   ```

3. **Build & Push Image**
   ```bash
   az acr build --registry genairegistry --image genai-api-gateway:latest .
   ```

4. **Deploy to App Service**
   ```bash
   az appservice plan create --name genai-plan --resource-group genai-rg --sku B1 --is-linux
   az webapp create --resource-group genai-rg --plan genai-plan --name genai-api --deployment-container-image-name genairegistry.azurecr.io/genai-api-gateway:latest
   ```

---

## Google Cloud Deployment

### Prerequisites
- Google Cloud Project
- Cloud SDK installed
- Cloud Run enabled

### Steps

1. **Build & Push to Artifact Registry**
   ```bash
   gcloud builds submit --tag us-central1-docker.pkg.dev/<project>/genai/api-gateway:latest
   ```

2. **Deploy to Cloud Run**
   ```bash
   gcloud run deploy genai-api-gateway --image us-central1-docker.pkg.dev/<project>/genai/api-gateway:latest --platform managed --region us-central1 --allow-unauthenticated
   ```

3. **Configure Cloud SQL**
   - Create PostgreSQL instance
   - Configure connection settings

---

## IBM Cloud Deployment

### Prerequisites
- IBM Cloud Account
- IBM Cloud CLI installed

### Steps

1. **Create Container Registry Namespace**
   ```bash
   ibmcloud cr namespace-add genai
   ```

2. **Build & Push Image**
   ```bash
   ibmcloud cr build -t us.icr.io/genai/api-gateway:latest .
   ```

3. **Deploy to Kubernetes**
   ```bash
   ibmcloud ks cluster create classic --name genai-cluster --hardware shared --workers 2
   ```

---

## Local Docker Deployment

### Quick Start

```bash
# Build image
docker build -t genai-api-gateway:latest .

# Run with compose
docker-compose up -d

# Access at http://localhost:5000
```

### Docker Compose File
```yaml
version: '3.8'
services:
  api:
    build: .
    ports:
      - "5000:5000"
    environment:
      - DB_HOST=postgres
      - OPENAI_API_KEY=${OPENAI_API_KEY}
    depends_on:
      - postgres
  
  postgres:
    image: postgres:13
    environment:
      POSTGRES_PASSWORD: postgres
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

---

## Scaling & Monitoring

### Auto-Scaling
- Configure based on CPU/Memory usage
- Scale by request count
- Predictive scaling

### Monitoring
- CloudWatch/Azure Monitor/Cloud Monitoring
- Track API response times
- Monitor LLM token usage and costs
- Set up alerts

---

## Security Best Practices

1. **Secrets Management**
   - Never commit API keys
   - Use cloud secret managers
   - Rotate keys regularly

2. **Network Security**
   - Use VPC/VNet
   - Enable SSL/TLS
   - Configure firewalls

3. **Authentication**
   - JWT tokens for API access
   - OAuth2 for third-party integrations
   - Rate limiting

---

## Cost Optimization

1. **LLM Provider Selection**
   - Route simple requests to cheaper providers
   - Use cost-optimized routing
   - Monitor spending

2. **Cloud Resources**
   - Use spot/reserved instances
   - Enable auto-scaling
   - Monitor resource utilization

3. **Caching**
   - Cache common prompts
   - Implement prompt deduplication

---

## Troubleshooting

### Common Issues

1. **API Key Errors**
   - Verify keys in environment
   - Check provider credentials
   - Test connectivity

2. **Database Connection**
   - Verify connection string
   - Check security groups/firewall
   - Test with connection tools

3. **Performance**
   - Monitor response times
   - Check provider latency
   - Optimize database queries
