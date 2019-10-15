// Copyright (c) 2019 Robert Rypuła - https://github.com/robertrypula

// Proof of Concept - don't judge the code quality :)

import { call, ret, word } from '@examples/web/simple-c/core';
import { add } from '@examples/web/simple-c/operators';
import { SimpleCWebExampleBase } from '@examples/web/simple-c/simple-c-web-example-base';

// Most desired feature:
// - add ability to return values by function call like ret(something.v)

export class FibonacciWebExample extends SimpleCWebExampleBase {
  protected run(): void {
    const output = word(1, []);
    const input = word(1, [7]);
    const fibonacci = word(-1, [
      bag => {
        const bagReader = word(0, []);
        const outputWriter = word(0, []);
        const n = word(1, []);
        const aN = word(1, []);
        const bN = word(1, []);
        const aV = word(1, []);
        const bV = word(1, []);
        const bagSub = word(2, []);

        bagReader.a = bag.v;
        n.v = bagReader.idx(1).v;
        outputWriter.a = bagReader.idx(0).v;

        if (n.v === 1 || n.v === 2) {
          // ^^^^^^^^^^^^^^^^^^^^ complex conditions are not allowed in Simple C - refactor it...
          outputWriter.v = 1;
        } else {
          aN.v = add(n.v, -2);
          bN.v = add(n.v, -1);

          bagSub.idx(0).v = aV.a;
          bagSub.idx(1).v = aN.v;
          call(fibonacci.a, bagSub.a);

          bagSub.idx(0).v = bV.a;
          bagSub.idx(1).v = bN.v;
          call(fibonacci.a, bagSub.a);

          outputWriter.v = add(aV.v, bV.v);
        }

        ret();
      }
    ]);

    const bagRoot = word(2, []);
    bagRoot.idx(0).v = output.a;
    bagRoot.idx(1).v = input.v;
    call(fibonacci.a, bagRoot.a);

    // F0	F1	F2	F3	F4	F5	F6	F7	F8	F9	F10	F11	F12	F13	F14	F15	F16
    //  0	 1	 1	 2	 3	 5	 8	13	21	34	 55	 89	144	233	377	610	987
    // console.log(input.v);
    // console.log(output.v);

    // Set the range form field to the end. The 'output' will be displayed in second byte pair.
    // 00 02 00 0d 00 06
    //       ^^^^^
    //       value
  }
}
