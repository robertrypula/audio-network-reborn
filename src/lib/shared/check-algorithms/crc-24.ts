// Copyright (c) 2019 Robert Rypuła - https://github.com/robertrypula

import { CheckAlgorithmImplementation } from '../model';

/*tslint:disable:no-bitwise*/

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
  // Code migrated to TypeScript from vanilla JavaScript implementation:
  // https://dev.flarecast.eu/stash/projects/SAND/repos/swagger-ui/browse/node_modules/crc/lib/crc24.js
  let crc = 0xb704ce;

  for (let i = 0; i < bytes.length; i++) {
    crc = (CRC_24_LOOKUP_TABLE[((crc >> 16) ^ bytes[i]) & 0xff] ^ (crc << 8)) & 0xffffff;
  }

  return [(crc >>> 16) & 0xff, (crc >>> 8) & 0xff, crc & 0xff];
};
