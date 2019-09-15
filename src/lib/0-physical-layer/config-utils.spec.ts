// Copyright (c) 2019 Robert Rypuła - https://github.com/robertrypula

import * as fromUtils from '@physical-layer/config-utils';

describe('Config Utils', () => {
  describe('getDspConfigList', () => {
    it('should return valid list', () => {
      expect(fromUtils.getDspConfigList()).toEqual([
        {
          band: { bandwidth: 15128.466796875, begin: 3568.505859375, end: 18696.97265625 },
          dspConfigInitializer: { fftSize: 1024, frequencyEnd: 18700, safeMarginFactor: 1.7 },
          dspMode: 'ExtraordinaryBandFast',
          rawByteRate: 25,
          rxIntervalMilliseconds: 20,
          txIntervalMilliseconds: 40
        },
        {
          band: { bandwidth: 15128.466796875, begin: 3568.505859375, end: 18696.97265625 },
          dspConfigInitializer: { fftSize: 1024, frequencyEnd: 18700, safeMarginFactor: 2.24 },
          dspMode: 'ExtraordinaryBandSlow',
          rawByteRate: 18.51851851851852,
          rxIntervalMilliseconds: 27,
          txIntervalMilliseconds: 54
        },
        {
          band: { bandwidth: 5970.6298828125, begin: 1223.0712890625, end: 7193.701171875 },
          dspConfigInitializer: { fftSize: 2048, frequencyEnd: 7200, safeMarginFactor: 1.344 },
          dspMode: 'FatBandFastAudibleLower',
          rawByteRate: 15.625,
          rxIntervalMilliseconds: 32,
          txIntervalMilliseconds: 64
        },
        {
          band: { bandwidth: 5970.6298828125, begin: 9213.57421875, end: 15184.2041015625 },
          dspConfigInitializer: { fftSize: 2048, frequencyEnd: 15200, safeMarginFactor: 1.344 },
          dspMode: 'FatBandFastAudibleUpper',
          rawByteRate: 15.625,
          rxIntervalMilliseconds: 32,
          txIntervalMilliseconds: 64
        },
        {
          band: { bandwidth: 7564.2333984375, begin: 11110.25390625, end: 18674.4873046875 },
          dspConfigInitializer: { fftSize: 2048, frequencyEnd: 18700, safeMarginFactor: 1.344 },
          dspMode: 'FatBandFastInaudible',
          rawByteRate: 15.625,
          rxIntervalMilliseconds: 32,
          txIntervalMilliseconds: 64
        },
        {
          band: { bandwidth: 5970.6298828125, begin: 1223.0712890625, end: 7193.701171875 },
          dspConfigInitializer: { fftSize: 2048, frequencyEnd: 7200, safeMarginFactor: 2.15 },
          dspMode: 'FatBandSlowAudibleLower',
          rawByteRate: 10,
          rxIntervalMilliseconds: 50,
          txIntervalMilliseconds: 100
        },
        {
          band: { bandwidth: 5970.6298828125, begin: 9213.57421875, end: 15184.2041015625 },
          dspConfigInitializer: { fftSize: 2048, frequencyEnd: 15200, safeMarginFactor: 2.15 },
          dspMode: 'FatBandSlowAudibleUpper',
          rawByteRate: 10,
          rxIntervalMilliseconds: 50,
          txIntervalMilliseconds: 100
        },
        {
          band: { bandwidth: 7564.2333984375, begin: 11110.25390625, end: 18674.4873046875 },
          dspConfigInitializer: { fftSize: 2048, frequencyEnd: 18700, safeMarginFactor: 2.15 },
          dspMode: 'FatBandSlowInaudible',
          rawByteRate: 10,
          rxIntervalMilliseconds: 50,
          txIntervalMilliseconds: 100
        },
        {
          band: { bandwidth: 2985.31494140625, begin: 4208.38623046875, end: 7193.701171875 },
          dspConfigInitializer: { fftSize: 4096, frequencyEnd: 7200, safeMarginFactor: 1.344 },
          dspMode: 'NormalBandFastAudibleLower',
          rawByteRate: 7.936507936507937,
          rxIntervalMilliseconds: 63,
          txIntervalMilliseconds: 126
        },
        {
          band: { bandwidth: 2990.6982421875, begin: 12198.88916015625, end: 15189.58740234375 },
          dspConfigInitializer: { fftSize: 4096, frequencyEnd: 15200, safeMarginFactor: 1.344 },
          dspMode: 'NormalBandFastAudibleUpper',
          rawByteRate: 7.936507936507937,
          rxIntervalMilliseconds: 63,
          txIntervalMilliseconds: 126
        },
        {
          band: { bandwidth: 4595.54443359375, begin: 14095.56884765625, end: 18691.11328125 },
          dspConfigInitializer: { fftSize: 4096, frequencyEnd: 18700, safeMarginFactor: 1.344 },
          dspMode: 'NormalBandFastInaudible',
          rawByteRate: 7.936507936507937,
          rxIntervalMilliseconds: 63,
          txIntervalMilliseconds: 126
        },
        {
          band: { bandwidth: 2985.31494140625, begin: 4208.38623046875, end: 7193.701171875 },
          dspConfigInitializer: { fftSize: 4096, frequencyEnd: 7200, safeMarginFactor: 2.15 },
          dspMode: 'NormalBandSlowAudibleLower',
          rawByteRate: 5,
          rxIntervalMilliseconds: 100,
          txIntervalMilliseconds: 200
        },
        {
          band: { bandwidth: 2990.6982421875, begin: 12198.88916015625, end: 15189.58740234375 },
          dspConfigInitializer: { fftSize: 4096, frequencyEnd: 15200, safeMarginFactor: 2.15 },
          dspMode: 'NormalBandSlowAudibleUpper',
          rawByteRate: 5,
          rxIntervalMilliseconds: 100,
          txIntervalMilliseconds: 200
        },
        {
          band: { bandwidth: 4595.54443359375, begin: 14095.56884765625, end: 18691.11328125 },
          dspConfigInitializer: { fftSize: 4096, frequencyEnd: 18700, safeMarginFactor: 2.15 },
          dspMode: 'NormalBandSlowInaudible',
          rawByteRate: 5,
          rxIntervalMilliseconds: 100,
          txIntervalMilliseconds: 200
        },
        {
          band: { bandwidth: 1495.34912109375, begin: 5701.043701171875, end: 7196.392822265625 },
          dspConfigInitializer: { fftSize: 8192, frequencyEnd: 7200, safeMarginFactor: 1.344 },
          dspMode: 'SlimBandFastAudibleLower',
          rawByteRate: 4,
          rxIntervalMilliseconds: 125,
          txIntervalMilliseconds: 250
        },
        {
          band: { bandwidth: 1492.657470703125, begin: 13705.48095703125, end: 15198.138427734375 },
          dspConfigInitializer: { fftSize: 8192, frequencyEnd: 15200, safeMarginFactor: 1.344 },
          dspMode: 'SlimBandFastAudibleUpper',
          rawByteRate: 4,
          rxIntervalMilliseconds: 125,
          txIntervalMilliseconds: 250
        },
        {
          band: { bandwidth: 1492.657470703125, begin: 17204.0771484375, end: 18696.734619140625 },
          dspConfigInitializer: { fftSize: 8192, frequencyEnd: 18700, safeMarginFactor: 1.344 },
          dspMode: 'SlimBandFastInaudible',
          rawByteRate: 4,
          rxIntervalMilliseconds: 125,
          txIntervalMilliseconds: 250
        },
        {
          band: { bandwidth: 1495.34912109375, begin: 5701.043701171875, end: 7196.392822265625 },
          dspConfigInitializer: { fftSize: 8192, frequencyEnd: 7200, safeMarginFactor: 2.15 },
          dspMode: 'SlimBandSlowAudibleLower',
          rawByteRate: 2.5,
          rxIntervalMilliseconds: 200,
          txIntervalMilliseconds: 400
        },
        {
          band: { bandwidth: 1492.657470703125, begin: 13705.48095703125, end: 15198.138427734375 },
          dspConfigInitializer: { fftSize: 8192, frequencyEnd: 15200, safeMarginFactor: 2.15 },
          dspMode: 'SlimBandSlowAudibleUpper',
          rawByteRate: 2.5,
          rxIntervalMilliseconds: 200,
          txIntervalMilliseconds: 400
        },
        {
          band: { bandwidth: 1492.657470703125, begin: 17204.0771484375, end: 18696.734619140625 },
          dspConfigInitializer: { fftSize: 8192, frequencyEnd: 18700, safeMarginFactor: 2.15 },
          dspMode: 'SlimBandSlowInaudible',
          rawByteRate: 2.5,
          rxIntervalMilliseconds: 200,
          txIntervalMilliseconds: 400
        }
      ]);
    });
  });
});
