// Copyright (c) 2019 Robert Rypuła - https://github.com/robertrypula

import { CheckAlgorithm, CheckAlgorithmImplementation } from './model';

/*tslint:disable:no-bitwise*/

export const getCheckAlgorithmImplementation = (checkAlgorithm: CheckAlgorithm): CheckAlgorithmImplementation => {
  switch (checkAlgorithm) {
    case CheckAlgorithm.Crc08:
      return getCrc08;
    case CheckAlgorithm.Crc16:
      return getCrc16;
    case CheckAlgorithm.Crc24:
      return getCrc24;
    case CheckAlgorithm.Crc32:
      return getCrc32;
    case CheckAlgorithm.Fletcher16:
      return getFletcher16;
    case CheckAlgorithm.Sha1:
      return getSha1;
    default:
      throw new Error('Invalid check algorithm');
  }
};

const CRC_08_LOOKUP_TABLE = `
  00,07,0e,09,1c,1b,12,15,38,3f,36,31,24,23,2a,2d,70,77,7e,79,6c,6b,62,65,48,4f,46,41,54,53,5a,5d,e0,e7,ee,e9,fc,fb,f2,
  f5,d8,df,d6,d1,c4,c3,ca,cd,90,97,9e,99,8c,8b,82,85,a8,af,a6,a1,b4,b3,ba,bd,c7,c0,c9,ce,db,dc,d5,d2,ff,f8,f1,f6,e3,e4,
  ed,ea,b7,b0,b9,be,ab,ac,a5,a2,8f,88,81,86,93,94,9d,9a,27,20,29,2e,3b,3c,35,32,1f,18,11,16,03,04,0d,0a,57,50,59,5e,4b,
  4c,45,42,6f,68,61,66,73,74,7d,7a,89,8e,87,80,95,92,9b,9c,b1,b6,bf,b8,ad,aa,a3,a4,f9,fe,f7,f0,e5,e2,eb,ec,c1,c6,cf,c8,
  dd,da,d3,d4,69,6e,67,60,75,72,7b,7c,51,56,5f,58,4d,4a,43,44,19,1e,17,10,05,02,0b,0c,21,26,2f,28,3d,3a,33,34,4e,49,40,
  47,52,55,5c,5b,76,71,78,7f,6a,6d,64,63,3e,39,30,37,22,25,2c,2b,06,01,08,0f,1a,1d,14,13,ae,a9,a0,a7,b2,b5,bc,bb,96,91,
  98,9f,8a,8d,84,83,de,d9,d0,d7,c2,c5,cc,cb,e6,e1,e8,ef,fa,fd,f4,f3`
  .split(',')
  .map(value => parseInt(value, 16));

export const getCrc08: CheckAlgorithmImplementation = (bytes: number[]): number[] => {
  // Code migrated to TypeScript from vanilla JavaScript implementation taken from:
  // https://dev.flarecast.eu/stash/projects/SAND/repos/swagger-ui/browse/node_modules/crc/lib/crc8.js
  let crc = 0;

  for (let i = 0; i < bytes.length; i++) {
    crc = CRC_08_LOOKUP_TABLE[(crc ^ bytes[i]) & 0xff] & 0xff;
  }

  return [crc & 0xff];
};

