// Copyright (c) 2019 Robert Rypuła - https://github.com/robertrypula

import {
  CheckAlgorithm,
  DataLinkLayer,
  DataLinkLayerWrapper,
  getBytesFromHex,
  getHexFromBytes,
  getTextFromUtf8Bytes,
  getUtf8BytesFromText
} from '@';

// const getById = <T = HTMLElement>(id: string) => (document.getElementById(id) as T); TODO check why it's not working
const getById = (id: string) => document.getElementById(id);
const getByIdInput = (id: string) => document.getElementById(id) as HTMLInputElement;
const getByTagName = (tag: string) => document.getElementsByTagName(tag);

export class DataLinkLayerChatSimpleWebExample {
  public dataLinkLayerWrapper: DataLinkLayerWrapper;

  public constructor() {
    getByTagName('html')[0].classList.add('data-link-layer-chat-simple');
    getById('audio-network-lite-root').innerHTML = require('./chat-simple.html');
    this.dataLinkLayerWrapper = new DataLinkLayerWrapper(new DataLinkLayer());
    this.dataLinkLayerWrapper.dataLinkLayer.setFrameConfigInitializer({
      checkAlgorithm: CheckAlgorithm.Sha1,
      headerLength: 20,
      payloadLengthBitSize: 0,
      payloadLengthFixed: 1,
      payloadLengthOffset: 1
    });
    this.dataLinkLayerWrapper.dataLinkLayer.physicalLayer.setDspConfigInitializer({
      fftSize: 4096,
      frequencyEnd: 7000,
      safeMarginFactor: 1.2
    });
    console.log(this.dataLinkLayerWrapper.dataLinkLayer.getFrameConfig());
    console.log(this.dataLinkLayerWrapper.dataLinkLayer.physicalLayer.getDspConfig());
    this.initializeHtmlElements();
  }

  public listenEnable(): void {
    getById('listen-wrapper').classList.add('enabled');
    this.dataLinkLayerWrapper.listen({
      complete: () => getById('listen-wrapper').classList.remove('enabled'),
      next: bytes => this.logFrame(bytes, true)
    });
  }

  public send(): void {
    const { max, min } = this.dataLinkLayerWrapper.dataLinkLayer.getFrameConfig().payloadLength;
    const value = (getById('send-field') as HTMLInputElement).value;
    const bytes = (getById('send-as-hex-checkbox') as HTMLInputElement).checked
      ? getBytesFromHex(value)
      : getUtf8BytesFromText(value);

    if (bytes.length < min || max < bytes.length) {
      alert('Payload of ' + bytes.length + ' B is out of range <' + min + ', ' + max + '>');
      return;
    }

    this.sendStart();
    this.dataLinkLayerWrapper.send(bytes, {
      complete: () => this.sendComplete(bytes),
      next: progress => (getById('send-progress-bar').style.width = progress * 100 + '%')
    });
  }

  protected initializeHtmlElements(): void {
    getById('send-button').addEventListener('click', () => this.send());
    getById('listen-enable-button').addEventListener('click', () => this.listenEnable());
    getById('send-field').addEventListener('keydown', (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        this.send();
      }
    });
  }

  protected logFrame(bytes: number[], isReceived: boolean): void {
    const div = document.createElement('div');

    div.innerHTML = `<div>${getTextFromUtf8Bytes(bytes)}<br/>${getHexFromBytes(bytes)}</div>`;
    div.classList.add(isReceived ? 'received' : 'sent');
    getById('messages-wrapper').appendChild(div);
  }

  protected sendStart(): void {
    getById('sent-wrapper').classList.add('sending-in-progress');
    getByIdInput('send-field').disabled = true;
    getByIdInput('send-button').disabled = true;
  }

  protected sendComplete(bytes: number[]): void {
    const sendField = getById('send-field') as HTMLInputElement;

    getById('sent-wrapper').classList.remove('sending-in-progress');
    getByIdInput('send-button').disabled = false;
    sendField.disabled = false;
    sendField.value = '';
    sendField.focus();
    this.logFrame(bytes, false);
  }
}
