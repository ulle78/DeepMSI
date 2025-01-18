# Frontend Dockerfile (./frontend/Dockerfile)
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies including PDF generation tools
RUN npm install && \
    npm install jspdf date-fns && \
    npm cache clean --force

# Copy the rest of the application
COPY . .

# Expose port 3000
EXPOSE 3000

# Start the application
CMD ["npm", "start"]