const CRC_16_LOOKUP_TABLE = `
  0000,c0c1,c181,0140,c301,03c0,0280,c241,c601,06c0,0780,c741,0500,c5c1,c481,0440,cc01,0cc0,0d80,cd41,0f00,cfc1,ce81,
  0e40,0a00,cac1,cb81,0b40,c901,09c0,0880,c841,d801,18c0,1980,d941,1b00,dbc1,da81,1a40,1e00,dec1,df81,1f40,dd01,1dc0,
  1c80,dc41,1400,d4c1,d581,1540,d701,17c0,1680,d641,d201,12c0,1380,d341,1100,d1c1,d081,1040,f001,30c0,3180,f141,3300,
  f3c1,f281,3240,3600,f6c1,f781,3740,f501,35c0,3480,f441,3c00,fcc1,fd81,3d40,ff01,3fc0,3e80,fe41,fa01,3ac0,3b80,fb41,
  3900,f9c1,f881,3840,2800,e8c1,e981,2940,eb01,2bc0,2a80,ea41,ee01,2ec0,2f80,ef41,2d00,edc1,ec81,2c40,e401,24c0,2580,
  e541,2700,e7c1,e681,2640,2200,e2c1,e381,2340,e101,21c0,2080,e041,a001,60c0,6180,a141,6300,a3c1,a281,6240,6600,a6c1,
  a781,6740,a501,65c0,6480,a441,6c00,acc1,ad81,6d40,af01,6fc0,6e80,ae41,aa01,6ac0,6b80,ab41,6900,a9c1,a881,6840,7800,
  b8c1,b981,7940,bb01,7bc0,7a80,ba41,be01,7ec0,7f80,bf41,7d00,bdc1,bc81,7c40,b401,74c0,7580,b541,7700,b7c1,b681,7640,
  7200,b2c1,b381,7340,b101,71c0,7080,b041,5000,90c1,9181,5140,9301,53c0,5280,9241,9601,56c0,5780,9741,5500,95c1,9481,
  5440,9c01,5cc0,5d80,9d41,5f00,9fc1,9e81,5e40,5a00,9ac1,9b81,5b40,9901,59c0,5880,9841,8801,48c0,4980,8941,4b00,8bc1,
  8a81,4a40,4e00,8ec1,8f81,4f40,8d01,4dc0,4c80,8c41,4400,84c1,8581,4540,8701,47c0,4680,8641,8201,42c0,4380,8341,4100,
  81c1,8081,4040`
  .split(',')
  .map(value => parseInt(value, 16));

export const getCrc16: CheckAlgorithmImplementation = (bytes: number[]): number[] => {
  // Code migrated to TypeScript from vanilla JavaScript implementation taken from:
  // https://dev.flarecast.eu/stash/projects/SAND/repos/swagger-ui/browse/node_modules/crc/lib/crc16.js
  let crc = 0;

  for (let i = 0; i < bytes.length; i++) {
    crc = (CRC_16_LOOKUP_TABLE[(crc ^ bytes[i]) & 0xff] ^ (crc >> 8)) & 0xffff;
  }

  return [(crc >>> 8) & 0xff, crc & 0xff];
};

const CRC_24_LOOKUP_TABLE = `
  000000,864cfb,8ad50d,0c99f6,93e6e1,15aa1a,1933ec,9f7f17,a18139,27cdc2,2b5434,ad18cf,3267d8,b42b23,b8b2d5,3efe2e,
  c54e89,430272,4f9b84,c9d77f,56a868,d0e493,dc7d65,5a319e,64cfb0,e2834b,ee1abd,685646,f72951,7165aa,7dfc5c,fbb0a7,
  0cd1e9,8a9d12,8604e4,00481f,9f3708,197bf3,15e205,93aefe,ad50d0,2b1c2b,2785dd,a1c926,3eb631,b8faca,b4633c,322fc7,
  c99f60,4fd39b,434a6d,c50696,5a7981,dc357a,d0ac8c,56e077,681e59,ee52a2,e2cb54,6487af,fbf8b8,7db443,712db5,f7614e,
  19a3d2,9fef29,9376df,153a24,8a4533,0c09c8,00903e,86dcc5,b822eb,3e6e10,32f7e6,b4bb1d,2bc40a,ad88f1,a11107,275dfc,
  dced5b,5aa1a0,563856,d074ad,4f0bba,c94741,c5deb7,43924c,7d6c62,fb2099,f7b96f,71f594,ee8a83,68c678,645f8e,e21375,
  15723b,933ec0,9fa736,19ebcd,8694da,00d821,0c41d7,8a0d2c,b4f302,32bff9,3e260f,b86af4,2715e3,a15918,adc0ee,2b8c15,
  d03cb2,567049,5ae9bf,dca544,43da53,c596a8,c90f5e,4f43a5,71bd8b,f7f170,fb6886,7d247d,e25b6a,641791,688e67,eec29c,
  3347a4,b50b5f,b992a9,3fde52,a0a145,26edbe,2a7448,ac38b3,92c69d,148a66,181390,9e5f6b,01207c,876c87,8bf571,0db98a,
  f6092d,7045d6,7cdc20,fa90db,65efcc,e3a337,ef3ac1,69763a,578814,d1c4ef,dd5d19,5b11e2,c46ef5,42220e,4ebbf8,c8f703,
  3f964d,b9dab6,b54340,330fbb,ac70ac,2a3c57,26a5a1,a0e95a,9e1774,185b8f,14c279,928e82,0df195,8bbd6e,872498,016863,
  fad8c4,7c943f,700dc9,f64132,693e25,ef72de,e3eb28,65a7d3,5b59fd,dd1506,d18cf0,57c00b,c8bf1c,4ef3e7,426a11,c426ea,
  2ae476,aca88d,a0317b,267d80,b90297,3f4e6c,33d79a,b59b61,8b654f,0d29b4,01b042,87fcb9,1883ae,9ecf55,9256a3,141a58,
  efaaff,69e604,657ff2,e33309,7c4c1e,fa00e5,f69913,70d5e8,4e2bc6,c8673d,c4fecb,42b230,ddcd27,5b81dc,57182a,d154d1,
  26359f,a07964,ace092,2aac69,b5d37e,339f85,3f0673,b94a88,87b4a6,01f85d,0d61ab,8b2d50,145247,921ebc,9e874a,18cbb1,
  e37b16,6537ed,69ae1b,efe2e0,709df7,f6d10c,fa48fa,7c0401,42fa2f,c4b6d4,c82f22,4e63d9,d11cce,575035,5bc9c3,dd8538`
  .split(',')
  .map(value => parseInt(value, 16));

