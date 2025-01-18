# Histopathological Image Classification Web App

A full-stack web application for classifying histopathological images using FastAI and React. This application allows users to upload histopathological images and get MSI-MSS predictions using a pre-trained deep learning model.

## Features

- 🎯 Image classification for MSI-MSS prediction
- 📸 Image upload with preview
- ⚡ Real-time predictions
- 🎨 Modern, responsive UI
- 🔧 FastAI integration
- 🚀 Flask backend API

## Project Structure

```
histopath-classifier/
├── frontend/                   # React frontend application
│   ├── package.json           # NPM dependencies and scripts
│   ├── public/                # Static files
│   └── src/
│       ├── components/        # React components
│       │   └── HistopathClassifier.js
│       └── App.js            # Main React application
├── backend/                   # Flask backend application
│   ├── app.py                # Main Flask application
│   ├── requirements.txt      # Python dependencies
│   └── models/               # Directory for ML models
│       └── export.pkl        # FastAI model file
└── README.md                 # Project documentation
```

## Prerequisites

Before you begin, ensure you have the following installed:
- Python 3.8 or higher
- Node.js 14.x or higher
- npm or yarn
- Git

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/histopath-classifier.git
cd histopath-classifier
```

2. Set up the backend:
```bash
# Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: .\venv\Scripts\activate

# Install dependencies
cd backend
pip install -r requirements.txt
```

3. Set up the frontend:
```bash
cd frontend
npm install
```

4. Add your model:
- Place your FastAI model file (export.pkl) in the `backend/models` directory

## Running the Application

1. Start the backend server:
```bash
cd backend
python app.py
```
The backend server will start at http://localhost:5000

2. In a new terminal, start the frontend:
```bash
cd frontend
npm start
```
The application will open at http://localhost:3000

## API Endpoints

### POST /api/predict
Accepts image uploads and returns predictions

**Request:**
- Method: POST
- Content-Type: multipart/form-data
- Body: Form data with 'image' file

**Response:**
```json
{
    "class": "MSI/MSS",
    "probability": 0.95
}
```

## Technologies Used

### Frontend
- React.js
- Tailwind CSS
- shadcn/ui components
- Axios for API calls

### Backend
- Flask
- FastAI
- PyTorch
- Python Pillow

## Development

### Frontend Development
```bash
cd frontend
npm start
```

### Backend Development
```bash
cd backend
flask run --debug
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Troubleshooting

### Common Issues

1. **Model Loading Error**
   - Ensure your model file is correctly placed in `backend/models/export.pkl`
   - Check if you're using the correct FastAI version

2. **CORS Issues**
   - Make sure both frontend and backend are running
   - Check if the backend URL in the frontend code matches your setup

3. **Dependencies Issues**
   - Clear npm cache: `npm cache clean --force`
   - Remove node_modules and reinstall: `rm -rf node_modules && npm install`

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- FastAI team for the deep learning framework
- React team for the frontend framework
- Contributors and maintainers of all used libraries

## Contact

Your Name - [@yourusername](https://twitter.com/yourusername)
Project Link: [https://github.com/yourusername/histopath-classifier](https://github.com/yourusername/histopath-classifier)