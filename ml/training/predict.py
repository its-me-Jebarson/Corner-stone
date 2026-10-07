"""
TruthLense AI - Standalone Image Deepfake Inference CLI
Usage:
    python training/predict.py path/to/image.jpg
"""

import os
import sys
import torch
import torch.nn as nn
from PIL import Image
from torchvision import transforms, models

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODELS_DIR = os.path.join(BASE_DIR, 'models')
MODEL_PATH = os.path.join(MODELS_DIR, 'deepfake_detector.pt')

DEVICE = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

def load_predictor():
    if not os.path.exists(MODEL_PATH):
        raise FileNotFoundError(f"Model file not found at {MODEL_PATH}. Train first using: python ml/training/train.py")

    checkpoint = torch.load(MODEL_PATH, map_location=DEVICE)
    model = models.resnet18()
    in_features = model.fc.in_features
    model.fc = nn.Sequential(
        nn.Linear(in_features, 128),
        nn.ReLU(),
        nn.Dropout(0.35),
        nn.Linear(128, 2)
    )

    model.load_state_dict(checkpoint['state_dict'])
    model.to(DEVICE)
    model.eval()
    return model, checkpoint.get('class_to_idx', {'real': 0, 'fake': 1})

def predict_image(image_path: str):
    if not os.path.exists(image_path):
        print(f"Error: Specified image file does not exist: {image_path}")
        sys.exit(1)

    try:
        img = Image.open(image_path).convert('RGB')
    except Exception as e:
        print(f"Error: Unable to open image file: {e}")
        sys.exit(1)

    eval_transform = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406],
                             std=[0.229, 0.224, 0.225])
    ])

    tensor = eval_transform(img).unsqueeze(0).to(DEVICE)
    model, class_to_idx = load_predictor()

    with torch.no_grad():
        outputs = model(tensor)
        probs = torch.softmax(outputs, dim=1)[0].cpu().numpy()

    # Map class 0 (REAL) and class 1 (FAKE)
    real_idx = class_to_idx.get('real', 0)
    fake_idx = class_to_idx.get('fake', 1)

    real_prob = float(probs[real_idx])
    fake_prob = float(probs[fake_idx])

    if fake_prob >= 0.5:
        prediction = "LIKELY_FAKE"
        confidence = fake_prob * 100
    else:
        prediction = "LIKELY_REAL"
        confidence = real_prob * 100

    print("=" * 45)
    print("TruthLense AI — Deepfake Model Prediction")
    print(f"File: {os.path.basename(image_path)}")
    print(f"Prediction       : {prediction}")
    print(f"Confidence       : {confidence:.1f}%")
    print(f"Real Probability : {real_prob * 100:.1f}% ({real_prob:.4f})")
    print(f"Fake Probability : {fake_prob * 100:.1f}% ({fake_prob:.4f})")
    print("=" * 45)

    return {
        'prediction': prediction,
        'real_probability': round(real_prob, 4),
        'fake_probability': round(fake_prob, 4),
        'confidence': round(confidence, 1)
    }

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("Usage: python training/predict.py <path_to_image>")
        sys.exit(1)
    predict_image(sys.argv[1])
