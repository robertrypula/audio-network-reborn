// Copyright (c) 2019 Robert Rypuła - https://github.com/robertrypula

import { NYQUIST_TWICE } from '@physical-layer/constants';
import { SimpleCanvas } from '@visualization/simple-canvas/simple-canvas';

/**
 * For 'getUnifiedFrequencies' function debugging purposes. Code example:
 *
 * const fftSize = 2048;
 * const sampleRates = [48000, 44100];
 * const unifiedFrequencies = AudioNetworkLite.getUnifiedFrequencies(fftSize, 1000, 256, sampleRates);
 * AudioNetworkLite.visualizeUnifiedFrequencies(unifiedFrequencies, 'canvas', fftSize, sampleRates);
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
    canvasElementId,
    Math.max(...sampleRates) / NYQUIST_TWICE + 50,
    sampleRates.length * binSpacing
  );

  sampleRates.forEach((sampleRate, index) => {
    const resolution = sampleRate / fftSize;

    for (let bin = 0; bin < frequencyBinsCount; bin++) {
      simpleCanvas.line(
        bin * resolution,
        index * binSpacing + binHeight / 3,
        bin * resolution,
        index * binSpacing + (binHeight * 2) / 3
      );
      simpleCanvas.rectangle(
        (bin - 0.5) * resolution,
        index * binSpacing,
        (bin + 0.5) * resolution - 1,
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
