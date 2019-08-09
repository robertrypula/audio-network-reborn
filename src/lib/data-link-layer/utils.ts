// Copyright (c) 2019 Robert Rypuła - https://github.com/robertrypula

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

export const getBytesFromString = (text: string): number[] => {
  return text.split('').map((item) => item.charCodeAt(0) % 256);
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

export const getStringFromBytes = (bytes: number[]): string => {
  return bytes.map((i) => String.fromCharCode(i)).join('');
};
