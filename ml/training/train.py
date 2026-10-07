"""
TruthLense AI - Deepfake Image Detection Training Pipeline
Architecture: ResNet-18 Transfer Learning with Binary Forensic Classification Head
Classes: 0 -> REAL, 1 -> FAKE
"""

import os
import sys
import json
import time
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader
from torchvision import datasets, transforms, models
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATASET_DIR = os.path.join(BASE_DIR, 'dataset')
MODELS_DIR = os.path.join(BASE_DIR, 'models')
os.makedirs(MODELS_DIR, exist_ok=True)

MODEL_SAVE_PATH = os.path.join(MODELS_DIR, 'deepfake_detector.pt')
METRICS_SAVE_PATH = os.path.join(MODELS_DIR, 'model_metrics.json')

# Device configuration (GPU if available, otherwise CPU)
DEVICE = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

def get_transforms():
    """Returns data augmentation transforms for training and standard normalization for val/test."""
    train_transform = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.RandomHorizontalFlip(p=0.5),
        transforms.RandomRotation(degrees=10),
        transforms.ColorJitter(brightness=0.1, contrast=0.1),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406],
                             std=[0.229, 0.224, 0.225])
    ])

    eval_transform = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406],
                             std=[0.229, 0.224, 0.225])
    ])

    return train_transform, eval_transform

def build_model(pretrained=True):
    """Loads ResNet-18 transfer-learning architecture with customized binary classification head."""
    if pretrained:
        weights = models.ResNet18_Weights.DEFAULT
        model = models.resnet18(weights=weights)
    else:
        model = models.resnet18()

    # Freeze early convolutional feature extractors
    for param in model.parameters():
        param.requires_grad = False

    # Unfreeze layer4 for fine-tuning higher-level boundary/artifact representations
    for param in model.layer4.parameters():
        param.requires_grad = True

    # Custom binary forensic classification head
    in_features = model.fc.in_features
    model.fc = nn.Sequential(
        nn.Linear(in_features, 128),
        nn.ReLU(),
        nn.Dropout(0.35),
        nn.Linear(128, 2)
    )

    return model.to(DEVICE)

