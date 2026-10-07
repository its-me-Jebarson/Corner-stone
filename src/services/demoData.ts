import { ForensicAnalysisResult, CrimeSceneCase } from '../types/forensics';

export const DEMO_PREVIEWS = {
  realPortrait: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
  fakePortrait: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80',
  realVideo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
  fakeVideo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
  audioWave: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=800&q=80',
  crimeScene: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1200&q=80',
  evidenceComparisonKnife: 'https://images.unsplash.com/photo-1593085512500-5d55148d6f0d?auto=format&fit=crop&w=600&q=80'
};

export const INITIAL_DEMO_CASES: ForensicAnalysisResult[] = [
  {
    id: 'case-demo-01',
    caseId: 'TL-2026-9481',
    title: 'Political Candidate Interview Photo',
    timestamp: '2026-10-06 14:22:10',
    mediaType: 'image',
    mediaUrl: DEMO_PREVIEWS.fakePortrait,
    fileName: 'candidate_leaked_photo_hires.jpg',
    fileSize: '4.8 MB',
    isDemo: true,
    verdict: 'FAKE',
    authenticityScore: 14.8,
    fakeProbability: 85.2,
    confidence: 93.8,
    riskLevel: 'HIGH',
    evidenceStrength: 'STRONG',
    summaryExplanation: 'High-confidence AI face replacement detected. Error Level Analysis shows significant resave disparity along facial margin, accompanied by absence of Bayer sensor noise in the central facial region.',
    detailedExplanations: [
      'Facial boundary reveals sharp gradient drop (>38%) along mandibular perimeter, consistent with autoencoder mask blending.',
      'Error Level Analysis (ELA) identifies double quantization patterns isolated specifically to the facial crop.',
      'Wavelet decomposition reveals synthetic smoothing filters applied to facial pores.'
    ],
    primaryEvidence: [
      'Facial Boundary & Blending: Seam detected with 91.2% confidence',
      'Error Level Analysis: Localized resave error 4.2x higher than background',
      'Missing Bayer sensor photo-response non-uniformity (PRNU) on facial skin'
    ],
    signals: [
      { name: 'Face Boundary & Blending', category: 'face', score: 89.4, confidence: 94.0, weight: 0.28, status: 'suspicious', description: 'Mandibular margin shows linear interpolation seam.', details: ['Contour gradient drop > 35%', 'Inpainting border detected'] },
      { name: 'Error Level Analysis (ELA)', category: 'compression', score: 87.1, confidence: 92.0, weight: 0.22, status: 'suspicious', description: 'Uneven compression error rate between face crop and background.', details: ['Facial block error 4.2x higher than canvas', 'Double-quantization pattern detected'] },
      { name: 'Sensor Noise Uniformity', category: 'image', score: 82.5, confidence: 89.0, weight: 0.20, status: 'suspicious', description: 'Sensor CFA noise missing in central facial region.', details: ['High frequency wavelet variance mismatch', 'Smoothing filter applied'] },
      { name: 'Lighting & Shadow Coherence', category: 'image', score: 76.0, confidence: 85.0, weight: 0.15, status: 'suspicious', description: 'Incident light angle contradicts background shadow vectors.', details: ['Light direction discrepancy: 34°', 'Corneal reflection inverted'] },
      { name: 'Metadata & Provenance', category: 'metadata', score: 71.0, confidence: 95.0, weight: 0.15, status: 'suspicious', description: 'Camera EXIF stripped, software tool atom found.', details: ['Software: Adobe Photoshop / Inpainting Tool', 'Missing camera serial number'] }
    ],
    suspiciousRegions: [
      {
        id: 'sr-1',
        label: 'Facial Boundary Warping / Blending Seam',
        x: 32,
        y: 22,
        width: 36,
        height: 48,
        confidence: 91.2,
        type: 'face_boundary',
        description: 'Gradient discontinuity along jawline and ear perimeter. ELA delta > 40%.'
      },
      {
        id: 'sr-2',
        label: 'Sensor Noise Floor Disparity',
        x: 40,
        y: 35,
        width: 20,
        height: 22,
        confidence: 86.5,
        type: 'noise_disparity',
        description: 'Absence of chromatic sensor noise on facial region compared to background.'
      }
    ],
    heatmapType: 'ela',
    heatmapUrl: DEMO_PREVIEWS.fakePortrait,
    metadata: {
      fileName: 'candidate_leaked_photo_hires.jpg',
      fileSize: '4.8 MB',
      format: 'image/jpeg',
      dimensions: '2048 x 2048 px',
      createdAt: '2026-10-06 10:14:02',
      modifiedAt: '2026-10-06 14:15:30',
      cameraMake: 'None (Software Pipeline)',
      cameraModel: 'Synthetic Neural Canvas',
      software: 'Diffusion Inpainting Pipeline v2.4',
      colorSpace: 'sRGB IEC61966-2.1',
      compression: 'DCT JPEG Standard',
      anomaliesDetected: [
        'Missing camera hardware maker tags and serial numbers',
        'Quantization matrix does not match standard camera firmware'
      ],
      isMetadataIntact: false
    },
    robustnessResults: [
      { condition: 'Original', authenticityScore: 14.8, fakeProbability: 85.2, verdict: 'FAKE', stabilityScore: 99, notes: 'Base input scan.' },
      { condition: 'JPEG Compression (Q=50)', authenticityScore: 17.3, fakeProbability: 82.7, verdict: 'FAKE', stabilityScore: 94, notes: 'Compression reduces high-frequency detail; core verdict unchanged.' },
      { condition: 'Center Crop (15%)', authenticityScore: 13.6, fakeProbability: 86.4, verdict: 'FAKE', stabilityScore: 97, notes: 'Cropping maintains dominant spatial signatures.' },
      { condition: 'Bilinear Resize (75%)', authenticityScore: 18.6, fakeProbability: 81.4, verdict: 'FAKE', stabilityScore: 91, notes: 'Resampling introduces minor interpolation smoothing.' },
      { condition: 'Gaussian Blur (r=1.5)', authenticityScore: 19.9, fakeProbability: 80.1, verdict: 'FAKE', stabilityScore: 89, notes: 'Verdict stable; boundary edge still detectable via low-frequency gradients.' },
      { condition: 'H.264 Re-encoded', authenticityScore: 16.8, fakeProbability: 83.2, verdict: 'FAKE', stabilityScore: 93, notes: 'Macroblock quantization does not invert primary forensic determination.' }
    ],
    generalizationAnalysis: {
      knownPatternMatch: 91.5,
      anomalyScore: 36.0,
      category: 'Known Manipulation',
      description: 'Signatures match known GAN / Diffusion autoencoder architectures (Face-swap / Reenactment / Neural Vocoder).'
    },
    processingTimeMs: 1420,
    modelVersion: 'TruthLense Neural-Forensic Engine v3.4.2 [PSI10]',
    tags: ['FAKE', 'IMAGE', 'HIGH']
  },
  {
    id: 'case-demo-02',
    caseId: 'TL-2026-1049',
    title: 'Court Witness Statement Video',
    timestamp: '2026-10-05 09:15:44',
    mediaType: 'video',
    mediaUrl: DEMO_PREVIEWS.realVideo,
    fileName: 'witness_depo_room4_cam01.mp4',
    fileSize: '42.1 MB',
    isDemo: true,
    verdict: 'REAL',
    authenticityScore: 94.2,
    fakeProbability: 5.8,
    confidence: 96.5,
    riskLevel: 'LOW',
    evidenceStrength: 'STRONG',
    summaryExplanation: 'Media exhibits unbroken optical flow, natural spontaneous blink rates, and continuous audio-visual lip synchronization with intact hardware AVC camera provenance.',
    detailedExplanations: [
      'Optical flow vector continuity verified across 1,840 consecutive frames.',
      'SyncNet lip-sync coherence confirmed with tight alignment (-3.8ms offset).',
      'Corneal specular highlights match studio 3-point lighting setup.'
    ],
    primaryEvidence: [
      'Continuous physiological markers and optical flow',
      'Intact camera hardware provenance and valid MP4 container atom',
      'Acoustic room impulse response aligns with recorded chamber geometry'
    ],
    signals: [
      { name: 'Temporal Motion Continuity', category: 'temporal', score: 5.1, confidence: 97.0, weight: 0.26, status: 'normal', description: 'Optical flow vectors continuous across frame sequences.', details: ['Zero frame-to-frame boundary jitter', 'Natural head rotation kinematics'] },
      { name: 'Lip-Sync Synchronization', category: 'lipsync', score: 4.2, confidence: 96.0, weight: 0.24, status: 'normal', description: 'Phoneme-to-viseme mouth movements match audio track.', details: ['Audio-video delta: -3.8ms (within human speech limits)', 'Consonant closures coherent'] },
      { name: 'Facial Landmark Dynamics', category: 'face', score: 5.8, confidence: 94.0, weight: 0.20, status: 'normal', description: 'Natural micro-saccades and spontaneous blink rates.', details: ['Blink rate 17 blinks/min (normal range)', 'Natural micro-expressions'] },
      { name: 'Lighting & Reflection Coherence', category: 'image', score: 7.0, confidence: 91.0, weight: 0.15, status: 'normal', description: 'Corneal reflections align with scene lighting.', details: ['Specular angle variance < 1.5°', 'No reflection inversion'] },
      { name: 'Video Codec & Container Metadata', category: 'metadata', score: 3.0, confidence: 97.0, weight: 0.15, status: 'normal', description: 'Original camera MP4/MOV container structure intact.', details: ['Timecode continuous', 'Hardware encoder GOP structure valid'] }
    ],
    suspiciousRegions: [],
    suspiciousTimestamps: [],
    audioVisualSyncScore: 96.5,
    lipSyncStatus: 'MATCH',
    temporalConsistencyScore: 97.2,
    metadata: {
      fileName: 'witness_depo_room4_cam01.mp4',
      fileSize: '42.1 MB',
      format: 'video/mp4',
      dimensions: '1920 x 1080 px',
      duration: '00:32.40',
      createdAt: '2026-10-05 09:00:12',
      modifiedAt: '2026-10-05 09:32:52',
      cameraMake: 'Sony Corporation',
      cameraModel: 'HXR-NX80 Camcorder',
      software: 'Sony XAVC S Firmware 1.02',
      colorSpace: 'BT.709',
      compression: 'AVC / H.264 High Profile',
      audioCodec: 'LPCM 48kHz Stereo 1536kbps',
      sampleRate: '48,000 Hz',
      bitrate: '18,400 kbps',
      anomaliesDetected: [],
      isMetadataIntact: true
    },
    robustnessResults: [
      { condition: 'Original', authenticityScore: 94.2, fakeProbability: 5.8, verdict: 'REAL', stabilityScore: 99, notes: 'Base input scan.' },
      { condition: 'JPEG Compression (Q=50)', authenticityScore: 91.2, fakeProbability: 8.8, verdict: 'REAL', stabilityScore: 95, notes: 'Lossy compression preserves core temporal continuity.' },
      { condition: 'Center Crop (15%)', authenticityScore: 93.7, fakeProbability: 6.3, verdict: 'REAL', stabilityScore: 98, notes: 'Crop preserves central eye and mouth tracking.' }
    ],
    generalizationAnalysis: {
      knownPatternMatch: 5.0,
      anomalyScore: 4.0,
      category: 'Natural Camera Artifact',
      description: 'Strict adherence to ISO camera sensor benchmarks with zero out-of-distribution neural indicators.'
    },
    processingTimeMs: 1850,
    modelVersion: 'TruthLense Neural-Forensic Engine v3.4.2 [PSI10]',
    tags: ['REAL', 'VIDEO', 'LOW']
  },
  {
    id: 'case-demo-03',
    caseId: 'TL-2026-7822',
    title: 'Executive Political Reenactment Leak',
    timestamp: '2026-10-04 18:30:19',
    mediaType: 'video',
    mediaUrl: DEMO_PREVIEWS.fakeVideo,
    fileName: 'speech_leak_broadcast_raw.mp4',
    fileSize: '36.8 MB',
    isDemo: true,
    verdict: 'FAKE',
    authenticityScore: 11.2,
    fakeProbability: 88.8,
    confidence: 95.0,
    riskLevel: 'CRITICAL',
    evidenceStrength: 'STRONG',
    summaryExplanation: 'Severe audio-visual desynchronization detected. Phoneme-viseme correlation confirms audio leads video by +340ms, with recurring inter-frame facial perimeter warping.',
    detailedExplanations: [
      'SyncNet lip-sync detector measured extreme phoneme-viseme discordance between 00:14.2 and 00:19.4.',
      'Temporal boundary flicker detected at frame 426-580 during rapid head turn.',
      'HiFi-GAN vocoder spectral brickwall cutoff present at exactly 16.0 kHz.'
    ],
    primaryEvidence: [
      'Lip-Sync Alignment: Audio leads mouth closure by +340ms (Score: 87.2%)',
      'Temporal Frame Coherence: Inter-frame perimeter flickering (Score: 85.0%)',
      'Synthetic Vocoder: 16kHz brickwall cutoff detected in speech track'
    ],
    signals: [
      { name: 'Lip-Sync Alignment', category: 'lipsync', score: 87.2, confidence: 95.0, weight: 0.28, status: 'suspicious', description: 'Phoneme-viseme desynchronization detected.', details: ['Audio lead by +340ms', 'Labial closure mismatch on plosive consonants'] },
      { name: 'Temporal Frame Coherence', category: 'temporal', score: 85.0, confidence: 93.0, weight: 0.24, status: 'suspicious', description: 'Inter-frame flickering on facial perimeter.', details: ['Spike in frame-to-frame pixel delta at 00:14.2 - 00:18.9', 'Facial warping detected'] },
      { name: 'Synthetic Vocoder Artifacts', category: 'audio', score: 81.5, confidence: 90.0, weight: 0.20, status: 'suspicious', description: 'Sharp spectral cutoff at 16kHz in speech track.', details: ['Zero room impulse response', 'Mechanical pitch contour'] },
      { name: 'Facial Landmark Dynamics', category: 'face', score: 86.4, confidence: 92.0, weight: 0.18, status: 'suspicious', description: 'Facial landmark mesh disconnects from skull orientation.', details: ['3D mesh rotation error > 11°', 'Blink frequency abnormally low'] },
      { name: 'Video Stream Atoms', category: 'metadata', score: 68.0, confidence: 88.0, weight: 0.10, status: 'suspicious', description: 'FFmpeg synthetic rendering pipeline tags present.', details: ['Encoder: Lavf60.3.100', 'Non-monotonic DTS timestamps'] }
    ],
    suspiciousRegions: [],
    suspiciousTimestamps: [
      { timestamp: '00:06.4', seconds: 6.4, severity: 'medium', anomalyType: 'facial_jitter', description: 'Facial boundary tracking drift starts.' },
      { timestamp: '00:14.2', seconds: 14.2, severity: 'high', anomalyType: 'temporal_flicker', description: 'Severe inter-frame warping and boundary flicker.' },
      { timestamp: '00:17.8', seconds: 17.8, severity: 'high', anomalyType: 'lip_desync', description: 'Phoneme-viseme mismatch: mouth open during closed consonant.' }
    ],
    audioVisualSyncScore: 38.5,
    lipSyncStatus: 'MISMATCH',
    temporalConsistencyScore: 26.5,
    metadata: {
      fileName: 'speech_leak_broadcast_raw.mp4',
      fileSize: '36.8 MB',
      format: 'video/mp4',
      dimensions: '1920 x 1080 px',
      duration: '00:28.40',
      createdAt: '2026-10-04 18:02:11',
      modifiedAt: '2026-10-04 18:29:45',
      cameraMake: 'None (FFmpeg Synthetic Container)',
      cameraModel: 'Unknown Software Stream',
      software: 'FFmpeg Lavf60.3.100',
      colorSpace: 'BT.709',
      compression: 'AVC / H.264',
      audioCodec: 'AAC 48kHz Stereo',
      sampleRate: '48,000 Hz',
      bitrate: '8,420 kbps',
      anomaliesDetected: [
        'Container software tag specifies FFmpeg re-encoder',
        'Non-standard GOP cadence indicates synthetic concatenation'
      ],
      isMetadataIntact: false
    },
    robustnessResults: [
      { condition: 'Original', authenticityScore: 11.2, fakeProbability: 88.8, verdict: 'FAKE', stabilityScore: 99, notes: 'Base input scan.' },
      { condition: 'JPEG Compression (Q=50)', authenticityScore: 13.7, fakeProbability: 86.3, verdict: 'FAKE', stabilityScore: 93, notes: 'Verdict stable.' }
    ],
    generalizationAnalysis: {
      knownPatternMatch: 89.2,
      anomalyScore: 42.0,
      category: 'Known Manipulation',
      description: 'Signatures match known GAN / Diffusion autoencoder architectures (Face-swap / Reenactment / Neural Vocoder).'
    },
    processingTimeMs: 1980,
    modelVersion: 'TruthLense Neural-Forensic Engine v3.4.2 [PSI10]',
    tags: ['FAKE', 'VIDEO', 'CRITICAL']
  },
  {
    id: 'case-demo-04',
    caseId: 'TL-2026-4402',
    title: 'CFO Urgent Wire Transfer Voice Note',
    timestamp: '2026-10-03 11:04:12',
    mediaType: 'audio',
    mediaUrl: DEMO_PREVIEWS.audioWave,
    fileName: 'cfo_authorization_call_urgent.wav',
    fileSize: '8.4 MB',
    isDemo: true,
    verdict: 'FAKE',
    authenticityScore: 11.4,
    fakeProbability: 88.6,
    confidence: 94.0,
    riskLevel: 'HIGH',
    evidenceStrength: 'STRONG',
    summaryExplanation: 'High-confidence neural voice clone. Formant micro-biomechanics show unnaturally flat pitch jitter (0.11%), combined with digital silence gating between phonemes.',
    detailedExplanations: [
      'Acoustic jitter measured across voiced vowel segments is 80% below the minimum biological variation of human vocal cords.',
      'Digital zero noise floor (-94 dBFS) indicates vocoder synthesis without ambient room acoustic baseline.',
      'Sharp spectral harmonic cutoff observed at 16.0 kHz.'
    ],
    primaryEvidence: [
      'Acoustic Jitter 0.11% (Biological minimum > 0.6%)',
      'Artificial zero-noise floor gating between speech bursts',
      'Acoustic room reverberation RT60 = 0.00s (Pure dry synthesis)'
    ],
    signals: [
      { name: 'Synthetic Vocoder Artifacts', category: 'audio', score: 88.6, confidence: 94.0, weight: 0.35, status: 'suspicious', description: 'HiFi-GAN / Diffusion acoustic harmonic footprint.', details: ['Phase continuity anomaly in vowel formants', 'Robotic sub-harmonic ringing'] },
      { name: 'Pitch & Jitter Biomechanics', category: 'audio', score: 84.2, confidence: 91.0, weight: 0.25, status: 'suspicious', description: 'Absence of biological vocal fold micro-tremors.', details: ['Jitter (local) 0.11% (Normal > 0.6%)', 'Unnaturally constant fundamental frequency'] },
      { name: 'Acoustic Room Reflection', category: 'audio', score: 79.0, confidence: 88.0, weight: 0.20, status: 'suspicious', description: 'Dry synthetic audio with zero natural room reverberation.', details: ['RT60 = 0.00s', 'Absence of organic microphone proximity effect'] },
      { name: 'Silence Floor & Noise Gating', category: 'audio', score: 83.0, confidence: 92.0, weight: 0.20, status: 'suspicious', description: 'Digital zero floor between words.', details: ['Noise floor -94 dBFS', 'No ambient room acoustic baseline'] }
    ],
    suspiciousRegions: [],
    suspiciousTimestamps: [
      { timestamp: '00:04.1', seconds: 4.1, severity: 'high', anomalyType: 'audio_synthetic_splice', description: 'Synthetic phase splice with zero acoustic decay.' },
      { timestamp: '00:11.6', seconds: 11.6, severity: 'high', anomalyType: 'audio_synthetic_splice', description: 'Unnatural formant frequency leap.' }
    ],
    syntheticVoiceScore: 88.6,
    spectralBands: [
      { range: '0 - 1,000 Hz', energy: 88, anomalyScore: 12, status: 'natural' },
      { range: '1,000 - 4,000 Hz', energy: 74, anomalyScore: 45, status: 'natural' },
      { range: '4,000 - 8,000 Hz', energy: 62, anomalyScore: 78, status: 'vocoder_artifact' },
      { range: '8,000 - 16,000 Hz', energy: 41, anomalyScore: 89, status: 'vocoder_artifact' },
      { range: '16,000 - 24,000 Hz', energy: 3, anomalyScore: 98, status: 'synthetic_cutoff' }
    ],
    metadata: {
      fileName: 'cfo_authorization_call_urgent.wav',
      fileSize: '8.4 MB',
      format: 'audio/wav',
      duration: '00:18.40',
      audioCodec: 'PCM 16-bit Mono',
      sampleRate: '48,000 Hz',
      bitrate: '768 kbps',
      anomaliesDetected: [
        'Absence of acoustic ambient noise floor',
        'Abrupt frequency cutoff at 16,000 Hz'
      ],
      isMetadataIntact: true
    },
    robustnessResults: [],
    generalizationAnalysis: {
      knownPatternMatch: 94.0,
      anomalyScore: 28.0,
      category: 'Known Manipulation',
      description: 'Signatures match known GAN / Diffusion autoencoder architectures (Face-swap / Reenactment / Neural Vocoder).'
    },
    processingTimeMs: 1120,
    modelVersion: 'TruthLense Neural-Forensic Engine v3.4.2 [PSI10]',
    tags: ['FAKE', 'AUDIO', 'HIGH']
  },
  {
    id: 'case-demo-05',
    caseId: 'TL-2026-6194',
    title: 'Social Messaging Low-Res Photo',
    timestamp: '2026-10-02 21:18:03',
    mediaType: 'image',
    mediaUrl: DEMO_PREVIEWS.fakePortrait,
    fileName: 'whatsapp_received_photo_compressed.jpg',
    fileSize: '74 KB',
    isDemo: true,
    verdict: 'UNCERTAIN',
    authenticityScore: 51.4,
    fakeProbability: 48.6,
    confidence: 47.0,
    riskLevel: 'MEDIUM',
    evidenceStrength: 'WEAK',
    uncertaintyReason: 'Heavy transport compression and conflicting forensic signals prevent a conclusive determination. The Evidence Conflict Index exceeds the safety threshold (0.64 > 0.45). To protect against false-positive accusations, TruthLense AI strictly classifies this case as UNCERTAIN.',
    conflictingSignals: [
      'Signal 1: Compression artifact density & ELA indicate spatial anomalies (52% fake probability)',
      'Signal 2: Anatomical geometry, pupil reflections, and facial proportions remain physiologically sound (79% authentic)',
      'Signal 3: Container provenance metadata was stripped during transport, preventing cryptographic camera confirmation'
    ],
    summaryExplanation: 'System classified as UNCERTAIN. In accordance with PSI10 Forensic Protocol, when evidence is conflicting or degraded by lossy social media compression, the platform refuses to force a false REAL or false FAKE verdict.',
    detailedExplanations: [
      'Signal-level analyses generated conflicting outputs: spatial compression metrics indicate potential manipulation, while physiological and anatomical metrics align with genuine media.',
      'Lossy transport compression (JPEG DCT quantization / social media bitrate reduction) removed fine-grain sensor noise fingerprints.',
      'Forensic protocol requires original uncompressed media before an actionable legal or corporate determination can be reached.'
    ],
    primaryEvidence: [
      'Evidence Conflict Index: 0.64 (Exceeds acceptable threshold for binary determination)',
      'Sensor noise SNR degraded by lossy recompression',
      'Anatomical landmark consistency remains intact'
    ],
    signals: [
      { name: 'Compression Artifact Density', category: 'compression', score: 64.0, confidence: 52.0, weight: 0.25, status: 'inconclusive', description: 'Heavy 8x8 DCT grid masking underlying sensor noise.', details: ['Quantization table scale coarse', 'Blocking metric elevated'] },
      { name: 'Error Level Analysis (ELA)', category: 'image', score: 56.0, confidence: 50.0, weight: 0.22, status: 'inconclusive', description: 'Edge ringing indistinguishable from compression artifact.', details: ['Ringing intensity elevated along high-contrast lines', 'No localized differential'] },
      { name: 'Facial Biomechanics & Proportions', category: 'face', score: 24.0, confidence: 76.0, weight: 0.20, status: 'normal', description: 'Facial landmarks match natural biological proportions.', details: ['Inter-pupillary distance within normal distribution', 'Gaze vector consistent'] },
      { name: 'Illumination Vector Field', category: 'image', score: 29.0, confidence: 64.0, weight: 0.18, status: 'normal', description: 'Ambient illumination gradients consistent across scene.', details: ['Single light source vector at 32° azimuth', 'No inverted specular highlight'] },
      { name: 'Metadata & Provenance Chain', category: 'metadata', score: 50.0, confidence: 90.0, weight: 0.15, status: 'inconclusive', description: 'Stripped by social media or compression pipeline.', details: ['EXIF metadata stripped by transport protocol', 'Aggressive low-bitrate quantization matrix detected'] }
    ],
    suspiciousRegions: [
      {
        id: 'sr-unc-1',
        label: 'Compression Artifact / Potential Seam',
        x: 35,
        y: 28,
        width: 30,
        height: 38,
        confidence: 51.0,
        type: 'compression_block',
        description: 'JPEG 8x8 DCT block boundaries mask underlying pixel variance.'
      }
    ],
    heatmapType: 'ela',
    heatmapUrl: DEMO_PREVIEWS.fakePortrait,
    metadata: {
      fileName: 'whatsapp_received_photo_compressed.jpg',
      fileSize: '74 KB',
      format: 'image/jpeg',
      dimensions: '800 x 600 px',
      createdAt: '2026-10-02 21:00:15',
      modifiedAt: '2026-10-02 21:18:03',
      cameraMake: 'Stripped by Social Platform',
      cameraModel: 'Unknown',
      software: 'WhatsApp Android Transcoder',
      colorSpace: 'sRGB',
      compression: 'Coarse Quantization DCT',
      anomaliesDetected: [
        'EXIF metadata stripped by transport protocol',
        'Aggressive low-bitrate quantization matrix detected',
        'Small file size limits high-frequency sensor noise verification'
      ],
      isMetadataIntact: false
    },
    robustnessResults: [
      { condition: 'Original', authenticityScore: 51.4, fakeProbability: 48.6, verdict: 'UNCERTAIN', stabilityScore: 99, notes: 'Base input scan.' },
      { condition: 'JPEG Compression (Q=50)', authenticityScore: 50.0, fakeProbability: 50.0, verdict: 'UNCERTAIN', stabilityScore: 94, notes: 'Compression confirms inconclusive status.' }
    ],
    generalizationAnalysis: {
      knownPatternMatch: 5.0,
      anomalyScore: 58.0,
      category: 'Natural Camera Artifact',
      description: 'Artifacts are characteristic of high-loss transport transcoding and compression, not generative synthesis.'
    },
    processingTimeMs: 890,
    modelVersion: 'TruthLense Neural-Forensic Engine v3.4.2 [PSI10]',
    tags: ['UNCERTAIN', 'IMAGE', 'MEDIUM']
  }
];

