import { Injectable } from '@angular/core';

@Injectable()
export class ApiService {

  private API_URL = "https://play-it-again-use-it-together.herokuapp.com/";//"http://localhost:8060/";

  async getTexture(): Promise<string> {
    return JSON.stringify(await this.getJsonFromApi('texture/'), null, "    ");
  }

  private async getJsonFromApi(path: string, params?: {}): Promise<{}> {
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