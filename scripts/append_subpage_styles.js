const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, '..', 'public', 'landing.css');
let css = fs.readFileSync(cssPath, 'utf8');

const subpageStyles = `
/* ==========================================================================
   Clean Minimal Dark Subpages (Pricing, Features, Tutorial, FAQ, Policies)
   ========================================================================== */

.page-hero-header {
  padding: 120px 0 36px;
  text-align: center;
}

/* Pricing Grid */
.pricing-section {
  padding: 20px 0 70px;
}

.pricing-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-top: 30px;
}

.pricing-card {
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  padding: 30px;
  box-shadow: var(--shadow-card);
  display: flex;
  flex-direction: column;
  transition: border-color 0.2s ease;
}

.pricing-card:hover {
  border-color: var(--border-medium);
}

.pricing-card.featured {
  border-color: rgba(255, 255, 255, 0.25);
  background: #111115;
}

.plan-tier-name {
  font-size: 17px;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 8px;
}

.plan-price-wrap {
  display: flex;
  align-items: baseline;
  gap: 6px;
  margin-bottom: 12px;
}

.plan-price {
  font-family: 'JetBrains Mono', monospace;
  font-size: 34px;
  font-weight: 700;
  color: #ffffff;
}

.plan-duration {
  font-size: 13px;
  color: var(--text-tertiary);
}

.plan-explanation {
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.5;
  margin-bottom: 22px;
}

.plan-features-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 28px;
  flex: 1;
}

.plan-features-list li {
  display: flex;
  align-items: flex-start;
  gap: 9px;
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.45;
}

.plan-features-list li.dimmed {
  opacity: 0.35;
}

.check-svg {
  width: 15px;
  height: 15px;
  stroke: #10b981;
  stroke-width: 2.5;
  fill: none;
  flex-shrink: 0;
  margin-top: 2px;
}

.cross-svg {
  width: 15px;
  height: 15px;
  stroke: var(--text-tertiary);
  stroke-width: 2.2;
  fill: none;
  flex-shrink: 0;
  margin-top: 2px;
}

/* Features Toolkit */
.toolkit-section {
  padding: 20px 0 70px;
}

.toolkit-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-top: 36px;
}

.toolkit-card {
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  padding: 24px;
  box-shadow: var(--shadow-card);
  transition: border-color 0.2s ease;
}

.toolkit-card:hover {
  border-color: var(--border-medium);
}

.toolkit-icon-box {
  width: 36px;
  height: 36px;
  border-radius: var(--radius-sm);
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border-subtle);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  color: #ffffff;
}

.toolkit-card h3 {
  font-size: 16.5px;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 8px;
}

.toolkit-card p {
  font-size: 13.5px;
  color: var(--text-secondary);
  line-height: 1.55;
}

/* Video Tutorial Player */
.tutorial-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 110px 24px 60px;
}

.video-player-card {
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-card);
  margin-bottom: 30px;
}

.video-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 18px;
  background: #000000;
  border-bottom: 1px solid var(--border-subtle);
}

.video-card-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 600;
  color: #ffffff;
}

.video-quality-tag {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10.5px;
  color: var(--text-tertiary);
}

.tutorial-step-card {
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  padding: 20px 24px;
  margin-bottom: 16px;
  box-shadow: var(--shadow-card);
}

.tutorial-step-card h3 {
  font-size: 16px;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 6px;
}

.tutorial-step-card p {
  font-size: 13.5px;
  color: var(--text-secondary);
  line-height: 1.55;
}

/* FAQ Accordion */
.faq-section {
  padding: 20px 0 70px;
}

.faq-grid {
  max-width: 860px;
  margin: 30px auto 0;
}

.faq-item {
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  padding: 18px 22px;
  margin-bottom: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: var(--shadow-card);
}

.faq-item:hover {
  border-color: var(--border-medium);
}

.faq-question {
  font-size: 14.5px;
  font-weight: 600;
  color: #ffffff;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.faq-answer {
  font-size: 13.5px;
  color: var(--text-secondary);
  line-height: 1.6;
  margin-top: 12px;
  display: none;
}

.faq-item.active .faq-answer {
  display: block;
}

@media (max-width: 1024px) {
  .toolkit-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .toolkit-grid {
    grid-template-columns: 1fr;
  }
}
`;

css += subpageStyles;
fs.writeFileSync(cssPath, css, 'utf8');
console.log('✓ Successfully appended clean subpage styles to landing.css');
