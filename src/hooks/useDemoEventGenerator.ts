import { useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { sendDemoEvent } from '../lib/pipedream';
import type { SecurityEvent } from '../types';

const EVENT_TYPES = [
  { type: 'MOTION_DETECTED', weight: 3 },
  { type: 'CAMERA_OFFLINE', weight: 1 },
  { type: 'PERIMETER_BREACH', weight: 1 },
  { type: 'AUDIO_ANOMALY', weight: 2 },
  { type: 'FACE_RECOGNIZED', weight: 1 },
  { type: 'GPS_GEOFENCE_EXIT', weight: 1 },
  { type: 'VIBRATION_SENSOR', weight: 2 },
  { type: 'ANCHOR_REGULATION', weight: 1 },
];

const COORDS = [
  { lat: -34.6037, lng: -58.3816 },
  { lat: -34.6012, lng: -58.3830 },
  { lat: -34.6050, lng: -58.3790 },
  { lat: -34.6025, lng: -58.3820 },
];

const ANCHOR_INTERVAL_MS = 30_000;
const NORMAL_INTERVAL = 15_000;
const POWER_SAVING_INTERVAL = 30_000;

function pickWeighted(excludeType?: string): string {
  const pool = EVENT_TYPES.filter(e => e.type !== excludeType);
  const total = pool.reduce((s, e) => s + e.weight, 0);
  let r = Math.random() * total;
  for (const e of pool) {
    r -= e.weight;
    if (r <= 0) return e.type;
  }
  return pool[0].type;
}

function randomHash(): string {
  const chars = '0123456789abcdef';
  let h = '';
  for (let i = 0; i < 64; i++) h += chars[Math.floor(Math.random() * 16)];
  return h;
}

export function useDemoEventGenerator() {
  const { state, addEvent, incrementTelegramCount, markEventTelegramSent, setAlertLevel, setConfidence, setCognitiveLoad } = useApp();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const settingsRef = useRef(state.settings);
  settingsRef.current = state.settings;
  const lastTypeRef = useRef<string | undefined>(undefined);
  const lastAnchorRef = useRef<number>(0);
  const recentHashesRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!state.demoMode) return;

    const tick = async () => {
      let chosenType = pickWeighted(lastTypeRef.current);

      if (chosenType === 'ANCHOR_REGULATION') {
        const now = Date.now();
        if (now - lastAnchorRef.current < ANCHOR_INTERVAL_MS) {
          chosenType = pickWeighted('ANCHOR_REGULATION');
        } else {
          lastAnchorRef.current = now;
        }
      }
      lastTypeRef.current = chosenType;

      const coord = COORDS[Math.floor(Math.random() * COORDS.length)];
      const jitter = () => (Math.random() - 0.5) * 0.005;
      const hash = randomHash();

      if (recentHashesRef.current.has(hash)) return;
      recentHashesRef.current.add(hash);
      if (recentHashesRef.current.size > 20) {
        const first = recentHashesRef.current.values().next().value;
        if (first) recentHashesRef.current.delete(first);
      }

      const event: SecurityEvent = {
        id: `evt-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        type: chosenType,
        timestamp: Date.now(),
        lat: coord.lat + jitter(),
        lng: coord.lng + jitter(),
        hash,
        metadata: {
          source: 'demo-generator',
          confidence: Math.floor(Math.random() * 30 + 70),
          module: ['CAM', 'AUDIO', 'GPS', 'IA'][Math.floor(Math.random() * 4)],
        },
        demo: true,
      };
      addEvent(event);

      if (chosenType === 'PERIMETER_BREACH' || chosenType === 'CAMERA_OFFLINE') {
        setAlertLevel('CRITICO');
        setConfidence(Math.floor(Math.random() * 20 + 60));
      } else if (chosenType === 'MOTION_DETECTED' || chosenType === 'AUDIO_ANOMALY') {
        setAlertLevel('ALERTA');
        setConfidence(Math.floor(Math.random() * 15 + 75));
      } else {
        setAlertLevel('SEGURO');
        setConfidence(Math.floor(Math.random() * 10 + 85));
      }
      setCognitiveLoad(Math.floor(Math.random() * 40 + 30));

      if (settingsRef.current.sendDemoToTelegram && settingsRef.current.pipedreamWebhookUrl) {
        const ok = await sendDemoEvent(event, settingsRef.current.pipedreamWebhookUrl);
        if (ok) {
          incrementTelegramCount();
          markEventTelegramSent(event.id);
        }
      } else if (settingsRef.current.sendDemoToTelegram && !settingsRef.current.pipedreamWebhookUrl) {
        console.log(`[AEGIS] Evento demo generado (sin webhook): type=${chosenType} hash=${hash.slice(0, 12)}...`);
      }
    };

    const interval = settingsRef.current.powerSavingMode ? POWER_SAVING_INTERVAL : NORMAL_INTERVAL;
    intervalRef.current = setInterval(tick, interval);
    tick();

    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [state.demoMode, state.settings.powerSavingMode, addEvent, incrementTelegramCount, markEventTelegramSent, setAlertLevel, setConfidence, setCognitiveLoad]);
}
