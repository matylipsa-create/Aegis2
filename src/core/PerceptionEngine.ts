export interface AmbiguityResult {
  isAmbiguous: boolean;
  confidence: number;
  interpretation: string[];
}

export interface NoiseAnalysisResult {
  patterns: string[];
  confidence: number;
}

export interface UncertaintyResult {
  level: 'low' | 'medium' | 'high';
  requiresHumanVeto: boolean;
}

type SensorInput = {
  type?: string;
  metadata?: Record<string, unknown>;
  confidence?: number;
  source?: string;
  module?: string;
};

const AMBIGUOUS_EVENT_TYPES = new Set([
  'AUDIO_ANOMALY',
  'VIBRATION_SENSOR',
  'MOTION_DETECTED',
  'FACE_RECOGNIZED',
]);

const NOISE_EVENT_TYPES = new Set([
  'AUDIO_ANOMALY',
  'VIBRATION_SENSOR',
  'MOTION_DETECTED',
]);

function coerce(input: unknown): SensorInput {
  if (input && typeof input === 'object') return input as SensorInput;
  return {};
}

export function detectAmbiguousPattern(input: unknown): AmbiguityResult {
  const data = coerce(input);
  const interpretations: string[] = [];
  let ambiguityScore = 0;

  const eventType = data.type ?? '';
  const meta = data.metadata ?? {};
  const eventConfidence = typeof data.confidence === 'number'
    ? data.confidence
    : typeof meta.confidence === 'number' ? meta.confidence : 85;

  if (AMBIGUOUS_EVENT_TYPES.has(eventType)) {
    ambiguityScore += 30;
    interpretations.push(`${eventType} presenta senales superpuestas con multiples causas posibles`);
  }

  if (eventConfidence < 75) {
    ambiguityScore += 25;
    interpretations.push(`Confianza del sensor (${eventConfidence}%) por debajo del umbral de claridad`);
  }

  const module = data.module ?? meta.module;
  if (module === 'AUDIO' || module === 'IA') {
    ambiguityScore += 15;
    interpretations.push(`Modulo ${module} puede interpretar el mismo estímulo de formas contradictorias`);
  }

  if (meta.audioLevel !== undefined && typeof meta.audioLevel === 'number' && meta.audioLevel > 0.8) {
    ambiguityScore += 10;
    interpretations.push('Nivel de audio en rango saturado: posible falso positivo acustico');
  }

  if (meta.keyword !== undefined && meta.keyword !== null && meta.keyword !== '') {
    ambiguityScore += 10;
    interpretations.push(`Palabra clave detectada ("${String(meta.keyword)}"): requiere confirmacion contextual`);
  }

  const isAmbiguous = ambiguityScore >= 40;
  const confidence = Math.max(0, Math.min(100, 100 - ambiguityScore));

  if (interpretations.length === 0) {
    interpretations.push('Patron claro: no se detectan senales contradictorias');
  }

  return { isAmbiguous, confidence, interpretation: interpretations };
}

export function analyzeStructuredNoise(input: unknown): NoiseAnalysisResult {
  const data = coerce(input);
  const patterns: string[] = [];
  let noiseConfidence = 50;

  const eventType = data.type ?? '';
  const meta = data.metadata ?? {};

  if (NOISE_EVENT_TYPES.has(eventType)) {
    patterns.push(`${eventType}: variacion periodica detectada en ventana de muestreo`);
    noiseConfidence += 15;
  }

  if (meta.audioLevel !== undefined && typeof meta.audioLevel === 'number') {
    if (meta.audioLevel > 0.8) {
      patterns.push('Pico acustico sostenido: patron de ruido estructurado de alta energia');
      noiseConfidence += 10;
    } else if (meta.audioLevel > 0.4) {
      patterns.push('Fluctuacion acustica moderada: posible transicion de estado');
      noiseConfidence += 5;
    }
  }

  if (meta.vibration !== undefined && typeof meta.vibration === 'number' && meta.vibration > 0.6) {
    patterns.push('Vibracion sostenida fuera de banda base: descartar fuente mecanica conocida');
    noiseConfidence += 10;
  }

  const module = data.module ?? meta.module;
  if (module === 'GPS') {
    patterns.push('Deriva GPS dentro de tolerancia: ruido estructural esperado');
    noiseConfidence += 5;
  }

  if (patterns.length === 0) {
    patterns.push('Sin patrones de ruido estructurado significativos');
  }

  return { patterns, confidence: Math.min(100, noiseConfidence) };
}

export function assessUncertainty(input: unknown): UncertaintyResult {
  const ambiguity = detectAmbiguousPattern(input);
  const noise = analyzeStructuredNoise(input);

  let uncertaintyScore = 0;

  if (ambiguity.isAmbiguous) uncertaintyScore += 35;
  if (ambiguity.confidence < 60) uncertaintyScore += 20;
  if (noise.confidence > 70) uncertaintyScore += 15;

  const data = coerce(input);
  const eventConfidence = typeof data.confidence === 'number'
    ? data.confidence
    : typeof data.metadata?.confidence === 'number' ? data.metadata.confidence : 85;
  if (eventConfidence < 70) uncertaintyScore += 20;

  const level: UncertaintyResult['level'] =
    uncertaintyScore >= 60 ? 'high' :
    uncertaintyScore >= 30 ? 'medium' : 'low';

  return {
    level,
    requiresHumanVeto: level === 'high',
  };
}
