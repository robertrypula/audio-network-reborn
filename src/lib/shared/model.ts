// Copyright (c) 2019 Robert Rypuła - https://github.com/robertrypula

export enum CheckAlgorithm {
  Crc08 = 'Crc08',
  Crc16 = 'Crc16',
  Crc24 = 'Crc24',
  Crc32 = 'Crc32',
  Sha1 = 'Sha1'
}

// -----------------------------------------------------------------------------

export type CheckAlgorithmImplementation = (bytes: number[]) => number[];

export type MinMaxRange = {
  max: number;
  min: number;
};

export type TestCaseInOut = {
  in: string;
  out: string;
};
