import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { Language, PreservationStatus, VerificationStatus, ReconstructionConfidence } from '../types';

export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }

export function t(en: string, ta: string, lang: Language): string { return lang === 'ta' ? ta : en; }

export function getPreservationColor(status: PreservationStatus): string {
  const map: Record<PreservationStatus, string> = {
    excellent: 'text-emerald-400', good: 'text-yellow-400',
    fair: 'text-orange-400', poor: 'text-red-400', at_risk: 'text-red-600',
  };
  return map[status] ?? 'text-stone-400';
}

export function getPreservationLabel(status: PreservationStatus, lang: Language): string {
  const labels: Record<PreservationStatus, { en: string; ta: string }> = {
    excellent: { en: 'Excellent', ta: 'சிறப்பான நிலை' },
    good: { en: 'Good', ta: 'நல்ல நிலை' },
    fair: { en: 'Fair', ta: 'சரியான நிலை' },
    poor: { en: 'Poor', ta: 'மோசமான நிலை' },
    at_risk: { en: 'At Risk', ta: 'ஆபத்தில்' },
  };
  return labels[status]?.[lang] ?? status;
}

export function getVerificationLabel(status: VerificationStatus, lang: Language): string {
  const labels: Record<VerificationStatus, { en: string; ta: string }> = {
    verified: { en: 'Expert Verified', ta: 'நிபுணர் சரிபார்க்கப்பட்டது' },
    partial: { en: 'Partially Documented', ta: 'பகுதியளவு ஆவணம்' },
    interpretive: { en: 'Interpretive', ta: 'விளக்க மறுகட்டமைப்பு' },
    pending: { en: 'Pending Review', ta: 'மதிப்பாய்வு நிலுவை' },
    rejected: { en: 'Rejected', ta: 'நிராகரிக்கப்பட்டது' },
  };
  return labels[status]?.[lang] ?? status;
}

export function getConfidenceColor(level: ReconstructionConfidence): string {
  const map: Record<ReconstructionConfidence, string> = {
    high: 'text-emerald-400', medium: 'text-yellow-400',
    low: 'text-orange-400', interpretive: 'text-blue-400',
  };
  return map[level] ?? 'text-stone-400';
}

export function getConfidenceLabel(level: ReconstructionConfidence): string {
  const map: Record<ReconstructionConfidence, string> = {
    high: 'High Confidence', medium: 'Medium Confidence',
    low: 'Low Confidence', interpretive: 'Interpretive',
  };
  return map[level] ?? level;
}

export function getHeritageTypeIcon(type: string): string {
  const icons: Record<string, string> = {
    temple: '🛕', fort: '🏰', palace: '🏯', museum: '🏛️',
    archaeological: '⛏️', sculpture: '🗿', traditional_art: '🎨',
    festival: '🎊', food_heritage: '🍛', handicraft: '🪡', intangible: '🎵',
  };
  return icons[type] ?? '🏛️';
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '…';
}

export function scoreToGrade(score: number, total: number): { grade: string; color: string; label: string } {
  const pct = (score / total) * 100;
  if (pct >= 90) return { grade: 'A+', color: 'text-emerald-400', label: 'Excellent' };
  if (pct >= 80) return { grade: 'A', color: 'text-emerald-400', label: 'Great' };
  if (pct >= 70) return { grade: 'B', color: 'text-yellow-400', label: 'Good' };
  if (pct >= 60) return { grade: 'C', color: 'text-orange-400', label: 'Fair' };
  return { grade: 'D', color: 'text-red-400', label: 'Keep Learning' };
}
