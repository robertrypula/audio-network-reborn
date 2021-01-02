// Copyright (c) 2019-2021 Robert Rypuła - https://github.com/robertrypula

import { CheckAlgorithmImplementation } from '@shared/model';

/*tslint:disable:no-bitwise*/

export const getSha1: CheckAlgorithmImplementation = (bytes: number[]): number[] => {
  // Code migrated to TypeScript from vanilla JavaScript implementation:
  // https://github.com/kvz/locutus/blob/master/src/php/strings/sha1.js
  const bytesLength: number = bytes.length;
  const rotLeft = (n: number, s: number): number => (n << s) | (n >>> (32 - s));
  const split = (val: number): number[] => [(val >>> 24) & 0xff, (val >>> 16) & 0xff, (val >>> 8) & 0xff, val & 0xff];
  const W: number[] = new Array(80);
  const words: number[] = [];
  let H0 = 0x67452301;
  let H1 = 0xefcdab89;
  let H2 = 0x98badcfe;
  let H3 = 0x10325476;
  let H4 = 0xc3d2e1f0;

  for (let i = 0; i < bytesLength - 3; i += 4) {
    words.push((bytes[i] << 24) | (bytes[i + 1] << 16) | (bytes[i + 2] << 8) | bytes[i + 3]);
  }

  switch (bytesLength % 4) {
    case 0:
      words.push(0x080000000);
      break;
    case 1:
      words.push((bytes[bytesLength - 1] << 24) | 0x0800000);
      break;
    case 2:
      words.push((bytes[bytesLength - 2] << 24) | (bytes[bytesLength - 1] << 16) | 0x08000);
      break;
    case 3:
      words.push(
        (bytes[bytesLength - 3] << 24) | (bytes[bytesLength - 2] << 16) | (bytes[bytesLength - 1] << 8) | 0x80
      );
      break;
  }

  while (words.length % 16 !== 14) {
    words.push(0);
  }

  words.push(bytesLength >>> 29);
  words.push((bytesLength << 3) & 0x0ffffffff);

  for (let i = 0; i < words.length; i += 16) {
    let A: number = H0;
    let B: number = H1;
    let C: number = H2;
    let D: number = H3;
    let E: number = H4;
    let temp: number;

    for (let j = 0; j < 16; j++) {
      W[j] = words[i + j];
    }

    for (let j = 16; j <= 79; j++) {
      W[j] = rotLeft(W[j - 3] ^ W[j - 8] ^ W[j - 14] ^ W[j - 16], 1);
    }

    for (let j = 0; j <= 19; j++) {
      temp = (rotLeft(A, 5) + ((B & C) | (~B & D)) + E + W[j] + 0x5a827999) & 0x0ffffffff;
      E = D;
      D = C;
      C = rotLeft(B, 30);
      B = A;
      A = temp;
    }

    for (let j = 20; j <= 39; j++) {
      temp = (rotLeft(A, 5) + (B ^ C ^ D) + E + W[j] + 0x6ed9eba1) & 0x0ffffffff;
      E = D;
      D = C;
      C = rotLeft(B, 30);
      B = A;
      A = temp;
    }

    for (let j = 40; j <= 59; j++) {
      temp = (rotLeft(A, 5) + ((B & C) | (B & D) | (C & D)) + E + W[j] + 0x8f1bbcdc) & 0x0ffffffff;
      E = D;
      D = C;
      C = rotLeft(B, 30);
      B = A;
      A = temp;
    }

    for (let j = 60; j <= 79; j++) {
      temp = (rotLeft(A, 5) + (B ^ C ^ D) + E + W[j] + 0xca62c1d6) & 0x0ffffffff;
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
