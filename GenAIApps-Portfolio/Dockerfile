# Use the official Python image from the Docker Hub
FROM python:3.9-slim

# Set the working directory
WORKDIR /app

# Copy the requirements.txt and .env files
COPY requirements.txt .
COPY .env .

# Upgrade pip to the latest version
#RUN pip install --upgrade pip

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code
COPY *.py .

# Expose the necessary ports
EXPOSE 8000 8501 8502 8503 8504 8506
