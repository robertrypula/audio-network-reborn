// Copyright (c) 2019 Robert Rypuła - https://github.com/robertrypula

export type CheckAlgorithmImplementation = (data: number[]) => number[];

export enum CheckAlgorithm {
  Fletcher08 = 'Fletcher08',
  Fletcher16 = 'Fletcher16',
  Sha1 = 'Sha1'
}
