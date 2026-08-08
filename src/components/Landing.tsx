import { useEffect, useRef } from 'react';
import {
  WifiOff,
  ShieldCheck,
  FileLock2,
  Layers,
  BrainCircuit,
  ArrowDown,
  ArrowRight,
  Github,
  Instagram,
  Youtube,
  ExternalLink,
} from 'lucide-react';

interface LandingProps {
  onEnterApp: () => void;
}

const PILLARS = [
  {
    icon: WifiOff,
    title: 'Offline-First',
    text: 'Funciona sin internet. Estás protegido aunque no haya señal.',
  },
  {
    icon: ShieldCheck,
    title: 'Veto Humano',
    text: 'La IA sugiere, vos decidís. Nunca al revés.',
  },
  {
    icon: FileLock2,
    title: 'Evidencia Inmutable',
    text: 'Cada evento queda registrado y verificable.',
  },
  {
    icon: Layers,
    title: 'Multi-Modo',
    text: 'Simple para todos. Potente para los que necesitan más.',
  },
  {
    icon: BrainCircuit,
    title: 'Percepción',
    text: 'Aegis no solo alerta. Analiza, interpreta y te ayuda a decidir.',
  },
];

const SOCIAL_LINKS = [
  { label: 'GitHub', href: 'https://github.com/matylipsa-create/Aegis2', icon: Github },
  { label: 'Vercel', href: 'https://vercel.com', icon: ExternalLink },
  { label: 'Instagram', href: 'https://instagram.com', icon: Instagram },
  { label: 'YouTube', href: 'https://youtube.com', icon: Youtube },
];

export default function Landing({ onEnterApp }: LandingProps) {
  const whatRef = useRef<HTMLDivElement>(null);

  const scrollToWhat = () => {
    whatRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  useEffect(() => {
    const sections = document.querySelectorAll('.land-reveal');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('land-reveal-in');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="land-root">
      {/* ===== HERO ===== */}
      <section className="land-hero">
        <div className="land-hero-glow" />
        <div className="land-hero-content land-reveal">
          <p className="land-hero-eyebrow">AEGIS</p>
          <h1 className="land-hero-title">
            La IA sugiere,<br />el humano decide.
          </h1>
          <p className="land-hero-sub">
            Aegis es un sistema que te devuelve el control. No reemplaza tu juicio, lo amplifica.
          </p>
          <button onClick={scrollToWhat} className="land-btn-primary">
            Conocé Aegis
            <ArrowDown size={18} className="land-btn-arrow" />
          </button>
        </div>
        <div className="land-hero-scroll-hint" aria-hidden="true" />
      </section>

      {/* ===== QUÉ ES AEGIS ===== */}
      <section ref={whatRef} className="land-what land-reveal">
        <div className="land-what-text">
          <h2 className="land-section-title">Qué es Aegis</h2>
          <p className="land-what-body">
            Aegis nació para que la tecnología te asista sin reemplazarte. Para que tengas
            evidencia cuando la necesites, y control cuando más importa. No es una alarma.
            Es una herramienta de confianza.
          </p>
        </div>
        <div className="land-what-visual">
          <div className="land-phone-mock">
            <div className="land-phone-notch" />
            <div className="land-phone-screen">
              <div className="land-phone-statusbar">
                <span>AEGIS</span>
                <span className="land-phone-dot land-phone-dot--safe" />
              </div>
              <div className="land-phone-body">
                <div className="land-phone-card land-phone-card--accent">
                  <BrainCircuit size={20} />
                  <div>
                    <p className="land-phone-card-title">Patrón ambiguo</p>
                    <p className="land-phone-card-sub">Confianza 63% — Requiere revisión</p>
                  </div>
                </div>
                <div className="land-phone-card">
                  <ShieldCheck size={20} />
                  <div>
                    <p className="land-phone-card-title">Veto humano</p>
                    <p className="land-phone-card-sub">Confirmar o descartar</p>
                  </div>
                </div>
                <div className="land-phone-card">
                  <FileLock2 size={20} />
                  <div>
                    <p className="land-phone-card-title">Evidencia</p>
                    <p className="land-phone-card-sub">Hash verificado · 09:41</p>
                  </div>
                </div>
                <div className="land-phone-veto-row">
                  <button className="land-phone-veto-btn land-phone-veto-btn--confirm">Confirmar</button>
                  <button className="land-phone-veto-btn land-phone-veto-btn--dismiss">Descartar</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== PILARES ===== */}
      <section className="land-pillars land-reveal">
        <h2 className="land-section-title land-section-title--center">Pilares</h2>
        <div className="land-pillars-grid">
          {PILLARS.map((p) => {
            const Icon = p.icon;
            return (
              <div key={p.title} className="land-pillar-card land-reveal">
                <div className="land-pillar-icon">
                  <Icon size={26} strokeWidth={1.6} />
                </div>
                <h3 className="land-pillar-title">{p.title}</h3>
                <p className="land-pillar-text">{p.text}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ===== TESTIMONIO ===== */}
      <section className="land-testimony land-reveal">
        <div className="land-testimony-card">
          <div className="land-testimony-mark">"</div>
          <p className="land-testimony-text">
            Lo que más valoro es que Aegis me devuelve la tranquilidad. No me vigila, me acompaña.
          </p>
          <p className="land-testimony-author">— Beta tester</p>
        </div>
      </section>

      {/* ===== CTA FINAL ===== */}
      <section className="land-cta land-reveal">
        <h2 className="land-cta-title">Probá Aegis. Sin instalar nada. Sin compromiso.</h2>
        <button onClick={onEnterApp} className="land-btn-primary land-btn-primary--lg">
          Probar la demo
          <ArrowRight size={18} className="land-btn-arrow" />
        </button>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="land-footer">
        <div className="land-footer-links">
          {SOCIAL_LINKS.map((s) => {
            const Icon = s.icon;
            return (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="land-footer-link">
                <Icon size={18} strokeWidth={1.6} />
                <span>{s.label}</span>
              </a>
            );
          })}
        </div>
        <p className="land-footer-tag">Hecho con propósito, desde cualquier lugar.</p>
      </footer>
    </div>
  );
}
