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
  timeTickMillisecondsRx: number;
  timeTickMillisecondsTx: number;
  transmissionMode: TransmissionMode;
  unifiedBinIndexes?: number[];
  unifiedFrequencies?: number[];
}

export interface DspConfigInitialInterface {
  fftSize: number;
  frequencyEnd: number;
  safeMarginFactor: number;
}

export enum TransmissionMode {
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

export type TransmissionModeToDspConfigInitialLookUp = {
  [key in keyof typeof TransmissionMode]: DspConfigInitialInterface
};
