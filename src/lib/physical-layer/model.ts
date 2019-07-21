// Copyright (c) 2019 Robert Rypuła - https://github.com/robertrypula

export interface ConfigInterface {
  fftSize: number;
  frequencyStart: number;
  safeMarginFactor: number;
  safeMarginMilliseconds: number;
}

export interface FrequencyBandInterface {
  begin: number;
  end: number;
}

export enum SpeedProfile {
  FatBandFast = 'FatBandFast',
  FatBandSlow = 'FatBandSlow',
  NormalBandFast = 'NormalBandFast',
  NormalBandSlow = 'NormalBandSlow',
  SlimBandFast = 'SlimBandFast',
  SlimBandSlow = 'SlimBandSlow'
}

export type SpeedProfileConfig = { [key in keyof typeof SpeedProfile]: ConfigInterface };
