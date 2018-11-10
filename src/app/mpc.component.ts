import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService, SoundObject } from './services/api-service';
import { downloadAudioFiles } from './util';

const KEYS = [[49,50,51,52],[81,87,69,82],[65,83,68,70],[89,88,67,86]];

@Component({
  templateUrl: './mpc.component.html'
})
export class MpcComponent {

  protected sounds: SoundObject[];
  protected audio: HTMLAudioElement[];
  protected isEditing = false;

  constructor(private api: ApiService, public router: Router) {}

  async ngOnInit() {
    this.sounds = await this.api.getRandomSoundObjects(16);
    this.updateAudio();
  }

  updateAudio() {
    this.audio = this.sounds.map(s => new Audio(s.audioUri));
  }

  play(sound: SoundObject) {
    this.audio[this.sounds.indexOf(sound)].play();
  }

  async random(sound: SoundObject) {
    const index = this.sounds.indexOf(sound);
    this.sounds[index] = (await this.api.getRandomSoundObjects(1))[0];
    this.updateAudio();
  }

  async similar(sound: SoundObject) {
    const index = this.sounds.indexOf(sound);
    this.sounds[index] = (await this.api.getSimilarSoundObjects(sound, 1))[0];
    this.updateAudio();
  }

  async all(sound: SoundObject) {
    const index = this.sounds.indexOf(sound);
    const newSounds = await this.api.getSimilarSoundObjects(sound, 16);
    this.sounds = this.sounds.map((s,i) => s == sound ? sound : newSounds[i]);
    this.updateAudio();
  }

  keyDown(event: KeyboardEvent) {
    KEYS.forEach((row,i) => row.forEach((val,j) =>
      event.keyCode == val ? this.play(this.sounds[i*4+j]) : null));
  }

  downloadCurrentSoundObjects() {
     downloadAudioFiles(this.sounds.map(s => s.audioUri));
  }

}
