// Copyright (c) 2019 Robert Rypuła - https://github.com/robertrypula

import { CheckAlgorithm, CheckFunction } from '../model';

/*tslint:disable:no-bitwise*/

export const getCheckFunction = (checkAlgorithm: CheckAlgorithm): CheckFunction => {
  switch (checkAlgorithm) {
    case CheckAlgorithm.Fletcher08:
      return getFletcher08;
    case CheckAlgorithm.Fletcher16:
      return getFletcher16;
    case CheckAlgorithm.Sha1:
      return getSha1;
    default:
      throw new Error('Invalid check algorithm');
  }
};

export const getFletcher08: CheckFunction = (data: number[]): number[] => {
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

export const getFletcher16: CheckFunction = (data: number[]): number[] => {
  let sum0 = 0;
  let sum1 = 0;

  for (let i = 0; i < data.length; i++) {
    sum0 = (sum0 + data[i]) % 0xff;
    sum1 = (sum1 + sum0) % 0xff;
  }

  return [sum1, sum0];
};

export const getSha1: CheckFunction = (data: number[]): number[] => {
  // Code migrated to TypeScript from vanilla JavaScript implementation taken from:
  // https://github.com/kvz/locutus/blob/master/src/php/strings/sha1.js
  const dataLength = data.length;
  const rotLeft = (n: number, s: number): number => (n << s) | (n >>> (32 - s));
  const split = (val: number): number[] => [(val >>> 24) & 0xff, (val >>> 16) & 0xff, (val >>> 8) & 0xff, val & 0xff];
  const W: number[] = new Array(80);
  const words: number[] = [];
  let H0 = 0x67452301;
  let H1 = 0xefcdab89;
  let H2 = 0x98badcfe;
  let H3 = 0x10325476;
  let H4 = 0xc3d2e1f0;

  for (let i = 0; i < dataLength - 3; i += 4) {
    words.push((data[i] << 24) | (data[i + 1] << 16) | (data[i + 2] << 8) | data[i + 3]);
  }

  switch (dataLength % 4) {
    case 0:
      words.push(0x080000000);
      break;
    case 1:
      words.push((data[dataLength - 1] << 24) | 0x0800000);
      break;
    case 2:
      words.push((data[dataLength - 2] << 24) | (data[dataLength - 1] << 16) | 0x08000);
      break;
    case 3:
      words.push((data[dataLength - 3] << 24) | (data[dataLength - 2] << 16) | (data[dataLength - 1] << 8) | 0x80);
      break;
  }

  while (words.length % 16 !== 14) {
    words.push(0);
  }

  words.push(dataLength >>> 29);
  words.push((dataLength << 3) & 0x0ffffffff);

  for (let i = 0; i < words.length; i += 16) {
    let A = H0;
    let B = H1;
    let C = H2;
    let D = H3;
    let E = H4;

    for (let j = 0; j < 16; j++) {
      W[j] = words[i + j];
    }

    for (let j = 16; j <= 79; j++) {
      W[j] = rotLeft(W[j - 3] ^ W[j - 8] ^ W[j - 14] ^ W[j - 16], 1);
    }

    for (let j = 0; j <= 19; j++) {
      const temp = (rotLeft(A, 5) + ((B & C) | (~B & D)) + E + W[j] + 0x5a827999) & 0x0ffffffff;
      E = D;
      D = C;
      C = rotLeft(B, 30);
      B = A;
      A = temp;
    }

    for (let j = 20; j <= 39; j++) {
      const temp = (rotLeft(A, 5) + (B ^ C ^ D) + E + W[j] + 0x6ed9eba1) & 0x0ffffffff;
      E = D;
      D = C;
      C = rotLeft(B, 30);
      B = A;
      A = temp;
    }

    for (let j = 40; j <= 59; j++) {
      const temp = (rotLeft(A, 5) + ((B & C) | (B & D) | (C & D)) + E + W[j] + 0x8f1bbcdc) & 0x0ffffffff;
      E = D;
      D = C;
      C = rotLeft(B, 30);
      B = A;
      A = temp;
    }

    for (let j = 60; j <= 79; j++) {
      const temp = (rotLeft(A, 5) + (B ^ C ^ D) + E + W[j] + 0xca62c1d6) & 0x0ffffffff;
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
