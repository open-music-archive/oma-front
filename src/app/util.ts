import * as _ from 'lodash';
import * as JSZip from 'jszip';
import { saveAs } from 'file-saver/FileSaver';

export async function downloadAudioFiles(uris: string[]) {
  const zip = new JSZip();
  const folder = zip.folder("sound-objects");

  await Promise.all(uris.map(async f => {
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