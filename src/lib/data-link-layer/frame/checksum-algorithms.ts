// Copyright (c) 2019 Robert Rypuła - https://github.com/robertrypula

import { ChecksumAlgorithm, ChecksumFunction } from '../model';

/*tslint:disable:no-bitwise*/

export const getChecksumFunction = (checksumAlgorithm: ChecksumAlgorithm): ChecksumFunction => {
  switch (checksumAlgorithm) {
    case ChecksumAlgorithm.Fletcher08:
      return getFletcher08;
    case ChecksumAlgorithm.Fletcher16:
      return getFletcher16;
    case ChecksumAlgorithm.Sha1:
      return getSha1;
    default:
      throw new Error('Invalid checksum algorithm');
  }
};

export const getFletcher08: ChecksumFunction = (data: number[]): number[] => {
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
    halfOfByte = isLeftHalfOfByte ? (byte & 0xf0) >>> 4 : byte & 0x0f;
    sum0 = (sum0 + halfOfByte) % 0x0f;
    sum1 = (sum1 + sum0) % 0x0f;
  }

  return [(sum1 << 4) | sum0];
};

export const getFletcher16: ChecksumFunction = (data: number[]): number[] => {
  let sum0 = 0;
  let sum1 = 0;

  for (let i = 0; i < data.length; i++) {
    sum0 = (sum0 + data[i]) % 0xff;
    sum1 = (sum1 + sum0) % 0xff;
  }

  return [sum1, sum0];
};

export const getSha1: ChecksumFunction = (data: number[]): number[] => {
  // Code migrated to TypeScript from vanilla JavaScript implementation taken from:
  // https://github.com/kvz/locutus/blob/master/src/php/strings/sha1.js
  const dataLength = data.length;
  const wordArray: number[] = [];
  const W = new Array(80);
  let H0 = 0x67452301;
  let H1 = 0xefcdab89;
  let H2 = 0x98badcfe;
  let H3 = 0x10325476;
  let H4 = 0xc3d2e1f0;
  let A: number;
  let B: number;
  let C: number;
  let D: number;
  let E: number;
  let dataWordEnding: number;
  const rotLeft = (n: number, s: number): number => (n << s) | (n >>> (32 - s));
  const split = (val: number): number[] => [(val >>> 24) & 0xff, (val >>> 16) & 0xff, (val >>> 8) & 0xff, val & 0xff];

  for (let i = 0; i < dataLength - 3; i += 4) {
    wordArray.push((data[i] << 24) | (data[i + 1] << 16) | (data[i + 2] << 8) | data[i + 3]);
  }

  switch (dataLength % 4) {
    case 0:
      dataWordEnding = 0x080000000;
      break;
    case 1:
      dataWordEnding = (data[dataLength - 1] << 24) | 0x0800000;
      break;
    case 2:
      dataWordEnding = (data[dataLength - 2] << 24) | (data[dataLength - 1] << 16) | 0x08000;
      break;
    case 3:
      dataWordEnding = (data[dataLength - 3] << 24) | (data[dataLength - 2] << 16) | (data[dataLength - 1] << 8) | 0x80;
      break;
  }

  wordArray.push(dataWordEnding);

  while (wordArray.length % 16 !== 14) {
    wordArray.push(0);
  }

  wordArray.push(dataLength >>> 29);
  wordArray.push((dataLength << 3) & 0x0ffffffff);

  for (let blockStart = 0; blockStart < wordArray.length; blockStart += 16) {
    for (let i = 0; i < 16; i++) {
      W[i] = wordArray[blockStart + i];
    }

    for (let i = 16; i <= 79; i++) {
      W[i] = rotLeft(W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16], 1);
    }

    A = H0;
    B = H1;
    C = H2;
    D = H3;
    E = H4;

    for (let i = 0; i <= 19; i++) {
      const temp = (rotLeft(A, 5) + ((B & C) | (~B & D)) + E + W[i] + 0x5a827999) & 0x0ffffffff;
      E = D;
      D = C;
      C = rotLeft(B, 30);
      B = A;
      A = temp;
    }

    for (let i = 20; i <= 39; i++) {
      const temp = (rotLeft(A, 5) + (B ^ C ^ D) + E + W[i] + 0x6ed9eba1) & 0x0ffffffff;
      E = D;
      D = C;
      C = rotLeft(B, 30);
      B = A;
      A = temp;
    }

    for (let i = 40; i <= 59; i++) {
      const temp = (rotLeft(A, 5) + ((B & C) | (B & D) | (C & D)) + E + W[i] + 0x8f1bbcdc) & 0x0ffffffff;
      E = D;
      D = C;
      C = rotLeft(B, 30);
      B = A;
      A = temp;
    }

    for (let i = 60; i <= 79; i++) {
      const temp = (rotLeft(A, 5) + (B ^ C ^ D) + E + W[i] + 0xca62c1d6) & 0x0ffffffff;
      E = D;
      D = C;
      C = rotLeft(B, 30);
      B = A;
      A = temp;
    }

    H0 = (H0 + A) & 0x0ffffffff;
    H1 = (H1 + B) & 0x0ffffffff;
    H2 = (H2 + C) & 0x0ffffffff;
    H3 = (H3 + D) & 0x0ffffffff;
    H4 = (H4 + E) & 0x0ffffffff;
  }

  return [...split(H0), ...split(H1), ...split(H2), ...split(H3), ...split(H4)];
};
