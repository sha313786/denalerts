// scripts/generate_clean_design.js
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const PUBLIC = path.join(ROOT, 'public');

console.log('Generating ultra-professional, human-crafted design for DenAlerts...');

// ============================================================================
// 1. GENERATE public/landing.css
// ============================================================================
const landingCss = `/* ==========================================================================
   DenAlerts — World-Class SaaS Design System
   Sleek obsidian-slate palette, refined typography, and precision UI craft.
   Designed for alerts.denbooks.in • Built by SRB STUDIOS
   ========================================================================== */

:root {
  /* Obsidian Slate Surface Tokens */
  --bg-page: #080a10;
  --bg-surface: #0e121c;
  --bg-surface-elevated: #131927;
  --bg-surface-hover: #192134;
  --bg-glass: rgba(10, 14, 23, 0.82);
  --bg-glass-card: rgba(14, 18, 28, 0.75);
  --bg-glass-pill: rgba(255, 255, 255, 0.04);

  /* Modern Brand Accents */
  --accent-primary: #6366f1;
  --accent-primary-hover: #4f46e5;
  --accent-primary-subtle: rgba(99, 102, 241, 0.12);
  --accent-primary-border: rgba(99, 102, 241, 0.35);
  
  --accent-violet: #8b5cf6;
  --accent-indigo: #6366f1;
  --accent-emerald: #10b981;
  --accent-emerald-subtle: rgba(16, 185, 129, 0.12);
  --accent-emerald-border: rgba(16, 185, 129, 0.3);
  
  --accent-gold: #f59e0b;
  --accent-rose: #f43f5e;

  /* Typography Colors */
  --text-primary: #f8fafc;
  --text-secondary: #94a3b8;
  --text-tertiary: #64748b;
  --text-dim: #475569;

  /* Borders & Specular Lines */
  --border-subtle: rgba(255, 255, 255, 0.07);
  --border-medium: rgba(255, 255, 255, 0.12);
  --border-highlight: rgba(255, 255, 255, 0.18);

  /* Elevation Shadows */
  --shadow-sm: 0 2px 6px rgba(0, 0, 0, 0.3);
  --shadow-md: 0 10px 28px -4px rgba(0, 0, 0, 0.5);
  --shadow-lg: 0 20px 48px -8px rgba(0, 0, 0, 0.65);
  --shadow-card: inset 0 1px 0 rgba(255, 255, 255, 0.07), 0 12px 32px -4px rgba(0, 0, 0, 0.5);

  /* Radii */
  --radius-xs: 6px;
  --radius-sm: 10px;
  --radius-md: 14px;
  --radius-lg: 20px;
  --radius-xl: 24px;
  --radius-full: 9999px;
}

/* ==========================================================================
   Base & Reset
   ========================================================================== */

*, *::before, *::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  color: var(--text-primary);
  background-color: var(--bg-page);
  line-height: 1.5;
  scroll-behavior: smooth;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  min-height: 100vh;
  overflow-x: hidden;
  background-color: var(--bg-page);
  background-image: 
    radial-gradient(circle at 50% -80px, rgba(99, 102, 241, 0.15), transparent 700px),
    linear-gradient(rgba(255, 255, 255, 0.015) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.015) 1px, transparent 1px);
  background-size: 100% 100%, 48px 48px, 48px 48px;
  background-position: top center, top center, top center;
  position: relative;
}

/* Container */
.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

/* Ambient glow backward compatibility (kept invisible/minimal) */
.ambient-glow-sphere {
  display: none !important;
}

/* ==========================================================================
   Navigation Bar
   ========================================================================== */

.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 68px;
  z-index: 1000;
  background: rgba(8, 10, 16, 0.82);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid var(--border-subtle);
  transition: background 0.2s ease, border-color 0.2s ease;
}

.nav-wrap {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
}

.nav-brand {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  color: var(--text-primary);
}

.brand-icon-box {
  width: 34px;
  height: 34px;
  border-radius: 9px;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.18);
  box-shadow: 0 2px 8px rgba(99, 102, 241, 0.35);
}

.brand-name {
  font-size: 18px;
  font-weight: 800;
  letter-spacing: -0.025em;
  color: #ffffff;
}

.brand-name span {
  color: #818cf8;
}

.brand-version-pill {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  font-weight: 700;
  color: #a5b4fc;
  background: rgba(99, 102, 241, 0.12);
  border: 1px solid rgba(99, 102, 241, 0.28);
  padding: 2px 7px;
  border-radius: var(--radius-full);
  letter-spacing: 0.04em;
}

.nav-menu {
  display: flex;
  align-items: center;
  gap: 4px;
  list-style: none;
}

.nav-menu li a {
  display: inline-block;
  padding: 7px 13px;
  border-radius: var(--radius-xs);
  font-size: 14px;
  font-weight: 500;
  color: var(--text-secondary);
  text-decoration: none;
  transition: all 0.15s ease;
}

.nav-menu li a:hover {
  color: #ffffff;
  background: rgba(255, 255, 255, 0.05);
}

.nav-menu li a.active {
  color: #ffffff;
  background: rgba(255, 255, 255, 0.08);
  font-weight: 600;
}

.nav-cta-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

/* ==========================================================================
   Buttons
   ========================================================================== */

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 13.5px;
  font-weight: 600;
  text-decoration: none;
  padding: 8px 16px;
  border-radius: var(--radius-sm);
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  cursor: pointer;
  border: 1px solid transparent;
  white-space: nowrap;
}

.btn-primary {
  background: linear-gradient(180deg, #6366f1 0%, #4f46e5 100%);
  color: #ffffff;
  border-color: rgba(255, 255, 255, 0.15);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 4px 14px rgba(79, 70, 229, 0.35);
}

.btn-primary:hover {
  background: linear-gradient(180deg, #6d70f8 0%, #5850ec 100%);
  transform: translateY(-1px);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.25), 0 6px 20px rgba(79, 70, 229, 0.45);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.04);
  color: var(--text-primary);
  border-color: var(--border-subtle);
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: var(--border-medium);
  transform: translateY(-1px);
}

.btn-lg {
  padding: 12px 24px;
  font-size: 15px;
  border-radius: var(--radius-md);
}

.btn-icon {
  width: 16px;
  height: 16px;
  stroke: currentColor;
  stroke-width: 2.2;
  fill: none;
}

/* ==========================================================================
   Hero Section
   ========================================================================== */

.hero-section {
  padding: 135px 0 50px;
  text-align: center;
  position: relative;
}

.hero-badge-wrap {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 14px;
  border-radius: var(--radius-full);
  background: rgba(99, 102, 241, 0.08);
  border: 1px solid rgba(99, 102, 241, 0.25);
  font-size: 12.5px;
  font-weight: 600;
  color: #c7d2fe;
  margin-bottom: 24px;
  letter-spacing: 0.02em;
}

.hero-status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #10b981;
  box-shadow: 0 0 8px #10b981;
  animation: pulseDot 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulseDot {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.4; transform: scale(0.85); }
}

.hero-headline {
  font-size: clamp(36px, 5.2vw, 62px);
  font-weight: 800;
  line-height: 1.1;
  letter-spacing: -0.035em;
  color: #ffffff;
  margin-bottom: 20px;
  max-width: 960px;
  margin-left: auto;
  margin-right: auto;
}

.highlight-gradient, .hero-gradient {
  background: linear-gradient(135deg, #a5b4fc 0%, #818cf8 40%, #c084fc 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.hero-subhead {
  font-size: clamp(15.5px, 1.8vw, 18px);
  line-height: 1.6;
  color: var(--text-secondary);
  max-width: 740px;
  margin: 0 auto 34px;
  font-weight: 400;
}

.hero-cta-group {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
  flex-wrap: wrap;
  margin-bottom: 30px;
}

.hero-guarantee-note {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 22px;
  flex-wrap: wrap;
  font-size: 12.5px;
  font-weight: 500;
  color: var(--text-tertiary);
  margin-bottom: 40px;
}

.hero-guarantee-note span {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.hero-guarantee-note svg {
  width: 14px;
  height: 14px;
  stroke: var(--accent-emerald);
  stroke-width: 2.5;
  fill: none;
}

/* Metric Strip / Performance Proof */
.metrics-strip {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin: 20px auto 40px;
  max-width: 1040px;
}

.metric-card {
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  padding: 18px 20px;
  text-align: left;
  box-shadow: var(--shadow-card);
  transition: transform 0.2s ease, border-color 0.2s ease;
}

.metric-card:hover {
  border-color: var(--border-medium);
  transform: translateY(-2px);
}

.metric-value {
  font-family: 'JetBrains Mono', monospace;
  font-size: 28px;
  font-weight: 800;
  color: #ffffff;
  letter-spacing: -0.03em;
  line-height: 1.1;
  margin-bottom: 4px;
}

.metric-label {
  font-size: 12px;
  font-weight: 700;
  color: #818cf8;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 4px;
}

.metric-desc {
  font-size: 12px;
  color: var(--text-tertiary);
  line-height: 1.4;
}

/* ==========================================================================
   Broadcasting & Platforms Marquee Ribbon
   ========================================================================== */

.platforms-marquee-section {
  padding: 24px 0;
  border-top: 1px solid var(--border-subtle);
  border-bottom: 1px solid var(--border-subtle);
  background: rgba(14, 18, 28, 0.4);
  overflow: hidden;
}

.marquee-heading {
  text-align: center;
  font-size: 12px;
  font-weight: 600;
  color: var(--text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 16px;
}

.marquee-track-container {
  overflow: hidden;
  user-select: none;
  width: 100%;
}

.marquee-track {
  display: flex;
  gap: 20px;
  width: max-content;
  animation: marqueeScroll 35s linear infinite;
}

.marquee-track:hover {
  animation-play-state: paused;
}

@keyframes marqueeScroll {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

.platform-badge {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  padding: 8px 16px;
  border-radius: var(--radius-sm);
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--border-subtle);
  color: var(--text-secondary);
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
}

/* ==========================================================================
   Section Headers & Utilities
   ========================================================================== */

.section-meta-tag {
  display: inline-block;
  font-family: 'JetBrains Mono', monospace;
  font-size: 11.5px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #818cf8;
  background: rgba(99, 102, 241, 0.1);
  border: 1px solid rgba(99, 102, 241, 0.25);
  padding: 3px 10px;
  border-radius: var(--radius-full);
  margin-bottom: 12px;
}

.section-heading {
  font-size: clamp(28px, 4vw, 42px);
  font-weight: 800;
  letter-spacing: -0.03em;
  color: #ffffff;
  margin-bottom: 12px;
  line-height: 1.2;
}

.section-description {
  font-size: clamp(14.5px, 1.6vw, 16.5px);
  color: var(--text-secondary);
  max-width: 680px;
  margin: 0 auto;
  line-height: 1.6;
}

/* ==========================================================================
   Interactive Simulator Section (#watch-it-work)
   ========================================================================== */

.watch-it-work-section {
  padding: 80px 0;
  position: relative;
}

.watch-stage-grid {
  margin-top: 40px;
  max-width: 960px;
  margin-left: auto;
  margin-right: auto;
}

.live-monitor-box {
  background: #0d111b;
  border: 1px solid var(--border-medium);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: 0 25px 60px -10px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.08);
}

.monitor-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 18px;
  background: #090c14;
  border-bottom: 1px solid var(--border-subtle);
}

.monitor-window-controls {
  display: flex;
  align-items: center;
  gap: 7px;
}

.window-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
}

.window-dot.red { background: #ef4444; }
.window-dot.yellow { background: #f59e0b; }
.window-dot.green { background: #10b981; }

.monitor-status-badges {
  display: flex;
  align-items: center;
  gap: 10px;
}

.badge-live-pulse {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(239, 68, 68, 0.15);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #f87171;
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  font-weight: 700;
  padding: 3px 9px;
  border-radius: var(--radius-full);
}

.badge-live-pulse span:first-child {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #ef4444;
  animation: pulseDot 1.5s infinite;
}

.badge-res {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  color: var(--text-tertiary);
}

.btn-icon-toggle {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-xs);
  color: var(--text-secondary);
  padding: 5px 9px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;
}

.btn-icon-toggle:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
}

/* Simulator Canvas Stage */
.simulator-stage {
  padding: 60px 24px;
  background: 
    radial-gradient(ellipse at 50% 50%, rgba(99, 102, 241, 0.06), transparent 70%),
    linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
  background-size: 100% 100%, 32px 32px, 32px 32px;
  min-height: 260px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

/* Animated Alert Box */
.stage-alert-card {
  background: rgba(15, 20, 32, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: var(--radius-md);
  padding: 20px 26px;
  width: 100%;
  max-width: 480px;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(12px);
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.stage-alert-card.pop-animate {
  animation: alertPopIn 0.45s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes alertPopIn {
  0% { transform: scale(0.92) translateY(12px); opacity: 0; }
  100% { transform: scale(1) translateY(0); opacity: 1; }
}

.card-top-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.app-badge-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 700;
  color: #38bdf8;
  background: rgba(56, 189, 248, 0.12);
  border: 1px solid rgba(56, 189, 248, 0.25);
  padding: 3px 10px;
  border-radius: var(--radius-full);
}

.audio-waveform-bars {
  display: flex;
  align-items: center;
  gap: 3px;
  height: 18px;
}

.audio-bar {
  width: 3px;
  height: 6px;
  border-radius: 2px;
  background: #818cf8;
  transition: height 0.15s ease;
}

.audio-waveform-bars.playing .audio-bar:nth-child(1) { animation: waveAnim 0.7s infinite alternate ease-in-out; }
.audio-waveform-bars.playing .audio-bar:nth-child(2) { animation: waveAnim 0.5s infinite alternate ease-in-out 0.15s; }
.audio-waveform-bars.playing .audio-bar:nth-child(3) { animation: waveAnim 0.8s infinite alternate ease-in-out 0.3s; }
.audio-waveform-bars.playing .audio-bar:nth-child(4) { animation: waveAnim 0.6s infinite alternate ease-in-out 0.45s; }

@keyframes waveAnim {
  0% { height: 4px; }
  100% { height: 18px; }
}

.donor-info-row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 10px;
}

.donor-display-name {
  font-size: 20px;
  font-weight: 800;
  color: #ffffff;
  letter-spacing: -0.02em;
}

.donor-display-amount {
  font-family: 'JetBrains Mono', monospace;
  font-size: 24px;
  font-weight: 800;
  color: #34d399;
}

.donor-display-msg {
  font-size: 14.5px;
  color: #cbd5e1;
  background: rgba(255, 255, 255, 0.04);
  border-left: 3px solid #818cf8;
  padding: 10px 14px;
  border-radius: 0 var(--radius-xs) var(--radius-xs) 0;
  margin-bottom: 14px;
  line-height: 1.5;
}

.card-status-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 11.5px;
  color: var(--text-tertiary);
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  padding-top: 10px;
}

/* Simulator Controls */
.simulator-controls {
  padding: 24px 28px;
  background: #090c14;
  border-top: 1px solid var(--border-subtle);
}

.sim-field label {
  display: block;
  font-size: 12px;
  font-weight: 600;
  color: var(--text-secondary);
  margin-bottom: 6px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.sim-input {
  width: 100%;
  padding: 9px 13px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-xs);
  color: #ffffff;
  font-size: 14px;
  outline: none;
  transition: border-color 0.15s ease;
  font-family: inherit;
}

.sim-input:focus {
  border-color: #818cf8;
  background: rgba(255, 255, 255, 0.06);
}

.amount-chips {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.amount-chip {
  padding: 6px 14px;
  border-radius: var(--radius-xs);
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid var(--border-subtle);
  color: var(--text-secondary);
  font-family: 'JetBrains Mono', monospace;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
}

.amount-chip:hover {
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
}

.amount-chip.active {
  background: rgba(99, 102, 241, 0.18);
  border-color: #818cf8;
  color: #ffffff;
}

.sim-test-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 12px 24px;
  background: linear-gradient(180deg, #6366f1 0%, #4f46e5 100%);
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: var(--radius-sm);
  color: #ffffff;
  font-size: 14.5px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 4px 14px rgba(79, 70, 229, 0.35);
}

.sim-test-btn:hover {
  background: linear-gradient(180deg, #6d70f8 0%, #5850ec 100%);
  transform: translateY(-1px);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.25), 0 6px 20px rgba(79, 70, 229, 0.45);
}

/* ==========================================================================
   Two Pillars / System Architecture (#architecture)
   ========================================================================== */

.two-ways-section {
  padding: 80px 0;
  position: relative;
}

.two-ways-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 28px;
  margin-top: 40px;
}

.two-ways-card {
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  padding: 32px;
  box-shadow: var(--shadow-card);
  display: flex;
  flex-direction: column;
  transition: transform 0.2s ease, border-color 0.2s ease;
}

.two-ways-card:hover {
  border-color: var(--border-medium);
  transform: translateY(-2px);
}

.two-ways-card.highlight {
  border-color: rgba(99, 102, 241, 0.3);
  background: linear-gradient(180deg, rgba(14, 18, 29, 0.95) 0%, rgba(19, 25, 41, 0.95) 100%);
}

.two-ways-badge-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.two-ways-badge {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 3px 9px;
  border-radius: var(--radius-full);
}

.badge-cyan {
  background: rgba(99, 102, 241, 0.12);
  color: #a5b4fc;
  border: 1px solid rgba(99, 102, 241, 0.28);
}

.badge-emerald {
  background: rgba(16, 185, 129, 0.12);
  color: #34d399;
  border: 1px solid rgba(16, 185, 129, 0.28);
}

.two-ways-card h3 {
  font-size: 22px;
  font-weight: 800;
  color: #ffffff;
  letter-spacing: -0.02em;
  margin-bottom: 8px;
}

.card-subtitle {
  font-size: 14.5px;
  color: var(--text-secondary);
  line-height: 1.5;
  margin-bottom: 24px;
}

.flow-diagram-box {
  background: #090c14;
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-sm);
  padding: 16px;
  margin-bottom: 24px;
}

.flow-step-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: var(--radius-xs);
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.flow-step-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.flow-step-text {
  flex: 1;
}

.flow-step-title {
  font-size: 13.5px;
  font-weight: 700;
  color: #ffffff;
}

.flow-step-desc {
  font-size: 12px;
  color: var(--text-tertiary);
}

.flow-step-arrow {
  text-align: center;
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  font-weight: 600;
  color: var(--text-tertiary);
  padding: 8px 0;
}

.two-ways-list {
  list-style: none;
  margin-bottom: 28px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 1;
}

.two-ways-list li {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 13.5px;
  color: var(--text-secondary);
  line-height: 1.5;
}

.two-ways-list li svg {
  width: 16px;
  height: 16px;
  stroke: var(--accent-emerald);
  stroke-width: 2.5;
  fill: none;
  flex-shrink: 0;
  margin-top: 3px;
}

/* ==========================================================================
   Supported Payment Rails
   ========================================================================== */

.supported-section {
  padding: 60px 0;
  border-top: 1px solid var(--border-subtle);
  border-bottom: 1px solid var(--border-subtle);
  background: rgba(14, 18, 28, 0.4);
}

.supported-header {
  text-align: center;
  font-size: 13px;
  font-weight: 700;
  color: var(--text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 24px;
}

.app-cards-flex {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  flex-wrap: wrap;
}

.app-brand-chip {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 10px 18px;
  border-radius: var(--radius-sm);
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  color: #ffffff;
  font-size: 13.5px;
  font-weight: 600;
  transition: transform 0.2s ease, border-color 0.2s ease;
}

.app-brand-chip:hover {
  border-color: var(--border-medium);
  transform: translateY(-2px);
}

/* ==========================================================================
   Feature Bento Grid (Linear Style)
   ========================================================================== */

.bento-section {
  padding: 80px 0;
}

.bento-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-top: 40px;
}

.bento-card {
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  padding: 28px;
  box-shadow: var(--shadow-card);
  transition: all 0.2s ease;
  position: relative;
  display: flex;
  flex-direction: column;
}

.bento-card:hover {
  border-color: var(--border-medium);
  transform: translateY(-2px);
}

.bento-icon {
  width: 44px;
  height: 44px;
  border-radius: var(--radius-sm);
  background: rgba(99, 102, 241, 0.1);
  border: 1px solid rgba(99, 102, 241, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  color: #818cf8;
}

.bento-icon svg {
  width: 22px;
  height: 22px;
  stroke: currentColor;
  stroke-width: 2;
  fill: none;
}

.bento-card h3 {
  font-size: 18px;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: -0.02em;
  margin-bottom: 10px;
}

.bento-card p {
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.6;
}

/* ==========================================================================
   Head-to-Head Comparison Matrix
   ========================================================================== */

.comparison-section {
  padding: 80px 0;
  background: rgba(14, 18, 28, 0.3);
  border-top: 1px solid var(--border-subtle);
  border-bottom: 1px solid var(--border-subtle);
}

.comparison-table-wrap {
  margin-top: 40px;
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  overflow: hidden;
  background: var(--bg-surface);
  box-shadow: var(--shadow-card);
}

.comparison-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

.comparison-table th,
.comparison-table td {
  padding: 18px 24px;
  border-bottom: 1px solid var(--border-subtle);
  font-size: 14px;
}

.comparison-table th {
  background: #090c14;
  color: var(--text-secondary);
  font-size: 12.5px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.comparison-table th.col-highlight {
  color: #818cf8;
  background: rgba(99, 102, 241, 0.1);
  border-bottom: 2px solid #6366f1;
}

.comparison-table td.col-highlight {
  background: rgba(99, 102, 241, 0.04);
  font-weight: 600;
  color: #ffffff;
}

.comparison-table tr:last-child td {
  border-bottom: none;
}

.tag-win {
  color: #34d399;
  font-weight: 700;
}

.tag-lose {
  color: #f87171;
}

/* ==========================================================================
   Hub Navigation Cards (#explore-hub)
   ========================================================================== */

.hub-section {
  padding: 80px 0;
}

.hub-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 18px;
  margin-top: 36px;
}

.hub-card {
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  padding: 22px;
  text-decoration: none;
  display: flex;
  flex-direction: column;
  transition: all 0.2s ease;
  box-shadow: var(--shadow-card);
}

.hub-card:hover {
  border-color: #818cf8;
  transform: translateY(-2px);
}

.hub-card-icon {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.04);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #818cf8;
  margin-bottom: 14px;
}

.hub-card-icon svg {
  width: 18px;
  height: 18px;
  stroke: currentColor;
  stroke-width: 2;
  fill: none;
}

.hub-card-title {
  font-size: 16px;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 6px;
}

.hub-card-desc {
  font-size: 12.5px;
  color: var(--text-tertiary);
  line-height: 1.5;
}

/* ==========================================================================
   Discord Community & Developer Section
   ========================================================================== */

.discord-section {
  padding: 80px 0;
}

.discord-widget-card {
  background: linear-gradient(135deg, rgba(20, 24, 40, 0.95) 0%, rgba(14, 18, 30, 0.95) 100%);
  border: 1px solid rgba(88, 101, 242, 0.35);
  border-radius: var(--radius-lg);
  padding: 36px 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 28px;
  box-shadow: 0 16px 40px -8px rgba(88, 101, 242, 0.25);
}

.discord-widget-brand {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}

.discord-online-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  font-weight: 700;
  color: #34d399;
  background: rgba(16, 185, 129, 0.12);
  border: 1px solid rgba(16, 185, 129, 0.25);
  padding: 2px 8px;
  border-radius: var(--radius-full);
}

.discord-online-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #10b981;
}

.discord-widget-card h3 {
  font-size: 22px;
  font-weight: 800;
  color: #ffffff;
  letter-spacing: -0.02em;
  margin-bottom: 8px;
}

.discord-widget-card p {
  font-size: 14.5px;
  color: var(--text-secondary);
  max-width: 620px;
  line-height: 1.6;
}

.btn-join-discord-card {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 12px 24px;
  background: #5865f2;
  color: #ffffff;
  font-size: 14.5px;
  font-weight: 700;
  text-decoration: none;
  border-radius: var(--radius-sm);
  white-space: nowrap;
  box-shadow: 0 4px 14px rgba(88, 101, 242, 0.4);
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.btn-join-discord-card:hover {
  background: #4752c4;
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(88, 101, 242, 0.5);
}

/* ==========================================================================
   Footer
   ========================================================================== */

.site-footer {
  border-top: 1px solid var(--border-subtle);
  background: #06080d;
  padding: 60px 0 30px;
  color: var(--text-tertiary);
  font-size: 13.5px;
}

.footer-ref-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 40px;
  margin-bottom: 40px;
}

.footer-brand-title {
  font-size: 18px;
  font-weight: 800;
  color: #ffffff;
  margin-bottom: 12px;
}

.footer-brand-text {
  font-size: 13px;
  line-height: 1.6;
  color: var(--text-tertiary);
  max-width: 380px;
}

.footer-col-header {
  font-size: 12px;
  font-weight: 700;
  color: #ffffff;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 16px;
}

.footer-ref-links {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.footer-ref-links a {
  color: var(--text-tertiary);
  text-decoration: none;
  transition: color 0.15s ease;
}

.footer-ref-links a:hover {
  color: #ffffff;
}

.footer-ref-bottom {
  border-top: 1px solid var(--border-subtle);
  padding-top: 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12.5px;
  color: var(--text-dim);
}

.footer-ref-bottom a {
  color: var(--text-tertiary);
  text-decoration: none;
}

.footer-ref-bottom a:hover {
  color: #fff;
}

/* ==========================================================================
   Sub-pages shared styles (Pricing, Tutorial, Features, About, FAQ)
   ========================================================================== */

.page-hero-header {
  padding: 130px 0 40px;
  text-align: center;
}

.pricing-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  margin-top: 30px;
}

.pricing-card {
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  padding: 32px;
  box-shadow: var(--shadow-card);
  display: flex;
  flex-direction: column;
}

.pricing-card.featured {
  border-color: rgba(99, 102, 241, 0.4);
  background: linear-gradient(180deg, rgba(14, 18, 29, 0.95) 0%, rgba(20, 26, 44, 0.95) 100%);
}

.plan-tier-name {
  font-size: 18px;
  font-weight: 800;
  color: #ffffff;
  margin-bottom: 12px;
}

.plan-price-wrap {
  display: flex;
  align-items: baseline;
  gap: 6px;
  margin-bottom: 12px;
}

.plan-price {
  font-family: 'JetBrains Mono', monospace;
  font-size: 38px;
  font-weight: 800;
  color: #ffffff;
}

.plan-duration {
  font-size: 14px;
  color: var(--text-tertiary);
}

.plan-explanation {
  font-size: 13.5px;
  color: var(--text-secondary);
  line-height: 1.5;
  margin-bottom: 24px;
}

.plan-features-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 30px;
  flex: 1;
}

.plan-features-list li {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.4;
}

.plan-features-list li.dimmed {
  opacity: 0.4;
}

.check-svg {
  width: 16px;
  height: 16px;
  stroke: var(--accent-emerald);
  stroke-width: 2.5;
  fill: none;
  flex-shrink: 0;
  margin-top: 2px;
}

.cross-svg {
  width: 16px;
  height: 16px;
  stroke: var(--text-tertiary);
  stroke-width: 2.2;
  fill: none;
  flex-shrink: 0;
  margin-top: 2px;
}

/* Policy Modal Backdrop */
.policy-modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(8px);
  z-index: 2000;
  display: none;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.policy-modal-backdrop.active {
  display: flex;
}

.policy-modal-card {
  background: var(--bg-surface);
  border: 1px solid var(--border-medium);
  border-radius: var(--radius-lg);
  max-width: 700px;
  width: 100%;
  max-height: 85vh;
  overflow-y: auto;
  padding: 32px;
  position: relative;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.8);
}

.policy-modal-close {
  position: absolute;
  top: 18px;
  right: 18px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid var(--border-subtle);
  border-radius: 50%;
  width: 32px;
  height: 32px;
  color: #fff;
  font-size: 20px;
  line-height: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* ==========================================================================
   Responsive Breakpoints
   ========================================================================== */

@media (max-width: 1024px) {
  .metrics-strip {
    grid-template-columns: repeat(2, 1fr);
  }
  .bento-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .footer-ref-grid {
    grid-template-columns: 1fr 1fr;
    gap: 32px;
  }
  .discord-widget-card {
    flex-direction: column;
    align-items: flex-start;
  }
}

@media (max-width: 768px) {
  .nav-menu {
    display: none;
  }
  .two-ways-grid {
    grid-template-columns: 1fr;
  }
  .metrics-strip {
    grid-template-columns: 1fr;
  }
  .bento-grid {
    grid-template-columns: 1fr;
  }
  .footer-ref-grid {
    grid-template-columns: 1fr;
  }
  .footer-ref-bottom {
    flex-direction: column;
    gap: 12px;
    text-align: center;
  }
  .donor-info-row {
    flex-direction: column;
    gap: 4px;
  }
}
`;

