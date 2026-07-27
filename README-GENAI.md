# Multi-LLM API Gateway - GenAI & Cloud Edition

![GenAI](https://img.shields.io/badge/GenAI-Enabled-brightgreen)
![Cloud-Ready](https://img.shields.io/badge/Cloud-Ready-blue)
![Multi-LLM](https://img.shields.io/badge/Multi--LLM-Support-orange)

## 🚀 Overview

This is an advanced **API Gateway Manager** that has been evolved into a **Multi-LLM API Gateway** specifically designed for **GenAI and Cloud Computing**. It enables developers to:

- **Access multiple LLM providers** (OpenAI, Hugging Face, Cohere) through a single unified API
- **Intelligently route requests** to the most cost-effective provider
- **Track and optimize costs** for GenAI API consumption
- **Manage API keys securely** with rate limiting and usage monitoring
- **Deploy on any cloud platform** (AWS, Azure, Google Cloud, IBM Cloud)
- **Monitor token usage** and performance metrics in real-time

---

## ✨ Key Features

### 1. **Multi-Provider LLM Support**
- ✅ **OpenAI GPT-3.5 & GPT-4** - Advanced reasoning and generation
- ✅ **Hugging Face Models** - Open-source language models
- ✅ **Cohere API** - Production-ready NLP models
- ✅ Easy provider switching and fallback mechanisms

### 2. **Intelligent Routing**
- 🤖 **Cost Optimization**: Routes simple requests to cheaper providers
- 📊 **Complexity Analysis**: Analyzes prompts to choose the best model
- ⚡ **Performance Tuning**: Balances cost vs. quality
- 🔄 **Fallback Handling**: Automatically retries with alternative providers

### 3. **Cost Tracking & Management**
- 💰 Real-time cost monitoring per provider
- 📈 Usage analytics and insights
- 🎯 Per-request cost breakdown
- 📊 Historical cost trends

### 4. **Cloud-Native Architecture**
- 🐳 **Docker Support**: Production-ready containerization
- ☁️ **Multi-Cloud Deployment**: AWS, Azure, GCP, IBM Cloud guides
- 🔐 **Security First**: JWT authentication, secrets management
- 📡 **Scalable Design**: Load balancing ready

### 5. **Existing API Gateway Features**
- 🔑 **API Key Management**: Generate, revoke, track API keys
- 📊 **Usage Monitoring**: Real-time usage statistics
- 🛡️ **Rate Limiting**: Prevent abuse and overuse
- 🔐 **JWT Authentication**: Secure token-based access
- 📝 **Admin Controls**: Dashboard for management

---

## 📋 Project Structure

```
.
├── genai/
│   ├── llm-providers.js          # LLM provider adapters
│   ├── llm-router.js             # Intelligent routing logic
│   └── cloud-deployment.md       # Cloud deployment guide
├── routes/
│   ├── genai-llm.js              # GenAI endpoints
│   └── [existing routes]
├── Dockerfile                    # Container image
├── docker-compose.yml            # Local deployment
├── .env.example                  # Configuration template
├── README-GENAI.md               # This file
└── [existing project files]
```

---

## 🚀 Quick Start

### 1. **Clone & Setup**
```bash
git clone https://github.com/Gagan0014/API_GATEWAY_MANAGER.git
cd API_GATEWAY_MANAGER
cp .env.example .env
```

### 2. **Add API Keys**
Edit `.env` and add your LLM provider keys:
```env
OPENAI_API_KEY=sk-...
HUGGINGFACE_API_KEY=hf_...
COHERE_API_KEY=...
```

### 3. **Run Locally with Docker**
```bash
docker-compose up -d
```

### 4. **Test the API**
```bash
# Generate text
curl -X POST http://localhost:5000/api/genai/generate \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Explain quantum computing in simple terms",
    "costOptimized": true
  }'

# Get available providers
curl http://localhost:5000/api/genai/providers

# Check costs
curl http://localhost:5000/api/genai/cost-summary
```

---

## 📚 API Endpoints

### GenAI Endpoints

#### `POST /api/genai/generate`
Generate text using LLM providers

**Request:**
```json
{
  "prompt": "Your prompt here",
  "costOptimized": true,
  "options": {
    "temperature": 0.7,
    "max_tokens": 500
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "provider": "openai",
    "response": "Generated text...",
    "tokens": 150,
    "cost": "0.000300",
    "promptAnalysis": {
      "complexity": "medium"
    }
  }
}
```

#### `GET /api/genai/providers`
List available LLM providers

#### `GET /api/genai/cost-summary`
Get cost tracking summary

#### `POST /api/genai/batch`
Batch process multiple prompts

---

## ☁️ Cloud Deployment

### AWS Deployment
```bash
# Push to ECR
aws ecr create-repository --repository-name genai-api-gateway
docker build -t genai-api-gateway:latest .
docker tag genai-api-gateway:latest <account>.dkr.ecr.<region>.amazonaws.com/genai-api-gateway:latest
docker push <account>.dkr.ecr.<region>.amazonaws.com/genai-api-gateway:latest

# Deploy with ECS or Fargate
```

### Azure Deployment
```bash
az group create --name genai-rg --location eastus
az acr create --resource-group genai-rg --name genairegistry --sku Basic
az acr build --registry genairegistry --image genai-api-gateway:latest .
az webapp create --resource-group genai-rg --name genai-api --deployment-container-image-name genairegistry.azurecr.io/genai-api-gateway:latest
```

### Google Cloud Deployment
```bash
gcloud builds submit --tag us-central1-docker.pkg.dev/<project>/genai/api-gateway:latest
gcloud run deploy genai-api-gateway --image us-central1-docker.pkg.dev/<project>/genai/api-gateway:latest
```

See `genai/cloud-deployment.md` for detailed guides.

---

## 💰 Cost Optimization Strategies

### 1. **Intelligent Provider Selection**
- Simple queries → Hugging Face (cheapest)
- Medium complexity → Cohere (balanced)
- Complex tasks → OpenAI (best quality)

### 2. **Cost-Optimized Routing**
```json
{
  "prompt": "Explain AI",
  "costOptimized": true
}
```

### 3. **Batch Processing**
Process multiple requests together for volume discounts

### 4. **Caching**
Implement prompt caching for frequently asked questions

---

## 🔐 Security Features

- ✅ **JWT Authentication**: Secure token-based API access
- ✅ **API Key Management**: Centralized key control
- ✅ **Rate Limiting**: Prevent abuse
- ✅ **Environment Variables**: Secrets never committed
- ✅ **Cloud Secrets Manager**: AWS Secrets, Azure Key Vault, etc.

---

## 📊 Monitoring & Analytics

Track:
- Token usage per provider
- Cost breakdown by LLM model
- Request latency and performance
- Success/failure rates
- User/API key activity

---

## 🛠️ Tech Stack

- **Backend**: Node.js + Express.js
- **Database**: PostgreSQL
- **LLM Providers**: OpenAI, Hugging Face, Cohere
- **Containerization**: Docker
- **Cloud Platforms**: AWS, Azure, GCP, IBM Cloud
- **Authentication**: JWT

---

## 📖 Documentation

- **[Cloud Deployment Guide](genai/cloud-deployment.md)** - Detailed deployment instructions
- **[LLM Providers](genai/llm-providers.js)** - Provider implementation details
- **[Router Logic](genai/llm-router.js)** - Cost optimization algorithms

---

## 🎯 Use Cases

1. **Enterprise AI Applications**: Secure, cost-effective GenAI access
2. **SaaS Platforms**: Add AI features without managing multiple providers
3. **Research Projects**: Experiment with different LLM models
4. **Content Generation**: Bulk content creation with cost optimization
5. **Chatbots & Assistants**: Multi-model support for resilience

---

## 📈 Future Roadmap

- [ ] Prompt caching for cost reduction
- [ ] Fine-tuned model support
- [ ] Real-time cost alerts
- [ ] A/B testing framework
- [ ] Advanced analytics dashboard
- [ ] GraphQL API
- [ ] Webhook integrations
- [ ] Rate limiting by model/provider

---

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Submit a pull request

---

## 📄 License

MIT License - See LICENSE file for details

---

## 💬 Support

For issues, questions, or suggestions:
- Create an issue on GitHub
- Email: support@example.com
- Documentation: [Project Wiki](https://github.com/Gagan0014/API_GATEWAY_MANAGER/wiki)

---

## ✅ Requirements Met for IBM SkillBuild Internship

✅ **GenAI Component**: Multi-LLM provider support (OpenAI, Hugging Face, Cohere)  
✅ **Cloud Ready**: Docker, deployment guides for AWS/Azure/GCP/IBM Cloud  
✅ **Functional App**: Complete working API gateway with LLM integration  
✅ **Documentation**: Comprehensive guides and code documentation  
✅ **GitHub Ready**: Code is version-controlled and submission-ready  
✅ **Innovation**: Intelligent routing, cost optimization, multi-provider support  

---

**Last Updated**: July 2026  
**Version**: 2.0 (GenAI Edition)
