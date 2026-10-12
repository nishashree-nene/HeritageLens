export interface SpeechOptions { lang?: string; rate?: number; pitch?: number; volume?: number; }

class SpeechService {
  private utterance: SpeechSynthesisUtterance | null = null;
  private supported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  speak(text: string, options: SpeechOptions = {}) {
    if (!this.supported) return;
    this.stop();
    this.utterance = new SpeechSynthesisUtterance(text);
    this.utterance.lang = options.lang ?? 'en-IN';
    this.utterance.rate = options.rate ?? 0.9;
    this.utterance.pitch = options.pitch ?? 1.0;
    this.utterance.volume = options.volume ?? 1.0;
    window.speechSynthesis.speak(this.utterance);
  }

  stop() { if (this.supported) { window.speechSynthesis.cancel(); this.utterance = null; } }
  pause() { if (this.supported) window.speechSynthesis.pause(); }
  resume() { if (this.supported) window.speechSynthesis.resume(); }
  isSpeaking() { return this.supported && window.speechSynthesis.speaking; }
  get isSupported() { return this.supported; }
}

export const speechService = new SpeechService();
