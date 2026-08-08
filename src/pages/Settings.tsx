import { X, Webhook, Send, BatteryLow } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function Settings({ open, onClose }: Props) {
  const { state, updateSettings, setMode } = useApp();
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center" style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }} onClick={onClose}>
      <div className="animate-slide-up w-full sm:max-w-md max-h-[85vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl"
        style={{ background: 'linear-gradient(180deg, #111326 0%, #0A0C1A 100%)', border: '1px solid rgba(59,130,246,0.2)' }}
        onClick={e => e.stopPropagation()}>

        <div className="sticky top-0 flex items-center justify-between px-5 py-4" style={{ background: 'rgba(10,12,26,0.95)', borderBottom: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(8px)' }}>
          <span className="font-display font-semibold text-white">Configuracion</span>
          <button onClick={onClose} className="p-1.5 rounded-lg active:scale-90" style={{ background: 'rgba(255,255,255,0.05)' }}>
            <X size={18} style={{ color: '#9CA3AF' }} />
          </button>
        </div>

        <div className="p-5 space-y-5">
          <div>
            <div className="text-[10px] uppercase tracking-wider mb-2" style={{ color: '#6B7280' }}>Modo de la App</div>
            <div className="flex gap-2">
              <button onClick={() => setMode('normal')}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-all active:scale-95"
                style={{
                  background: state.mode === 'normal' ? 'rgba(59,130,246,0.15)' : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${state.mode === 'normal' ? 'rgba(59,130,246,0.4)' : 'rgba(255,255,255,0.06)'}`,
                  color: state.mode === 'normal' ? '#3B82F6' : '#6B7280',
                }}>
                Normal
              </button>
              <button onClick={() => setMode('technical')}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-all active:scale-95"
                style={{
                  background: state.mode === 'technical' ? 'rgba(59,130,246,0.15)' : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${state.mode === 'technical' ? 'rgba(59,130,246,0.4)' : 'rgba(255,255,255,0.06)'}`,
                  color: state.mode === 'technical' ? '#3B82F6' : '#6B7280',
                }}>
                Tecnico
              </button>
            </div>
          </div>

          <div>
            <div className="text-[10px] uppercase tracking-wider mb-2" style={{ color: '#6B7280' }}>Integracion Telegram (Pipedream)</div>
            <div className="space-y-3">
              <div>
                <label className="text-xs flex items-center gap-1.5 mb-1.5" style={{ color: '#9CA3AF' }}>
                  <Webhook size={12} /> URL del Webhook
                </label>
                <input
                  type="url"
                  value={state.settings.pipedreamWebhookUrl}
                  onChange={e => updateSettings({ pipedreamWebhookUrl: e.target.value })}
                  placeholder="https://hooks.pipedream.com/..."
                  className="w-full px-3 py-2 rounded-xl text-sm font-mono outline-none transition-all"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', color: '#E5E7EB' }}
                />
              </div>
              <button
                onClick={() => updateSettings({ sendDemoToTelegram: !state.settings.sendDemoToTelegram })}
                className="w-full flex items-center justify-between py-2.5 px-3 rounded-xl transition-all active:scale-95"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div className="flex items-center gap-2">
                  <Send size={14} style={{ color: state.settings.sendDemoToTelegram ? '#3B82F6' : '#6B7280' }} />
                  <span className="text-sm" style={{ color: '#E5E7EB' }}>Enviar eventos demo a Telegram</span>
                </div>
                <div className="w-10 h-6 rounded-full transition-all relative" style={{
                  background: state.settings.sendDemoToTelegram ? '#3B82F6' : 'rgba(255,255,255,0.1)',
                }}>
                  <div className="absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all" style={{
                    left: state.settings.sendDemoToTelegram ? '18px' : '2px',
                  }} />
                </div>
              </button>
            </div>
          </div>

          {state.demoMode && (
            <div className="rounded-xl p-3 flex items-center gap-2" style={{ background: 'rgba(252,211,77,0.08)', border: '1px solid rgba(252,211,77,0.2)' }}>
              <span className="text-xs" style={{ color: '#FCD34D' }}>Modo Demo activo — los datos son simulados</span>
            </div>
          )}

          <div>
            <div className="text-[10px] uppercase tracking-wider mb-2" style={{ color: '#6B7280' }}>Optimizacion de Recursos</div>
            <button
              onClick={() => updateSettings({ powerSavingMode: !state.settings.powerSavingMode })}
              className="w-full flex items-center justify-between py-2.5 px-3 rounded-xl transition-all active:scale-95"
              style={{
                background: state.settings.powerSavingMode ? 'rgba(34,197,94,0.08)' : 'rgba(255,255,255,0.03)',
                border: `1px solid ${state.settings.powerSavingMode ? 'rgba(34,197,94,0.3)' : 'rgba(255,255,255,0.08)'}`,
              }}>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <BatteryLow size={14} style={{ color: state.settings.powerSavingMode ? '#22C55E' : '#6B7280' }} />
                  <span className="text-sm" style={{ color: '#E5E7EB' }}>Modo Ahorro de Energia</span>
                </div>
                <span className="text-[10px] mt-1" style={{ color: '#6B7280' }}>
                  {state.settings.powerSavingMode
                    ? 'Solo GPS + panico. Sin animaciones. Actualizacion reducida.'
                    : 'Desactiva animaciones, reduce frecuencia y limita modulos a GPS + panico.'}
                </span>
              </div>
              <div className="w-10 h-6 rounded-full transition-all relative flex-shrink-0" style={{
                background: state.settings.powerSavingMode ? '#22C55E' : 'rgba(255,255,255,0.1)',
              }}>
                <div className="absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all" style={{
                  left: state.settings.powerSavingMode ? '18px' : '2px',
                }} />
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
