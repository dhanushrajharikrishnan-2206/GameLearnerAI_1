class SoundSynthesizer {
  private ctx: AudioContext | null = null;
  private isEnabled: boolean = true;

  constructor() {
    // Read persisted audio preference
    const saved = localStorage.getItem('gamelearn_audio_enabled');
    if (saved !== null) {
      this.isEnabled = saved === 'true';
    }
  }

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public getAudioEnabled(): boolean {
    return this.isEnabled;
  }

  public setAudioEnabled(enabled: boolean) {
    this.isEnabled = enabled;
    localStorage.setItem('gamelearn_audio_enabled', String(enabled));
  }

  public toggleAudio(): boolean {
    this.setAudioEnabled(!this.isEnabled);
    return this.isEnabled;
  }

  // 1. Correct Answer: Ascending cheerful arpeggio
  public playCorrect() {
    if (!this.isEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, this.ctx!.currentTime + idx * 0.07);

      gain.gain.setValueAtTime(0, this.ctx!.currentTime + idx * 0.07);
      gain.gain.linearRampToValueAtTime(0.18, this.ctx!.currentTime + idx * 0.07 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx!.currentTime + idx * 0.07 + 0.22);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(this.ctx!.currentTime + idx * 0.07);
      osc.stop(this.ctx!.currentTime + idx * 0.07 + 0.25);
    });
  }

  // 2. Incorrect Answer: Low dissonance buzzer
  public playIncorrect() {
    if (!this.isEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(160, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(110, this.ctx.currentTime + 0.28);

    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.3);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(this.ctx.currentTime);
    osc.stop(this.ctx.currentTime + 0.32);
  }

  // 3. XP Sparkle: High twinkling chime
  public playXp() {
    if (!this.isEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, this.ctx.currentTime); // A5
    osc.frequency.exponentialRampToValueAtTime(1760, this.ctx.currentTime + 0.15); // A6

    gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.2);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(this.ctx.currentTime);
    osc.stop(this.ctx.currentTime + 0.22);
  }

  // 4. Boss Hit: Punchy low impact thump
  public playBossHit() {
    if (!this.isEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(220, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(45, this.ctx.currentTime + 0.25);

    gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.28);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(this.ctx.currentTime);
    osc.stop(this.ctx.currentTime + 0.3);
  }

  // 5. Boss Defeated / Victory: Epic fanfare chord
  public playBossDefeated() {
    if (!this.isEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    const chords = [
      [523.25, 659.25, 783.99],       // C Major
      [587.33, 739.99, 880.00],       // D Major
      [659.25, 830.61, 987.77],       // E Major
      [783.99, 987.77, 1174.66, 1567.98] // G Major with high octave
    ];

    chords.forEach((chord, step) => {
      const time = this.ctx!.currentTime + step * 0.16;
      chord.forEach((freq) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, time);

        gain.gain.setValueAtTime(0.12, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.45);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(time);
        osc.stop(time + 0.5);
      });
    });
  }

  // 5b. Level Up fanfare
  public playLevelUpSound() {
    this.playBossDefeated();
  }

  // 6. Combo Fire sound
  public playCombo(comboLevel: number) {
    if (!this.isEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    const baseFreq = 440 + Math.min(comboLevel, 10) * 80;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(baseFreq, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(baseFreq * 1.5, this.ctx.currentTime + 0.12);

    gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.18);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(this.ctx.currentTime);
    osc.stop(this.ctx.currentTime + 0.2);
  }
}

export const soundFx = new SoundSynthesizer();
