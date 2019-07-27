// Copyright (c) 2019 Robert Rypuła - https://github.com/robertrypula

export enum AudioMonoIoCreateMode {
  // AutoDetectWebAudioOrNode = 'AutoDetectWebAudioOrNode',
  // Node = 'Node',
  Stub = 'Stub',
  WebAudioApi = 'WebAudioApi'
}

export interface AudioMonoIoInterface {
  getFftSize(): number;
  getSampleRate(): number;
  getFrequencyDomainData(): Float32Array;
  inputDisable(): void;
  setFftSize(fftSize: number): void;
  setPeriodicWave(frequency: number): void;
  outputDisable(): void;
}

export interface BandInterface {
  bandwidth: number;
  begin: number;
  end: number;
}

export interface DspConfig {
  band: BandInterface;
  dspConfigInitial: DspConfigInitialInterface;
  rawByteRate: number;
  transmissionMode: TransmissionMode;
  unifiedBinIndexes?: number[];
  unifiedFrequencies?: number[];
}

export interface DspConfigInitialInterface {
  fftSize: number;
  frequencyStart: number;
  safeMarginFactor: number;
}

export enum TransmissionMode {
  FatBandFast = 'FatBandFast',
  FatBandSlow = 'FatBandSlow',

  NormalBandFast = 'NormalBandFast',
  NormalBandSlow = 'NormalBandSlow',

  SlimBandFast = 'SlimBandFast',
  SlimBandSlow = 'SlimBandSlow'
}

// 1000 - 7000     6 k
//
// 9000 - 15000  - 6 k
//
// 16500 - 19500 - 3 k

/*
    FatBandFastAudibleLower = 'FatBandFastAudibleLower',
    FatBandFastAudibleUpper = 'FatBandFastAudibleUpper',
    FatBandFastInaudible = 'FatBandFastInaudible',
    FatBandSlowAudibleLower = 'FatBandSlowAudibleLower',
    FatBandSlowAudibleUpper = 'FatBandSlowAudibleUpper',
    FatBandSlowInaudible = 'FatBandSlowInaudible',
    NormalBandFastAudibleLower = 'NormalBandFastAudibleLower',
    NormalBandFastAudibleUpper = 'NormalBandFastAudibleUpper',
    NormalBandFastInaudible = 'NormalBandFastInaudible',
    NormalBandSlowAudibleLower = 'NormalBandSlowAudibleLower',
    NormalBandSlowAudibleUpper = 'NormalBandSlowAudibleUpper',
    NormalBandSlowInaudible = 'NormalBandSlowInaudible',
    SlimBandFastAudibleLower = 'SlimBandFastAudibleLower',
    SlimBandFastAudibleUpper = 'SlimBandFastAudibleUpper',
    SlimBandFastInaudible = 'SlimBandFastInaudible',
    SlimBandSlowAudibleLower = 'SlimBandSlowAudibleLower'
    SlimBandSlowAudibleUpper = 'SlimBandSlowAudibleUpper'
    SlimBandSlowInaudible = 'SlimBandSlowInaudible'
*/

export type TransmissionModeToDspConfigInitialLookUp = {
  [key in keyof typeof TransmissionMode]: DspConfigInitialInterface
};
