import type { SecurityEvent } from '../types';

const PIPEDREAM_KEY = 'aegis-pipedream-webhook';

export function getWebhookUrl(): string {
  try { return localStorage.getItem(PIPEDREAM_KEY) || ''; } catch { return ''; }
}

export function setWebhookUrl(url: string): void {
  try { localStorage.setItem(PIPEDREAM_KEY, url); } catch { /* noop */ }
}

interface DemoEventPayload {
  type: string;
  timestamp: number;
  lat: number;
  lng: number;
  hash: string;
  metadata: Record<string, unknown>;
  demo: boolean;
}

export async function sendDemoEvent(event: SecurityEvent, webhookUrl: string): Promise<boolean> {
  if (!webhookUrl) {
    console.warn('[AEGIS] sendDemoEvent: no webhook URL configured');
    return false;
  }

  const payload: DemoEventPayload = {
    type: event.type,
    timestamp: event.timestamp,
    lat: event.lat,
    lng: event.lng,
    hash: event.hash,
    metadata: event.metadata,
    demo: true,
  };

  try {
    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      console.error(`[AEGIS] Telegram send failed: ${res.status} ${res.statusText}`);
      return false;
    }
    console.log(`[AEGIS] Evento demo enviado a Telegram: type=${event.type} hash=${event.hash.slice(0, 12)}...`);
    return true;
  } catch (err) {
    console.error('[AEGIS] Error enviando evento a Telegram:', err);
    return false;
  }
}
