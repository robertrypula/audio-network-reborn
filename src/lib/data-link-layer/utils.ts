// Copyright (c) 2019 Robert Rypuła - https://github.com/robertrypula

import { FrameConfigInterface } from './model';

export const getAllOneByteErrors = (data: number[], callback: () => void, range = 256): void => {
  for (let i = 0; i < data.length; i++) {
    const byteReal = data[i];

    for (let byteCorrupted = 0; byteCorrupted < range; byteCorrupted++) {
      if (byteCorrupted === byteReal) {
        continue;
      }
      data[i] = byteCorrupted;
      callback();
    }
    data[i] = byteReal;
  }
};

export const getMovingWindowSubArrays = (
  data: number[], lengthMinFromLeft: number, lengthMax: number, callback: (subArray: number[]) => void
): void => {
  if (data.length < lengthMax) {
    return;
  }

  for (let i = -lengthMax + lengthMinFromLeft; i <= data.length - lengthMax; i++) {
    const start = Math.max(0, i);
    const end = Math.min(i + lengthMax, data.length);
    callback(data.slice(start, end));
  }
};

export const getRawBytesLengthMax = (frameConfig: FrameConfigInterface): number => {
  return frameConfig.headerPayloadLengthEnabled
    ? frameConfig.headerLength + frameConfig.payloadLengthMax
    : frameConfig.headerLength + frameConfig.payloadLength;
};

export const getRawBytesLengthMin = (frameConfig: FrameConfigInterface): number => {
  return frameConfig.headerPayloadLengthEnabled
    ? frameConfig.headerLength + frameConfig.payloadLengthMin
    : frameConfig.headerLength + frameConfig.payloadLength;
};

export const getRightAlignedSubArrays = (
  data: number[], lengthMin: number, callback: (subArray: number[]) => void
): void => {
  for (let i = 0; i < data.length - lengthMin + 1; i++) {
    callback(data.slice(i));
  }
};
