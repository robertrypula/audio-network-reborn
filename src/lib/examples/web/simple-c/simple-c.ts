// Copyright (c) 2019 Robert Rypuła - https://github.com/robertrypula

import * as domUtils from '@examples/web/dom-utils';
import { add, Byte, call, memoryBytes, regFP, regSP, ret, sh, word } from '@examples/web/simple-c/core';

/*tslint:disable:no-console*/
/*tslint:disable:no-bitwise*/

export class SimpleCWebExample {
  public constructor() {
    domUtils.getByTagName('html').classList.add('simple-c');
    domUtils.getById('audio-network-reborn-root').innerHTML = require('./simple-c.html');

    domUtils.getById('refresh-button').addEventListener('click', () => this.refreshMemoryLog());
    this.refreshMemoryLog();
  }

  public refreshMemoryLog(): void {
    this.run();
    // domUtils.getById('stack-memory').innerHTML = this.getBytesHtml(stackBytes);
    domUtils.getById('memory').innerHTML = this.getBytesHtml(memoryBytes);
  }

  protected getBytesHtml(bytes: Byte[]): string {
    return bytes.reduce(
      (html, byte, index) =>
        html +
        `<span class="${byte.type} ${index === regFP ? 'fp' : ''} ${index === regSP ? 'sp' : ''}">${this.getHexFromByte(
          byte.value
        )}</span> `,
      ''
    );
  }

  protected getHexFromByte(byte: number): string {
    return ((byte & 0xff) < 16 ? '0' : '') + (byte & 0xff).toString(16);
  }

  protected run(): void {
    const length = word(1, []);
    const textToCheck = word(10, [`simple c`]);
    const getLengthBag = word(2, []);
    const getLength = word(-1, [
      bag => {
        const text = word(0, []);
        const i = word(0, []);
        const chars = word(1, []);
        const stillNotReachedEnd = word(1, []);
        const offset = word(1, []);
        const params = word(0, []);

        params.a = bag.v;
        text.a = params.idx(0).v;
        i.a = params.idx(1).v;

        stillNotReachedEnd.v = 1;
        i.v = -1;

        do {
          i.v = add(i.v, 1);

          chars.v = text.idx(i.v).v;
          chars.v = sh(chars.v, 8);
          offset.v = 0;

          if (chars.v) {
            chars.v = text.idx(i.v).v;
            chars.v = sh(chars.v, -8);
            chars.v = sh(chars.v, 8);
            if (chars.v) {
              // nothing
            } else {
              offset.v = 1;
              stillNotReachedEnd.v = 0;
            }
          } else {
            stillNotReachedEnd.v = 0;
          }
        } while (stillNotReachedEnd.v);

        i.v = sh(i.v, -1);
        i.v = add(i.v, offset.v);

        ret();
      }
    ]);

    getLengthBag.idx(0).v = textToCheck.a;
    getLengthBag.idx(1).v = length.a;

    call(getLength.a, getLengthBag.a);
  }
}
