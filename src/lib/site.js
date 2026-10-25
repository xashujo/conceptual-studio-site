import settings from '../data/settings.json';

export { settings };

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

// The availability line is a month plus a label in the CMS. A future month reads as a date;
// once that month arrives (the site rebuilds weekly), the plain label shows instead, so it never goes stale.
export function availabilityText(now = new Date()) {
  const a = settings.availability ?? {};
  if (!a.show) return null;
  const [y, m] = String(a.from ?? '').split('-').map(Number);
  if (y && m) {
    const from = y * 12 + (m - 1);
    const current = now.getFullYear() * 12 + now.getMonth();
    if (from > current) return `Booking new projects from ${MONTHS[m - 1]}${y !== now.getFullYear() ? ` ${y}` : ''}`;
  }
  return a.label || 'Taking on new projects';
}

export const price = (n) => (n == null ? null : new Intl.NumberFormat('en-GB', { maximumFractionDigits: 0 }).format(n));

// Paragraphs from a plain multi-line CMS field.
export const paras = (s = '') => s.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);

export const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'XIII', 'XIV', 'XV', 'XVI', 'XVII', 'XVIII', 'XIX', 'XX'];

export const categoryName = { brand: 'Brand identity', data: 'Data visualisation', motion: '3D and motion' };

export function mailto(subject = 'A new project', body = '') {
  const q = new URLSearchParams({ subject, body }).toString().replace(/\+/g, '%20');
  return `mailto:${settings.email}?${q}`;
}

export function bookingHref() {
  return settings.bookingUrl || mailto('Booking a 20-minute call', 'Hi Josh,\n\nI’d like to book a 20-minute call about a project. Some times that suit me:\n\n');
}
