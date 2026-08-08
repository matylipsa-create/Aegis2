import { useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';

export function useRealModeSensors() {
  const { state, setSensors } = useApp();
  const streamRef = useRef<MediaStream | null>(null);
  const watchIdRef = useRef<number | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const audioStreamRef = useRef<MediaStream | null>(null);

  const realMode = state.settings.realMode;
  const powerSaving = state.settings.powerSavingMode;

  useEffect(() => {
    if (!realMode || powerSaving) {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
        streamRef.current = null;
      }
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
      setSensors({
        cameraActive: false,
        audioActive: false,
        gpsActive: false,
        cameraError: null,
        audioError: null,
        gpsError: null,
      });
      return;
    }

    let cancelled = false;

    async function startCamera() {
      try {
        if (!navigator.mediaDevices?.getUserMedia) {
          setSensors({ cameraError: 'getUserMedia no soportado' });
          return;
        }
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
          audio: false,
        });
        if (cancelled) { stream.getTracks().forEach(t => t.stop()); return; }
        streamRef.current = stream;
        setSensors({ cameraActive: true, cameraError: null });
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Error desconocido';
        setSensors({ cameraError: msg, cameraActive: false });
      }
    }

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
        source.connect(analyser);
        setSensors({ audioActive: true, audioError: null });
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

    startCamera();
    startAudio();
    startGPS();

    return () => {
      cancelled = true;
      if (streamRef.current) { streamRef.current.getTracks().forEach(t => t.stop()); streamRef.current = null; }
      if (watchIdRef.current !== null && navigator.geolocation) { navigator.geolocation.clearWatch(watchIdRef.current); watchIdRef.current = null; }
      if (audioCtxRef.current) { audioCtxRef.current.close().catch(() => {}); audioCtxRef.current = null; }
      if (audioStreamRef.current) { audioStreamRef.current.getTracks().forEach(t => t.stop()); audioStreamRef.current = null; }
    };
  }, [realMode, powerSaving, setSensors]);
}
