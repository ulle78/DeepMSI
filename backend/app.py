from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
import io
import sys
import os  # Added os import
import logging
import pathlib
from fastai.learner import load_learner
from fastai.vision.core import PILImage
import torch
import numpy as np
import traceback

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

# Global variable for the model
learn = None

def load_model():
    """Load the FastAI model with error handling."""
    global learn
    try:
        # Fix for Windows paths
        if sys.platform == "win32":
            temp = pathlib.PosixPath
            pathlib.PosixPath = pathlib.WindowsPath

        model_path = pathlib.Path('models/export.pkl')
        if not model_path.exists():
            raise FileNotFoundError(f"Model file not found at {model_path}")
            
        learn = load_learner(model_path)
        logger.info("Model loaded successfully!")
        return True
    except Exception as e:
        logger.error(f"Error loading model: {str(e)}")
        logger.error(f"Traceback: {traceback.format_exc()}")
        return False

def process_image(image_bytes):
    """Process image bytes into FastAI compatible format."""
    try:
        # Open and convert image to RGB
        img = Image.open(io.BytesIO(image_bytes)).convert('RGB')
        
        # Convert to numpy array and then to FastAI PILImage
        img_array = np.array(img)
        fastai_img = PILImage.create(img_array)
        
        return fastai_img
    except Exception as e:
        logger.error(f"Error processing image: {str(e)}")
        raise

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint."""
    return jsonify({
        'status': 'healthy',
        'model_loaded': learn is not None
    })

@app.route('/api/predict', methods=['POST'])
def predict():
    """Endpoint for making predictions."""
    # Check if model is loaded
    if learn is None:
        return jsonify({'error': 'Model not loaded'}), 500

    # Validate request
    if 'image' not in request.files:
        return jsonify({'error': 'No image provided'}), 400
    
    try:
        # Get the image from the request
        image_file = request.files['image']
        image_bytes = image_file.read()
        
        # Log image details for debugging
        logger.info(f"Received image: {image_file.filename}, "
                   f"Size: {len(image_bytes)} bytes")
        
        # Process image
        fastai_img = process_image(image_bytes)
        
        # Make prediction
        with torch.no_grad():  # Disable gradient calculation for inference
            pred_class, pred_idx, probs = learn.predict(fastai_img)
        
        # Prepare response
        response = {
            'class': str(pred_class),
            'probability': float(probs[pred_idx]),
            'probabilities': {
                str(learn.dls.vocab[i]): float(prob) 
                for i, prob in enumerate(probs)
            }
        }
        
        logger.info(f"Prediction successful: {response['class']} "
                   f"with probability {response['probability']}")
        
        return jsonify(response)
    
    except Exception as e:
        error_msg = f"Error during prediction: {str(e)}"
        logger.error(error_msg)
        logger.error(f"Traceback: {traceback.format_exc()}")
        return jsonify({
            'error': 'Error making prediction. Please try again',
            'details': str(e) if app.debug else None
        }), 500

if __name__ == '__main__':
    # Load the model
    if not load_model():
        logger.error("Failed to load model. Exiting...")
        sys.exit(1)
    
    # Start the Flask application
    port = int(os.environ.get('PORT', '5000'))
    debug = os.environ.get('FLASK_DEBUG', 'True').lower() == 'true'
    
    logger.info(f"Starting application on port {port}")
    app.run(host='0.0.0.0', port=port, debug=debug)