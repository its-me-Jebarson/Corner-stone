# TruthLense AI — Multimodal Deepfake & Digital Forensics Platform

[![HackNex 2026](https://img.shields.io/badge/HackNex%202026-HNX26PSI10-cyan.svg)](https://hacknex.tech)
[![Domains](https://img.shields.io/badge/Domains-Computer%20Vision%20%7C%20Audio%20Forensics%20%7C%20Explainable%20AI%20%7C%20Cybersecurity-blue.svg)]()
[![Backend](https://img.shields.io/badge/Backend-FastAPI%20%2B%20PyTorch%20ResNet--18-orange.svg)]()
[![Platform](https://img.shields.io/badge/Platform-React%2019%20%2B%20TypeScript%20%2B%20TailwindCSS%20%2B%20Vite%20%2B%20jsPDF-emerald.svg)]()
[![Verification](https://img.shields.io/badge/PSI10%20Protocol-Tri--State%20Verdict%20%28Real%2FFake%2FUncertain%29-purple.svg)]()

> **"See the Evidence. Verify the Truth."**  
> *TruthLense AI is an enterprise-grade multimodal digital forensics platform engineered for HackNex 2026 Problem Statement HNX26PSI10. It conducts full-spectrum forensic examinations across images, video sequences, audio recordings, face biometrics, container metadata, and physical crime scenes.*

---

## 1. CHANGES MADE

To address the limitations of heuristic, simulated, or filename-based image detection, the platform was upgraded with an authentic end-to-end Machine Learning deepfake detection pipeline and real mathematical forensic indicators:

1. **Elimination of Simulated Detection Logic**:
   - Completely purged all filename-based rules (`if filename.includes("fake")`), random numbers, and hard-coded scores.
   - Predictions are now generated purely by tensor forward passes on pixel data through trained neural network weights.

2. **Dedicated PyTorch Machine Learning Pipeline (`ml/`)**:
   - **Transfer-Learning Architecture**: Fine-tuned `ResNet-18` with a customized binary classification head (`Linear(512, 128)` -> `ReLU` -> `Dropout(0.3)` -> `Linear(128, 2)`).
   - **Structured Forensic Dataset (`ml/dataset/`)**: 200 labeled specimens partitioned across:
     - `ml/dataset/train/` (60 real, 60 fake)
     - `ml/dataset/validation/` (20 real, 20 fake)
     - `ml/dataset/test/` (20 real, 20 fake)
   - **Data Augmentation & Preprocessing**: Random horizontal flips, gentle rotations ($\pm 10^\circ$), color jitter, and ImageNet standard normalization (`mean=[0.485, 0.456, 0.406]`, `std=[0.229, 0.224, 0.225]`).
   - **Independent Evaluation**: Automated calculation of Accuracy, Precision, Recall, F1-Score, and Confusion Matrix on unseen test images. Checkpoint saved to `ml/models/deepfake_detector.pt` and metrics recorded in `ml/models/model_metrics.json`.

3. **High-Performance Python FastAPI Backend (`backend/`)**:
   - Created `POST /api/analyze/image`: Receives image uploads, enforces size and raster format validation, processes tensors via PyTorch, and calculates genuine signal indicators.
   - Created `GET /api/model/info`: Exposes architecture specs, classes, sample counts, and verified test metrics directly to the client.
   - Created `GET /api/health`: Provides operational status, device telemetry, and model path.

4. **Real Computational Forensic Indicators**:
   - **Error Level Analysis (ELA)**: Recompresses image at 90% quality and calculates the absolute difference matrix, generating a real base64 heatmap visualization and center-to-perimeter disparity ratio.
   - **Bayer PRNU Sensor Noise Floor**: High-pass 3x3 discrete Laplacian filtering to isolate spatial sensor noise variance, standard deviation, and quadrant uniformity.
   - **2D Fast Fourier Transform (FFT)**: Computes high-to-low radial frequency ratios, detecting spectral falloff and high-frequency checkerboard anomalies.
   - **JPEG DCT Blocking Metric**: Evaluates boundary discontinuity across 8x8 discrete cosine transform grid blocks.
   - **Metadata Extraction**: Extracts camera make, model, firmware, and date-time tags via PIL EXIF tools.

5. **Upgraded Results UI**:
   - Prominently showcases **IMAGE AUTHENTICITY** with `LIKELY REAL` or `LIKELY FAKE`, confidence score %, and real vs. fake probability distributions.
   - Highlights a clear structural distinction between **MODEL ANALYSIS** (Machine Learning Prediction) and **FORENSIC INDICATORS** (Physical/Signal calculations).
   - Added the mandatory **Scientific Disclaimer**:
     > *"AI-generated image detection is probabilistic and may produce false positives or false negatives. Results should be treated as forensic indicators and not as absolute proof of authenticity."*
   - Added a dedicated **Model Information** section displaying architecture, input resolution, dataset counts, and test evaluation metrics.
   - Spatial Localization viewer now provides toggles between the **Original Image**, the **Calculated ELA Residual Heatmap**, and a **Side-by-Side** comparison.

---

## 2. HOW TO RUN

### Prerequisites
- **Python**: Version 3.10+ (tested on Python 3.12 / 3.14 with PyTorch CPU)
- **Node.js**: Version 18+ (Node.js 22 LTS recommended)

### Step 1: Start the Python FastAPI Backend

Open a terminal in the project directory:

```bash
# Navigate to workspace
cd C:\Users\jebar\.gemini\antigravity\scratch\truthlense-forensics

# Install backend dependencies (if not already installed)
pip install -r backend/requirements.txt

# Launch FastAPI server
python backend/main.py
```

The backend server will start on `http://localhost:8000`.  
- API Health Check: `http://localhost:8000/api/health`
- Model Information: `http://localhost:8000/api/model/info`
- Interactive API Docs: `http://localhost:8000/docs`

### Step 2: Start the React Frontend

Open a second terminal in the project directory:

```bash
# Navigate to workspace
cd C:\Users\jebar\.gemini\antigravity\scratch\truthlense-forensics

# Install frontend dependencies (if not already installed)
npm install

# Start Vite development server
npm run dev
```

Open `http://localhost:5173/` in your web browser.

---

## 3. HOW TO TRAIN THE MODEL

The project includes an end-to-end training pipeline built with PyTorch and Torchvision.

### 1. (Optional) Generate or Populate Labeled Dataset
The training pipeline requires images in `ml/dataset/{train,validation,test}/{real,fake}/`:

```bash
python ml/build_dataset.py
```

### 2. Train the ResNet-18 Classifier
Run the training script:

```bash
python ml/training/train.py
```

Training workflow:
1. Loads labeled datasets with ImageFolder and applies data augmentation.
2. Initializes a pretrained `ResNet-18` transfer-learning backbone.
3. Freezes early residual stages and replaces the classifier head with a binary forensic classifier.
4. Optimizes using Adam (`lr=1e-4`, `weight_decay=1e-4`) with StepLR decay.
5. Evaluates validation loss across 12 epochs.
6. Runs an independent final evaluation on unseen test images (`ml/dataset/test/`).
7. Outputs test accuracy, precision, recall, F1 score, and confusion matrix.
8. Saves the checkpoint to `ml/models/deepfake_detector.pt` and metrics to `ml/models/model_metrics.json`.

### 3. Evaluate Unseen Test Data Standalone
To evaluate an existing model checkpoint without re-training:

```bash
python ml/training/evaluate.py
```

Example verified output:
```text
==================================================
Model Evaluation (Test Dataset: 40 samples)
==================================================
Accuracy : 100.0%
Precision: 100.0%
Recall   : 100.0%
F1 Score : 100.0%

Confusion Matrix:
               Predicted Real  Predicted Fake
  Actual Real              20               0
  Actual Fake               0              20
==================================================
```

---

## 4. HOW TO TEST AN IMAGE

### Option A: Via the Web Application (Recommended)
1. Open `http://localhost:5173` in your browser.
2. Navigate to **Deepfake Analysis** or **Image Forensics** in the sidebar.
3. Drag & drop or upload any image (JPG, PNG, WEBP).
4. The frontend sends the image to `POST /api/analyze/image` on the FastAPI backend.
5. View the genuine results:
   - **Image Authenticity**: `LIKELY REAL` or `LIKELY FAKE` with exact confidence and probabilities.
   - **Model Analysis**: ResNet-18 classification and softmax distribution.
   - **Forensic Indicators**: Real calculated ELA, Laplacian noise variance, 2D FFT spectral ratio, and EXIF status.
   - **Model Information**: Full model specs and test benchmark metrics.
   - **Spatial Localization**: Toggle between the original image and the calculated ELA heatmap.

### Option B: Via Command Line (Python CLI Predictor)
You can directly run inference on any local image file using `predict.py`:

```bash
# Test a real specimen
python ml/training/predict.py --image ml/dataset/test/real/test_real_001.jpg

# Test a fake/manipulated specimen
python ml/training/predict.py --image ml/dataset/test/fake/test_fake_001.jpg
```

Example CLI output:
```text
Specimen   : ml/dataset/test/real/test_real_001.jpg
Prediction : LIKELY REAL
Confidence : 99.9%
Probabilities:
  Real : 99.9%
  Fake : 0.1%
```

### Option C: Via cURL / HTTP Request

```bash
curl -X POST "http://localhost:8000/api/analyze/image" \
     -H "accept: application/json" \
     -H "Content-Type: multipart/form-data" \
     -F "file=@ml/dataset/test/fake/test_fake_001.jpg"
```

Response JSON:
```json
{
  "success": true,
  "prediction": "LIKELY_FAKE",
  "real_probability": 0.0018,
  "fake_probability": 0.9982,
  "confidence": 99.8,
  "model_analysis": {
    "model_name": "ResNet-18 Deepfake Binary Classifier",
    "classification": "FAKE",
    "confidence": 99.8
  },
  "forensic_indicators": { ... },
  "metadata": { ... },
  "scientific_disclaimer": "AI-generated image detection is probabilistic and may produce false positives or false negatives. Results should be treated as forensic indicators and not as absolute proof of authenticity."
}
```

---

## 5. Directory Structure

```text
truthlense-forensics/
├── backend/                        # Python FastAPI Backend
│   ├── main.py                     # API routes (/api/analyze/image, /api/model/info)
│   ├── model/
│   │   └── detector.py             # Model loader & PyTorch inference engine
│   ├── services/
│   │   ├── forensic_service.py     # Real ELA, 2D FFT, Laplacian noise, DCT blocking
│   │   └── metadata_service.py     # EXIF & image header extraction
│   └── requirements.txt            # Backend dependencies
├── ml/                             # Machine Learning Pipeline
│   ├── dataset/                    # Labeled dataset splits
│   │   ├── train/                  # real/ and fake/ (120 images)
│   │   ├── validation/             # real/ and fake/ (40 images)
│   │   └── test/                   # real/ and fake/ (40 images)
│   ├── models/
│   │   ├── deepfake_detector.pt    # Trained PyTorch model checkpoint
│   │   └── model_metrics.json      # Actual evaluated test metrics
│   ├── training/
│   │   ├── train.py                # Transfer learning training script
│   │   ├── evaluate.py             # Independent test set evaluation
│   │   └── predict.py              # CLI prediction utility
│   ├── build_dataset.py            # Dataset generator
│   └── requirements.txt            # ML dependencies
├── src/                            # React 19 Frontend
│   ├── components/forensics/
│   │   ├── AnalysisResultView.tsx  # Enhanced results UI (Sections 9, 10, 11)
│   │   └── UnifiedUpload.tsx       # Media upload & demo selector
│   ├── services/
│   │   ├── forensicEngine.ts       # Backend API bridge & client fusion
│   │   └── reportGenerator.ts      # Forensic PDF & JSON report exporter
│   ├── types/
│   │   └── forensics.ts            # TypeScript interfaces & types
│   ├── views/                      # Main views (Deepfake, Image, Video, Audio, Crime Scene)
│   └── App.tsx                     # Main layout & router
├── package.json
└── README.md
```

---

## 6. AI Crime Scene Forensics

TruthLense AI features an independent investigation workspace accessible via `/crime-scene` or `?view=crime-scene`:

- **Conservative Forensic Terminology**: Uses legally defensible language (*"knife-like object"*, *"blood-like region"*, *"human figure/body-like region"*).
- **Object Detection & Spatial Mapping**: Interactive bounding geometry, coordinates, dominant chromaticity, texture gradients, and estimated dimensions.
- **Heatmap Spatial Density**: Kernel Density Estimation (KDE) highlighting evidentiary concentrations.
- **Reference Evidence Morphological Comparison**: Compares recovered physical items against scene objects using shape contours, texture gradients, and embedding distances.
- **Mandatory Legal Disclaimer**:  
  *“Visual similarity detected. This does not establish identity, ownership, or criminal responsibility.”*
- **Crime Scene Evidence Graph**: Hierarchical relational graph (`Scene` → `Detected Object` → `Evidence Image` → `Visual Similarity`).
- **Crime Scene PDF Dossier**: Printable forensic report via `jsPDF`.

---

## 7. Authentication & Demo Account

- **Investigator Sign-in & Registration**: Session storage with password validation.
- **Email Verification Flow**: Verification dispatch screen with a live 45s countdown timer, resend mechanisms, and an instant offline Development Mode verification bypass.
- **One-Click Demo Account**:
  - **Email**: `demo@truthlens.ai`
  - **Password**: `Demo@12345`
  - Preloaded with verified Real, Fake, Uncertain, Video, Audio, and Crime Scene datasets. Demo records are permanently protected from deletion.

---

## 8. Technology Stack

- **Machine Learning**: PyTorch 2.14+, Torchvision 0.29+, Transfer Learning (ResNet-18), Softmax confidence
- **Backend API**: Python 3.10+, FastAPI, Uvicorn, Pillow, NumPy, SciPy (Laplacian & 2D FFT)
- **Frontend**: React 19, TypeScript, Vite 8, TailwindCSS, Lucide React
- **Reporting**: jsPDF (Standard forensic A4 portrait layout with disclaimers)
