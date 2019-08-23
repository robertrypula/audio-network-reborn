// Copyright (c) 2019 Robert Rypuła - https://github.com/robertrypula

import { CheckAlgorithmImplementation } from '../model';

/*tslint:disable:no-bitwise*/

export const getFletcher16: CheckAlgorithmImplementation = (bytes: number[]): number[] => {
  let sum0 = 0;
  let sum1 = 0;

  for (let i = 0, iMax = bytes.length; i < iMax; i++) {
    sum0 = (sum0 + bytes[i]) % 0xff;
    sum1 = (sum1 + sum0) % 0xff;
  }

  return [sum1, sum0];
};
