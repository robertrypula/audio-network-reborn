// Copyright (c) 2019 Robert Rypuła - https://github.com/robertrypula

import { NYQUIST_TWICE, SimpleCanvas } from '..';

/**
 * For 'getUnifiedFrequencies' function debugging purposes. Code example:
 *
 * const fftSize = 2048;
 * const unifiedFrequencies = AudioNetworkLite.getUnifiedFrequencies(fftSize, 1000, 256);
 * AudioNetworkLite.visualizeUnifiedFrequencies(unifiedFrequencies, 'canvas', fftSize);
 */
export const visualizeUnifiedFrequencies = (
  unifiedFrequencies: number[],
  canvasElementId: string = 'canvas',
  fftSize: number = 2048,
  sampleRates: number[] = [48000, 44100],
  binHeight: number = 30,
  binSpacing: number = 60
): void => {
  const frequencyBinsCount = 0.5 * fftSize;
  const simpleCanvas = new SimpleCanvas(
    canvasElementId, (Math.max(...sampleRates)) / NYQUIST_TWICE + 50, sampleRates.length * binSpacing
  );

  sampleRates.forEach((sampleRate, index) => {
    const resolution = sampleRate / fftSize;

    for (let bin = 0; bin < frequencyBinsCount; bin++) {
      simpleCanvas.line(
        bin * resolution,
        index * binSpacing + (binHeight / 3),
        bin * resolution,
        index * binSpacing + (binHeight * 2 / 3)
      );
      simpleCanvas.rectangle(
        (bin - 0.5) * resolution,
        index * binSpacing,
        ((bin + 0.5) * resolution) - 1,
        index * binSpacing + binHeight
      );
    }
  });

  unifiedFrequencies.forEach((frequency: number) => {
    const y = binHeight * 1.5;
    const halfHeight = binHeight / 3;
    simpleCanvas.line(frequency, y - halfHeight, frequency, y + halfHeight);
  });
};

export const getUnifiedFrequencies = (
  fftSize: number = 2048,
  frequencyStart: number = 1000,
  bins: number = 256,
  sampleRates: number[] = [48000, 44100]
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

export const getClosestBinIndexes = (fftSize: number, sampleRate: number, frequencies: number[]): number[] => {
  return frequencies.map((frequency: number) => Math.round(frequency * fftSize / sampleRate));
};
