# Histopathological Image Classification Web App

A full-stack web application for classifying histopathological images to detect Microsatellite Instability (MSIMUT) and Microsatellite Stable (MSS) conditions using FastAI and React.

## Features

- 🎯 Image classification for MSIMUT/MSS prediction
- 📸 Real-time image preview and analysis
- 📄 PDF report generation with patient details
- 🎨 Modern, responsive UI with Tailwind CSS
- 🔧 FastAI deep learning model integration
- 🚀 Flask backend API
- 🐳 Docker containerization

## Project Structure

```
project-root/
├── backend/                  # Flask backend application
│   ├── models/              # Directory for ML models
│   │   └── export.pkl       # FastAI model file
│   ├── node_modules/        # Node.js dependencies
│   ├── app.py              # Main Flask application
│   ├── Dockerfile          # Backend Docker configuration
│   └── requirements.txt    # Python dependencies
├── frontend/               # React frontend application
│   ├── build/             # Production build
│   ├── node_modules/      # Node.js dependencies
│   ├── public/            # Static files
│   │   ├── index.html     # Main HTML file
│   │   └── manifest.json  # Web app manifest
│   ├── src/              # Source code
│   │   ├── components/   # React components
│   │   │   ├── modals/  # Modal components
│   │   │   │   ├── reportModal.js
│   │   │   │   └── ui/  # UI components
│   │   │   ├── HistopathClassifier.js
│   │   │   ├── PatientDetailsModal.js
│   │   │   └── Test.js
│   │   ├── services/    # Service layer
│   │   │   └── reportService.js
│   │   ├── App.js      # Main React component
│   │   ├── index.css   # Global styles
│   │   └── index.js    # Entry point
│   ├── Dockerfile      # Frontend Docker configuration
│   ├── package.json    # NPM dependencies and scripts
│   ├── postcss.config.js
│   └── tailwind.config.js
├── docker-compose.yml   # Docker Compose configuration
└── README.md          # Project documentation
```

## Prerequisites

Before you begin, ensure you have installed:
- Docker and Docker Compose
- Node.js (v14 or higher) and npm
- Python 3.8 or higher
- Git

## Setting Up the Project

1. Clone the repository:
```bash
git clone <https://github.com/ulle78/DeepMSI.git>
cd DeepMSI
```

2. Create necessary directories and files:

```bash
# Create project structure
mkdir -p backend/models frontend/src/{components/{modals,ui},services}

# Create backend files
touch backend/{app.py,requirements.txt,Dockerfile}

# Create frontend files
touch frontend/src/components/{HistopathClassifier.js,PatientDetailsModal.js,Test.js}
touch frontend/src/components/modals/reportModal.js
touch frontend/src/services/reportService.js
touch frontend/{postcss.config.js,tailwind.config.js}
```

3. Configure the backend:

Create `backend/requirements.txt`:
```
flask
fastai
torch
pillow
flask-cors
```

4. Configure the frontend:

Initialize a new React project:
```bash
cd frontend
npx create-react-app .
```

Install required dependencies:
```bash
npm install tailwindcss postcss autoprefixer lucide-react jspdf html2canvas
```

Configure Tailwind CSS:
```bash
npx tailwindcss init -p
```

5. Place your FastAI model:
- Put your trained model file (`export.pkl`) in the `backend/models` directory

## Docker Setup

1. Create Docker configuration files:

Create `backend/Dockerfile`:
```dockerfile
FROM python:3.8-slim

WORKDIR /app

RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .
RUN mkdir -p models

EXPOSE 5000

CMD ["python", "app.py"]
```

Create `frontend/Dockerfile`:
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

Create `docker-compose.yml`:
```yaml
version: '3.8'

services:
  frontend:
    build: 
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - REACT_APP_API_URL=http://localhost:5000
    volumes:
      - ./frontend:/app
      - /app/node_modules
    depends_on:
      - backend
    networks:
      - histopath-network

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "5000:5000"
    volumes:
      - ./backend:/app
      - ./backend/models:/app/models
    environment:
      - FLASK_ENV=development
      - FLASK_APP=app.py
    networks:
      - histopath-network

networks:
  histopath-network:
    driver: bridge
```

## Running the Application

### Using Docker (Recommended)

1. Build and start the containers:
```bash
docker-compose up --build
```

2. Access the application:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

To stop the application:
```bash
docker-compose down
```

### Without Docker (Development)

1. Start the backend:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: .\venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

2. Start the frontend:
```bash
cd frontend
npm install
npm start
```

## Usage

1. Open the application in your browser
2. Upload a histopathological image
3. Click "Analyze" to get the prediction
4. Fill in patient details when prompted
5. View and download the PDF report

## Development

### Frontend Development
- Components are in `frontend/src/components`
- Modal components are in `frontend/src/components/modals`
- Styling uses Tailwind CSS
- PDF generation uses jsPDF and html2canvas

### Backend Development
- Main Flask application is in `backend/app.py`
- FastAI model is loaded from `backend/models/export.pkl`
- API endpoints handle image upload and prediction

## Troubleshooting

Common issues and solutions:

1. Docker container not starting:
```bash
# Check logs
docker-compose logs

# Rebuild containers
docker-compose up --build
```

2. Frontend can't connect to backend:
- Verify backend is running on port 5000
- Check CORS configuration in backend
- Verify API URL in frontend environment

3. Model not loading:
- Ensure `export.pkl` is in `backend/models`
- Check model compatibility with FastAI version

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License

## Acknowledgments

- FastAI for the deep learning framework
- React and Tailwind CSS for frontend development
- Flask for backend API
- All contributors and maintainers