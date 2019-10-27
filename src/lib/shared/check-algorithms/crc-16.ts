// Copyright (c) 2019 Robert Rypuła - https://github.com/robertrypula

import { CheckAlgorithmImplementation } from '@shared/model';

/*tslint:disable:no-bitwise*/

const CRC_16_LOOKUP_TABLE: number[] = `
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
  .map((value: string): number => parseInt(value, 16));

export const getCrc16: CheckAlgorithmImplementation = (bytes: number[]): number[] => {
  // Code migrated to TypeScript from vanilla JavaScript implementation:
  // https://dev.flarecast.eu/stash/projects/SAND/repos/swagger-ui/browse/node_modules/crc/lib/crc16.js
  let crc = 0;

  for (let i = 0; i < bytes.length; i++) {
    crc = (CRC_16_LOOKUP_TABLE[(crc ^ bytes[i]) & 0xff] ^ (crc >> 8)) & 0xffff;
  }

  return [(crc >>> 8) & 0xff, crc & 0xff];
};
