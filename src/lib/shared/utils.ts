// Copyright (c) 2019 Robert Rypuła - https://github.com/robertrypula

/*tslint:disable:no-bitwise*/

export const getBytesFromHex = (hex: string): number[] => {
  const bytes: number[] = [];
  const aCode: number = 'a'.charCodeAt(0);
  const fCode: number = 'f'.charCodeAt(0);
  const zeroCode: number = '0'.charCodeAt(0);
  const nineCode: number = '9'.charCodeAt(0);
  let byte = 0;
  let halfByteCounter = 0;

  hex = hex.toLowerCase();
  for (let i = 0, iMax = hex.length; i < iMax; i++) {
    const charCode: number = hex.charCodeAt(i);
    const halfByte: number =
      aCode <= charCode && charCode <= fCode
        ? charCode - aCode + 0xa
        : zeroCode <= charCode && charCode <= nineCode
        ? charCode - zeroCode
        : null;

    if (halfByte === null) {
      continue;
    }

    byte = halfByteCounter % 2 === 0 ? halfByte << 4 : byte | halfByte;
    if (halfByteCounter % 2 === 1 || i === iMax - 1) {
      bytes.push(byte);
    }
    halfByteCounter++;
  }

  return bytes;
};

export const getBytesFromText = (text: string): number[] => {
  return text.split('').map((char: string): number => char.charCodeAt(0) % 256);
};

export const getFilledArray = (length: number, fillWith = 0): number[] => {
  // https://stackoverflow.com/questions/1295584
  return new Array(length).fill(fillWith);
};

export const getHexFromBytes = (bytes: number[], joinWith = ' '): string => {
  return bytes.map((byte: number): string => padStart(byte & 0xff, 16, 2)).join(joinWith);
};

export const getRandomBytes = (length: number): number[] => {
  // https://stackoverflow.com/questions/1295584
  return getFilledArray(length).map((): number => getRandomInt(0, 255));
};

export const getRandomInt = (min: number, max: number): number => {
  // https://stackoverflow.com/a/1527820
  min = Math.ceil(min);
  max = Math.floor(max);

  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const getTextFromBytes = (bytes: number[]): string => {
  return bytes.map(i => String.fromCharCode(i)).join('');
};

export const isEqual = (a: any, b: any): boolean => {
  const aClone: any = JSON.parse(JSON.stringify(a));
  const bClone: any = JSON.parse(JSON.stringify(b));

  sortKeys(aClone);
  sortKeys(bClone);

  return JSON.stringify(aClone) === JSON.stringify(bClone);
};

export const padStart = (value: number, radix: number, length: number, fillWith = '0'): string => {
  const result: string = (value >> 0).toString(radix);
  const missingCharacters = length - result.length;

  return missingCharacters > 0 ? fillWith.repeat(missingCharacters) + result : result;
};

export const sortKeys = (object: any): void => {
  const someAlmostRandomValue = '_sortKeys_I_am_almost_random_';

  typeof object === 'object' &&
    object !== null &&
    Object.keys(object)
      .sort()
      .forEach((key: string): void => {
        object[someAlmostRandomValue + key] = object[key];
        delete object[key];
        object[key] = object[someAlmostRandomValue + key];
        delete object[someAlmostRandomValue + key];
        sortKeys(object[key]);
      });
};
