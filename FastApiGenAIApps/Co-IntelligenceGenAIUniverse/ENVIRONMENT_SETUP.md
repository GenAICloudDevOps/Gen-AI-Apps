# 🔧 Environment Setup Guide

This guide explains how to configure your environment variables for the Co-Intelligence GenAI Universe platform.

## 📋 Environment Files Overview

The platform includes several environment configuration files:

- **`.env`** - Main environment file (currently has placeholder values)
- **`.env.local`** - Template for local development
- **`.env.cloud`** - Template for cloud/EC2 deployment
- **`.env.example`** - Reference template

## 🔑 Setting Up AWS Credentials

### Step 1: Get Your AWS Credentials
1. Log into your AWS Console
2. Go to IAM → Users → Your User → Security Credentials
3. Create an Access Key if you don't have one
4. Copy your `Access Key ID` and `Secret Access Key`

### Step 2: Update Environment Files

#### For Local Development:
```bash
# Copy the local template
cp .env.local .env

# Edit the .env file
nano .env

# Replace these lines with your actual credentials:
AWS_ACCESS_KEY_ID=your_actual_access_key_here
AWS_SECRET_ACCESS_KEY=your_actual_secret_key_here
```

#### For Cloud/EC2 Deployment:
```bash
# Copy the cloud template
cp .env.cloud .env

# Edit the .env file
nano .env

# Replace these values:
AWS_ACCESS_KEY_ID=your_actual_access_key_here
AWS_SECRET_ACCESS_KEY=your_actual_secret_key_here
PUBLIC_IP=your_ec2_public_ip_here
```

## 🌍 Environment Variables Explained

### Deployment Configuration
- `DEPLOYMENT_ENV` - Set to `local` or `cloud`
- `HOST_IP` - `localhost` for local, `0.0.0.0` for cloud
- `PUBLIC_IP` - Your EC2 public IP for cloud deployment

### AWS Configuration
- `AWS_DEFAULT_REGION` - AWS region (default: us-east-1)
- `AWS_ACCESS_KEY_ID` - Your AWS access key
- `AWS_SECRET_ACCESS_KEY` - Your AWS secret key
- `BEDROCK_PRIMARY_MODEL` - AI model to use

### Application URLs
These are automatically configured based on your environment:
- `REACT_APP_API_URL` - Frontend API endpoint
- `REACT_APP_AI_CHAT_URL` - AI Chat app URL
- `REACT_APP_DOCUMENT_ANALYSIS_URL` - Document analysis app URL
- `REACT_APP_WEB_SEARCH_URL` - Web search app URL

## 🚀 Quick Setup Commands

### Local Development:
```bash
# Setup for local development
cp .env.local .env
# Edit .env with your AWS credentials
./scripts/deploy.sh
```

### Cloud Deployment:
```bash
# Setup for cloud deployment
cp .env.cloud .env
# Edit .env with your AWS credentials and EC2 public IP
./scripts/deploy.sh
```

## ⚠️ Security Notes

1. **Never commit real credentials** to version control
2. The `.env` files in this repository contain **placeholder values only**
3. Always update with your actual credentials locally
4. Use IAM roles on EC2 when possible instead of access keys
5. Regularly rotate your AWS access keys

## 🔍 Troubleshooting

### AWS Credentials Issues:
```bash
# Test your credentials
aws sts get-caller-identity

# Check if credentials are loaded in container
docker-compose exec backend env | grep AWS
```

### Environment Detection Issues:
```bash
# Check current environment detection
curl http://localhost:8000/api/v1/config

# Force specific environment
export DEPLOYMENT_ENV=local
./scripts/deploy.sh
```

### URL Configuration Issues:
```bash
# Verify app URLs
curl http://localhost:8000/api/v1/apps

# Test individual services
curl http://localhost:8000/health
curl http://localhost:8501/_stcore/health
```

## 📚 Additional Resources

- [AWS Bedrock Documentation](https://docs.aws.amazon.com/bedrock/)
- [AWS IAM Best Practices](https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html)
- [Docker Compose Environment Variables](https://docs.docker.com/compose/environment-variables/)

## 🆘 Need Help?

If you encounter issues:
1. Run `./scripts/validate-setup.sh` to check your configuration
2. Run `./scripts/test-system.sh` to test all services
3. Check the logs with `docker-compose logs -f`
4. Refer to the main README.md for troubleshooting steps