fs.writeFileSync(path.join(PUBLIC, 'landing.css'), landingCss, 'utf8');
console.log('✓ Wrote public/landing.css');

// ============================================================================
// 2. GENERATE public/index.html
// ============================================================================
const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>DenAlerts — Real-time UPI Superchats | 0% Platform Fee for Live Streamers</title>
  <meta name="description" content="Capture UPI payments instantly on your live stream. Zero commission, direct P2P bank settlement for Google Pay, PhonePe, and Paytm with transparent 60fps OBS overlays & Indian voice TTS.">
  <meta name="keywords" content="upi alerts on stream, upi donation alerts, live stream upi alerts, obs upi alert box, gpay donation alert, phonepe stream alerts, paytm upi alerts, stream alerts india, zero commission donation alerts">
  <link rel="canonical" href="https://alerts.denbooks.in/">
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">

  <!-- Schema.org JSON-LD Structured Data -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id": "https://alerts.denbooks.in/#webapp",
        "name": "DenAlerts",
        "alternateName": ["DenAlerts UPI Stream Alerts", "DenAlerts OBS Alert Box"],
        "url": "https://alerts.denbooks.in/",
        "description": "Zero-commission UPI payment alert box and transparent OBS overlay system for Indian live streamers. Supports Google Pay, PhonePe, Paytm, and BHIM UPI with Indian voice synthetic speech.",
        "applicationCategory": "MultimediaApplication",
        "operatingSystem": "Android, Windows, macOS, Linux",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "INR"
        },
        "creator": {
          "@type": "Organization",
          "name": "SRB STUDIOS",
          "url": "https://denbooks.in",
          "logo": "https://alerts.denbooks.in/denalerts-logo.svg"
        }
      },
      {
        "@type": "SiteNavigationElement",
        "@id": "https://alerts.denbooks.in/#sitelinks",
        "name": [
          "Setup Video & Tutorial Guide",
          "Creator Cockpit Login",
          "Live Donation Goal Overlay",
          "Cancellation & Refund Policy",
          "About DenAlerts & Compliance"
        ],
        "url": [
          "https://alerts.denbooks.in/tutorial",
          "https://alerts.denbooks.in/login",
          "https://alerts.denbooks.in/goal",
          "https://alerts.denbooks.in/refund-and-cancellation",
          "https://alerts.denbooks.in/about"
        ]
      }
    ]
  }
  </script>

  <!-- Open Graph Social Preview Meta Tags -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://alerts.denbooks.in/">
  <meta property="og:site_name" content="SRB STUDIOS">
  <meta property="og:title" content="DenAlerts — Zero-Commission UPI Alerts for Live Streamers">
  <meta property="og:description" content="Receive direct-to-bank UPI Superchats from PhonePe, Google Pay, and Paytm with 0% platform fee. Real-time Indian voice announcements & transparent OBS overlays.">
  <meta property="og:image" content="https://alerts.denbooks.in/og-banner.png">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta name="theme-color" content="#6366f1">

  <!-- Twitter / X Card Meta Tags -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:url" content="https://alerts.denbooks.in/">
  <meta name="twitter:title" content="DenAlerts — Zero-Commission UPI Alerts for Live Streamers">
  <meta name="twitter:description" content="Receive direct-to-bank UPI Superchats from PhonePe, Google Pay, and Paytm with 0% platform fee. Real-time Indian voice announcements & transparent OBS overlays.">
  <meta name="twitter:image" content="https://alerts.denbooks.in/og-banner.png">
  
  <link rel="icon" type="image/svg+xml" href="/denalerts-logo.svg">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/landing.css?v=50">
