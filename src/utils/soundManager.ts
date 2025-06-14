
export class SoundManager {
  private audioContext: AudioContext | null = null;
  private soundEnabled = true;

  constructor() {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (e) {
      console.warn('Web Audio API not supported');
    }
  }

  private createTone(frequency: number, duration: number, type: OscillatorType = 'sine') {
    if (!this.audioContext || !this.soundEnabled) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
    oscillator.type = type;

    gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration);
  }

  playMoveSound() {
    this.createTone(800, 0.1);
  }

  playCaptureSound() {
    this.createTone(600, 0.15, 'sawtooth');
  }

  playCheckSound() {
    this.createTone(1000, 0.2);
    setTimeout(() => this.createTone(1200, 0.2), 100);
  }

  playGameOverSound() {
    this.createTone(400, 0.3);
    setTimeout(() => this.createTone(350, 0.3), 150);
    setTimeout(() => this.createTone(300, 0.5), 300);
  }

  playInvalidMoveSound() {
    this.createTone(200, 0.1, 'square');
  }

  toggleSound() {
    this.soundEnabled = !this.soundEnabled;
    return this.soundEnabled;
  }

  isSoundEnabled() {
    return this.soundEnabled;
  }
}

export const soundManager = new SoundManager();
