// Copyright (c) 2019 Robert Rypuła - https://github.com/robertrypula

import * as domUtils from '@examples/web/dom-utils';
import { add, call, ret, sh, word } from '@examples/web/simple-c/core';

export class SimpleCWebExample {
  public constructor() {
    domUtils.getByTagName('html').classList.add('simple-c');
    domUtils.getById('audio-network-reborn-root').innerHTML = require('./simple-c.html');

    domUtils.getById('refresh-button').addEventListener('click', () => this.refreshMemoryLog());
  }

  public refreshMemoryLog(): void {
    domUtils.getById('stack-memory').innerHTML = '32';
    domUtils.getById('data-memory').innerHTML = '32';
    this.run();
  }

  protected run(): void {
    const length = word(1, []);
    const textToCheck = word(20, [`lorem ipsum`]);
    const getLength = word(1, [
      bag => {
        const text = word(0, []);
        const i = word(0, []);
        const chars = word(1, []);
        const isEnd = word(1, []);
        const offset = word(1, []);

        isEnd.v = 0;
        i.v = -1;

        text.a = bag.idx(0).v;
        i.a = bag.idx(1).v;

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
              isEnd.v = 1;
            }
          } else {
            isEnd.v = 1;
          }
        } while (isEnd.v);

        i.v = sh(i.v, -1);
        i.v = add(i.v, offset.v);

        ret();
      }
    ]);

    const getLengthBag = word(2, []);
    getLengthBag.idx(0).v = textToCheck.a;
    getLengthBag.idx(1).v = length.a;

    call(getLength.a, getLengthBag.a);
  }
}
