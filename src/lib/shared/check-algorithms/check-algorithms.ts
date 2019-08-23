// Copyright (c) 2019 Robert Rypuła - https://github.com/robertrypula

import { CheckAlgorithm, CheckAlgorithmImplementation } from '../model';
import { getCrc08 } from './crc-08';
import { getCrc16 } from './crc-16';
import { getCrc24 } from './crc-24';
import { getCrc32 } from './crc-32';
import { getSha1 } from './sha-1';

/*tslint:disable:no-bitwise*/

export const getCheckAlgorithmImplementation = (checkAlgorithm: CheckAlgorithm): CheckAlgorithmImplementation => {
  switch (checkAlgorithm) {
    case CheckAlgorithm.Crc08:
      return getCrc08;
    case CheckAlgorithm.Crc16:
      return getCrc16;
    case CheckAlgorithm.Crc24:
      return getCrc24;
    case CheckAlgorithm.Crc32:
      return getCrc32;
    case CheckAlgorithm.Sha1:
      return getSha1;
    default:
      throw new Error('Invalid check algorithm');
  }
};
