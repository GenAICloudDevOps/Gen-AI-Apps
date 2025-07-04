FROM python:3.11-slim

WORKDIR /app

# Copy requirements first for better caching
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Expose port (Gradio default is 7860)
EXPOSE 7860

# Run Gradio app
CMD ["python", "gradio_app.py"]
