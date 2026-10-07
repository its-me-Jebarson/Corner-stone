export type MediaType = 'image' | 'video' | 'audio';

export type ForensicVerdict = 'REAL' | 'FAKE' | 'UNCERTAIN';

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type EvidenceStrength = 'WEAK' | 'MODERATE' | 'STRONG';

export interface ForensicSignal {
  name: string;
  category: 'image' | 'video' | 'audio' | 'face' | 'lipsync' | 'metadata' | 'compression' | 'temporal';
  score: number; // 0 to 100 (higher = more indicative of manipulation)
  confidence: number; // 0 to 100
  weight: number; // 0 to 1
  status: 'normal' | 'suspicious' | 'anomalous' | 'inconclusive';
  description: string;
  details: string[];
}

export interface SuspiciousRegion {
  id: string;
  label: string;
  x: number; // percentage 0-100
  y: number;
  width: number;
  height: number;
  confidence: number;
  type: 'face_boundary' | 'blur_inconsistency' | 'noise_disparity' | 'warping' | 'compression_block';
  description: string;
}

export interface SuspiciousTimestamp {
  timestamp: string; // e.g. "00:14.2"
  seconds: number;
  severity: 'low' | 'medium' | 'high';
  anomalyType: 'temporal_flicker' | 'lip_desync' | 'facial_jitter' | 'audio_synthetic_splice';
  description: string;
  frameIndex?: number;
}

export interface AudioFrequencyBand {
  range: string;
  energy: number;
  anomalyScore: number;
  status: 'natural' | 'synthetic_cutoff' | 'vocoder_artifact';
}

export interface MetadataReport {
  fileName: string;
  fileSize: string;
  format: string;
  dimensions?: string;
  duration?: string;
  createdAt?: string;
  modifiedAt?: string;
  cameraMake?: string;
  cameraModel?: string;
  software?: string;
  colorSpace?: string;
  compression?: string;
  audioCodec?: string;
  sampleRate?: string;
  bitrate?: string;
  anomaliesDetected: string[];
  isMetadataIntact: boolean;
}

export interface RobustnessTestResult {
  condition: 'Original' | 'JPEG Compression (Q=50)' | 'Center Crop (15%)' | 'Bilinear Resize (75%)' | 'Gaussian Blur (r=1.5)' | 'H.264 Re-encoded';
  authenticityScore: number;
  fakeProbability: number;
  verdict: ForensicVerdict;
  stabilityScore: number; // 0-100%
  notes: string;
}

export interface ForensicAnalysisResult {
  id: string;
  caseId: string;
  title: string;
  timestamp: string;
  mediaType: MediaType;
  mediaUrl: string;
  fileName: string;
  fileSize: string;
  isDemo?: boolean;
  
  // Core Classification
  verdict: ForensicVerdict;
  authenticityScore: number; // 0 - 100% (100% = authentic real)
  fakeProbability: number; // 0 - 100% (100% = manipulated)
  confidence: number; // 0 - 100%
  riskLevel: RiskLevel;
  evidenceStrength: EvidenceStrength;
  
  // Uncertainty reasoning (if UNCERTAIN)
  uncertaintyReason?: string;
  conflictingSignals?: string[];
  
  // Explanations
  summaryExplanation: string;
  detailedExplanations: string[];
  primaryEvidence: string[];
  
  // Signal Scores
  signals: ForensicSignal[];
  
  // Spatial Localization
  suspiciousRegions: SuspiciousRegion[];
  heatmapType?: 'grad_cam' | 'ela' | 'frequency_domain' | 'noise_residual';
  heatmapUrl?: string;
  
  // Temporal Localization (Video)
  suspiciousTimestamps?: SuspiciousTimestamp[];
  audioVisualSyncScore?: number; // 0-100%
  lipSyncStatus?: 'MATCH' | 'MISMATCH' | 'INCONCLUSIVE';
  temporalConsistencyScore?: number;
  
