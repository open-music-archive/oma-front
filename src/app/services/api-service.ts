import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import * as socketIO from 'socket.io-client';

export interface RecordSide {
  title: string,
  composer: string,
  artist: string,
  catNo: string,
  label: string,
  side: string,
  imageUri: string,
  originalImage: string,
  time: string,
  eq: string,
  noEqAudioFile: string,
  recordingGuid: string
}

@Injectable()
export class ApiService {

  private API_URL = "https://play-it-again-use-it-together.herokuapp.com/";//"http://localhost:8060/";
  private socket = socketIO(this.API_URL, {
    extraHeaders: {
      'Access-Control-Allow-Credentials': 'omit'
    }
  });

  async getRecentRecordings(): Promise<RecordSide[]> {
    const recs = <RecordSide[]>await this.getJsonFromApi('recordings/');
    recs.sort((a,b) => Date.parse(b.time) - Date.parse(a.time));
    return recs.slice(0,10);
  }

  async getTexture(): Promise<string> {
    return JSON.stringify(await this.getJsonFromApi('texture/'), null, "    ");
  }

  onLiveTexture(): Observable<string> {
    return new Observable<string>(observer => {
      this.socket.on('live-stream', (data: string) => observer.next(data));
    });
  }

  private async getJsonFromApi(path: string, params?: {}): Promise<{}[]> {
    path = this.addParams(path, params);
    const response = await fetch(this.API_URL+path);
    return JSON.parse(await response.text());
  }

  private addParams(path, params?: {}) {
    if (params) {
      let paramStrings = Array.from(Object.keys(params))
        .map(k => k+"="+encodeURIComponent(params[k]));
      path += '?'+paramStrings.join('&');
    }
    return path;
  }

}