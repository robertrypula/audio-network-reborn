// Copyright (c) 2019 Robert Rypuła - https://github.com/robertrypula

import {
  BYTE,
  DspConfig,
  DspConfigInitialInterface,
  MILLISECONDS_IN_SECOND,
  NYQUIST_TWICE,
  SUPPORTED_SAMPLE_RATES,
  TransmissionMode,
  transmissionModeToDspConfigInitialLookUp
} from '..';

export const getClosestBinIndexes = (fftSize: number, sampleRate: number, frequencies: number[]): number[] => {
  return frequencies.map((frequency: number) => Math.round(frequency * fftSize / sampleRate));
};

export const getFftTimePeriod = (config: DspConfigInitialInterface): number => {
  return Math.ceil(
    MILLISECONDS_IN_SECOND * config.safeMarginFactor * config.fftSize / Math.min(...SUPPORTED_SAMPLE_RATES)
  ) / MILLISECONDS_IN_SECOND;
};

export const getDspConfig = (
  transmissionMode: TransmissionMode,
  sampleRate: number = null
): DspConfig => {
  const config = transmissionModeToDspConfigInitialLookUp[transmissionMode];
  const unifiedFrequencies = getUnifiedFrequencies(config.fftSize, config.frequencyStart, BYTE, SUPPORTED_SAMPLE_RATES);
  const dspConfig: DspConfig = {
    band: {
      bandwidth: unifiedFrequencies[unifiedFrequencies.length - 1] - unifiedFrequencies[0],
      begin: unifiedFrequencies[0],
      end: unifiedFrequencies[unifiedFrequencies.length - 1]
    },
    dspConfigInitial: config,
    rawByteRate: getRawByteRate(config),
    transmissionMode
  };

  if (sampleRate !== null) {
    dspConfig.unifiedFrequencies = unifiedFrequencies;
    dspConfig.unifiedBinIndexes = getClosestBinIndexes(config.fftSize, sampleRate, unifiedFrequencies);
  }

  return dspConfig;
};

export const getDspConfigList = (sampleRate: number = null): DspConfig[] => {
  return Object.keys(TransmissionMode).map(
    (transmissionMode: TransmissionMode) => getDspConfig(transmissionMode, sampleRate)
  );
};

export const getRawByteRate = (config: DspConfigInitialInterface): number => {
  return 1 / (NYQUIST_TWICE * getFftTimePeriod(config));
};

export const getUnifiedFrequencies = (
  fftSize: number,
  frequencyStart: number,
  bins: number,
  sampleRates: number[]
): number[] => {
  const unifiedFrequencies: number[] = [];
  const frequencyBinsCount = 0.5 * fftSize;
  const highestFrequency = Math.min(...sampleRates) / NYQUIST_TWICE;

  if (sampleRates.length !== 2) {
    throw new Error('Not implemented and will probably never be... ;)');
  }
  if (sampleRates[0] <= sampleRates[1]) {
    throw new Error('Sample rates values ​​must be given in descending order');
  }

  for (let bin = 0; bin < frequencyBinsCount; bin++) {
    const frequency0 = bin * sampleRates[0] / fftSize;
    const bin1ClosestToFrequency0 = frequency0 * fftSize / sampleRates[1];
    let bin1Integer = Math.floor(bin1ClosestToFrequency0);
    let bin1Fraction = bin1ClosestToFrequency0 % 1;

    if (bin1Fraction >= 0.5) {      // TODO we don't need fraction, we could just do simple Math.round()
      bin1Integer++;
      bin1Fraction -= 1;
    }

    const frequency1 = bin1Integer * sampleRates[1] / fftSize;
    const frequencyMiddle = (frequency0 + frequency1) / 2;

    if (frequencyMiddle >= highestFrequency) {
      break;
    }

    if (frequencyMiddle >= frequencyStart) {
      unifiedFrequencies.push(frequencyMiddle);
    }

    if (unifiedFrequencies.length === bins) {
      break;
    }
  }

  if (unifiedFrequencies.length !== bins) {
    throw new Error('Could not find desired bins amounts');
  }

  return unifiedFrequencies;
};
