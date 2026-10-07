export type AIProvider = 'gemini' | 'openai';

export interface AIProviderConfig {
  provider: AIProvider;
  geminiApiKey: string;
  openaiApiKey: string;
  geminiModel: string;
  openaiModel: string;
  isConnected: boolean;
  lastTestedAt?: string;
  lastError?: string;
}

const STORAGE_KEY = 'truthlense_ai_provider_config';

export function getAIProviderConfig(): AIProviderConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to read AI provider configuration:', e);
  }

  return {
    provider: 'gemini',
    geminiApiKey: '',
    openaiApiKey: '',
    geminiModel: 'gemini-1.5-flash',
    openaiModel: 'gpt-4o',
    isConnected: false
  };
}

export function saveAIProviderConfig(config: AIProviderConfig): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch (e) {
    console.error('Failed to save AI provider configuration:', e);
  }
}

/**
 * Tests the API key against the chosen provider's live endpoint
 */
export async function testAPIKeyConnection(
  provider: AIProvider,
  apiKey: string
): Promise<{ success: boolean; message: string; modelInfo?: string }> {
  if (!apiKey || apiKey.trim().length === 0) {
    return { success: false, message: 'API key cannot be empty.' };
  }

  const cleanKey = apiKey.trim();

  if (provider === 'gemini') {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models?key=${cleanKey}`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const msg = errorData?.error?.message || `HTTP ${response.status}: Authentication failed`;
        return { success: false, message: `Gemini verification failed: ${msg}` };
      }

      const data = await response.json();
      const count = Array.isArray(data.models) ? data.models.length : 0;
      return {
        success: true,
        message: `Successfully connected to Google Gemini API! (${count} models available)`,
        modelInfo: 'gemini-1.5-flash / gemini-1.5-pro'
      };
    } catch (err: any) {
      return {
        success: false,
        message: `Network or CORS error connecting to Gemini API: ${err.message || 'Check your internet connection.'}`
      };
    }
  } else {
    // OpenAI
    try {
      const response = await fetch('https://api.openai.com/v1/models', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${cleanKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const msg = errorData?.error?.message || `HTTP ${response.status}: Authentication failed`;
        return { success: false, message: `OpenAI verification failed: ${msg}` };
      }

      return {
        success: true,
        message: 'Successfully connected to OpenAI API! Model access verified.',
        modelInfo: 'gpt-4o / gpt-4o-mini'
      };
    } catch (err: any) {
      return {
        success: false,
        message: `Network or CORS error connecting to OpenAI API: ${err.message || 'Check your internet connection.'}`
      };
    }
  }
}

/**
 * Perform AI Multimodal Forensic Analysis with Gemini or OpenAI
 */
export async function analyzeMediaWithAI(params: {
  mediaType: 'image' | 'video' | 'audio';
  fileName: string;
  fileBase64?: string;
  mimeType?: string;
  fileSize: string;
  metadataSummary: string;
}): Promise<{
  aiUsed: boolean;
  provider?: AIProvider;
  verdict?: 'REAL' | 'FAKE' | 'UNCERTAIN';
  authenticityScore?: number;
  fakeProbability?: number;
  confidence?: number;
  riskLevel?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  primaryEvidence?: string[];
  findings?: string;
  lipSyncEvaluation?: string;
}> {
  const config = getAIProviderConfig();
  const apiKey = config.provider === 'gemini' ? config.geminiApiKey : config.openaiApiKey;

  if (!apiKey || apiKey.trim().length === 0) {
    // No API key configured, use local DSP engine
    return { aiUsed: false };
  }

  const prompt = `You are TruthLense AI, an elite multimodal digital forensics examiner adhering to ISO/IEC 27037 standards.
Analyze the following media asset for potential deepfake manipulation, AI generation, face swapping, voice synthesis, or tampering.

Media Specs:
- File: ${params.fileName}
- Media Type: ${params.mediaType}
- Size: ${params.fileSize}
- Provenance/Metadata: ${params.metadataSummary}

Examine for:
1. Face manipulation, blending boundaries, edge/noise inconsistencies, lighting and corneal shadow anomalies.
2. Splicing, warping, GAN artifacts, diffusion texture smoothing, double JPEG compression DCT blocks.
3. For video/audio: lip-sync desynchronization, mechanical pitch contours, synthetic vocoder 16kHz cutoffs, temporal flicker.
4. If signals are conflicting or heavy transport compression masks artifacts, strictly conclude UNCERTAIN.

Respond strictly in valid JSON with this exact schema:
{
  "verdict": "REAL" | "FAKE" | "UNCERTAIN",
  "authenticityScore": number between 0 and 100,
  "fakeProbability": number between 0 and 100,
  "confidence": number between 0 and 100,
  "riskLevel": "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
  "primaryEvidence": ["point 1", "point 2", "point 3"],
  "summary": "Detailed explanation of forensic observations",
  "lipSyncEvaluation": "Optional notes on audio/video sync"
}`;

  try {
    if (config.provider === 'gemini') {
      const parts: any[] = [{ text: prompt }];

      if (params.fileBase64 && params.mimeType && params.mediaType === 'image') {
        parts.push({
          inline_data: {
            mime_type: params.mimeType,
            data: params.fileBase64.replace(/^data:image\/[a-z]+;base64,/, '')
          }
        });
      }

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey.trim()}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts }],
            generationConfig: {
              temperature: 0.2,
              responseMimeType: 'application/json'
            }
          })
        }
      );

      if (!res.ok) {
        console.warn('Gemini inference error:', await res.text());
        return { aiUsed: false };
      }

      const json = await res.json();
      const textResponse = json.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!textResponse) return { aiUsed: false };

      const parsed = JSON.parse(textResponse);
      return {
        aiUsed: true,
        provider: 'gemini',
        verdict: parsed.verdict,
        authenticityScore: Number(parsed.authenticityScore),
        fakeProbability: Number(parsed.fakeProbability),
        confidence: Number(parsed.confidence),
        riskLevel: parsed.riskLevel,
        primaryEvidence: parsed.primaryEvidence,
        findings: parsed.summary,
        lipSyncEvaluation: parsed.lipSyncEvaluation
      };
    } else {
      // OpenAI GPT-4o
      const messages: any[] = [
        {
          role: 'system',
          content: 'You are TruthLense AI, an expert digital forensics assistant. Respond in pure JSON format.'
        }
      ];

      const contentParts: any[] = [{ type: 'text', text: prompt }];

      if (params.fileBase64 && params.mediaType === 'image') {
        contentParts.push({
          type: 'image_url',
          image_url: { url: params.fileBase64 }
        });
      }

      messages.push({ role: 'user', content: contentParts });

      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey.trim()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages,
          response_format: { type: 'json_object' },
          temperature: 0.2
        })
      });

      if (!res.ok) {
        console.warn('OpenAI inference error:', await res.text());
        return { aiUsed: false };
      }

      const json = await res.json();
      const content = json.choices?.[0]?.message?.content;
      if (!content) return { aiUsed: false };

      const parsed = JSON.parse(content);
      return {
        aiUsed: true,
        provider: 'openai',
        verdict: parsed.verdict,
        authenticityScore: Number(parsed.authenticityScore),
        fakeProbability: Number(parsed.fakeProbability),
        confidence: Number(parsed.confidence),
        riskLevel: parsed.riskLevel,
        primaryEvidence: parsed.primaryEvidence,
        findings: parsed.summary,
        lipSyncEvaluation: parsed.lipSyncEvaluation
      };
    }
  } catch (e) {
    console.warn('AI analysis fallback triggered:', e);
    return { aiUsed: false };
  }
}
