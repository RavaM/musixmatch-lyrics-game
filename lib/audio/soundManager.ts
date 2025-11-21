// lib/audio/soundManager.ts
import { Howl, Howler } from "howler";

type SoundId = "click" | "correct" | "wrong";

class SoundManager {
  private sfx: Record<SoundId, Howl>;
  private bgm: Howl;
  private muted = false;
  private bgmBaseVolume = 0.05;

  constructor() {
    this.sfx = {
      click: new Howl({
        src: ["/sounds/click.wav"],
        volume: 0.1,
      }),
      correct: new Howl({
        src: ["/sounds/correct.mp3"],
        volume: 0.1,
      }),
      wrong: new Howl({
        src: ["/sounds/wrong.wav"],
        volume: 0.1,
      }),
    };

    this.bgm = new Howl({
      src: ["/sounds/bg-loop.mp3"],
      loop: true,
      volume: this.bgmBaseVolume,
      html5: false,
    });
  }

  play(id: SoundId) {
    if (this.muted) return;
    this.sfx[id]?.play();
  }

  playBgm() {
    if (this.muted) return;
    if (this.bgm.playing()) return;

    const id = this.bgm.play();
    this.bgm.volume(0, id);
    this.bgm.fade(0, this.bgmBaseVolume, 400, id);
  }

  pauseBgm() {
    if (!this.bgm.playing()) return;
    const from = this.bgm.volume();
    this.bgm.fade(from, 0, 300);
    setTimeout(() => this.bgm.pause(), 320);
  }

  setMuted(muted: boolean) {
    this.muted = muted;

    if (muted) {
      this.pauseBgm();
      Howler.mute(true);
    } else {
      Howler.mute(false);
    }
  }
}

export const soundManager = new SoundManager();
