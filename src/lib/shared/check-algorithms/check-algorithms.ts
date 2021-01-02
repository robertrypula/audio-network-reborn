// Copyright (c) 2019-2021 Robert Rypuła - https://github.com/robertrypula

import { getCrc08 } from '@shared/check-algorithms/crc-08';
import { getCrc16 } from '@shared/check-algorithms/crc-16';
import { getCrc24 } from '@shared/check-algorithms/crc-24';
import { getCrc32 } from '@shared/check-algorithms/crc-32';
import { getSha1 } from '@shared/check-algorithms/sha-1';
import { CheckAlgorithm, CheckAlgorithmImplementation } from '@shared/model';

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
