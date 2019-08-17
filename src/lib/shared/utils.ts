// Copyright (c) 2019 Robert Rypuła - https://github.com/robertrypula

/*tslint:disable:no-bitwise*/

export const getBytesFromHex = (hex: string): number[] => {
  const bytes: number[] = [];
  const aCode = 'a'.charCodeAt(0);
  const fCode = 'f'.charCodeAt(0);
  const zeroCode = '0'.charCodeAt(0);
  const nineCode = '9'.charCodeAt(0);
  let byte: number = 0;
  let halfByteCounter = 0;

  hex = hex.toLowerCase();
  for (let i = 0, iMax = hex.length; i < iMax; i++) {
    const charCode = hex.charCodeAt(i);
    const halfByte =
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
  return text.split('').map((item) => item.charCodeAt(0) % 256);
};

export const getHexFromBytes = (bytes: number[], joinWith = ' '): string => {
  return bytes.map((byte) => ((byte & 0xFF) < 16 ? '0' : '') + (byte & 0xFF).toString(16)).join(joinWith);
};

export const getRandomBytes = (length: number): number[] => {
  return new Array(length).fill(0).map(() => getRandomInt(0, 255));
};

export const getRandomInt = (min: number, max: number): number => {
  // https://stackoverflow.com/a/1527820
  min = Math.ceil(min);
  max = Math.floor(max);

  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const getTextFromBytes = (bytes: number[]): string => {
  return bytes.map((i) => String.fromCharCode(i)).join('');
};
