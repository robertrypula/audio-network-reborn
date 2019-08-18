// Copyright (c) 2019 Robert Rypuła - https://github.com/robertrypula

export type CheckAlgorithmImplementation = (bytes: number[]) => number[];

export enum CheckAlgorithm {
  Fletcher16 = 'Fletcher16',
  Sha1 = 'Sha1'
}

export interface TestCaseInterface {
  in: string;
  out: string;
}
