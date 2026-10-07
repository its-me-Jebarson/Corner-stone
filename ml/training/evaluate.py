"""
TruthLense AI - Model Evaluation Script
Evaluates the saved model against the unseen test dataset.
"""

import os
import sys
import json
import torch
import torch.nn as nn
from torchvision import datasets, transforms, models
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATASET_DIR = os.path.join(BASE_DIR, 'dataset')
MODELS_DIR = os.path.join(BASE_DIR, 'models')
MODEL_PATH = os.path.join(MODELS_DIR, 'deepfake_detector.pt')

DEVICE = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

def load_eval_model():
    if not os.path.exists(MODEL_PATH):
        print(f"Error: Trained model not found at {MODEL_PATH}")
        print("Please train the model first by running: python ml/training/train.py")
        sys.exit(1)

    checkpoint = torch.load(MODEL_PATH, map_location=DEVICE)
    
    # Rebuild ResNet18 with binary head
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
    return model, checkpoint.get('classes', ['real', 'fake'])

def run_evaluation():
    test_dir = os.path.join(DATASET_DIR, 'test')
    if not os.path.exists(test_dir):
        print(f"Error: Test dataset directory not found at {test_dir}")
        sys.exit(1)

    eval_transform = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406],
                             std=[0.229, 0.224, 0.225])
    ])

    test_dataset = datasets.ImageFolder(test_dir, transform=eval_transform)
    test_loader = torch.utils.data.DataLoader(test_dataset, batch_size=16, shuffle=False)

    model, classes = load_eval_model()
    print(f"Evaluating model on {len(test_dataset)} test specimens across classes: {test_dataset.class_to_idx}...")

    all_preds = []
    all_labels = []

    with torch.no_grad():
        for inputs, labels in test_loader:
            inputs = inputs.to(DEVICE)
            outputs = model(inputs)
            _, preds = torch.max(outputs, 1)
            all_preds.extend(preds.cpu().numpy().tolist())
            all_labels.extend(labels.numpy().tolist())

    acc = accuracy_score(all_labels, all_preds) * 100
    prec = precision_score(all_labels, all_preds, pos_label=1, zero_division=0) * 100
    rec = recall_score(all_labels, all_preds, pos_label=1, zero_division=0) * 100
    f1 = f1_score(all_labels, all_preds, pos_label=1, zero_division=0) * 100
    cm = confusion_matrix(all_labels, all_preds)

    print("\n" + "=" * 25)
    print("Model Evaluation")
    print(f"Accuracy : {acc:.1f}%")
    print(f"Precision: {prec:.1f}%")
    print(f"Recall   : {rec:.1f}%")
    print(f"F1 Score : {f1:.1f}%")
    print("=" * 25)
    print("\nConfusion Matrix (Rows=True, Columns=Predicted):")
    print(f"               Pred REAL   Pred FAKE")
    print(f"  True REAL   {cm[0][0]:>9d}  {cm[0][1]:>10d}")
    print(f"  True FAKE   {cm[1][0]:>9d}  {cm[1][1]:>10d}")

if __name__ == '__main__':
    run_evaluation()
