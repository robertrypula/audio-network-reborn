// Copyright (c) 2019 Robert Rypuła - https://github.com/robertrypula

import {
  BYTE,
  ConfigInterface,
  MILLISECONDS_IN_SECOND,
  NYQUIST_TWICE,
  SUPPORTED_SAMPLE_RATES,
  TransmissionDetails,
  TransmissionMode,
  transmissionModeToConfigLookUp
} from '..';

export const getClosestBinIndexes = (fftSize: number, sampleRate: number, frequencies: number[]): number[] => {
  return frequencies.map((frequency: number) => Math.round(frequency * fftSize / sampleRate));
};

export const getFftTimePeriod = (config: ConfigInterface) => {
  return Math.ceil(
    MILLISECONDS_IN_SECOND * config.safeMarginFactor * config.fftSize / Math.min(...SUPPORTED_SAMPLE_RATES)
  ) / MILLISECONDS_IN_SECOND;
};

export const getTransmissionDetails = (
  transmissionMode: TransmissionMode,
  sampleRate: number = null
): TransmissionDetails => {
  const config = transmissionModeToConfigLookUp[transmissionMode];
  const unifiedFrequencies = getUnifiedFrequencies(config.fftSize, config.frequencyStart, BYTE, SUPPORTED_SAMPLE_RATES);
  const transmissionModeDetails: TransmissionDetails = {
    band: {
      bandwidth: unifiedFrequencies[unifiedFrequencies.length - 1] - unifiedFrequencies[0],
      begin: unifiedFrequencies[0],
      end: unifiedFrequencies[unifiedFrequencies.length - 1]
    },
    config,
    rawByteRate: getRawByteRate(config),
    transmissionMode
  };

  if (sampleRate !== null) {
    transmissionModeDetails.unifiedFrequencies = unifiedFrequencies;
    transmissionModeDetails.unifiedBinIndexes = getClosestBinIndexes(config.fftSize, sampleRate, unifiedFrequencies);
  }

  return transmissionModeDetails;
};

export const getTransmissionModeDetailsList = () => {
  return Object.keys(TransmissionMode).map(
    (transmissionMode: TransmissionMode) => getTransmissionDetails(transmissionMode)
  );
};

export const getRawByteRate = (config: ConfigInterface) => {
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
