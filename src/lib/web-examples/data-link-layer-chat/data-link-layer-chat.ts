// Copyright (c) 2019 Robert Rypuła - https://github.com/robertrypula

import { DataLinkLayer, DataLinkLayerWrapper, getBytesFromText, getTextFromBytes } from '../..';
import * as fromTemplate from './data-link-layer-chat.template';

const getById = (id: string) => document.getElementById(id);

export class DataLinkLayerChatWebExample {
  public dataLinkLayerWrapper: DataLinkLayerWrapper;

  public constructor() {
    getById('audio-network-lite-root').innerHTML = fromTemplate.mainHtml;
    this.dataLinkLayerWrapper = new DataLinkLayerWrapper(new DataLinkLayer());
    this.initializeEvents();
  }

  public listenEnable(): void {
    getById('listen-enable-button').style.display = 'none';
    getById('waiting-for-data-frames-label').style.display = 'block';
    this.dataLinkLayerWrapper.listen({
      complete: () => {
        getById('listen-enable-button').style.display = 'block';
        getById('waiting-for-data-frames-label').style.display = 'none';
      },
      next: bytes => this.logFrame(getTextFromBytes(bytes), true)
    });
  }

  public send(): void {
    const asciiText = (getById('send-field') as HTMLInputElement).value.replace(/[^\x20-\x7E]+/g, '');

    if (asciiText === '') {
      return;
    }

    getById('send-field').setAttribute('disabled', 'disabled');
    getById('send-button').setAttribute('disabled', 'disabled');
    this.dataLinkLayerWrapper.send(getBytesFromText(asciiText), {
      complete: () => {
        getById('send-field').removeAttribute('disabled');
        getById('send-button').removeAttribute('disabled');
        (getById('send-field') as HTMLInputElement).value = '';
        this.logFrame(asciiText, false);
      },
      next: progress => (getById('progress-bar').style.width = progress * 100 + '%')
    });
  }

  protected initializeEvents(): void {
    getById('send-button').addEventListener('click', () => this.send());
    getById('listen-enable-button').addEventListener('click', () => this.listenEnable());
    getById('send-field').addEventListener('keydown', (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        this.send();
      }
    });
  }

  protected logFrame(message: string, isReceived: boolean): void {
    const div = document.createElement('div');

    div.innerHTML = message;
    if (isReceived) {
      div.style.textAlign = 'right';
    }
    getById('messages').appendChild(div);
  }
}
