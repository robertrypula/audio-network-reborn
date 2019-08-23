// Copyright (c) 2019 Robert Rypuła - https://github.com/robertrypula

import { Frame } from './frame/frame';
import { FrameConfigInterface } from './model';

export const allOneItemErrors = (data: number[], callback: () => void, range = 256): void => {
  for (let i = 0; i < data.length; i++) {
    const itemReal = data[i];

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
  scramble: number[],
  frameConfig: FrameConfigInterface,
  errorCorrectionEnabled: boolean,
  callback: (frameCandidate: Frame, isErrorCorrected: boolean) => void
): void => {
  scrambledSubArrays(bytes, scramble, false, rawBytesScrambled => {
    rightAlignedSubArrays(rawBytesScrambled, frameConfig.rawBytesLengthMin, rawBytes => {
      callback(new Frame(frameConfig).setRawBytes(rawBytes), false);
      if (errorCorrectionEnabled) {
        allOneItemErrors(rawBytes, () => {
          callback(new Frame(frameConfig).setRawBytes(rawBytes), true);
        });
      }
    });
  });
};

export const movingWindowSubArrays = (
  data: number[],
  lengthMinFromLeft: number,
  lengthMax: number,
  callback: (subArray: number[]) => void
): void => {
  if (data.length < lengthMax) {
    return;
  }

  for (let i = -lengthMax + lengthMinFromLeft, iMax = data.length - lengthMax; i <= iMax; i++) {
    const start = Math.max(0, i);
    const end = Math.min(i + lengthMax, data.length);
    callback(data.slice(start, end));
  }
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
  scramble: number[],
  scramblePosition: number = 0,
  add: boolean = true,
  range = 256
): void => {
  for (let i = 0; i < data.length; i++) {
    const scrambleValue = (add ? 1 : -1) * (scramble[(scramblePosition + i) % scramble.length] % range);
    data[i] = (data[i] + scrambleValue + range) % range;
  }
};

export const scrambledSubArrays = (
  data: number[],
  scramble: number[],
  add: boolean = true,
  callback: (subArray: number[]) => void,
  range = 256
): void => {
  for (let i = 0; i < scramble.length; i++) {
    const subArray = data.slice(0);
    scrambleArray(subArray, scramble, i, add, range);
    callback(subArray);
  }
};
