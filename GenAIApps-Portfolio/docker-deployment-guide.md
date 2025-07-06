# Docker Deployment Guide for GenAI Apps Portfolio

## Overview
This guide covers the complete Docker setup for the GenAI Apps Portfolio, including both React frontend and Python backend services.

## Prerequisites
- Docker and Docker Compose installed
- AWS credentials configured
- Mistral API key obtained
- PostgreSQL database accessible

## Quick Start

### 1. Environment Configuration
Update the `.env` file with your actual values:
```bash
# AWS Configuration
S3_BUCKET_NAME="your-actual-bucket-name"
AWS_ACCESS_KEY="your-aws-access-key"
AWS_SECRET_KEY="your-aws-secret-key"
AWS_REGION=us-east-1

# Database Configuration
POSTGRES_HOST="your-postgres-host"
POSTGRES_DB="your-database-name"
POSTGRES_USER="your-database-user"
POSTGRES_PASSWORD="your-database-password"

# API Configuration
MISTRAL_API_KEY="your-mistral-api-key"

# Deployment Configuration
EC2_PUBLIC_IP=your-ec2-public-ip
API_BASE_URL=http://your-ec2-public-ip
```

### 2. Build and Deploy
```bash
# Build all services
docker-compose build

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

## Service Architecture

### Services Overview
| Service | Port | Description |
|---------|------|-------------|
| react-frontend | 3000 | React portfolio dashboard |
| streamlit-app1-rag-documind | 8501 | RAG document analysis |
| streamlit-app2-prompteng | 8502 | Prompt engineering tools |
| streamlit-app3-nist-ai-rmf | 8503 | NIST AI framework |
| streamlit-app4-multiagentcrewai | 8504 | Multi-agent collaboration |
| chainlit-app5-conversationalai | 8000 | Conversational AI chat |
| streamlit-app6-interpretexplainai | 8506 | Interpretable AI demos |

### Network Configuration
- All services run on a custom bridge network `genai-network`
- Services can communicate using service names
- Health checks implemented for all Python services

## Development vs Production

### Development Mode
```bash
# Start with hot-reloading for React
docker-compose up react-frontend

# Start specific services
docker-compose up streamlit-app1-rag-documind
```

### Production Mode
```bash
# Start all services in detached mode
docker-compose up -d

# Scale specific services if needed
docker-compose up -d --scale streamlit-app1-rag-documind=2
```

## Troubleshooting

### Common Issues

1. **Port Conflicts**
   ```bash
   # Check what's using the ports
   lsof -i :3000
   lsof -i :8501
   
   # Stop conflicting services
   docker-compose down
   ```

2. **Environment Variables Not Loading**
   ```bash
   # Verify .env file
   cat .env
   
   # Rebuild with no cache
   docker-compose build --no-cache
   ```

3. **Service Health Check Failures**
   ```bash
   # Check service logs
   docker-compose logs streamlit-app1-rag-documind
   
   # Check service status
   docker-compose ps
   ```

4. **React App Not Connecting to Backend**
   - Verify `EC2_PUBLIC_IP` in `.env`
   - Check if backend services are running
   - Verify network connectivity

### Debugging Commands
```bash
# View all running containers
docker ps

# Execute commands in running container
docker-compose exec react-frontend sh
docker-compose exec streamlit-app1-rag-documind bash

# View resource usage
docker stats

# Clean up unused resources
docker system prune -a
```

## Monitoring and Logs

### Log Management
```bash
# View logs for all services
docker-compose logs

# Follow logs for specific service
docker-compose logs -f react-frontend

# View last 100 lines
docker-compose logs --tail=100 streamlit-app1-rag-documind
```

### Health Monitoring
```bash
# Check service health
docker-compose ps

# Restart unhealthy services
docker-compose restart streamlit-app1-rag-documind
```

## Scaling and Performance

### Horizontal Scaling
```bash
# Scale specific services
docker-compose up -d --scale streamlit-app1-rag-documind=3

# Load balance with nginx (additional setup required)
```

### Resource Limits
Add to docker-compose.yml:
```yaml
services:
  streamlit-app1-rag-documind:
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 512M
        reservations:
          cpus: '0.25'
          memory: 256M
```

## Security Considerations

1. **Environment Variables**: Never commit real credentials
2. **Network Security**: Use custom networks for isolation
3. **Container Security**: Run containers as non-root users
4. **Image Security**: Regularly update base images

## Backup and Recovery

### Data Backup
```bash
# Backup volumes
docker run --rm -v genai_data:/data -v $(pwd):/backup alpine tar czf /backup/backup.tar.gz /data

# Restore volumes
docker run --rm -v genai_data:/data -v $(pwd):/backup alpine tar xzf /backup/backup.tar.gz -C /
```

### Configuration Backup
```bash
# Backup configuration
cp .env .env.backup
cp docker-compose.yml docker-compose.yml.backup
```

## Updates and Maintenance

### Updating Services
```bash
# Pull latest images
docker-compose pull

# Rebuild and restart
docker-compose up -d --build

# Remove old images
docker image prune -a
```

### Rolling Updates
```bash
# Update one service at a time
docker-compose up -d --no-deps streamlit-app1-rag-documind
```

This setup provides a robust, scalable, and maintainable deployment solution for your GenAI Apps Portfolio.
