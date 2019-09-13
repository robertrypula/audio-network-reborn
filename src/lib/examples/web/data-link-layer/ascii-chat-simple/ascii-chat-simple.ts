// Copyright (c) 2019 Robert Rypuła - https://github.com/robertrypula

import {
  DataLinkLayer,
  DataLinkLayerWrapper,
  getBytesFromHex,
  getBytesFromText,
  getHexFromBytes,
  getTextFromBytes
} from '@';
import * as fromTemplate from '@examples/web/data-link-layer/ascii-chat-simple/ascii-chat-simple.template';

/*tslint:disable-next-line:no-var-requires*/
const template = require('./ascii-chat-simple.html');

// const getById = <T = HTMLElement>(id: string) => (document.getElementById(id) as T); TODO check why it's not working
const getById = (id: string) => document.getElementById(id);
const getByIdInput = (id: string) => document.getElementById(id) as HTMLInputElement;
const getByTagName = (tag: string) => document.getElementsByTagName(tag);

export class DataLinkLayerAsciiChatSimpleWebExample {
  public dataLinkLayerWrapper: DataLinkLayerWrapper;

  public constructor() {
    /*tslint:disable-next-line:no-console*/
    console.log(template);
    getByTagName('html')[0].classList.add('data-link-layer-ascii-chat-simple');
    getById('audio-network-lite-root').innerHTML = fromTemplate.mainHtml;
    this.dataLinkLayerWrapper = new DataLinkLayerWrapper(new DataLinkLayer());
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
    const { payloadLengthMax, payloadLengthMin } = this.dataLinkLayerWrapper.dataLinkLayer.getFrameConfig();
    const value = (getById('send-field') as HTMLInputElement).value;
    const bytes = (getById('send-as-hex-checkbox') as HTMLInputElement).checked
      ? getBytesFromHex(value)
      : getBytesFromText(value.replace(/[^\x20-\x7E]+/g, ''));

    if (bytes.length < payloadLengthMin || payloadLengthMax < bytes.length) {
      alert('Payload of ' + bytes.length + ' B is out of range <' + payloadLengthMin + ', ' + payloadLengthMax + '>');
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

    div.innerHTML = `<div>${getTextFromBytes(bytes)}<br/>${getHexFromBytes(bytes)}</div>`;
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
