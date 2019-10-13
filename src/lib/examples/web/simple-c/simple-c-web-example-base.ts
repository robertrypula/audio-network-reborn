// Copyright (c) 2019 Robert Rypuła - https://github.com/robertrypula

import * as domUtils from '@examples/web/dom-utils';
import { memoryBytes, refreshMemoryLog, regFP, regSP } from '@examples/web/simple-c/core';
import { Byte } from '@examples/web/simple-c/model';

/*tslint:disable:no-bitwise*/

export abstract class SimpleCWebExampleBase {
  protected refreshMemoryLogCounter = 0;
  protected lastHtml: string = null;

  protected constructor() {
    domUtils.getByTagName('html').classList.add('simple-c');
    domUtils.getById('audio-network-reborn-root').innerHTML = require('./simple-c-web-example-base.html');

    refreshMemoryLog.handler = this.refreshMemoryLog.bind(this);
    this.run();
  }

  public refreshMemoryLog(): void {
    const div = domUtils.createElement('div');
    const html = this.getBytesHtml(memoryBytes);

    if (this.lastHtml !== html) {
      div.setAttribute('id', `log-${this.refreshMemoryLogCounter++}`);
      div.innerHTML = html;
      domUtils.getById('memory').appendChild(div);
      this.lastHtml = html;
    }
  }

  protected getBytesHtml(bytes: Byte[]): string {
    return bytes.reduce(
      (html, byte, index) =>
        html +
        `<span class="${byte.type} ${index === regFP ? 'fp' : ''} ${index === regSP ? 'sp' : ''}">` +
        `${this.getHexFromByte(byte.value)}` +
        `</span> `,
      ''
    );
  }

  protected getHexFromByte(byte: number): string {
    return ((byte & 0xff) < 16 ? '0' : '') + (byte & 0xff).toString(16);
  }

  protected abstract run(): void;
}
