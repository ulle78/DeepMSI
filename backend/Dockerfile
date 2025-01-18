# Backend Dockerfile (./backend/Dockerfile)
FROM python:3.9-slim

WORKDIR /app

# Install system dependencies and create models directory
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/* \
    && mkdir -p /app/models

# Copy requirements file
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application
COPY . .

# Create a non-root user
RUN useradd -m appuser && \
    chown -R appuser:appuser /app && \
    chmod -R 755 /app

# Switch to non-root user
USER appuser

# Expose port 5000
EXPOSE 5000

# The command is specified in docker-compose.yml