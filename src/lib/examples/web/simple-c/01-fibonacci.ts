// Copyright (c) 2019 Robert Rypuła - https://github.com/robertrypula

// Proof of Concept - don't judge the code quality :)

import { call, ret, word } from '@examples/web/simple-c/core';
import { add } from '@examples/web/simple-c/operators';
import { SimpleCWebExampleBase } from '@examples/web/simple-c/simple-c-web-example-base';

export class FibonacciWebExample extends SimpleCWebExampleBase {
  protected run(): void {
    const output = word(1, []);
    const input = word(1, [7]);
    const fibonacci = word(-1, [
      n => {
        const result = word(1, []);
        const aN = word(1, []);
        const bN = word(1, []);
        const aV = word(1, []);
        const bV = word(1, []);

        if (n.v <= 2) {
          // ^^^^^^^^^^^^^^^^^^^^ complex conditions are not allowed in Simple C - refactor it...
          // https://github.com/robertrypula/ucEmu/blob/master/operators/word/cmpGTE.js
          result.v = 1;
        } else {
          aN.v = add(n.v, -2);
          aV.v = call(fibonacci.a, aN.v);
          bN.v = add(n.v, -1);
          bV.v = call(fibonacci.a, bN.v);
          result.v = add(aV.v, bV.v);
        }

        ret(result.v);
      }
    ]);

    output.v = call(fibonacci.a, input.v);

    // F0	F1	F2	F3	F4	F5	F6	F7	F8	F9	F10	F11	F12	F13	F14	F15	F16
    //  0	 1	 1	 2	 3	 5	 8	13	21	34	 55	 89	144	233	377	610	987
    // console.log(input.v);
    // console.log(output.v);

    // Set the range form field to the end. The 'output' will be displayed in second byte pair.
    // 00 02 00 0d 00 06 ...
    //       ^^^^^
    //       value: 0x0d is 13 in decimal -> fibonacci(7)
  }
}
