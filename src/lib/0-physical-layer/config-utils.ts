// Copyright (c) 2019 Robert Rypuła - https://github.com/robertrypula

import * as fromConfig from '@physical-layer/config';
import { BYTE_UNIQUE_VALUES, MILLISECONDS_IN_SECOND, NYQUIST_TWICE } from '@physical-layer/constants';
import { DspConfig, DspConfigInitializerInterface, DspMode } from '@physical-layer/model';

export const getClosestBinIndexes = (fftSize: number, sampleRate: number, frequencies: number[]): number[] => {
  return frequencies.map((frequency: number) => Math.round((frequency * fftSize) / sampleRate));
};

export const getDspConfig = (dspMode: DspMode, sampleRate: number = null): DspConfig => {
  const dspConfigInitializer = fromConfig.dspModeToDspConfigInitializerLookUp[dspMode];
  const unifiedFrequencies = getUnifiedFrequencies(
    dspConfigInitializer.fftSize,
    dspConfigInitializer.frequencyEnd,
    BYTE_UNIQUE_VALUES,
    fromConfig.SUPPORTED_SAMPLE_RATES
  );
  const rxIntervalMilliseconds = getRxIntervalMilliseconds(dspConfigInitializer);
  const txIntervalMilliseconds = NYQUIST_TWICE * rxIntervalMilliseconds;
  const dspConfig: DspConfig = {
    band: {
      bandwidth: unifiedFrequencies[unifiedFrequencies.length - 1] - unifiedFrequencies[0],
      begin: unifiedFrequencies[0],
      end: unifiedFrequencies[unifiedFrequencies.length - 1]
    },
    dspConfigInitializer,
    dspMode,
    rawByteRate: MILLISECONDS_IN_SECOND / txIntervalMilliseconds,
    rxIntervalMilliseconds,
    txIntervalMilliseconds
  };

  if (sampleRate !== null) {
    dspConfig.unifiedFrequencies = unifiedFrequencies;
    dspConfig.unifiedBinIndexes = getClosestBinIndexes(dspConfigInitializer.fftSize, sampleRate, unifiedFrequencies);
  }

  return dspConfig;
};

export const getDspConfigList = (sampleRate: number = null): DspConfig[] => {
  return Object.keys(DspMode).map((dspMode: DspMode) => getDspConfig(dspMode, sampleRate));
};

export const getLongestFftWindowTime = (dspConfigInitializer: DspConfigInitializerInterface): number => {
  return dspConfigInitializer.fftSize / Math.min(...fromConfig.SUPPORTED_SAMPLE_RATES);
};

export const getRxIntervalMilliseconds = (dspConfigInitializer: DspConfigInitializerInterface): number => {
  // NOTE: division by NYQUIST_TWICE at 'RX' and multiplication by NYQUIST_TWICE at 'TX' done on purpose
  // in order to keep both values in 3 digits after dot and still have strict relation: 2rx = tx
  return Math.ceil(
    (MILLISECONDS_IN_SECOND * dspConfigInitializer.safeMarginFactor * getLongestFftWindowTime(dspConfigInitializer)) /
      NYQUIST_TWICE
  );
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
  return fromConfig.FREQUENCY_FORBIDDEN_RANGE.some((range: number[]) => range[0] < frequency && frequency < range[1]);
};
