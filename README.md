# Aegis 2 — Seguridad Soberana

> **Escudo y Espada** — Sistema táctico de seguridad soberana, offline-first, con veto humano.

[![Deploy](https://img.shields.io/badge/Vercel-Live-black?logo=vercel)](https://aegis2.vercel.app)
[![Demo](https://img.shields.io/badge/Bolt-Demo-00E5FF)](https://aegis2.bolt.app)

## Demo

La aplicación es accesible sin autenticación agregando `?demo=true` a la URL:

- **Vercel**: https://aegis2.vercel.app?demo=true
- **Bolt**: https://aegis2.bolt.app?demo=true

Para diagnóstico completo, agregá `?debug=true`:

```
https://aegis2.vercel.app?demo=true&debug=true
```

## Características

- **Offline-First**: funciona sin conexión a la nube, sincroniza cuando vuelve la red
- **Veto Humano**: ninguna acción crítica se ejecuta sin confirmación del operador
- **PWA Instalable**: instalable desde Chrome/Edge en Android y PC
- **Identidad Soberana**: nombre, ícono y colores propios — sin dependencias de marca externa
- **Detección por IA**: visión, audio y palabras clave con filtrado por confianza
- **Centro de Evidencia**: captura y registro automático de eventos detectados
- **Regulación Cognitiva**: asistente de voz con consolidación de mensajes repetidos
- **Capa Perceptiva (EVOLIS)**: detección de patrones ambiguos, análisis de ruido estructurado y derivación al veto humano ante incertidumbre alta

## Perception Layer

La capa perceptiva es el núcleo cognitivo de Aegis que permite al sistema pasar de un sistema de alertas a un analizador de estados complejos en tiempo real. Está implementada en `src/core/` y se compone de tres pilares:

### 1. Detección de Patrones Ambiguos (`detectAmbiguousPattern`)
Analiza cada evento entrante y determina si las señales del sensor admiten múltiples interpretaciones contradictorias. Evalúa el tipo de evento, la confianza del sensor, el módulo de origen y las características de la señal (nivel de audio, palabras clave) para producir un puntaje de ambigüedad y una lista de interpretaciones posibles.

### 2. Análisis de Ruido Estructurado (`analyzeStructuredNoise`)
Examina las señales de los sensores en busca de patrones de ruido con estructura periódica o sostenida que puedan confundirse con eventos reales. Distingue entre fluctuaciones esperadas (deriva GPS dentro de tolerancia) y ruido de alta energía que requiere atención (picos acústicos sostenidos, vibración fuera de banda base).

### 3. Evaluación de Incertidumbre y Veto Humano (`assessUncertainty`)
Combina los resultados de los dos pilares anteriores para clasificar el nivel de incertidumbre del evento en `low`, `medium` o `high`. Cuando la incertidumbre es alta, activa el protocolo de veto humano: el sistema pausa cualquier acción automática y requiere que el operador confirme la interpretación antes de proceder.

### Integración EVOLIS
El módulo `EVOLIS` (`src/core/EVOLIS.ts`) orquesta los tres pilares. Cada evento que ingresa al sistema pasa por `analyzeEvent()`, que ejecuta los tres análisis y, si la incertidumbre es alta, invoca al veto handler registrado. En el flujo de demostración, el veto handler registra una advertencia en consola; en producción, este hook se conecta a la interfaz de confirmación del operador.

## PWA

- **Nombre**: Aegis 2
- **Theme Color**: `#0A0C12`
- **Background Color**: `#0A0C12`
- **Ícono**: Escudo cyan con texto "Aegis 2" (192×192 y 512×512)
- **Display**: Standalone

Al instalar la PWA, el nombre "Aegis 2" aparece en la pantalla de inicio con el ícono del escudo.

## Stack

- React 18 + TypeScript + Vite
- Supabase (auth, base de datos, edge functions)
- Firebase (auth, notificaciones)
- TensorFlow.js (detección de objetos)
- Tailwind CSS

## Integración UE5

Aegis envía eventos cognitivos a Unreal Engine 5 vía WebSocket (puerto 17771) a través del GameBridge. La documentación completa del formato de eventos y el listener en C++/Blueprints está en:

- [docs/UE5_INTEGRATION_GUIDE.md](docs/UE5_INTEGRATION_GUIDE.md)

## Desarrollo

```bash
npm install
npm run dev      # servidor de desarrollo
npm run build    # build de producción
npm run typecheck # verificación de tipos
```

## Licencia

Propietario — © Aegis 2
