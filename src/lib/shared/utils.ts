// Copyright (c) 2019 Robert Rypuła - https://github.com/robertrypula

/*tslint:disable:no-bitwise*/

export const getBytesFromHex = (hex: string): number[] => {
  return []; // TODO implement
};

export const getBytesFromText = (text: string): number[] => {
  return text.split('').map((item) => item.charCodeAt(0) % 256);
};

export const getHexFromBytes = (bytes: number[]): string => {
  return bytes.map((byte) => ((byte & 0xFF) < 16 ? '0' : '') + (byte & 0xFF).toString(16)).join(' ');
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