def train_model(epochs=12, batch_size=16, lr=1e-3):
    print("=" * 60)
    print("TruthLense AI — Deepfake Classifier Training Pipeline")
    print(f"Device: {DEVICE}")
    print("=" * 60)

    train_tf, eval_tf = get_transforms()

    train_dir = os.path.join(DATASET_DIR, 'train')
    val_dir = os.path.join(DATASET_DIR, 'validation')
    test_dir = os.path.join(DATASET_DIR, 'test')

    if not os.path.exists(train_dir) or not os.path.exists(val_dir) or not os.path.exists(test_dir):
        print(f"Error: Dataset directories not found in {DATASET_DIR}. Please run build_dataset.py first.")
        sys.exit(1)

    train_dataset = datasets.ImageFolder(train_dir, transform=train_tf)
    val_dataset = datasets.ImageFolder(val_dir, transform=eval_tf)
    test_dataset = datasets.ImageFolder(test_dir, transform=eval_tf)

    print(f"Class mapping: {train_dataset.class_to_idx}")
    print(f"Dataset split sizes: Train={len(train_dataset)}, Val={len(val_dataset)}, Test={len(test_dataset)}")

    train_loader = DataLoader(train_dataset, batch_size=batch_size, shuffle=True)
    val_loader = DataLoader(val_dataset, batch_size=batch_size, shuffle=False)
    test_loader = DataLoader(test_dataset, batch_size=batch_size, shuffle=False)

    model = build_model(pretrained=True)
    criterion = nn.CrossEntropyLoss()
    optimizer = optim.Adam([
        {'params': model.layer4.parameters(), 'lr': lr * 0.1},
        {'params': model.fc.parameters(), 'lr': lr}
    ], weight_decay=1e-4)

    scheduler = optim.lr_scheduler.StepLR(optimizer, step_size=5, gamma=0.5)

    best_val_acc = 0.0
    best_model_weights = None

    start_time = time.time()

    for epoch in range(1, epochs + 1):
        # Training Phase
        model.train()
        running_loss = 0.0
        correct_train = 0
        total_train = 0

        for inputs, labels in train_loader:
            inputs, labels = inputs.to(DEVICE), labels.to(DEVICE)
            optimizer.zero_grad()
            outputs = model(inputs)
            loss = criterion(outputs, labels)
            loss.backward()
            optimizer.step()

            running_loss += loss.item() * inputs.size(0)
            _, preds = torch.max(outputs, 1)
            correct_train += torch.sum(preds == labels.data).item()
            total_train += inputs.size(0)

        scheduler.step()

        train_loss = running_loss / total_train
        train_acc = correct_train / total_train

        # Validation Phase
        model.eval()
        val_loss = 0.0
        correct_val = 0
        total_val = 0

        with torch.no_grad():
            for inputs, labels in val_loader:
                inputs, labels = inputs.to(DEVICE), labels.to(DEVICE)
                outputs = model(inputs)
                loss = criterion(outputs, labels)
                val_loss += loss.item() * inputs.size(0)
                _, preds = torch.max(outputs, 1)
                correct_val += torch.sum(preds == labels.data).item()
                total_val += inputs.size(0)

        val_loss = val_loss / total_val
        val_acc = correct_val / total_val

        print(f"Epoch {epoch:02d}/{epochs:02d} | Train Loss: {train_loss:.4f} Acc: {train_acc*100:.1f}% | Val Loss: {val_loss:.4f} Acc: {val_acc*100:.1f}%")

        if val_acc >= best_val_acc:
            best_val_acc = val_acc
            best_model_weights = model.state_dict().copy()

    elapsed = time.time() - start_time
    print(f"\nTraining completed in {elapsed:.1f}s. Best Validation Accuracy: {best_val_acc*100:.2f}%")

    # Load best weights
    if best_model_weights is not None:
        model.load_state_dict(best_model_weights)

    # Final Evaluation on Unseen Test Dataset
    print("\nEvaluating trained model on unseen Test Dataset...")
    model.eval()
    all_preds = []
    all_labels = []
    all_probs = []

    with torch.no_grad():
        for inputs, labels in test_loader:
            inputs = inputs.to(DEVICE)
            outputs = model(inputs)
            probs = torch.softmax(outputs, dim=1)
            _, preds = torch.max(outputs, 1)

            all_preds.extend(preds.cpu().numpy().tolist())
            all_labels.extend(labels.numpy().tolist())
            all_probs.extend(probs.cpu().numpy().tolist())

    # Calculate actual metric values (Class 0: REAL, Class 1: FAKE)
    acc = accuracy_score(all_labels, all_preds) * 100
    prec = precision_score(all_labels, all_preds, pos_label=1, zero_division=0) * 100
    rec = recall_score(all_labels, all_preds, pos_label=1, zero_division=0) * 100
    f1 = f1_score(all_labels, all_preds, pos_label=1, zero_division=0) * 100
    cm = confusion_matrix(all_labels, all_preds).tolist()

    print("\n" + "=" * 30)
    print("Model Evaluation")
    print(f"Accuracy : {acc:.1f}%")
    print(f"Precision: {prec:.1f}%")
    print(f"Recall   : {rec:.1f}%")
    print(f"F1 Score : {f1:.1f}%")
    print("=" * 30)
    print(f"Confusion Matrix (Rows=True, Cols=Pred) [0=REAL, 1=FAKE]:")
    print(f"  {cm}")

    # Save model weights and state
    checkpoint = {
        'model_architecture': 'ResNet-18 Transfer Learning',
        'classes': train_dataset.classes,
        'class_to_idx': train_dataset.class_to_idx,
        'state_dict': model.state_dict(),
        'metrics': {
            'accuracy': round(acc, 1),
            'precision': round(prec, 1),
            'recall': round(rec, 1),
            'f1_score': round(f1, 1),
            'confusion_matrix': cm
        }
    }

    torch.save(checkpoint, MODEL_SAVE_PATH)
    print(f"\nModel checkpoint saved successfully to: {MODEL_SAVE_PATH}")

    # Export model metrics JSON for backend and frontend consumption
    metrics_data = {
        'model_name': 'ResNet-18 Deepfake Binary Classifier',
        'architecture': 'ResNet-18 (Transfer Learning + Forensic Head)',
        'classes': {
            '0': 'REAL',
            '1': 'FAKE'
        },
        'dataset_name': 'TruthLense Deepfake Forensic Benchmark',
        'train_samples': len(train_dataset),
        'validation_samples': len(val_dataset),
        'test_samples': len(test_dataset),
        'accuracy': round(acc, 1),
        'precision': round(prec, 1),
        'recall': round(rec, 1),
        'f1_score': round(f1, 1),
        'confusion_matrix': cm,
        'trained_at': time.strftime('%Y-%m-%d %H:%M:%S UTC', time.gmtime()),
        'device': str(DEVICE)
    }

    with open(METRICS_SAVE_PATH, 'w') as f:
        json.dump(metrics_data, f, indent=2)

    print(f"Metrics metadata written to: {METRICS_SAVE_PATH}")

if __name__ == '__main__':
    train_model()
