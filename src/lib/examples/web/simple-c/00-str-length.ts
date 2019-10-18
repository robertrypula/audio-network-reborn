// Copyright (c) 2019 Robert Rypuła - https://github.com/robertrypula

// Proof of Concept - don't judge the code quality :)

import { call, ret, word } from '@examples/web/simple-c/core';
import { add, sh } from '@examples/web/simple-c/operators';
import { SimpleCWebExampleBase } from '@examples/web/simple-c/simple-c-web-example-base';

export class StrLengthWebExample extends SimpleCWebExampleBase {
  protected run(): void {
    const length = word(1, []);
    const textToCheck = word(10, [`Simple C`]);
    const getLength = word(-1, [
      bag => {
        const text = word(0, []);
        const i = word(1, []);
        const chars = word(1, []);
        const stillNotReachedEnd = word(1, []);
        const offset = word(1, []);

        text.a = bag.v;

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

        ret(i.v);
      }
    ]);

    length.v = call(getLength.a, textToCheck.a);

    // Set the range form field to the end. The 'textToCheck' length will be displayed in second byte pair.
    // 00 02 00 08 00 06 ...
    //       ^^^^^
    //       length of `Simple C` string
  }
}