export const SAMPLE_CRIME_SCENE_CASES: CrimeSceneCase[] = [
  {
    id: 'cs-case-01',
    caseNumber: 'CS-2026-0914',
    incidentTitle: 'Residential Burglary & Physical Altercation Evidence',
    incidentDate: '2026-09-14 02:45',
    location: '448 Westfall Way, Precinct 12',
    sceneImageUrl: DEMO_PREVIEWS.crimeScene,
    sceneImageName: 'scene_floor_evidence_overview.jpg',
    analystSummary: 'Scene scan detected two high-priority physical objects: a knife-like sharp edged object with metallic specular reflectivity, and a fluid-like pooled region consistent with biological stain patterns.',
    investigator: 'Det. Sarah Vance, Badge #4810',
    status: 'ACTIVE_INVESTIGATION',
    legalDisclaimer: 'CRITICAL FORENSIC DISCLAIMER: AI-generated visual detection is an investigative aid and does NOT establish guilt, ownership, cause of death, or criminal responsibility. All physical evidence must undergo chain of custody and certified laboratory testing.',
    detectedObjects: [
      {
        id: 'obj-01',
        label: 'knife-like object',
        category: 'weapon_like',
        confidence: 91.8,
        x: 42,
        y: 48,
        width: 14,
        height: 24,
        visualCharacteristics: {
          estimatedDimensions: 'Approx. 21cm total length, 12cm blade',
          dominantColor: 'Silver/Metallic (#C0C0C0)',
          textureDescription: 'High specular reflection on bevel; polymer handle grip pattern',
          reflectiveProperties: 'Directional anisotropic specular highlight'
        },
        forensicNotes: 'Edge profile shows clip-point morphology. Possible secondary blood transfer near bolster.'
      },
      {
        id: 'obj-02',
        label: 'fluid-like region (suspected biological stain)',
        category: 'fluid_like',
        confidence: 88.4,
        x: 58,
        y: 52,
        width: 18,
        height: 20,
        visualCharacteristics: {
          estimatedDimensions: 'Approx. 34cm x 26cm perimeter pool',
          dominantColor: 'Deep Crimson/Burgundy (#4A0E17)',
          textureDescription: 'Glossy surface with peripheral satellite spatter droplets',
          reflectiveProperties: 'Fresnel fluid specular reflection'
        },
        forensicNotes: 'Low-velocity impact spatter pattern radiating northeast. Swab preservation recommended.'
      }
    ],
    comparisons: [
      {
        referenceName: 'Recovered Tactical Knife (Serial #TK-88)',
        referenceUrl: DEMO_PREVIEWS.evidenceComparisonKnife,
        comparedObjectId: 'obj-01',
        similarityScore: 88.6,
        shapeSimilarity: 92.4,
        textureSimilarity: 85.0,
        colorHistogramSimilarity: 88.2,
        featureEmbeddingDistance: 0.18,
        investigativeRemarks: 'Strong morphological match on spine serration and bevel angle. High visual probability of being same make/model.',
        disclaimer: 'Visual pattern similarity does NOT constitute conclusive metallurgical or ballistic proof of identity.'
      }
    ],
    sceneHeatmapDensity: [
      { x: 42, y: 48, intensity: 0.95 },
      { x: 58, y: 52, intensity: 0.90 },
      { x: 30, y: 35, intensity: 0.35 }
    ]
  }
];
