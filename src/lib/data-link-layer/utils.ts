// Copyright (c) 2019 Robert Rypuła - https://github.com/robertrypula

/*tslint:disable:no-bitwise*/

export const getAllOneByteErrorsInPlace = (data: number[], callback: () => void, range = 256): void => {
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

export const getBytesFromString = (text: string): number[] => {
  return text.split('').map((item) => item.charCodeAt(0));
};

export const getFletcher8 = (data: number[]): number => {
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
   let sum0 = 0;
   let sum1 = 0;

   for (let i = 0; i < data.length; i++) {
      sum0 = (sum0 + data[i]) % 0xFF;
      sum1 = (sum1 + sum0) % 0xFF;
   }

   return [sum1, sum0];
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

export const getRandomInt = (min: number, max: number): number => { // https://stackoverflow.com/a/1527820
  min = Math.ceil(min);
  max = Math.floor(max);

  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const getRightAlignedSubArrays = (
  data: number[], lengthMin: number, callback: (subArray: number[]) => void
): void => {
  for (let i = 0; i < data.length - lengthMin + 1; i++) {
    callback(data.slice(i));
  }
};