  // Audio Findings (Audio/Video)
  syntheticVoiceScore?: number;
  spectralBands?: AudioFrequencyBand[];
  voiceArtifactNotes?: string[];
  
  // Metadata & Compression
  metadata: MetadataReport;
  robustnessResults: RobustnessTestResult[];
  
  // Generalization / Out of Distribution Analysis
  generalizationAnalysis: {
    knownPatternMatch: number; // 0-100%
    anomalyScore: number; // 0-100%
    category: 'Known Manipulation' | 'Out-of-Distribution / Novel Deepfake' | 'Natural Camera Artifact';
    description: string;
  };
  
  // Machine Learning Pipeline Details
  mlPrediction?: {
    prediction: 'LIKELY_REAL' | 'LIKELY_FAKE';
    realProbability: number;
    fakeProbability: number;
    confidence: number;
    modelName: string;
  };
  modelInfo?: {
    modelName: string;
    architecture: string;
    classes: { [key: string]: string };
    datasetName: string;
    trainSamples: number;
    validationSamples: number;
    testSamples: number;
    accuracy: number;
    precision: number;
    recall: number;
    f1Score: number;
    confusionMatrix?: number[][];
    isTrained: boolean;
  };
  forensicIndicators?: {
    dimensions: string;
    aspectRatio: string;
    colorStatistics: {
      meanRed: number;
      meanGreen: number;
      meanBlue: number;
      colorStd: number;
    };
    ela: {
      elaScore: number;
      meanError: number;
      maxError: number;
      isAnomalous: boolean;
      centerToPerimeterRatio?: number;
    };
    noiseAnalysis: {
      variance: number;
      std: number;
      uniformityDelta: number;
      status: string;
    };
    frequencyAnalysis: {
      highFrequencyRatio: number;
      highFrequencyPercentage: number;
      spectralFalloff: string;
      periodicGridPeaks: boolean;
    };
    jpegAnalysis: {
      isJpeg: boolean;
      dctBlockingMetric: number;
      estimatedQuality: string | number;
      blockingSeverity: string;
    };
  };

  // Processing info
  processingTimeMs: number;
  modelVersion: string;
  analystNotes?: string;
  bookmarked?: boolean;
  tags?: string[];
}

export interface CrimeSceneObject {
  id: string;
  label: string;
  category: 'weapon_like' | 'fluid_like' | 'person_like' | 'personal_item' | 'footwear_impression' | 'tool_like';
  confidence: number;
  x: number;
  y: number;
  width: number;
  height: number;
  visualCharacteristics: {
    estimatedDimensions?: string;
    dominantColor: string;
    textureDescription: string;
    reflectiveProperties: string;
  };
  forensicNotes: string;
}

export interface EvidenceComparison {
  referenceName: string;
  referenceUrl: string;
  comparedObjectId: string;
  similarityScore: number;
  shapeSimilarity: number;
  textureSimilarity: number;
  colorHistogramSimilarity: number;
  featureEmbeddingDistance: number;
  investigativeRemarks: string;
  disclaimer: string;
}

export interface CrimeSceneCase {
  id: string;
  caseNumber: string;
  incidentTitle: string;
  incidentDate: string;
  location: string;
  sceneImageUrl: string;
  sceneImageName: string;
  detectedObjects: CrimeSceneObject[];
  comparisons: EvidenceComparison[];
  sceneHeatmapDensity: { x: number; y: number; intensity: number }[];
  analystSummary: string;
  investigator: string;
  status: 'ACTIVE_INVESTIGATION' | 'PENDING_REVIEW' | 'CLOSED';
  legalDisclaimer: string;
}

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  role: 'Forensic Analyst' | 'Lead Examiner' | 'Guest Evaluator' | 'Demo User';
  organization: string;
  isVerified: boolean;
  isDemo: boolean;
  avatarUrl?: string;
  createdAt?: string;
}
