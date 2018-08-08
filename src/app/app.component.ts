import { Component, OnInit } from '@angular/core';
import { DymoPlayer } from 'dymo-player';
import { ApiService } from './services/api-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  private player: DymoPlayer;
  private texture: string;
  private previousUri: string;

  constructor(private apiService: ApiService) {}

  async ngOnInit() {
    this.player = new DymoPlayer(true, true, 0.2, 2, 0.04);
    await this.player.init("https://raw.githubusercontent.com/dynamic-music/dymo-core/master/ontologies/");
    this.playLiveTexture();
  }

  private playLiveTexture() {
    this.apiService.onLiveTexture().subscribe(async texture => {
      this.texture = texture;
      const newUri = (await this.player.loadDymoFromString(texture)).dymoUris;
      console.log("LIVE", newUri, this.previousUri);
      this.player.playUri(newUri[newUri.length-1], this.previousUri);
      this.previousUri = newUri[newUri.length-1];
    })
  }

  private async playTexture() {
    this.texture = await this.apiService.getTexture();
    await this.player.loadDymoFromString(this.texture);
    this.player.play();
  }

}
