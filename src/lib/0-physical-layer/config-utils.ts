// Copyright (c) 2019 Robert Rypuła - https://github.com/robertrypula

import * as fromConfig from '@physical-layer/config';
import { BYTE_UNIQUE_VALUES, MILLISECONDS_IN_SECOND, NYQUIST_TWICE } from '@physical-layer/constants';
import { DspConfig, DspConfigInitializer, DspMode } from '@physical-layer/model';
import { isEqual } from '@shared/utils';

export const detectDspMode = (dspConfigInitializer: DspConfigInitializer): DspMode => {
  return Object.keys(DspMode).find((dspMode: DspMode) =>
    isEqual(fromConfig.DSP_MODE_TO_DSP_CONFIG_INITIALIZER_LOOK_UP[dspMode], dspConfigInitializer)
  ) as DspMode;
};

export const getClosestBinIndexes = (fftSize: number, sampleRate: number, frequencies: number[]): number[] => {
  return frequencies.map((frequency: number) => Math.round((frequency * fftSize) / sampleRate));
};

export const getDspConfig = (dspConfigInitializer: DspConfigInitializer, sampleRate: number = null): DspConfig => {
  validateDspConfigInitializer(dspConfigInitializer);
  const unifiedFrequencies: number[] = getUnifiedFrequencies(
    dspConfigInitializer.fftSize,
    dspConfigInitializer.frequencyEnd,
    BYTE_UNIQUE_VALUES,
    fromConfig.SUPPORTED_SAMPLE_RATES
  );
  const rxIntervalMilliseconds: number = getRxIntervalMilliseconds(dspConfigInitializer);
  const txIntervalMilliseconds: number = NYQUIST_TWICE * rxIntervalMilliseconds;
  const dspConfig: DspConfig = {
    band: {
      bandwidth: unifiedFrequencies[unifiedFrequencies.length - 1] - unifiedFrequencies[0],
      begin: unifiedFrequencies[0],
      end: unifiedFrequencies[unifiedFrequencies.length - 1]
    },
    dspConfigInitializer,
    dspMode: detectDspMode(dspConfigInitializer),
    longestFftWindowTimeMilliseconds: MILLISECONDS_IN_SECOND * getLongestFftWindowTime(dspConfigInitializer),
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

export const getDspConfigsFromAllDspModes = (sampleRate: number = null): DspConfig[] => {
  return Object.keys(DspMode).map((dspMode: DspMode) =>
    getDspConfig(fromConfig.DSP_MODE_TO_DSP_CONFIG_INITIALIZER_LOOK_UP[dspMode], sampleRate)
  );
};

export const getLongestFftWindowTime = (dspConfigInitializer: DspConfigInitializer): number => {
  return dspConfigInitializer.fftSize / Math.min(...fromConfig.SUPPORTED_SAMPLE_RATES);
};

export const getRxIntervalMilliseconds = (dspConfigInitializer: DspConfigInitializer): number => {
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
  const frequencyBinsCount: number = 0.5 * fftSize;
  const highestPossibleFrequency: number = Math.min(...sampleRates) / NYQUIST_TWICE;

  if (sampleRates.length !== 2) {
    throw new Error('Only fixed amount of sample rates is supported (two)');
  }
  if (sampleRates[0] <= sampleRates[1]) {
    throw new Error('Sample rates values must be given in descending order');
  }

  for (let binIndex0 = frequencyBinsCount - 1; binIndex0 >= 0; binIndex0--) {
    const frequency0: number = (binIndex0 * sampleRates[0]) / fftSize;
    const binIndex1ClosestToFrequency0: number = (frequency0 * fftSize) / sampleRates[1];
    const binIndex1Integer: number = Math.round(binIndex1ClosestToFrequency0);
    const frequency1: number = (binIndex1Integer * sampleRates[1]) / fftSize;
    const frequencyMiddle: number = (frequency0 + frequency1) / 2;

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

export const isInsideForbiddenFrequencies = (frequency: number): boolean => {
  return fromConfig.FREQUENCY_FORBIDDEN_RANGE.some((range: number[]) => range[0] < frequency && frequency < range[1]);
};

export const validateDspConfigInitializer = (dspConfigInitializer: DspConfigInitializer): void => {
  const { fftSize, safeMarginFactor } = dspConfigInitializer;

  if (safeMarginFactor < 1) {
    throw new Error(`Safe margin factor is equal to ${safeMarginFactor} but it needs to be higher or equal one`);
  }

  if (![32, 64, 128, 256, 512, 1024, 2048, 4096, 8192, 16384, 32768].includes(fftSize)) {
    throw new Error(`Fft size is equal to ${fftSize} but it needs to be power of two in range between 32 and 32768`);
  }
};
