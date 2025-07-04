FROM python:3.11-slim

WORKDIR /app

# Copy requirements and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Make the MCP server executable
RUN chmod +x mcp_compliant_server.py
RUN chmod +x hybrid_main.py

# Default to web mode, but can be overridden
CMD ["python", "hybrid_main.py"]
