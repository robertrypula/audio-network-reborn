// Copyright (c) 2019 Robert Rypuła - https://github.com/robertrypula

import { Frame } from '@data-link-layer/frame/frame';
import { ErrorCorrection, FrameConfig, ScramblerMode } from '@data-link-layer/model';

export const allPossibleRightAlignedArrays = (
  input: number[],
  lengthMin: number,
  callback: (output: number[]) => void
): void => {
  for (let i = 0, iMax = input.length - lengthMin + 1; i < iMax; i++) {
    callback(input.slice(i));
  }
};

export const allPossibleSinglePositionErrors = (data: number[], callback: () => void, range = 256): void => {
  for (let i = 0; i < data.length; i++) {
    const dataItemReal: number = data[i];

    for (let dataItemCorrupted = 0; dataItemCorrupted < range; dataItemCorrupted++) {
      data[i] = dataItemCorrupted;
      dataItemCorrupted !== dataItemReal && callback();
    }

    data[i] = dataItemReal;
  }
};

export const allPossibleUnScrambledArrays = (
  input: number[],
  scrambleSequence: number[],
  callback: (output: number[]) => void,
  range = 256
): void => {
  for (let offset = 0; offset < scrambleSequence.length; offset++) {
    const output: number[] = input.slice(0);
    scrambler(output, ScramblerMode.UnScramble, scrambleSequence, offset, range);
    callback(output);
  }
};

export const findFrameCandidates = (
  input: number[],
  scrambleSequence: number[],
  frameConfig: FrameConfig,
  errorCorrection: ErrorCorrection,
  callback: (frameCandidate: Frame, isErrorCorrected: boolean) => void
): void => {
  const { min } = frameConfig.rawBytesLength;

  allPossibleUnScrambledArrays(input, scrambleSequence, (unScrambled: number[]) => {
    allPossibleRightAlignedArrays(unScrambled, min, (rawBytes: number[]) => {
      callback(new Frame(frameConfig).setRawBytes(rawBytes), false);
      errorCorrection === ErrorCorrection.On &&
        allPossibleSinglePositionErrors(rawBytes, () => callback(new Frame(frameConfig).setRawBytes(rawBytes), true));
    });
  });
};

export const scrambler = (
  data: number[],
  scrambleMode: ScramblerMode,
  scrambleSequence: number[],
  offset = 0,
  range = 256
): void => {
  for (let i = 0; i < data.length; i++) {
    let dataItemOffset: number = scrambleSequence[(offset + i) % scrambleSequence.length] % range;

    if (scrambleMode === ScramblerMode.UnScramble) {
      dataItemOffset *= -1;
    }
    data[i] = (data[i] + dataItemOffset + range) % range;
  }
};
