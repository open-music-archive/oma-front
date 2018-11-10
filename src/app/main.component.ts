import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DymoPlayer } from 'dymo-player';
import { ApiService } from './services/api-service';
import { Http } from '@angular/http';
import { downloadAudioFiles } from './util';

@Component({
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  private player: DymoPlayer;
  private texture: string;
  private previousUri: string;
  private numPlayingDymos: number;
  private numLoadedBuffers: number;
  private performanceInfo: string;
  private recordings: {}[];

  constructor(private apiService: ApiService, private http: Http, public router: Router) {}

  async ngOnInit() {
    this.player = new DymoPlayer({useWorkers:true, preloadBuffers:true,
      scheduleAheadTime:1, loadAheadTime:1, loggingOn: false});
    await this.player.init("https://raw.githubusercontent.com/dynamic-music/dymo-core/master/ontologies/");
    this.player.getPlayingDymoUris().subscribe(ds => this.numPlayingDymos = ds.length);
    this.player.getAudioBank().getBufferCount().subscribe(n => this.numLoadedBuffers = n);
    this.playCrackling();
    this.playLiveTexture();
  }

  private playLiveTexture() {
    const live = this.apiService.onLiveTexture().subscribe(async texture => {

      this.texture = texture;
      const newUris = (await this.player.loadDymoFromString(texture)).dymoUris;
      const newUri = newUris[newUris.length-1];
      console.log("LIVE", await this.player.getDymoManager().getStore().size());
      this.updatePerformanceInfo();
      if (this.previousUri && this.player.isPlaying(this.previousUri)) {
        this.player.transitionToUri(newUri, this.previousUri, 3);
      } else {
        this.player.playUri(newUri);//, this.previousUri);
      }
      this.previousUri = newUri;

      this.recordings = await this.apiService.getRecentRecordings();
      //console.log(this.recordings)
    })
  }

  private async playTexture() {
    this.texture = await this.apiService.getTexture();
    await this.player.loadDymoFromString(this.texture);
    this.player.play();
  }

  private async playCrackling() {
    this.http.get('assets/crackling.json')
      .subscribe(async c => {
        const uri = (await this.player.loadDymoFromString(c.text())).dymoUris[0];
        this.player.playUri(uri);
        this.previousUri = uri;
      });
  }

  protected async downloadCurrentSoundObjects() {
    if (this.previousUri) {
      const files = await this.player.getDymoManager().getStore().getAllSourcePaths();
      downloadAudioFiles(files);
    }
  }

  private async updatePerformanceInfo() {
    let info: string[] = [];
    const store = this.player.getDymoManager().getStore();
    info.push("triples: " + await store.size());
    info.push("observers: " + await store.getValueObserverCount());
    info.push("constraints: " + await store.getActiveConstraintCount());
    info.push("dymos: " + this.numPlayingDymos);
    info.push("buffers: " + this.numLoadedBuffers);
    this.performanceInfo = info.join(', ');
  }

}
