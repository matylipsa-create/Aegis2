import { useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';

export function useRealModeSensors() {
  const { state, setSensors } = useApp();
  const watchIdRef = useRef<number | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const audioStreamRef = useRef<MediaStream | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const rafRef = useRef<number | null>(null);

  const realMode = state.settings.realMode;
  const powerSaving = state.settings.powerSavingMode;

  useEffect(() => {
    if (!realMode || powerSaving) {
      if (watchIdRef.current !== null && navigator.geolocation) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
        audioCtxRef.current = null;
      }
      if (audioStreamRef.current) {
        audioStreamRef.current.getTracks().forEach(t => t.stop());
        audioStreamRef.current = null;
      }
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      setSensors({
        audioActive: false,
        gpsActive: false,
        audioError: null,
        gpsError: null,
        audioLevel: 0,
      });
      return;
    }

    let cancelled = false;

    async function startAudio() {
      try {
        if (!navigator.mediaDevices?.getUserMedia) {
          setSensors({ audioError: 'getUserMedia no soportado' });
          return;
        }
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
        if (cancelled) { stream.getTracks().forEach(t => t.stop()); return; }
        audioStreamRef.current = stream;
        const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const ctx = new AC();
        audioCtxRef.current = ctx;
        const source = ctx.createMediaStreamSource(stream);
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 256;
        analyser.smoothingTimeConstant = 0.6;
        source.connect(analyser);
        analyserRef.current = analyser;
        setSensors({ audioActive: true, audioError: null });

        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        const updateLevel = () => {
          if (cancelled || !analyserRef.current) return;
          analyserRef.current.getByteTimeDomainData(dataArray);
          let sum = 0;
          for (let i = 0; i < dataArray.length; i++) {
            const v = (dataArray[i] - 128) / 128;
            sum += v * v;
          }
          const rms = Math.sqrt(sum / dataArray.length);
          const level = Math.min(100, Math.round(rms * 200));
          setSensors({ audioLevel: level });
          rafRef.current = requestAnimationFrame(updateLevel);
        };
        rafRef.current = requestAnimationFrame(updateLevel);
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Error desconocido';
        setSensors({ audioError: msg, audioActive: false });
      }
    }

    function startGPS() {
      if (!navigator.geolocation) {
        setSensors({ gpsError: 'Geolocation no soportado', gpsActive: false });
        return;
      }
      watchIdRef.current = navigator.geolocation.watchPosition(
        (pos) => {
          if (cancelled) return;
          setSensors({
            gpsActive: true,
            gpsError: null,
            gpsLat: pos.coords.latitude,
            gpsLng: pos.coords.longitude,
          });
        },
        (err) => {
          if (cancelled) return;
          setSensors({ gpsError: err.message, gpsActive: false });
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 5000 }
      );
    }

    startAudio();
    startGPS();

    return () => {
      cancelled = true;
      if (watchIdRef.current !== null && navigator.geolocation) { navigator.geolocation.clearWatch(watchIdRef.current); watchIdRef.current = null; }
      if (audioCtxRef.current) { audioCtxRef.current.close().catch(() => {}); audioCtxRef.current = null; }
      if (audioStreamRef.current) { audioStreamRef.current.getTracks().forEach(t => t.stop()); audioStreamRef.current = null; }
      if (rafRef.current !== null) { cancelAnimationFrame(rafRef.current); rafRef.current = null; }
    };
  }, [realMode, powerSaving, setSensors]);
}
