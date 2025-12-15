FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements
COPY REQUIREMENTS.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r REQUIREMENTS.txt

# Copy application code
COPY . .

# Expose port (Cloud Run uses PORT environment variable, defaults to 8080)
EXPOSE 8080

# Run the application
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8080"]