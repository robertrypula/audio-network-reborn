// Copyright (c) 2019 Robert Rypuła - https://github.com/robertrypula

export enum AudioMonoIoCreateMode {
  Stub = 'Stub',
  WebApi = 'WebApi'
}

export enum DspMode {
  // NOTE: names picked in a way that they sort alphabetically from fast to slow
  ExtraordinaryBandFast = 'ExtraordinaryBandFast',
  ExtraordinaryBandSlow = 'ExtraordinaryBandSlow',
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
  SlimBandSlowAudibleLower = 'SlimBandSlowAudibleLower',
  SlimBandSlowAudibleUpper = 'SlimBandSlowAudibleUpper',
  SlimBandSlowInaudible = 'SlimBandSlowInaudible'
}

// -----------------------------------------------------------------------------

export interface AudioMonoIo {
  getFftSize(): number;
  getFrequencyDomainData(currentTime: number): Float32Array;
  getSampleRate(): number;
  inputDisable(): void;
  outputDisable(): void;
  setFftSize(fftSize: number): void;
  setPeriodicWave(frequency: number, currentTime: number): void;
}

export interface Band {
  bandwidth: number;
  begin: number;
  end: number;
}

export interface DspConfig {
  band: Band;
  dspConfigInitializer: DspConfigInitializer;
  dspMode: DspMode;
  longestFftWindowTimeMilliseconds: number;
  rawByteRate: number;
  rxIntervalMilliseconds: number;
  txIntervalMilliseconds: number;
  unifiedBinIndexes?: number[];
  unifiedFrequencies?: number[];
}

export interface DspConfigInitializer {
  fftSize: number;
  frequencyEnd: number;
  safeMarginFactor: number;
}

// -----------------------------------------------------------------------------

export type DspModeToDspConfigInitializerLookUp = {
  [key in keyof typeof DspMode]: DspConfigInitializer;
};
