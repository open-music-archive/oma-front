import { Component, OnInit } from '@angular/core';
import { DymoPlayer } from 'dymo-player';
import { ApiService } from './services/api-service';
import * as JSZip from 'jszip';
import * as _ from 'lodash';
import { saveAs } from 'file-saver/FileSaver';
import { Http } from '@angular/http';

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

  constructor(private apiService: ApiService, private http: Http) {}

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
      const zip = new JSZip();
      const folder = zip.folder("sound-objects");

      await Promise.all(files.map(async f => {
        const audio = await fetch(f, {mode: 'cors'});
        const name = f.slice(_.lastIndexOf(f, '/')+1);
        if (audio.ok) {
          folder.file(name, audio.arrayBuffer())
        }
      }));

      zip.generateAsync({type:"blob"}).then(content => {
        saveAs(content, "sound-objects.zip");
      });
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