export const getCrc24: CheckAlgorithmImplementation = (bytes: number[]): number[] => {
  // Code migrated to TypeScript from vanilla JavaScript implementation taken from:
  // https://dev.flarecast.eu/stash/projects/SAND/repos/swagger-ui/browse/node_modules/crc/lib/crc24.js
  let crc = 0xb704ce;

  for (let i = 0; i < bytes.length; i++) {
    crc = (CRC_24_LOOKUP_TABLE[((crc >> 16) ^ bytes[i]) & 0xff] ^ (crc << 8)) & 0xffffff;
  }

  return [(crc >>> 16) & 0xff, (crc >>> 8) & 0xff, crc & 0xff];
};

const CRC_32_LOOKUP_TABLE = `
  00000000,77073096,ee0e612c,990951ba,076dc419,706af48f,e963a535,9e6495a3,0edb8832,79dcb8a4,e0d5e91e,97d2d988,09b64c2b,
  7eb17cbd,e7b82d07,90bf1d91,1db71064,6ab020f2,f3b97148,84be41de,1adad47d,6ddde4eb,f4d4b551,83d385c7,136c9856,646ba8c0,
  fd62f97a,8a65c9ec,14015c4f,63066cd9,fa0f3d63,8d080df5,3b6e20c8,4c69105e,d56041e4,a2677172,3c03e4d1,4b04d447,d20d85fd,
  a50ab56b,35b5a8fa,42b2986c,dbbbc9d6,acbcf940,32d86ce3,45df5c75,dcd60dcf,abd13d59,26d930ac,51de003a,c8d75180,bfd06116,
  21b4f4b5,56b3c423,cfba9599,b8bda50f,2802b89e,5f058808,c60cd9b2,b10be924,2f6f7c87,58684c11,c1611dab,b6662d3d,76dc4190,
  01db7106,98d220bc,efd5102a,71b18589,06b6b51f,9fbfe4a5,e8b8d433,7807c9a2,0f00f934,9609a88e,e10e9818,7f6a0dbb,086d3d2d,
  91646c97,e6635c01,6b6b51f4,1c6c6162,856530d8,f262004e,6c0695ed,1b01a57b,8208f4c1,f50fc457,65b0d9c6,12b7e950,8bbeb8ea,
  fcb9887c,62dd1ddf,15da2d49,8cd37cf3,fbd44c65,4db26158,3ab551ce,a3bc0074,d4bb30e2,4adfa541,3dd895d7,a4d1c46d,d3d6f4fb,
  4369e96a,346ed9fc,ad678846,da60b8d0,44042d73,33031de5,aa0a4c5f,dd0d7cc9,5005713c,270241aa,be0b1010,c90c2086,5768b525,
  206f85b3,b966d409,ce61e49f,5edef90e,29d9c998,b0d09822,c7d7a8b4,59b33d17,2eb40d81,b7bd5c3b,c0ba6cad,edb88320,9abfb3b6,
  03b6e20c,74b1d29a,ead54739,9dd277af,04db2615,73dc1683,e3630b12,94643b84,0d6d6a3e,7a6a5aa8,e40ecf0b,9309ff9d,0a00ae27,
  7d079eb1,f00f9344,8708a3d2,1e01f268,6906c2fe,f762575d,806567cb,196c3671,6e6b06e7,fed41b76,89d32be0,10da7a5a,67dd4acc,
  f9b9df6f,8ebeeff9,17b7be43,60b08ed5,d6d6a3e8,a1d1937e,38d8c2c4,4fdff252,d1bb67f1,a6bc5767,3fb506dd,48b2364b,d80d2bda,
  af0a1b4c,36034af6,41047a60,df60efc3,a867df55,316e8eef,4669be79,cb61b38c,bc66831a,256fd2a0,5268e236,cc0c7795,bb0b4703,
  220216b9,5505262f,c5ba3bbe,b2bd0b28,2bb45a92,5cb36a04,c2d7ffa7,b5d0cf31,2cd99e8b,5bdeae1d,9b64c2b0,ec63f226,756aa39c,
  026d930a,9c0906a9,eb0e363f,72076785,05005713,95bf4a82,e2b87a14,7bb12bae,0cb61b38,92d28e9b,e5d5be0d,7cdcefb7,0bdbdf21,
  86d3d2d4,f1d4e242,68ddb3f8,1fda836e,81be16cd,f6b9265b,6fb077e1,18b74777,88085ae6,ff0f6a70,66063bca,11010b5c,8f659eff,
  f862ae69,616bffd3,166ccf45,a00ae278,d70dd2ee,4e048354,3903b3c2,a7672661,d06016f7,4969474d,3e6e77db,aed16a4a,d9d65adc,
  40df0b66,37d83bf0,a9bcae53,debb9ec5,47b2cf7f,30b5ffe9,bdbdf21c,cabac28a,53b39330,24b4a3a6,bad03605,cdd70693,54de5729,
  23d967bf,b3667a2e,c4614ab8,5d681b02,2a6f2b94,b40bbe37,c30c8ea1,5a05df1b,2d02ef8d`
  .split(',')
  .map(value => parseInt(value, 16));

