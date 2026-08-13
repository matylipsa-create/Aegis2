import { X, Shield, Cpu, Radio, Activity, Database, Layers, Send, Zap, BatteryLow, Camera, Mic } from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { ModuleState, CameraState } from '../types';

interface Props {
  open: boolean;
  onClose: () => void;
}

const MODULE_ICONS: Record<string, typeof Shield> = {
  CAM: Radio, AUDIO: Activity, GPS: Shield, IA: Cpu, IDB: Database, FIFO: Layers,
};

function ModuleRow({ mod }: { mod: ModuleState }) {
  const Icon = MODULE_ICONS[mod.key] || Shield;
  return (
    <div className="flex items-center justify-between py-2 px-3 rounded-lg"
      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="flex items-center gap-2">
        <Icon size={16} style={{ color: mod.active ? '#FBBF24' : '#6B7280' }} />
        <span className="text-sm font-medium" style={{ color: '#E5E7EB' }}>{mod.label}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-mono" style={{ color: mod.loaded ? '#6B7280' : '#F87171' }}>
          {mod.loaded ? 'LOADED' : 'LAZY'}
        </span>
        <span className="w-2 h-2 rounded-full" style={{
          background: mod.active ? '#22C55E' : '#EF4444',
          boxShadow: mod.active ? '0 0 8px rgba(34,197,94,0.6)' : '0 0 8px rgba(239,68,68,0.6)',
        }} />
      </div>
    </div>
  );
}

const CAMERA_STATUS_STYLE: Record<string, { border: string; glow: string; label: string }> = {
  active: { border: '#22C55E', glow: 'rgba(34,197,94,0.4)', label: 'ACTIVA' },
  fail: { border: '#EF4444', glow: 'rgba(239,68,68,0.4)', label: 'FALLO' },
  connecting: { border: '#FBBF24', glow: 'rgba(251,191,36,0.4)', label: 'CONECTANDO' },
  standby: { border: '#6B7280', glow: 'rgba(107,114,128,0.2)', label: 'STANDBY' },
  unavailable: { border: '#4B5563', glow: 'rgba(75,85,99,0.1)', label: 'N/A' },
};

function CameraRow({ cam }: { cam: CameraState }) {
  const st = CAMERA_STATUS_STYLE[cam.status] || CAMERA_STATUS_STYLE.standby;
  return (
    <div className="flex items-center justify-between py-1.5 px-3 rounded-lg"
      style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid ${st.border}33` }}>
      <span className="text-xs font-medium" style={{ color: '#9CA3AF' }}>{cam.label}</span>
      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full"
        style={{ color: st.border, border: `1px solid ${st.border}55`, background: `${st.border}11` }}>
        {st.label}
      </span>
    </div>
  );
}

function MetricCard({ label, value, color, pulse }: { label: string; value: string; color: string; pulse?: boolean }) {
  return (
    <div className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${color}33` }}>
      <div className="text-[10px] uppercase tracking-wider mb-1" style={{ color: '#6B7280' }}>{label}</div>
      <div className={`text-lg font-bold font-mono ${pulse ? 'animate-pulse' : ''}`} style={{ color }}>
        {value}
      </div>
    </div>
  );
}

