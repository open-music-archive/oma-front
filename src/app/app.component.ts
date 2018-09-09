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
  private numPlayingDymos: number;
  private numLoadedBuffers: number;
  private performanceInfo: string;

  constructor(private apiService: ApiService) {}

  async ngOnInit() {
    this.player = new DymoPlayer({useWorkers:true, preloadBuffers:true,
      scheduleAheadTime:1, loadAheadTime:1, loggingOn: false});
    await this.player.init("https://raw.githubusercontent.com/dynamic-music/dymo-core/master/ontologies/");
    this.player.getPlayingDymoUris().subscribe(ds => this.numPlayingDymos = ds.length);
    this.player.getAudioBank().getBufferCount().subscribe(n => this.numLoadedBuffers = n);
    this.playLiveTexture();
  }

  private playLiveTexture() {
    this.apiService.onLiveTexture().subscribe(async texture => {
      this.texture = texture;
      const newUris = (await this.player.loadDymoFromString(texture)).dymoUris;
      const newUri = newUris[newUris.length-1];
      console.log("LIVE", await this.player.getDymoManager().getStore().size());
      this.updatePerformanceInfo();
      //this.player.playUri(newUri);//, this.previousUri);
      this.player.transitionToUri(newUri, this.previousUri, 3);
      this.previousUri = newUri;
    })
  }

  private async playTexture() {
    this.texture = await this.apiService.getTexture();
    await this.player.loadDymoFromString(this.texture);
    this.player.play();
  }

  private async updatePerformanceInfo() {
    let info: string[] = [];
    const store = this.player.getDymoManager().getStore();
    info.push("triples: " + await store.size());
    info.push("observers: " + await store.getValueObserverCount());
    info.push("dymos: " + this.numPlayingDymos);
    info.push("buffers: " + this.numLoadedBuffers);
    this.performanceInfo = info.join(', ');
  }

}
