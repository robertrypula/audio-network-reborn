// Copyright (c) 2019 Robert Rypuła - https://github.com/robertrypula

import { Frame } from '@data-link-layer/frame/frame';
import { FrameConfig } from '@data-link-layer/model';

export const allOneItemErrors = (data: number[], callback: () => void, range = 256): void => {
  for (let i = 0; i < data.length; i++) {
    const itemReal: number = data[i];

    for (let itemCorrupted = 0; itemCorrupted < range; itemCorrupted++) {
      if (itemCorrupted === itemReal) {
        continue;
      }
      data[i] = itemCorrupted;
      callback();
    }
    data[i] = itemReal;
  }
};

export const findFrameCandidates = (
  bytes: number[],
  scrambleSequence: number[],
  frameConfig: FrameConfig,
  errorCorrectionEnabled: boolean,
  callback: (frameCandidate: Frame, isErrorCorrected: boolean) => void
): void => {
  scrambledSubArrays(bytes, scrambleSequence, false, (rawBytesScrambled: number[]) => {
    rightAlignedSubArrays(rawBytesScrambled, frameConfig.rawBytesLength.min, (rawBytes: number[]) => {
      callback(new Frame(frameConfig).setRawBytes(rawBytes), false);
      errorCorrectionEnabled &&
        allOneItemErrors(rawBytes, () => callback(new Frame(frameConfig).setRawBytes(rawBytes), true));
    });
  });
};

export const rightAlignedSubArrays = (
  data: number[],
  lengthMin: number,
  callback: (subArray: number[]) => void
): void => {
  for (let i = 0, iMax = data.length - lengthMin + 1; i < iMax; i++) {
    callback(data.slice(i));
  }
};

export const scrambleArray = (
  data: number[],
  scrambleSequence: number[],
  positionInSequence: number = 0,
  add: boolean = true,
  range = 256
): void => {
  for (let i = 0; i < data.length; i++) {
    const dataValueOffset: number =
      (add ? 1 : -1) * (scrambleSequence[(positionInSequence + i) % scrambleSequence.length] % range);
    data[i] = (data[i] + dataValueOffset + range) % range;
  }
};

export const scrambledSubArrays = (
  data: number[],
  scrambleSequence: number[],
  add: boolean = true,
  callback: (subArray: number[]) => void,
  range = 256
): void => {
  for (let i = 0; i < scrambleSequence.length; i++) {
    const subArray: number[] = data.slice(0);
    scrambleArray(subArray, scrambleSequence, i, add, range);
    callback(subArray);
  }
};