</head>
<body>

  <!-- Audio Element for Interactive Simulator -->
  <audio id="demo-chime" src="/alert.wav" preload="auto"></audio>

  <!-- Navigation -->
  <nav class="navbar" id="main-nav">
    <div class="container nav-wrap">
      <a href="/" class="nav-brand">
        <div class="brand-icon-box">
          <img src="/denalerts-logo.svg" alt="DenAlerts Logo" width="22" height="22">
        </div>
        <div class="brand-name">Den<span>Alerts</span></div>
        <span class="brand-version-pill">v2.5</span>
      </a>

      <ul class="nav-menu">
        <li><a href="/" class="active">Home</a></li>
        <li><a href="#architecture">Architecture</a></li>
        <li><a href="#features">Features</a></li>
        <li><a href="#comparison">Comparison</a></li>
        <li><a href="/pricing">Pricing</a></li>
        <li><a href="/tutorial">Tutorial</a></li>
        <li><a href="/faq">FAQ</a></li>
      </ul>

      <div class="nav-cta-group">
        <a href="/DenAlerts.apk" download class="btn btn-secondary" title="Download Official Android Companion App">
          <svg class="btn-icon" viewBox="0 0 24 24">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          <span>Get APK</span>
        </a>
        <a href="https://discord.gg/XyKNuC4hBd" target="_blank" class="btn btn-secondary" title="Join Discord Community & Live Support">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="#5865F2" style="vertical-align:middle;">
            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
          </svg>
          <span>Discord</span>
        </a>
        <a href="/login" class="btn btn-primary">
          <span>Open Cockpit</span>
          <svg class="btn-icon" viewBox="0 0 24 24">
            <line x1="5" y1="12" x2="19" y2="12"/>
            <polyline points="12 5 19 12 12 19"/>
          </svg>
        </a>
      </div>
    </div>
  </nav>

  <!-- Hero Section -->
  <section class="hero-section">
    <div class="container">
      <div class="hero-badge-wrap">
        <span class="hero-status-dot"></span>
        <span>v2.5 Live Release &bull; Zero-Escrow UPI Relay for Streamers</span>
      </div>

      <h1 class="hero-headline">
        Direct UPI Superchats.<br>
        <span class="hero-gradient">0% Platform Cut. Instant to Bank.</span>
      </h1>

      <p class="hero-subhead">
        The broadcaster-grade UPI alert box for Indian live streamers. Turn incoming PhonePe, Google Pay, and Paytm payments into instant 60fps OBS browser alerts and natural Indian voice TTS &mdash; deposited straight into your bank account with zero platform fees or payout delays.
      </p>

      <div class="hero-cta-group">
        <a href="/login" class="btn btn-primary btn-lg">
          <span>Launch Creator Cockpit</span>
          <svg class="btn-icon" viewBox="0 0 24 24">
            <line x1="5" y1="12" x2="19" y2="12"/>
            <polyline points="12 5 19 12 12 19"/>
          </svg>
        </a>
        <a href="/DenAlerts.apk" download class="btn btn-secondary btn-lg">
          <svg class="btn-icon" viewBox="0 0 24 24">
            <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
            <line x1="12" y1="18" x2="12.01" y2="18"/>
          </svg>
          <span>Download Android App (v2.5)</span>
        </a>
      </div>

      <div class="hero-guarantee-note">
        <span><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg> 0% Platform Fee</span>
        <span><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg> Direct-To-Bank P2P</span>
        <span><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg> OBS &amp; Streamlabs Compatible</span>
        <span><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg> Zero Business KYC / GST Required</span>
      </div>

      <!-- Metrics Proof Strip -->
      <div class="metrics-strip">
        <div class="metric-card">
          <div class="metric-value">0%</div>
          <div class="metric-label">Platform Cut</div>
          <div class="metric-desc">You retain 100% of every viewer rupee</div>
        </div>
        <div class="metric-card">
          <div class="metric-value">&lt;180ms</div>
          <div class="metric-label">Trigger Latency</div>
          <div class="metric-desc">Sub-second WebSocket notification bridge</div>
        </div>
        <div class="metric-card">
          <div class="metric-value">100%</div>
          <div class="metric-label">Direct P2P Settlement</div>
          <div class="metric-desc">Funds land instantly in your personal savings account</div>
        </div>
        <div class="metric-card">
          <div class="metric-value">₹0 / mo</div>
          <div class="metric-label">Free Forever Tier</div>
          <div class="metric-desc">Unlimited superchat alerts for every creator</div>
        </div>
      </div>
    </div>
  </section>

  <!-- Broadcasting Platforms Marquee -->
  <section class="platforms-marquee-section" id="platforms">
    <p class="marquee-heading">Native 60fps Hardware-Accelerated Browser Source Support</p>
    <div class="marquee-track-container">
      <div class="marquee-track">
        <div class="platform-badge">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="#ffffff"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm-1.04 4.54a5.455 5.455 0 0 1 4.58 2.502 6.55 6.55 0 0 0-4.576.438 6.545 6.545 0 0 0-3.327 4.148 5.46 5.46 0 0 1 3.323-7.088zm-5.4 7.46a5.455 5.455 0 0 1 2.29-4.693 6.55 6.55 0 0 0 .97 4.5 6.545 6.545 0 0 0 4.887 2.062 5.46 5.46 0 0 1-8.147-1.869zm8.904 6.452a5.455 5.455 0 0 1-4.72-2.234 6.55 6.55 0 0 0 3.606-.807 6.545 6.545 0 0 0 3.018-4.377 5.46 5.46 0 0 1-1.904 7.418z"/></svg>
          <span>OBS Studio</span>
        </div>
        <div class="platform-badge">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="#31f1c7"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3.7 15.3c-.4.4-1.1.4-1.5 0l-3.2-3.2-1.7 1.7c-.4.4-1.1.4-1.5 0-.4-.4-.4-1.1 0-1.5l2.4-2.4c.4-.4 1.1-.4 1.5 0l3.2 3.2 1.7-1.7c.4-.4 1.1-.4 1.5 0 .4.4.4 1.1 0 1.5l-2.4 2.4z"/></svg>
          <span>Streamlabs Desktop</span>
        </div>
        <div class="platform-badge">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="#FF0000"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
          <span>YouTube Live</span>
        </div>
        <div class="platform-badge">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="#9146FF"><path d="M11.571 4.714h1.715v5.143h-1.715zm4.715 0h1.714v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z"/></svg>
          <span>Twitch</span>
        </div>
        <div class="platform-badge">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="#53FC18"><path d="M4 3h5v6h2V3h5v6h-2v3h2v9h-5v-6h-2v6H4v-6h2V9H4V3z"/></svg>
          <span>Kick</span>
        </div>
        <div class="platform-badge">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="#f59e0b"><rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" stroke-width="2" fill="none"/><line x1="8" y1="12" x2="16" y2="12" stroke="currentColor" stroke-width="2"/></svg>
          <span>vMix Studio</span>
        </div>
        <!-- Infinite loop duplicate -->
        <div class="platform-badge">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="#ffffff"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm-1.04 4.54a5.455 5.455 0 0 1 4.58 2.502 6.55 6.55 0 0 0-4.576.438 6.545 6.545 0 0 0-3.327 4.148 5.46 5.46 0 0 1 3.323-7.088zm-5.4 7.46a5.455 5.455 0 0 1 2.29-4.693 6.55 6.55 0 0 0 .97 4.5 6.545 6.545 0 0 0 4.887 2.062 5.46 5.46 0 0 1-8.147-1.869zm8.904 6.452a5.455 5.455 0 0 1-4.72-2.234 6.55 6.55 0 0 0 3.606-.807 6.545 6.545 0 0 0 3.018-4.377 5.46 5.46 0 0 1-1.904 7.418z"/></svg>
          <span>OBS Studio</span>
        </div>
        <div class="platform-badge">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="#31f1c7"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3.7 15.3c-.4.4-1.1.4-1.5 0l-3.2-3.2-1.7 1.7c-.4.4-1.1.4-1.5 0-.4-.4-.4-1.1 0-1.5l2.4-2.4c.4-.4 1.1-.4 1.5 0l3.2 3.2 1.7-1.7c.4-.4 1.1-.4 1.5 0 .4.4.4 1.1 0 1.5l-2.4 2.4z"/></svg>
          <span>Streamlabs Desktop</span>
        </div>
      </div>
    </div>
  </section>

  <!-- Interactive Studio Simulator Section (#watch-it-work) -->
  <section class="watch-it-work-section" id="watch-it-work">
    <div class="container">
      <div style="text-align:center;">
        <span class="section-meta-tag">Interactive Broadcast Studio</span>
        <h2 class="section-heading">Test Live Overlay Alerts &amp; Voice TTS</h2>
        <p class="section-description">
          Preview how incoming superchats look and sound on your broadcast. Enter any custom donor name, UPI app, amount, and message below to trigger real-time sound chimes and Indian synthetic speech.
        </p>
      </div>

      <div class="watch-stage-grid">
        <div class="live-monitor-box">
          <!-- Window Header Bar -->
          <div class="monitor-topbar">
            <div class="monitor-window-controls">
              <span class="window-dot red"></span>
              <span class="window-dot yellow"></span>
              <span class="window-dot green"></span>
            </div>
            <div class="monitor-status-badges">
              <span class="badge-live-pulse">
                <span></span>
                <span>ON AIR</span>
              </span>
              <span class="badge-res">OBS Studio 1080p 60fps</span>
            </div>
            <div class="monitor-actions">
              <button type="button" class="btn-icon-toggle" id="btn-toggle-sound" title="Toggle Sound Chime">
                <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- Alert Display Canvas Stage -->
          <div class="simulator-stage">
            <div class="stage-alert-card pop-animate" id="live-alert-card">
              <div class="card-top-row">
                <div class="app-badge-chip" id="sim-badge-chip">
                  <span>Google Pay UPI</span>
                </div>
                <div class="audio-waveform-bars" id="waveform-bars">
                  <div class="audio-bar"></div>
                  <div class="audio-bar"></div>
                  <div class="audio-bar"></div>
                  <div class="audio-bar"></div>
                </div>
              </div>

              <div class="donor-info-row">
                <div class="donor-display-name" id="display-donor">Aakash Verma</div>
                <div class="donor-display-amount" id="display-amount">₹500</div>
              </div>

              <div class="donor-display-msg" id="display-msg">
                "Clutch 1v4 god level gameplay bhai! GG"
              </div>

              <div class="card-status-meta">
                <span>Direct P2P NPCI Transfer</span>
                <span>Indian Synthetic TTS Active</span>
              </div>
            </div>
          </div>

          <!-- Simulator Test Controls -->
          <div class="simulator-controls">
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:14px;">
              <div class="sim-field">
                <label>Test Donor Name</label>
                <input type="text" id="sim-donor" class="sim-input" value="Aakash Verma">
              </div>
              <div class="sim-field">
                <label>Source UPI App</label>
                <select id="sim-app" class="sim-input">
                  <option value="Google Pay">Google Pay (GPay)</option>
                  <option value="PhonePe">PhonePe UPI</option>
                  <option value="Paytm">Paytm UPI</option>
                  <option value="BHIM">BHIM UPI</option>
                </select>
              </div>
            </div>

            <div class="sim-field" style="margin-bottom:14px;">
              <label>Donation Amount (INR)</label>
              <div class="amount-chips">
                <button type="button" class="amount-chip" data-amt="50">₹50</button>
                <button type="button" class="amount-chip" data-amt="100">₹100</button>
                <button type="button" class="amount-chip" data-amt="200">₹200</button>
                <button type="button" class="amount-chip active" data-amt="500">₹500</button>
                <button type="button" class="amount-chip" data-amt="1000">₹1,000</button>
                <button type="button" class="amount-chip" data-amt="5000">₹5,000</button>
              </div>
            </div>

            <div class="sim-field" style="margin-bottom:18px;">
              <label>Test Donor Message</label>
              <input type="text" id="sim-note" class="sim-input" value="Clutch 1v4 god level gameplay bhai! GG">
            </div>

            <button type="button" id="btn-trigger-sim" class="sim-test-btn" style="width:100%;">
              <svg style="width:16px; height:16px; stroke:currentColor; fill:none;" viewBox="0 0 24 24">
                <polygon points="5 3 19 12 5 21 5 3"/>
              </svg>
              <span>Fire Live Alert &amp; Speak TTS</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Supported Payment Rails -->
  <section class="supported-section" id="apps">
    <div class="container">
      <div class="supported-header">Supported UPI Applications &amp; Indian Banking Rails</div>
      <div class="app-cards-flex">
        <!-- PhonePe -->
        <div class="app-brand-chip">
          <svg viewBox="0 0 32 32" width="24" height="24">
            <rect width="32" height="32" rx="7" fill="#5f259f"/>
            <path d="M8 10h16" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round"/>
            <path d="M14 10l-4.5-4" stroke="#ffffff" stroke-width="2" stroke-linecap="round"/>
            <path d="M11.5 10v6c0 2 1.5 3.5 3.5 3.5h3" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round" fill="none"/>
            <path d="M18 10v14" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round"/>
          </svg>
          <span>PhonePe UPI</span>
        </div>

        <!-- Google Pay -->
        <div class="app-brand-chip">
          <svg viewBox="0 0 32 32" width="24" height="24">
            <rect width="32" height="32" rx="7" fill="#131722" stroke="rgba(255,255,255,0.12)" stroke-width="1"/>
            <g transform="translate(4, 4)">
              <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7v3h3.9c2.3-2.1 3.5-5.2 3.5-9z"/>
              <path fill="#34A853" d="M12 24c3.2 0 6-1.1 7.9-3l-3.9-3c-1.1.7-2.5 1.2-4 1.2-3.1 0-5.7-2.1-6.7-4.9H1.3v3.1C3.3 21.4 7.4 24 12 24z"/>
              <path fill="#FBBC05" d="M5.3 14.3c-.3-.8-.4-1.6-.4-2.3s.1-1.5.4-2.3V6.6H1.3C.5 8.2 0 10 0 12s.5 3.8 1.3 5.4l4-3.1z"/>
              <path fill="#EA4335" d="M12 4.8c1.8 0 3.4.6 4.6 1.8l3.5-3.5C18 1.2 15.2 0 12 0 7.4 0 3.3 2.6 1.3 6.6l4 3.1c1-2.8 3.6-4.9 6.7-4.9z"/>
            </g>
          </svg>
          <span>Google Pay</span>
        </div>

        <!-- Paytm -->
        <div class="app-brand-chip">
          <svg viewBox="0 0 38 28" width="32" height="24">
            <rect width="38" height="28" rx="6" fill="#002970"/>
            <text x="3" y="19" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-weight="900" font-size="12" fill="#ffffff" letter-spacing="-0.5">Pay</text>
            <text x="24" y="19" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-weight="900" font-size="12" fill="#00baf2" letter-spacing="-0.5">tm</text>
          </svg>
          <span>Paytm UPI</span>
        </div>

        <!-- BHIM UPI -->
        <div class="app-brand-chip">
          <svg viewBox="0 0 32 32" width="24" height="24">
            <rect width="32" height="32" rx="7" fill="#111625" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
            <path d="M9 8l7 8-7 8" stroke="#00A859" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
            <path d="M16 8l7 8-7 8" stroke="#F37021" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
          </svg>
          <span>BHIM UPI</span>
        </div>

        <!-- Bank SMS -->
        <div class="app-brand-chip">
          <svg viewBox="0 0 32 32" width="24" height="24">
            <rect width="32" height="32" rx="7" fill="rgba(245, 158, 11, 0.12)" stroke="rgba(245, 158, 11, 0.25)" stroke-width="1"/>
            <path d="M7 11L16 6l9 5M8 12v8M13 12v8M19 12v8M24 12v8M6 22h20M5 25h22" stroke="#f59e0b" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
          </svg>
          <span>Bank SMS (SBI, HDFC, ICICI, Axis)</span>
        </div>
      </div>
    </div>
  </section>

  <!-- System Architecture Section (#architecture) -->
  <section class="two-ways-section" id="architecture">
    <div class="container">
      <div style="text-align:center;">
        <span class="section-meta-tag">System Architecture</span>
        <h2 class="section-heading">How Direct UPI Alerts Work (0% Cut)</h2>
        <p class="section-description">
          DenAlerts eliminates intermediate escrow wallets. The stream overlay and companion app operate as an instantaneous notification relay.
        </p>
      </div>

      <div class="two-ways-grid">
        <!-- Pillar 1: Personal QR & P2P Transfer -->
        <div class="two-ways-card highlight">
          <div class="two-ways-badge-row">
            <span class="two-ways-badge badge-cyan">Pillar 01 &bull; Broadcaster QR</span>
            <span style="font-size:12px; color:var(--text-tertiary); font-weight:600;">Direct-to-Bank</span>
          </div>

          <h3>Your Personal UPI QR Code</h3>
          <p class="card-subtitle">
            Display your personal UPI QR on stream. Viewers pay peer-to-peer directly into your savings account with zero intermediary deductions.
          </p>

          <div class="flow-diagram-box">
            <div class="flow-step-row">
              <div class="flow-step-icon" style="background:rgba(99,102,241,0.15);">
                <svg viewBox="0 0 24 24" width="16" height="16" stroke="#818cf8" stroke-width="2" fill="none"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
              </div>
              <div class="flow-step-text">
                <div class="flow-step-title">Viewer Scans QR Code on Stream</div>
                <div class="flow-step-desc">Pays via PhonePe, GPay, Paytm, BHIM, or Cred</div>
              </div>
            </div>

            <div class="flow-step-arrow">&darr; 100% Peer-to-Peer NPCI Settlement</div>

            <div class="flow-step-row" style="background:rgba(16,185,129,0.06); border-color:rgba(16,185,129,0.2);">
              <div class="flow-step-icon" style="background:rgba(16,185,129,0.15);">
                <svg viewBox="0 0 24 24" width="16" height="16" stroke="#10b981" stroke-width="2.5" fill="none"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <div class="flow-step-text">
                <div class="flow-step-title" style="color:#34d399;">Money Lands in Your Bank Account</div>
                <div class="flow-step-desc">0% platform commission &bull; Zero escrow holding</div>
              </div>
            </div>
          </div>

          <ul class="two-ways-list">
            <li>
              <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
              <span>Works with any personal savings or current bank account</span>
            </li>
            <li>
              <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
              <span>No merchant registration, GSTIN, or gateway paperwork required</span>
            </li>
            <li>
              <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
              <span>Zero withdrawal delays &mdash; funds are instantly available to you</span>
            </li>
          </ul>

          <a href="/login" class="btn btn-primary" style="width:100%; text-align:center;">
            Open Creator Cockpit
          </a>
        </div>

        <!-- Pillar 2: Android Companion Relay -->
        <div class="two-ways-card">
          <div class="two-ways-badge-row">
            <span class="two-ways-badge badge-emerald">Pillar 02 &bull; Companion Bridge</span>
            <span style="font-size:12px; color:var(--text-tertiary); font-weight:600;">Encrypted WebSocket</span>
          </div>

          <h3>Android Companion App (v2.5)</h3>
          <p class="card-subtitle">
            Listens to verified bank credit notifications in real-time and relays animated alerts to OBS in &lt;180ms.
          </p>

          <div class="flow-diagram-box">
            <div class="flow-step-row">
              <div class="flow-step-icon" style="background:rgba(16,185,129,0.15);">
                <svg viewBox="0 0 24 24" width="16" height="16" stroke="#10b981" stroke-width="2" fill="none"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
              </div>
              <div class="flow-step-text">
                <div class="flow-step-title">App Catches Payment Notification</div>
                <div class="flow-step-desc">Extracts donor name &amp; superchat amount</div>
              </div>
            </div>

            <div class="flow-step-arrow">&darr; &lt;180ms Ultra-Low Latency WebSocket</div>

            <div class="flow-step-row" style="background:rgba(99,102,241,0.06); border-color:rgba(99,102,241,0.2);">
              <div class="flow-step-icon" style="background:rgba(99,102,241,0.15);">
                <svg viewBox="0 0 24 24" width="16" height="16" stroke="#818cf8" stroke-width="2" fill="none"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
              </div>
              <div class="flow-step-text">
                <div class="flow-step-title" style="color:#a5b4fc;">Animated Alert &amp; Indian TTS on OBS</div>
                <div class="flow-step-desc">1080p 60fps transparent browser source</div>
              </div>
            </div>
          </div>

          <ul class="two-ways-list">
            <li>
              <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
              <span>Pair once with a persistent 6-digit PIN code</span>
            </li>
            <li>
              <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
              <span><strong>Live Stream Mode</strong> toggle prevents personal notification leaks</span>
            </li>
            <li>
              <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
              <span>Listens to GPay, PhonePe, Paytm and bank SMS credits seamlessly</span>
            </li>
          </ul>

          <a href="/DenAlerts.apk" download class="btn btn-secondary" style="width:100%; text-align:center;">
            Download Android App (v2.5)
          </a>
        </div>
      </div>
    </div>
  </section>

  <!-- Feature Bento Grid (#features) -->
  <section class="bento-section" id="features">
    <div class="container">
      <div style="text-align:center;">
        <span class="section-meta-tag">Platform Capabilities</span>
        <h2 class="section-heading">Built for High-Performance Broadcasting</h2>
        <p class="section-description">
          Engineered from the ground up for esports athletes, content creators, and live broadcasters demanding zero latency and complete financial autonomy.
        </p>
      </div>

      <div class="bento-grid">
        <!-- 1. Zero Escrow -->
        <div class="bento-card">
          <div class="bento-icon">
            <svg viewBox="0 0 24 24"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          </div>
          <h3>Zero Escrow Architecture</h3>
          <p>
            DenAlerts never touches your money. Funds move directly from your viewer's bank to your bank via NPCI UPI rails. No payout thresholds or 30-day withholding.
          </p>
        </div>

        <!-- 2. OBS & Streamlabs Browser Source -->
        <div class="bento-card">
          <div class="bento-icon">
            <svg viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
          </div>
          <h3>60fps Hardware Accelerated</h3>
          <p>
            Paste your single unique overlay URL into OBS Studio, Streamlabs, or vMix. Rendered at 1920x1080 60fps with transparent alpha channel and zero GPU overhead.
          </p>
        </div>

        <!-- 3. Indian Voice TTS -->
        <div class="bento-card">
          <div class="bento-icon">
            <svg viewBox="0 0 24 24"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
          </div>
          <h3>Natural Indian Synthetic TTS</h3>
          <p>
            Crisp, bilingual speech synthesis tailored for Indian accents and regional vernacular. Correctly pronounces names and reads messages aloud on stream.
          </p>
        </div>

        <!-- 4. Privacy & Live Mode -->
        <div class="bento-card">
          <div class="bento-icon">
            <svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          </div>
          <h3>Strict Privacy &amp; Live Mode</h3>
          <p>
            The companion app only forwards payment events while your Live Stream Mode is toggled ON. Personal chats, OTPs, and private transactions are strictly filtered out.
          </p>
        </div>

        <!-- 5. Dynamic Goal Bars -->
        <div class="bento-card">
          <div class="bento-icon">
            <svg viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          </div>
          <h3>Dynamic Donation Goals</h3>
          <p>
            Set custom stream targets (PC upgrades, charity milestones, stream setups) with animated progress bars that automatically update with every verified UPI tip.
          </p>
        </div>

        <!-- 6. Smart Anti-Spam -->
        <div class="bento-card">
          <div class="bento-icon">
            <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>
          </div>
          <h3>Anti-Spam &amp; Word Filtering</h3>
          <p>
            Protect your stream from trolls with minimum amount triggers for TTS speech, keyword blocklists, and automatic profanity suppression.
          </p>
        </div>
      </div>
    </div>
  </section>

  <!-- Head-to-Head Comparison Table (#comparison) -->
  <section class="comparison-section" id="comparison">
    <div class="container">
      <div style="text-align:center;">
        <span class="section-meta-tag">Platform Comparison</span>
        <h2 class="section-heading">Why Streamers Switch to DenAlerts</h2>
        <p class="section-description">
          See the stark mathematical difference between YouTube Super Chat, traditional alert aggregators, and DenAlerts.
        </p>
      </div>

      <div class="comparison-table-wrap">
        <table class="comparison-table">
          <thead>
            <tr>
              <th style="width:30%;">Feature / Capability</th>
              <th class="col-highlight" style="width:25%;">DenAlerts</th>
              <th style="width:25%;">YouTube Super Chat</th>
              <th style="width:20%;">Streamlabs</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Platform Commission</strong></td>
              <td class="col-highlight tag-win">0% (Keep 100%)</td>
              <td class="tag-lose">30% Revenue Cut</td>
              <td class="tag-lose">2.9% + ₹30 / txn</td>
            </tr>
            <tr>
              <td><strong>Payout Settlement Time</strong></td>
              <td class="col-highlight tag-win">Instant (0 seconds)</td>
              <td class="tag-lose">Net-30 Days Delay</td>
              <td class="tag-lose">2 - 5 Business Days</td>
            </tr>
            <tr>
              <td><strong>Where Funds Land</strong></td>
              <td class="col-highlight tag-win">Direct into Savings Account</td>
              <td>Google AdSense Escrow</td>
              <td>Payment Gateway Balance</td>
            </tr>
            <tr>
              <td><strong>Setup Requirements</strong></td>
              <td class="col-highlight tag-win">Any Personal UPI ID</td>
              <td class="tag-lose">AdSense KYC &amp; Tax Forms</td>
              <td class="tag-lose">Merchant KYC &amp; GSTIN</td>
            </tr>
            <tr>
              <td><strong>Supported UPI Apps</strong></td>
              <td class="col-highlight tag-win">GPay, PhonePe, Paytm, BHIM</td>
              <td>Credit Cards / Limited UPI</td>
              <td>Cards / Gateways</td>
            </tr>
            <tr>
              <td><strong>TTS &amp; Sound Overlay</strong></td>
              <td class="col-highlight tag-win">Indian Voice &amp; Custom Overlays</td>
              <td class="tag-lose">Chat Text Only</td>
              <td>English Only Defaults</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>

  <!-- Standalone Hub Navigation (#explore-hub) -->
  <section class="hub-section" id="explore-hub">
    <div class="container">
      <div style="text-align:center;">
        <span class="section-meta-tag">Creator Resources</span>
        <h2 class="section-heading">Dedicated Platform Hubs</h2>
        <p class="section-description">
          Everything is organized into dedicated, transparent pages for complete clarity.
        </p>
      </div>

      <div class="hub-grid">
        <a href="/about" class="hub-card">
          <div class="hub-card-icon">
            <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
          </div>
          <div class="hub-card-title">About DenAlerts</div>
          <div class="hub-card-desc">Our mission, engineering architecture, and creator privacy policy.</div>
        </a>

        <a href="/features" class="hub-card">
          <div class="hub-card-icon">
            <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          </div>
          <div class="hub-card-title">Broadcaster Toolkit</div>
          <div class="hub-card-desc">OBS overlays, sound chimes, goal progress bars, and leaderboards.</div>
        </a>

        <a href="/pricing" class="hub-card">
          <div class="hub-card-icon">
            <svg viewBox="0 0 24 24"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          </div>
          <div class="hub-card-title">Plans &amp; Pricing</div>
          <div class="hub-card-desc">100% Free Forever tier and Creator Pro details with zero commission.</div>
        </a>

        <a href="/tutorial" class="hub-card">
          <div class="hub-card-icon">
            <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>
          </div>
          <div class="hub-card-title">Setup Video Guide</div>
          <div class="hub-card-desc">1080p master walkthrough to pair APK and launch OBS in 3 minutes.</div>
        </a>

        <a href="/faq" class="hub-card">
          <div class="hub-card-icon">
            <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          </div>
          <div class="hub-card-title">Frequently Asked</div>
          <div class="hub-card-desc">Got questions about UPI bank compatibility or OBS settings? Read answers.</div>
        </a>
      </div>
    </div>
  </section>

  <!-- Discord & Developer Section -->
  <section class="discord-section">
    <div class="container">
      <div class="discord-widget-card">
        <div>
          <div class="discord-widget-brand">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="#5865F2">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
            </svg>
            <span style="font-weight:700; font-size:15px; color:#fff;">Official Broadcaster Discord</span>
            <span class="discord-online-pill">
              <span class="discord-online-dot"></span>
              <span>Community Live</span>
            </span>
          </div>
          <h3>Join Indian Streamers &amp; Broadcasters</h3>
          <p>
            Get real-time setup troubleshooting, APK update drops, stream overlay asset packs, and direct feature support from the developer.
          </p>
        </div>
        <a href="https://discord.gg/XyKNuC4hBd" target="_blank" class="btn-join-discord-card">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
          </svg>
          <span>Join Official Discord</span>
        </a>
      </div>
    </div>
  </section>

  <!-- Professional Footer -->
  <footer class="site-footer">
    <div class="container">
      <div class="footer-ref-grid">
        <div>
          <div class="footer-brand-title">DenAlerts</div>
          <p class="footer-brand-text">
            DenAlerts is a broadcaster-grade notification relay that monitors Android notifications and bank SMS to trigger instant, transparent alerts in OBS Studio, Streamlabs, and vMix. Zero commission, direct P2P bank settlement.
          </p>
        </div>

        <div>
          <div class="footer-col-header">Platform</div>
          <ul class="footer-ref-links">
            <li><a href="/">Home</a></li>
            <li><a href="/features">Features</a></li>
            <li><a href="/pricing">Pricing Plans</a></li>
            <li><a href="/tutorial">Setup Tutorial</a></li>
            <li><a href="/faq">FAQ</a></li>
          </ul>
        </div>

        <div>
          <div class="footer-col-header">Legal &amp; Policy</div>
          <ul class="footer-ref-links">
            <li><a href="/terms">Terms of Service</a></li>
            <li><a href="/privacy">Privacy Policy</a></li>
            <li><a href="/refund-and-cancellation">Refund &amp; Cancellation</a></li>
          </ul>
        </div>

        <div>
          <div class="footer-col-header">Community</div>
          <ul class="footer-ref-links">
            <li><a href="https://discord.gg/XyKNuC4hBd" target="_blank">Discord Server</a></li>
            <li><a href="mailto:support@denbooks.in">support@denbooks.in</a></li>
            <li><a href="https://denbooks.in" target="_blank">SRB STUDIOS Suite</a></li>
          </ul>
        </div>
      </div>

      <div class="footer-ref-bottom">
        <div>&copy; 2026 DenAlerts. All rights reserved.</div>
        <div>Engineered with precision by <strong>SRB STUDIOS</strong> (<a href="https://denbooks.in" target="_blank">denbooks.in</a>)</div>
      </div>
    </div>
  </footer>

  <!-- Interactive Simulator Script -->
  <script>
    const simDonor = document.getElementById('sim-donor');
    const simNote = document.getElementById('sim-note');
    const simApp = document.getElementById('sim-app');
    const amountChips = document.querySelectorAll('.amount-chip');
    const btnTrigger = document.getElementById('btn-trigger-sim');
    
    const displayDonor = document.getElementById('display-donor');
    const displayAmount = document.getElementById('display-amount');
    const displayMsg = document.getElementById('display-msg');
    const simBadgeChip = document.getElementById('sim-badge-chip');
    const liveAlertCard = document.getElementById('live-alert-card');
    const waveformBars = document.getElementById('waveform-bars');
    const demoChime = document.getElementById('demo-chime');
    const btnToggleSound = document.getElementById('btn-toggle-sound');

    let selectedAmount = '500';
    let isSoundMuted = false;

    if (btnToggleSound) {
      btnToggleSound.addEventListener('click', () => {
        isSoundMuted = !isSoundMuted;
        btnToggleSound.style.opacity = isSoundMuted ? '0.4' : '1';
        btnToggleSound.setAttribute('title', isSoundMuted ? 'Unmute alert sound' : 'Mute alert sound');
      });
    }

    amountChips.forEach(chip => {
      chip.addEventListener('click', () => {
        amountChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        selectedAmount = chip.getAttribute('data-amt');
      });
    });

    function triggerAlert(donor, amount, app, note) {
      displayDonor.textContent = donor;
      displayAmount.textContent = '₹' + amount;
      displayMsg.textContent = '"' + note + '"';
      simBadgeChip.innerHTML = '<span>' + app + ' UPI</span>';

      // Animate card pop
      liveAlertCard.classList.remove('pop-animate');
      void liveAlertCard.offsetWidth; // Reflow
      liveAlertCard.classList.add('pop-animate');

      // Play Chime
      if (!isSoundMuted) {
        try {
          demoChime.currentTime = 0;
          demoChime.play().catch(() => {});
        } catch (_) {}
      }

      // Waveform animation
      waveformBars.classList.add('playing');

      // Speech synthesis
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const textToSpeak = donor + ' donated ₹' + amount + '. ' + note;
        const utter = new SpeechSynthesisUtterance(textToSpeak);
        utter.rate = 1.0;
        utter.pitch = 1.0;
        utter.onend = () => {
          waveformBars.classList.remove('playing');
        };
        window.speechSynthesis.speak(utter);
      } else {
        setTimeout(() => {
          waveformBars.classList.remove('playing');
        }, 3000);
      }
    }

    btnTrigger.addEventListener('click', () => {
      const donor = simDonor.value.trim() || 'Aakash Verma';
      const note = simNote.value.trim() || 'Clutch 1v4 god level gameplay bhai! GG';
      const app = simApp.value;
      triggerAlert(donor, selectedAmount, app, note);
    });
  </script>
</body>
</html>
`;

fs.writeFileSync(path.join(PUBLIC, 'index.html'), indexHtml, 'utf8');
console.log('✓ Wrote public/index.html');

// ============================================================================
// 3. CLEAN UP SUB-PAGES (pricing, tutorial, features, about, faq)
// ============================================================================
const subPages = ['pricing.html', 'tutorial.html', 'features.html', 'about.html', 'faq.html'];

subPages.forEach(file => {
  const filePath = path.join(PUBLIC, file);
  if (!fs.existsSync(filePath)) return;

  let content = fs.readFileSync(filePath, 'utf8');

  // Remove ambient glow spheres
  content = content.replace(/<div class="ambient-glow-sphere[^"]*"><\/div>/g, '');
  
  // Update landing.css cache buster version
  content = content.replace(/landing\.css(\?v=\d+)?/g, 'landing.css?v=50');

  // Replace font with Plus Jakarta Sans & JetBrains Mono
  content = content.replace(
    /family=Sora:[^"&]+/g,
    'family=Plus+Jakarta+Sans:wght@400;500;600;700;800'
  );

  // Remove cyan text shadows in inline styles
  content = content.replace(/text-shadow:\s*0\s*0\s*12px\s*rgba\(0,\s*240,\s*255,\s*0\.6\);?/g, '');
  content = content.replace(/color:\s*#00f0ff\s*!important;?/g, 'color: #ffffff !important;');

  // Remove cyan glow box-shadows in tutorial.html
  content = content.replace(/box-shadow:\s*0\s*20px\s*60px\s*rgba\(0,\s*0,\s*0,\s*0\.7\),\s*0\s*0\s*40px\s*rgba\(0,\s*240,\s*255,\s*0\.15\);?/g, 'box-shadow: 0 20px 60px rgba(0, 0, 0, 0.7);');
  content = content.replace(/border:\s*1px\s*solid\s*rgba\(0,\s*240,\s*255,\s*0\.3\);?/g, 'border: 1px solid rgba(255, 255, 255, 0.12);');
  content = content.replace(/background:\s*#00f0ff;\s*border-radius:\s*50%;\s*box-shadow:\s*0\s*0\s*10px\s*#00f0ff;/g, 'background: #10b981; border-radius: 50%; box-shadow: 0 0 10px #10b981;');

  // Replace emoji boxes in features.html if any
  content = content.replace('<div class="toolkit-icon-box">🎨</div>', '<div class="toolkit-icon-box"><svg viewBox="0 0 24 24" width="20" height="20" stroke="#818cf8" stroke-width="2" fill="none"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg></div>');
  content = content.replace('<div class="toolkit-icon-box">🎯</div>', '<div class="toolkit-icon-box"><svg viewBox="0 0 24 24" width="20" height="20" stroke="#818cf8" stroke-width="2" fill="none"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg></div>');
  content = content.replace('<div class="toolkit-icon-box">👑</div>', '<div class="toolkit-icon-box"><svg viewBox="0 0 24 24" width="20" height="20" stroke="#818cf8" stroke-width="2" fill="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg></div>');
  content = content.replace('<div class="toolkit-icon-box">📜</div>', '<div class="toolkit-icon-box"><svg viewBox="0 0 24 24" width="20" height="20" stroke="#818cf8" stroke-width="2" fill="none"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg></div>');
  content = content.replace('<div class="toolkit-icon-box">🔌</div>', '<div class="toolkit-icon-box"><svg viewBox="0 0 24 24" width="20" height="20" stroke="#818cf8" stroke-width="2" fill="none"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg></div>');
  content = content.replace('<div class="toolkit-icon-box">🛡️</div>', '<div class="toolkit-icon-box"><svg viewBox="0 0 24 24" width="20" height="20" stroke="#818cf8" stroke-width="2" fill="none"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg></div>');

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('✓ Cleaned ' + file);
});

console.log('All files successfully updated with world-class human-crafted styling!');
