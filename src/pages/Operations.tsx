import { Activity, Send, Radio, Database, CircleCheck as CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Operations() {
  const { state } = useApp();
  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-display text-xl font-bold text-white">Operaciones</h1>
        <p className="text-xs mt-0.5" style={{ color: '#6B7280' }}>Eventos, cola FIFO y sincronizacion</p>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div className="rounded-xl p-3 text-center" style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)' }}>
          <Activity size={16} className="mx-auto mb-1" style={{ color: '#3B82F6' }} />
          <div className="text-lg font-bold font-mono" style={{ color: '#3B82F6' }}>{state.events.length}</div>
          <div className="text-[9px]" style={{ color: '#6B7280' }}>Eventos</div>
        </div>
        <div className="rounded-xl p-3 text-center" style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)' }}>
          <Send size={16} className="mx-auto mb-1" style={{ color: '#22C55E' }} />
          <div className="text-lg font-bold font-mono" style={{ color: '#22C55E' }}>{state.telegramSentCount}</div>
          <div className="text-[9px]" style={{ color: '#6B7280' }}>Telegram</div>
        </div>
        <div className="rounded-xl p-3 text-center" style={{ background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.2)' }}>
          <Database size={16} className="mx-auto mb-1" style={{ color: '#FBBF24' }} />
          <div className="text-lg font-bold font-mono" style={{ color: '#FBBF24' }}>IDB</div>
          <div className="text-[9px]" style={{ color: '#6B7280' }}>Storage</div>
        </div>
      </div>

      <div>
        <div className="flex items-center gap-1.5 mb-2">
          <Radio size={12} style={{ color: '#3B82F6' }} />
          <span className="text-[10px] uppercase tracking-wider" style={{ color: '#6B7280' }}>Cola de Eventos (FIFO)</span>
        </div>
        <div className="space-y-1 max-h-64 overflow-y-auto">
          {state.events.length === 0 ? (
            <div className="text-xs text-center py-8" style={{ color: '#4B5563' }}>Sin eventos en cola</div>
          ) : state.events.map(e => (
            <div key={e.id} className="rounded-lg py-2 px-3 animate-fade-in" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div className="flex items-center justify-between mb-0.5">
                <span className="text-xs font-mono" style={{ color: '#9CA3AF' }}>{e.type}</span>
                <span className="text-[9px] font-mono" style={{ color: '#4B5563' }}>{new Date(e.timestamp).toLocaleTimeString('es-AR')}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-mono" style={{ color: '#4B5563' }}>hash: {e.hash.slice(0, 20)}...</span>
                <div className="flex items-center gap-1.5">
                  {e.telegramSent && (
                    <span className="flex items-center gap-0.5 text-[8px] px-1.5 py-0.5 rounded-full"
                      style={{ background: 'rgba(59,130,246,0.15)', color: '#60A5FA', border: '1px solid rgba(59,130,246,0.3)' }}>
                      <CheckCircle2 size={8} /> Telegram
                    </span>
                  )}
                  {e.demo && <span className="text-[8px] px-1.5 py-0.5 rounded-full" style={{ background: 'rgba(252,211,77,0.1)', color: '#FCD34D' }}>DEMO</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
