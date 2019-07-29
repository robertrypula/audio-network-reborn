// Copyright (c) 2019 Robert Rypuła - https://github.com/robertrypula

/*tslint:disable:no-bitwise*/

export const getFletcher8 = (data: number[]): number => {
  // taken from my other project: audio-network
  let byte: number;
  let byteNumber: number;
  let halfOfByte: number;
  let isLeftHalfOfByte: boolean;
  let sum0 = 0;
  let sum1 = 0;

  for (let i = 0; i < 2 * data.length; i++) {
    isLeftHalfOfByte = i % 2 === 0;
    byteNumber = i >>> 1;
    byte = data[byteNumber];
    halfOfByte = isLeftHalfOfByte
      ? (byte & 0xF0) >>> 4
      : byte & 0x0F;
    sum0 = (sum0 + halfOfByte) % 0x0F;
    sum1 = (sum1 + sum0) % 0x0F;
  }

  return (sum1 << 4) | sum0;
};

export const getFletcher16 = (data: number[]): number[] => {
  // Inspired by https://github.com/jb55/fletcher/blob/master/index.js
  // TODO write own based on getFletcher8
  let i = 0;
  let length = data.length;
  let sum1 = 0xFF;
  let sum2 = 0xFF;

  while (length) {
    let tLength = length > 20 ? 20 : length;
    length -= tLength;
    do {
      sum2 += sum1 += data[i++];
    } while (--tLength);
    sum1 = (sum1 & 0xFF) + (sum1 >> 8);
    sum2 = (sum2 & 0xFF) + (sum2 >> 8);
  }

  sum1 = (sum1 & 0xFF) + (sum1 >> 8);
  sum2 = (sum2 & 0xFF) + (sum2 >> 8);

  return [sum2 << 8, sum1];
};
