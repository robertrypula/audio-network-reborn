// Copyright (c) 2019 Robert Rypuła - https://github.com/robertrypula

// Proof of Concept - don't judge the code quality :)

import * as domUtils from '@examples/web/dom-utils';
import { memoryBytes, refreshMemoryLog, regFP, regSP } from '@examples/web/simple-c/core';
import { Byte } from '@examples/web/simple-c/model';

/*tslint:disable:no-bitwise*/

export abstract class SimpleCWebExampleBase {
  protected htmlHistory: string[] = [];

  protected constructor() {
    domUtils.getByTagName('html').classList.add('simple-c');
    domUtils.getById('audio-network-reborn-root').innerHTML = require('./simple-c-web-example-base.html');

    refreshMemoryLog.handler = this.refreshMemoryLog.bind(this);
    this.run();
    this.configureInputs();
  }

  public refreshMemoryLog(): void {
    const html = this.getBytesHtml(memoryBytes);

    if (this.htmlHistory.length === 0 || this.htmlHistory[this.htmlHistory.length - 1] !== html) {
      this.htmlHistory.push(html);
    }
  }

  protected configureInputs(): void {
    domUtils.getByIdInput('range').setAttribute('max', this.htmlHistory.length - 1 + '');
    domUtils.getByIdInput('range').addEventListener('input', () => {
      domUtils.getById('memory').innerHTML = this.htmlHistory[+domUtils.getByIdInput('range').value];
    });
    domUtils.getById('memory').innerHTML = this.htmlHistory[0];
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
