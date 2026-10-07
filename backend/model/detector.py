"""
TruthLense AI - Deepfake Detector Model Loader & Inference Engine
Architecture: ResNet-18 Transfer Learning with Fine-Tuned Forensic Head
"""

import os
import json
import torch
import torch.nn as nn
from PIL import Image
from torchvision import transforms, models

# Look for model in known directory paths
POSSIBLE_MODEL_PATHS = [
    os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'ml', 'models', 'deepfake_detector.pt')),
    os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'ml', 'models', 'deepfake_detector.pt')),
    os.path.abspath(os.path.join(os.path.dirname(__file__), 'deepfake_detector.pt')),
    os.path.abspath(os.path.join('ml', 'models', 'deepfake_detector.pt'))
]

POSSIBLE_METRICS_PATHS = [
    os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'ml', 'models', 'model_metrics.json')),
    os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'ml', 'models', 'model_metrics.json')),
    os.path.abspath(os.path.join('ml', 'models', 'model_metrics.json'))
]

DEVICE = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

class DeepfakeDetector:
    def __init__(self):
        self.model = None
        self.classes = ['real', 'fake']
        self.class_to_idx = {'fake': 0, 'real': 1}
        self.is_loaded = False
        self.model_path = None
        self.metrics = None
        self.transform = transforms.Compose([
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406],
                                 std=[0.229, 0.224, 0.225])
        ])

        self.load_model()
        self.load_metrics()

    def find_model_path(self):
        for path in POSSIBLE_MODEL_PATHS:
            if os.path.exists(path):
                return path
        return None

    def load_metrics(self):
        for path in POSSIBLE_METRICS_PATHS:
            if os.path.exists(path):
                try:
                    with open(path, 'r') as f:
                        self.metrics = json.load(f)
                    return
                except Exception as e:
                    print(f"Failed to read metrics: {e}")
        self.metrics = None

    def load_model(self):
        path = self.find_model_path()
        if not path:
            print("[TruthLense ML] Model checkpoint not found. Model status: NOT_LOADED")
            self.is_loaded = False
            return

        try:
            print(f"[TruthLense ML] Loading model from {path} on device {DEVICE}...")
            checkpoint = torch.load(path, map_location=DEVICE)

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

            self.model = model
            self.model_path = path
            self.class_to_idx = checkpoint.get('class_to_idx', {'fake': 0, 'real': 1})
            self.classes = checkpoint.get('classes', ['fake', 'real'])
            self.is_loaded = True
            print("[TruthLense ML] Deepfake Detector successfully loaded and ready for inference!")
        except Exception as e:
            print(f"[TruthLense ML] Error loading model: {e}")
            self.is_loaded = False

    def predict(self, image: Image.Image):
        if not self.is_loaded or self.model is None:
            raise RuntimeError("AI model is not available. Please train the model first by running 'python ml/training/train.py'.")

        rgb_image = image.convert('RGB')
        tensor = self.transform(rgb_image).unsqueeze(0).to(DEVICE)

        with torch.no_grad():
            outputs = self.model(tensor)
            probs = torch.softmax(outputs, dim=1)[0].cpu().numpy()

        real_idx = self.class_to_idx.get('real', 1)
        fake_idx = self.class_to_idx.get('fake', 0)

        raw_real_prob = float(probs[real_idx])
        raw_fake_prob = float(probs[fake_idx])

        # Enforce scientific calibration: prevent 0.00% or 100.00% absolute certainty
        clamped_fake = min(max(raw_fake_prob, 0.001), 0.999)
        clamped_real = min(max(raw_real_prob, 0.001), 0.999)

        if clamped_fake >= 0.5:
            prediction = "LIKELY_FAKE"
            confidence = round(clamped_fake * 100, 1)
        else:
            prediction = "LIKELY_REAL"
            confidence = round(clamped_real * 100, 1)

        # Re-normalize to sum exactly to 1.0 for reporting
        total_p = clamped_real + clamped_fake
        final_real_prob = round(clamped_real / total_p, 4)
        final_fake_prob = round(clamped_fake / total_p, 4)

        return {
            "prediction": prediction,
            "real_probability": final_real_prob,
            "fake_probability": final_fake_prob,
            "confidence": confidence,
            "raw_scores": {
                "real": float(raw_real_prob),
                "fake": float(raw_fake_prob)
            }
        }

# Global singleton instance
detector = DeepfakeDetector()
