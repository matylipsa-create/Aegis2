import { useState, useCallback, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { sendDemoEvent } from '../lib/pipedream';
import type { SecurityEvent } from '../types';

function randomHash(): string {
  const chars = '0123456789abcdef';
  let h = '';
  for (let i = 0; i < 64; i++) h += chars[Math.floor(Math.random() * 16)];
  return h;
}

export function usePanic() {
  const { state, addEvent, setAlertLevel, setStatus, incrementTelegramCount, markEventTelegramSent } = useApp();
  const [panicActive, setPanicActive] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const triggerPanic = useCallback(async () => {
    setPanicActive(true);
    setStatus('ARMADO');
    setAlertLevel('CRITICO');

    if (navigator.vibrate) {
      navigator.vibrate([200, 100, 200, 100, 400]);
    }

    try {
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AC();
      }
      const ctx = audioCtxRef.current;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.setValueAtTime(440, now + 0.15);
      osc.frequency.setValueAtTime(880, now + 0.3);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.6);
    } catch { /* noop */ }

    const lat = state.sensors.gpsLat ?? -34.6037;
    const lng = state.sensors.gpsLng ?? -58.3816;

    const event: SecurityEvent = {
      id: `panic-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      type: 'PANIC_ALERT',
      timestamp: Date.now(),
      lat,
      lng,
      hash: randomHash(),
      metadata: {
        source: state.settings.realMode ? 'real-panic' : 'demo-panic',
        trigger: 'manual',
        gpsAccuracy: state.sensors.gpsActive ? 'high' : 'fallback',
      },
      demo: !state.settings.realMode,
    };
    addEvent(event);

    if (state.settings.sendDemoToTelegram && state.settings.pipedreamWebhookUrl) {
      const ok = await sendDemoEvent(event, state.settings.pipedreamWebhookUrl);
      if (ok) {
        incrementTelegramCount();
        markEventTelegramSent(event.id);
      }
    }

    setTimeout(() => setPanicActive(false), 3000);
  }, [state.settings, state.sensors, addEvent, setAlertLevel, setStatus, incrementTelegramCount, markEventTelegramSent]);

  return { panicActive, triggerPanic };
}
