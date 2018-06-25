import { Component, OnInit } from '@angular/core';
import { DymoPlayerManager } from 'dymo-player';
import { ApiService } from './services/api-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  private texture: string;

  constructor(private apiService: ApiService) {}

  async ngOnInit() {
    this.texture = await this.apiService.getTexture();
    const player = new DymoPlayerManager();
    await player.init();
    console.log("loaded", await player.getDymoManager().getStore().size());
    await player.getDymoManager().loadIntoStoreFromString(this.texture);
    player.startPlaying();
  }

}
