// Copyright (c) 2019 Robert Rypuła - https://github.com/robertrypula

import { call, ret, word } from '@examples/web/simple-c/core';
import { add, sh } from '@examples/web/simple-c/operators';
import { SimpleCWebExampleBase } from '@examples/web/simple-c/simple-c-web-example-base';

export class SimpleCWebExample extends SimpleCWebExampleBase {
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
