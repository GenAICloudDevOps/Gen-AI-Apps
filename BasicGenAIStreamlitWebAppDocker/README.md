# Mistral API Streamlit Web App (Dockerized)
This Streamlit application leverages the Mistral API for AI-powered responses. Users can input prompts and receive AI-generated text. This version is containerized using Docker for easy deployment.

## Prerequisites
- **Docker**: Ensure you have Docker installed on your system.
- **Mistral API**:  This application uses the Mistral API. To utilize this application, you must possess a Mistral API key. Update the models you would like to use. Please be aware of the associated costs before using or deploying any services.

## Installation and run
To install and run this application, follow the steps below:

1. Clone this repository

2. Open a terminal and navigate to the project directory. 

3. Run the following command to build the Docker image:
  `docker-compose build`
  
4. Start the container with the following command:
  `docker-compose up -d`  
 
  This will build the image (if not already built) and start the container.

## Access the streamlit web app at one of the following addresses depending upon where you have built this:
- **Localhost**: http://localhost:8501
- **Your IP Address**:  http://your_ip_address:8501
- **Domain Name**: http://your_domain_name:port

## Functionality
- Select a model from the dropdown (optional, if models are available)
- Enter a prompt in the text area.
- Click "Submit" to receive the AI-generated response.

## Security Considerations
Be mindful of potential costs associated with the Mistral API before deploying. Remember to follow security best practices for containerized applications in production environments.

## Optional: Environment Variables
For development, you can create a .env file with your Mistral API credentials. However, for production deployments, consider using Docker secrets.

### The webpage will appear as shown below. 
![Gen AI using Mistral API](1.jpg)


  