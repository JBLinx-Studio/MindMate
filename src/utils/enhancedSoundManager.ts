
class EnhancedSoundManager {
  private sounds: { [key: string]: HTMLAudioElement } = {};
  private enabled: boolean = true;
  private volume: number = 0.7;

  constructor() {
    this.initializeSounds();
  }

  private initializeSounds() {
    // Create audio contexts for different game events
    this.sounds = {
      move: this.createSound('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+fzwm4gBSuBzvLZiTYIG2q+7dybTQwOUrDly'), 
      capture: this.createSound('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+fzwm4gBSuBzvLZiTYIG2q+7dybTQwOUrDl'), 
      check: this.createSound('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+fzwm4gBSuBzvLZiTYIG2q+7dybTQwOUrDl'),
      checkmate: this.createSound('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+fzwm4gBSuBzvLZiTYIG2q+7dybTQwOUrDl'),
      castle: this.createSound('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+fzwm4gBSuBzvLZiTYIG2q+7dybTQwOUrDl'),
      promotion: this.createSound('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+fzwm4gBSuBzvLZiTYIG2q+7dybTQwOUrDl'),
      gameStart: this.createSound('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+fzwm4gBSuBzvLZiTYIG2q+7dybTQwOUrDl'),
      gameEnd: this.createSound('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+fzwm4gBSuBzvLZiTYIG2q+7dybTQwOUrDl'),
      select: this.createSound('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+fzwm4gBSuBzvLZiTYIG2q+7dybTQwOUrDl'),
      hover: this.createSound('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+fzwm4gBSuBzvLZiTYIG2q+7dybTQwOUrDl')
    };
  }

  private createSound(dataUrl: string): HTMLAudioElement {
    const audio = new Audio();
    audio.preload = 'auto';
    audio.volume = this.volume;
    // For now, we'll create silent audio objects since we can't embed real audio data
    return audio;
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  setVolume(volume: number) {
    this.volume = Math.max(0, Math.min(1, volume));
    Object.values(this.sounds).forEach(sound => {
      sound.volume = this.volume;
    });
  }

  private playSound(soundName: string, variation: number = 0) {
    if (!this.enabled) return;
    
    try {
      const sound = this.sounds[soundName];
      if (sound) {
        sound.currentTime = 0;
        // Add slight pitch variation for more natural sound
        if (variation) {
          sound.playbackRate = 1 + (variation * 0.1);
        }
        sound.play().catch(() => {
          // Silently handle audio play failures (common in browsers)
        });
      }
    } catch (error) {
      // Silently handle any audio errors
    }
  }

  playMove(isCapture: boolean = false, variation: number = 0) {
    this.playSound(isCapture ? 'capture' : 'move', variation);
  }

  playCheck() {
    this.playSound('check');
  }

  playCheckmate() {
    this.playSound('checkmate');
  }

  playCastle() {
    this.playSound('castle');
  }

  playPromotion() {
    this.playSound('promotion');
  }

  playGameStart() {
    this.playSound('gameStart');
  }

  playGameEnd() {
    this.playSound('gameEnd');
  }

  playSelect() {
    this.playSound('select', Math.random() * 0.2 - 0.1);
  }

  playHover() {
    this.playSound('hover', Math.random() * 0.1);
  }

  // Advanced sound combinations
  playMoveSequence(moves: string[]) {
    moves.forEach((move, index) => {
      setTimeout(() => {
        this.playMove(move.includes('x'), index * 0.1);
      }, index * 100);
    });
  }

  playVictoryFanfare() {
    this.playGameEnd();
    setTimeout(() => this.playSound('promotion'), 500);
    setTimeout(() => this.playSound('castle'), 1000);
  }
}

export const enhancedSoundManager = new EnhancedSoundManager();