export default function AegisMetricsPanel({ open, onClose }: Props) {
  const { state } = useApp();
  if (!open) return null;

  const statusColor = state.status === 'ARMADO' ? '#22C55E' : state.status === 'DESARMADO' ? '#EF4444' : '#FBBF24';
  const activeModules = state.modules.filter(m => m.active).length;
  const lastEvent = state.events[0];
  const isPowerSaving = state.settings.powerSavingMode;
  const isNormal = state.mode === 'normal';
  const camQuality = isPowerSaving ? 'OFF' : isNormal ? '480p' : '1080p';
  const audioQuality = isPowerSaving ? 'OFF' : isNormal ? '16kHz' : '44.1kHz';
  const updateFreq = isPowerSaving ? '30s' : isNormal ? '15s' : '8s';

  return (
    <div className="fixed inset-0 z-40 flex items-end sm:items-center justify-center" style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }} onClick={onClose}>
      <div className="animate-slide-up w-full sm:max-w-md max-h-[85vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl"
        style={{ background: 'linear-gradient(180deg, #1A2A3A 0%, #0A0C12 100%)', border: '1px solid rgba(251,191,36,0.2)', boxShadow: '0 -10px 40px rgba(0,0,0,0.5)' }}
        onClick={e => e.stopPropagation()}>

        <div className="sticky top-0 flex items-center justify-between px-5 py-4" style={{ background: 'rgba(10,12,26,0.95)', borderBottom: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(8px)' }}>
          <div className="flex items-center gap-2">
            <Shield size={20} style={{ color: '#FBBF24' }} />
            <span className="font-display font-semibold text-white">Metricas del Sistema</span>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg transition-all active:scale-90" style={{ background: 'rgba(255,255,255,0.05)' }}>
            <X size={18} style={{ color: '#9CA3AF' }} />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {isPowerSaving && (
            <div className="rounded-xl p-3 flex items-center gap-2 animate-fade-in" style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)' }}>
              <BatteryLow size={16} style={{ color: '#22C55E' }} />
              <span className="text-xs font-semibold" style={{ color: '#4ADE80' }}>Modo Ahorro de Energia activo</span>
            </div>
          )}
          <div className="rounded-xl p-4 flex items-center justify-between" style={{ background: `${statusColor}11`, border: `1px solid ${statusColor}44` }}>
            <div>
              <div className="text-[10px] uppercase tracking-wider mb-1" style={{ color: '#6B7280' }}>Estado del Sistema</div>
              <div className="text-2xl font-bold font-mono animate-pulse" style={{ color: statusColor, textShadow: `0 0 12px ${statusColor}66` }}>
                {state.status}
              </div>
            </div>
            <Shield size={32} style={{ color: statusColor, filter: `drop-shadow(0 0 8px ${statusColor}88)` }} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <MetricCard label="Confianza Global" value={`${state.confidence}%`} color={state.confidence > 80 ? '#22C55E' : state.confidence > 60 ? '#FBBF24' : '#EF4444'} pulse={state.confidence < 70} />
            <MetricCard label="Carga Cognitiva" value={`${state.cognitiveLoad}%`} color={state.cognitiveLoad > 70 ? '#EF4444' : state.cognitiveLoad > 50 ? '#FBBF24' : '#22C55E'} />
            <MetricCard label="Eventos en Cola" value={String(state.events.length)} color="#FBBF24" />
            <MetricCard label="Modulos Activos" value={`${activeModules}/${state.modules.length}`} color="#22C55E" />
          </div>

          <div>
            <div className="text-[10px] uppercase tracking-wider mb-2" style={{ color: '#6B7280' }}>Modulos del Sistema</div>
            <div className="space-y-1.5">
              {state.modules.map(m => <ModuleRow key={m.key} mod={m} />)}
            </div>
          </div>

          <div>
            <div className="text-[10px] uppercase tracking-wider mb-2" style={{ color: '#6B7280' }}>Camaras y Sensores</div>
            <div className="space-y-1">
              {state.cameras.map(c => <CameraRow key={c.id} cam={c} />)}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="rounded-xl p-2.5 flex flex-col items-center gap-1" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <Camera size={14} style={{ color: isPowerSaving ? '#6B7280' : '#FBBF24' }} />
              <div className="text-[9px]" style={{ color: '#6B7280' }}>Camara</div>
              <div className="text-xs font-mono" style={{ color: isPowerSaving ? '#6B7280' : '#9CA3AF' }}>{camQuality}</div>
            </div>
            <div className="rounded-xl p-2.5 flex flex-col items-center gap-1" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <Mic size={14} style={{ color: isPowerSaving ? '#6B7280' : '#FBBF24' }} />
              <div className="text-[9px]" style={{ color: '#6B7280' }}>Audio</div>
              <div className="text-xs font-mono" style={{ color: isPowerSaving ? '#6B7280' : '#9CA3AF' }}>{audioQuality}</div>
            </div>
            <div className="rounded-xl p-2.5 flex flex-col items-center gap-1" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <Activity size={14} style={{ color: '#FBBF24' }} />
              <div className="text-[9px]" style={{ color: '#6B7280' }}>Update</div>
              <div className="text-xs font-mono" style={{ color: '#9CA3AF' }}>{updateFreq}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl p-3 flex items-center gap-2" style={{ background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.25)' }}>
              <Send size={16} style={{ color: '#FBBF24' }} />
              <div>
                <div className="text-[9px] uppercase tracking-wider" style={{ color: '#6B7280' }}>Enviados a Telegram</div>
                <div className="text-base font-bold font-mono" style={{ color: '#FBBF24' }}>{state.telegramSentCount}</div>
              </div>
            </div>
            <div className="rounded-xl p-3 flex items-center gap-2" style={{ background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.25)' }}>
              <Zap size={16} style={{ color: '#FBBF24' }} />
              <div>
                <div className="text-[9px] uppercase tracking-wider" style={{ color: '#6B7280' }}>Ultimo Evento</div>
                <div className="text-xs font-mono" style={{ color: '#FBBF24' }}>{lastEvent ? lastEvent.type : '---'}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
