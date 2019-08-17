// Copyright (c) 2019 Robert Rypuła - https://github.com/robertrypula

import {
  BYTE_UNIQUE_VALUES,
  DspConfig,
  DspConfigInitialInterface,
  FREQUENCY_FORBIDDEN_RANGE,
  MILLISECONDS_IN_SECOND,
  NYQUIST_TWICE,
  SUPPORTED_SAMPLE_RATES,
  TransmissionMode,
  transmissionModeToDspConfigInitialLookUp
} from '..';

export const getClosestBinIndexes = (fftSize: number, sampleRate: number, frequencies: number[]): number[] => {
  return frequencies.map((frequency: number) => Math.round((frequency * fftSize) / sampleRate));
};

export const getDspConfig = (transmissionMode: TransmissionMode, sampleRate: number = null): DspConfig => {
  const config = transmissionModeToDspConfigInitialLookUp[transmissionMode];
  const unifiedFrequencies = getUnifiedFrequencies(
    config.fftSize,
    config.frequencyEnd,
    BYTE_UNIQUE_VALUES,
    SUPPORTED_SAMPLE_RATES
  );
  const timeTickMillisecondsRx = getTimeTickMillisecondsRx(config);
  const timeTickMillisecondsTx = NYQUIST_TWICE * timeTickMillisecondsRx;
  const dspConfig: DspConfig = {
    band: {
      bandwidth: unifiedFrequencies[unifiedFrequencies.length - 1] - unifiedFrequencies[0],
      begin: unifiedFrequencies[0],
      end: unifiedFrequencies[unifiedFrequencies.length - 1]
    },
    dspConfigInitial: config,
    rawByteRate: MILLISECONDS_IN_SECOND / timeTickMillisecondsTx,
    timeTickMillisecondsRx,
    timeTickMillisecondsTx,
    transmissionMode
  };

  if (sampleRate !== null) {
    dspConfig.unifiedFrequencies = unifiedFrequencies;
    dspConfig.unifiedBinIndexes = getClosestBinIndexes(config.fftSize, sampleRate, unifiedFrequencies);
  }

  return dspConfig;
};

export const getDspConfigList = (sampleRate: number = null): DspConfig[] => {
  return Object.keys(TransmissionMode).map((transmissionMode: TransmissionMode) =>
    getDspConfig(transmissionMode, sampleRate)
  );
};

export const getLongestFftWindowTime = (config: DspConfigInitialInterface): number => {
  return config.fftSize / Math.min(...SUPPORTED_SAMPLE_RATES);
};

export const getTimeTickMillisecondsRx = (config: DspConfigInitialInterface): number => {
  return Math.ceil(MILLISECONDS_IN_SECOND * config.safeMarginFactor * getLongestFftWindowTime(config));
};

export const getUnifiedFrequencies = (
  fftSize: number,
  frequencyEnd: number,
  frequenciesToUnifyCount: number,
  sampleRates: number[]
): number[] => {
  const unifiedFrequencies: number[] = [];
  const frequencyBinsCount = 0.5 * fftSize;
  const highestPossibleFrequency = Math.min(...sampleRates) / NYQUIST_TWICE;

  if (sampleRates.length !== 2) {
    throw new Error('Not implemented and will probably never be... ;)');
  }
  if (sampleRates[0] <= sampleRates[1]) {
    throw new Error('Sample rates values ​​must be given in descending order');
  }

  for (let binIndex0 = frequencyBinsCount - 1; binIndex0 >= 0; binIndex0--) {
    const frequency0 = (binIndex0 * sampleRates[0]) / fftSize;
    const binIndex1ClosestToFrequency0 = (frequency0 * fftSize) / sampleRates[1];
    const binIndex1Integer = Math.round(binIndex1ClosestToFrequency0);
    const frequency1 = (binIndex1Integer * sampleRates[1]) / fftSize;
    const frequencyMiddle = (frequency0 + frequency1) / 2;

    if (frequencyMiddle >= highestPossibleFrequency || isInsideForbiddenFrequencies(frequencyMiddle)) {
      continue;
    }
    if (frequencyMiddle <= frequencyEnd) {
      unifiedFrequencies.push(frequencyMiddle);
    }
    if (unifiedFrequencies.length === frequenciesToUnifyCount) {
      break;
    }
  }

  if (unifiedFrequencies.length !== frequenciesToUnifyCount) {
    throw new Error('Could not find desired unified frequencies amounts');
  }

  unifiedFrequencies.reverse();

  return unifiedFrequencies;
};

const isInsideForbiddenFrequencies = (frequency: number): boolean => {
  return FREQUENCY_FORBIDDEN_RANGE.some((range: number[]) => range[0] < frequency && frequency < range[1]);
};
