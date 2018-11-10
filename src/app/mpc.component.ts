import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService, SoundObject } from './services/api-service';

@Component({
  templateUrl: './mpc.component.html'
})
export class MpcComponent {

  protected sounds: SoundObject[];

  constructor(private api: ApiService, public router: Router) {}

  async ngOnInit() {
    this.sounds = await this.api.getRandomSoundObjects(16);
  }

  play(sound: SoundObject) {
    new Audio(sound.audioUri).play();
  }

}