export const getCrc32: CheckAlgorithmImplementation = (bytes: number[]): number[] => {
  // Code migrated to TypeScript from vanilla JavaScript implementation taken from:
  // https://dev.flarecast.eu/stash/projects/SAND/repos/swagger-ui/browse/node_modules/crc/lib/crc32.js
  let crc = 0 ^ -1;

  for (let i = 0; i < bytes.length; i++) {
    crc = CRC_32_LOOKUP_TABLE[(crc ^ bytes[i]) & 0xff] ^ (crc >>> 8);
  }
  crc = crc ^ -1;

  return [(crc >>> 24) & 0xff, (crc >>> 16) & 0xff, (crc >>> 8) & 0xff, crc & 0xff];
};

export const getFletcher16: CheckAlgorithmImplementation = (bytes: number[]): number[] => {
  let sum0 = 0;
  let sum1 = 0;

  for (let i = 0, iMax = bytes.length; i < iMax; i++) {
    sum0 = (sum0 + bytes[i]) % 0xff;
    sum1 = (sum1 + sum0) % 0xff;
  }

  return [sum1, sum0];
};

export const getSha1: CheckAlgorithmImplementation = (bytes: number[]): number[] => {
  // Code migrated to TypeScript from vanilla JavaScript implementation taken from:
  // https://github.com/kvz/locutus/blob/master/src/php/strings/sha1.js
  const bytesLength = bytes.length;
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
    let A = H0;
    let B = H1;
    let C = H2;
    let D = H3;
    let E = H4;
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
