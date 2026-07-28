export class NotificationModule {
  constructor(configModel) {
    this.configModel = configModel;
  }
  async notify(title, message) {
    this.visual(title, message);
    if (this.configModel.get().soundEnabled) this.sound();
  }
  visual(title, message) {
    if (!("Notification" in window)) return;
    if (Notification.permission === "granted")
      new Notification(title, { body: message });
    else if (Notification.permission !== "denied")
      Notification.requestPermission().then((permission) => {
        if (permission === "granted")
          new Notification(title, { body: message });
      });
  }
  sound() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(880, ctx.currentTime);
      gain.gain.setValueAtTime(0.07, ctx.currentTime);
      oscillator.connect(gain);
      gain.connect(ctx.destination);
      oscillator.start();
      oscillator.stop(ctx.currentTime + 0.25);
    } catch {
      /* degradación silenciosa */
    }
  }
}
