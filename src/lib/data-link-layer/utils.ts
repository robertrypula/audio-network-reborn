// Copyright (c) 2019 Robert Rypuła - https://github.com/robertrypula

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

export const getRawBytesLengthMax = (frameConfig: FrameConfigInterface): number => {
  return frameConfig.headerPayloadLengthEnabled
    ? frameConfig.headerLength + frameConfig.payloadLengthMax
    : frameConfig.headerLength + frameConfig.payloadLengthFixed;
};

export const getRawBytesLengthMin = (frameConfig: FrameConfigInterface): number => {
  return frameConfig.headerPayloadLengthEnabled
    ? frameConfig.headerLength + frameConfig.payloadLengthMin
    : frameConfig.headerLength + frameConfig.payloadLengthFixed;
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
  for (let i = 0; i < data.length - lengthMin + 1; i++) {
    callback(data.slice(i));
  }
};

export const scrambledSubArrays = (
  data: number[],
  scramble: number[],
  add: boolean,
  callback: (subArray: number[]) => void,
  range = 256
): void => {
  for (let i = 0; i < scramble.length; i++) {
    const subArray = data.slice(0);
    for (let j = 0; j < data.length; j++) {
      const scrambleValue = (add ? 1 : -1) * scramble[(i + j) % scramble.length];
      subArray[j] += scrambleValue % range;
    }
    callback(subArray);
  }
};
