// Copyright (c) 2019 Robert Rypuła - https://github.com/robertrypula

export enum AudioMonoIoCreateMode {
  // AutoDetectWebAudioOrNode = 'AutoDetectWebAudioOrNode',
  // Node = 'Node',
  // Stub = 'Stub',
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

export interface ConfigInterface {
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

export interface TransmissionModeDetails {
  band: BandInterface;
  config: ConfigInterface;
  rawByteRate: number;
  transmissionMode: TransmissionMode;
  unifiedFrequencies?: number[];
}

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

export type TransmissionModeToConfigLookUp = { [key in keyof typeof TransmissionMode]: ConfigInterface };
