// Copyright (c) 2019 Robert Rypuła - https://github.com/robertrypula

/*tslint:disable:no-bitwise*/

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
