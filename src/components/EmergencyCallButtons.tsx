import { useState } from 'react';
import { Phone, TriangleAlert as AlertTriangle, Siren, X } from 'lucide-react';

interface Props {
  variant: 'panic' | '911' | '107' | '103';
  onPress?: () => void;
}

const CONFIG = {
  panic: { label: 'PANICO', icon: Siren, cls: 'btn-panic', color: '#EF4444', tel: null, badge: null },
  '911': { label: 'EMERGENCIA 911', icon: Phone, cls: 'btn-emergency', color: '#F59E0B', tel: 'tel:911', badge: 'URGENTE' },
  '107': { label: 'EMERGENCIA 107', icon: Phone, cls: 'btn-emergency-secondary', color: '#F59E0B', tel: 'tel:107', badge: null },
  '103': { label: 'EMERGENCIA 103', icon: Phone, cls: 'btn-emergency-secondary', color: '#F59E0B', tel: 'tel:103', badge: null },
} as const;

export default function EmergencyCallButtons({ variant, onPress }: Props) {
  const cfg = CONFIG[variant];
  const Icon = cfg.icon;
  const isPrimary = variant === 'panic' || variant === '911';
  const [showConfirm, setShowConfirm] = useState(false);

  const handleButtonClick = () => {
    if (variant === 'panic') {
      onPress?.();
      return;
    }
    setShowConfirm(true);
  };

  const handleConfirmCall = () => {
    setShowConfirm(false);
    if (cfg.tel) {
      window.location.href = cfg.tel;
    }
  };

  return (
    <>
      <button
        onClick={handleButtonClick}
        className={`${cfg.cls} relative flex items-center justify-center gap-2 w-full rounded-2xl py-3.5 font-semibold active:scale-95`}
        style={{
          background: variant === 'panic' ? '#EF4444' : 'rgba(255,255,255,0.04)',
          color: variant === 'panic' ? '#fff' : cfg.color,
          fontSize: isPrimary ? 14 : 12,
        }}
      >
        <Icon size={isPrimary ? 22 : 18} />
        <span>{cfg.label}</span>
        {cfg.badge && (
          <span className="absolute -top-1.5 -right-1.5 px-1.5 py-0.5 rounded-full text-[8px] font-bold animate-pulse"
            style={{ background: '#DC2626', color: '#fff', border: '1px solid #FCD34D' }}>
            {cfg.badge}
          </span>
        )}
      </button>

      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
          onClick={() => setShowConfirm(false)}>
          <div className="animate-scale-in w-full max-w-xs mx-4 rounded-2xl p-6 text-center"
            style={{ background: 'linear-gradient(180deg, #1A1209 0%, #0A0C12 100%)', border: '1px solid rgba(245,158,11,0.3)' }}
            onClick={e => e.stopPropagation()}>
            <div className="mx-auto mb-4 w-14 h-14 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(245,158,11,0.15)', border: '2px solid rgba(245,158,11,0.4)' }}>
              <AlertTriangle size={28} style={{ color: '#F59E0B' }} />
            </div>
            <h3 className="font-display text-lg font-bold text-white mb-1">Confirmar Llamada</h3>
            <p className="text-sm mb-1" style={{ color: '#9CA3AF' }}>
              Vas a llamar al numero de emergencia:
            </p>
            <p className="text-2xl font-bold font-mono mb-5" style={{ color: '#F59E0B' }}>
              {variant === '911' ? '911' : variant === '107' ? '107' : '103'}
            </p>
            <div className="flex gap-3">
              <button onClick={() => setShowConfirm(false)}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-all active:scale-95"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#9CA3AF' }}>
                Cancelar
              </button>
              <button onClick={handleConfirmCall}
                className="btn-emergency flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all active:scale-95 flex items-center justify-center gap-1.5"
                style={{ background: 'rgba(245,158,11,0.15)', color: '#F59E0B' }}>
                <Phone size={14} />
                Llamar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
