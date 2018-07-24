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

    const player = new DymoPlayerManager(true, true, 0.2, 2);
    await player.init("https://raw.githubusercontent.com/dynamic-music/dymo-core/master/ontologies/");
    console.log("loaded", await player.getDymoManager().getStore().size());
    await player.loadDymoFromString(this.texture);
    player.startPlaying();
  }

}
