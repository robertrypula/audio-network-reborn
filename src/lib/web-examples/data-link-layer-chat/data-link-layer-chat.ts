// Copyright (c) 2019 Robert Rypuła - https://github.com/robertrypula

import { DataLinkLayer, DataLinkLayerWrapper, getBytesFromText, getTextFromBytes } from '../..';
import * as fromTemplate from './data-link-layer-chat.template';

export class DataLinkLayerChatWebExample {
  public dataLinkLayerWrapper: DataLinkLayerWrapper;

  public constructor() {
    document.getElementById('audio-network-lite-root').innerHTML = fromTemplate.mainHtml;
    this.dataLinkLayerWrapper = new DataLinkLayerWrapper(new DataLinkLayer());
  }

  public listenEnable(): void {
    document.getElementById('listen-enable-button').style.display = 'none';
    document.getElementById('waiting-for-data-frames-label').style.display = 'block';
    this.dataLinkLayerWrapper.listen({
      complete: () => {
        document.getElementById('listen-enable-button').style.display = 'block';
        document.getElementById('waiting-for-data-frames-label').style.display = 'none';
      },
      next: bytes => this.logFrame(getTextFromBytes(bytes), true)
    });
  }

  public send(): void {
    const asciiText = (document.getElementById('send-field') as HTMLInputElement).value.replace(/[^\x20-\x7E]+/g, '');

    if (asciiText === '') {
      return;
    }

    document.getElementById('send-field').setAttribute('disabled', 'disabled');
    document.getElementById('send-button').setAttribute('disabled', 'disabled');
    this.dataLinkLayerWrapper.send(getBytesFromText(asciiText), {
      complete: () => {
        document.getElementById('send-field').removeAttribute('disabled');
        document.getElementById('send-button').removeAttribute('disabled');
        (document.getElementById('send-field') as HTMLInputElement).value = '';
        this.logFrame(asciiText, false);
      },
      next: progress => (document.getElementById('progress').style.width = progress * 100 + '%')
    });
  }

  protected logFrame(message: string, isReceived: boolean): void {
    const div = document.createElement('div');

    div.innerHTML = message;
    if (isReceived) {
      div.style.textAlign = 'right';
    }
    document.getElementById('messages').appendChild(div);
  }
}
