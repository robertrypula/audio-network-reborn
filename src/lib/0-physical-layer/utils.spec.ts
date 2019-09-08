// Copyright (c) 2019 Robert Rypuła - https://github.com/robertrypula

import * as fromUtils from './utils';

describe('Utils', () => {
  describe('getDspConfigList', () => {
    it('should return valid list', () => {
      expect(fromUtils.getDspConfigList()).toEqual([
        {
          band: { bandwidth: 15128.466796875, begin: 3568.505859375, end: 18696.97265625 },
          dspConfigInitial: { fftSize: 1024, frequencyEnd: 18700, safeMarginFactor: 1.7 },
          rawByteRate: 25,
          rxIntervalMilliseconds: 20,
          transmissionMode: 'ExtraordinaryBandFast',
          txIntervalMilliseconds: 40
        },
        {
          band: { bandwidth: 15128.466796875, begin: 3568.505859375, end: 18696.97265625 },
          dspConfigInitial: { fftSize: 1024, frequencyEnd: 18700, safeMarginFactor: 2.24 },
          rawByteRate: 18.51851851851852,
          rxIntervalMilliseconds: 27,
          transmissionMode: 'ExtraordinaryBandSlow',
          txIntervalMilliseconds: 54
        },
        {
          band: { bandwidth: 5970.6298828125, begin: 1223.0712890625, end: 7193.701171875 },
          dspConfigInitial: { fftSize: 2048, frequencyEnd: 7200, safeMarginFactor: 1.344 },
          rawByteRate: 15.625,
          rxIntervalMilliseconds: 32,
          transmissionMode: 'FatBandFastAudibleLower',
          txIntervalMilliseconds: 64
        },
        {
          band: { bandwidth: 5970.6298828125, begin: 9213.57421875, end: 15184.2041015625 },
          dspConfigInitial: { fftSize: 2048, frequencyEnd: 15200, safeMarginFactor: 1.344 },
          rawByteRate: 15.625,
          rxIntervalMilliseconds: 32,
          transmissionMode: 'FatBandFastAudibleUpper',
          txIntervalMilliseconds: 64
        },
        {
          band: { bandwidth: 7564.2333984375, begin: 11110.25390625, end: 18674.4873046875 },
          dspConfigInitial: { fftSize: 2048, frequencyEnd: 18700, safeMarginFactor: 1.344 },
          rawByteRate: 15.625,
          rxIntervalMilliseconds: 32,
          transmissionMode: 'FatBandFastInaudible',
          txIntervalMilliseconds: 64
        },
        {
          band: { bandwidth: 5970.6298828125, begin: 1223.0712890625, end: 7193.701171875 },
          dspConfigInitial: { fftSize: 2048, frequencyEnd: 7200, safeMarginFactor: 2.15 },
          rawByteRate: 10,
          rxIntervalMilliseconds: 50,
          transmissionMode: 'FatBandSlowAudibleLower',
          txIntervalMilliseconds: 100
        },
        {
          band: { bandwidth: 5970.6298828125, begin: 9213.57421875, end: 15184.2041015625 },
          dspConfigInitial: { fftSize: 2048, frequencyEnd: 15200, safeMarginFactor: 2.15 },
          rawByteRate: 10,
          rxIntervalMilliseconds: 50,
          transmissionMode: 'FatBandSlowAudibleUpper',
          txIntervalMilliseconds: 100
        },
        {
          band: { bandwidth: 7564.2333984375, begin: 11110.25390625, end: 18674.4873046875 },
          dspConfigInitial: { fftSize: 2048, frequencyEnd: 18700, safeMarginFactor: 2.15 },
          rawByteRate: 10,
          rxIntervalMilliseconds: 50,
          transmissionMode: 'FatBandSlowInaudible',
          txIntervalMilliseconds: 100
        },
        {
          band: { bandwidth: 2985.31494140625, begin: 4208.38623046875, end: 7193.701171875 },
          dspConfigInitial: { fftSize: 4096, frequencyEnd: 7200, safeMarginFactor: 1.344 },
          rawByteRate: 7.936507936507937,
          rxIntervalMilliseconds: 63,
          transmissionMode: 'NormalBandFastAudibleLower',
          txIntervalMilliseconds: 126
        },
        {
          band: { bandwidth: 2990.6982421875, begin: 12198.88916015625, end: 15189.58740234375 },
          dspConfigInitial: { fftSize: 4096, frequencyEnd: 15200, safeMarginFactor: 1.344 },
          rawByteRate: 7.936507936507937,
          rxIntervalMilliseconds: 63,
          transmissionMode: 'NormalBandFastAudibleUpper',
          txIntervalMilliseconds: 126
        },
        {
          band: { bandwidth: 4595.54443359375, begin: 14095.56884765625, end: 18691.11328125 },
          dspConfigInitial: { fftSize: 4096, frequencyEnd: 18700, safeMarginFactor: 1.344 },
          rawByteRate: 7.936507936507937,
          rxIntervalMilliseconds: 63,
          transmissionMode: 'NormalBandFastInaudible',
          txIntervalMilliseconds: 126
        },
        {
          band: { bandwidth: 2985.31494140625, begin: 4208.38623046875, end: 7193.701171875 },
          dspConfigInitial: { fftSize: 4096, frequencyEnd: 7200, safeMarginFactor: 2.15 },
          rawByteRate: 5,
          rxIntervalMilliseconds: 100,
          transmissionMode: 'NormalBandSlowAudibleLower',
          txIntervalMilliseconds: 200
        },
        {
          band: { bandwidth: 2990.6982421875, begin: 12198.88916015625, end: 15189.58740234375 },
          dspConfigInitial: { fftSize: 4096, frequencyEnd: 15200, safeMarginFactor: 2.15 },
          rawByteRate: 5,
          rxIntervalMilliseconds: 100,
          transmissionMode: 'NormalBandSlowAudibleUpper',
          txIntervalMilliseconds: 200
        },
        {
          band: { bandwidth: 4595.54443359375, begin: 14095.56884765625, end: 18691.11328125 },
          dspConfigInitial: { fftSize: 4096, frequencyEnd: 18700, safeMarginFactor: 2.15 },
          rawByteRate: 5,
          rxIntervalMilliseconds: 100,
          transmissionMode: 'NormalBandSlowInaudible',
          txIntervalMilliseconds: 200
        },
        {
          band: { bandwidth: 1495.34912109375, begin: 5701.043701171875, end: 7196.392822265625 },
          dspConfigInitial: { fftSize: 8192, frequencyEnd: 7200, safeMarginFactor: 1.344 },
          rawByteRate: 4,
          rxIntervalMilliseconds: 125,
          transmissionMode: 'SlimBandFastAudibleLower',
          txIntervalMilliseconds: 250
        },
        {
          band: { bandwidth: 1492.657470703125, begin: 13705.48095703125, end: 15198.138427734375 },
          dspConfigInitial: { fftSize: 8192, frequencyEnd: 15200, safeMarginFactor: 1.344 },
          rawByteRate: 4,
          rxIntervalMilliseconds: 125,
          transmissionMode: 'SlimBandFastAudibleUpper',
          txIntervalMilliseconds: 250
        },
        {
          band: { bandwidth: 1492.657470703125, begin: 17204.0771484375, end: 18696.734619140625 },
          dspConfigInitial: { fftSize: 8192, frequencyEnd: 18700, safeMarginFactor: 1.344 },
          rawByteRate: 4,
          rxIntervalMilliseconds: 125,
          transmissionMode: 'SlimBandFastInaudible',
          txIntervalMilliseconds: 250
        },
        {
          band: { bandwidth: 1495.34912109375, begin: 5701.043701171875, end: 7196.392822265625 },
          dspConfigInitial: { fftSize: 8192, frequencyEnd: 7200, safeMarginFactor: 2.15 },
          rawByteRate: 2.5,
          rxIntervalMilliseconds: 200,
          transmissionMode: 'SlimBandSlowAudibleLower',
          txIntervalMilliseconds: 400
        },
        {
          band: { bandwidth: 1492.657470703125, begin: 13705.48095703125, end: 15198.138427734375 },
          dspConfigInitial: { fftSize: 8192, frequencyEnd: 15200, safeMarginFactor: 2.15 },
          rawByteRate: 2.5,
          rxIntervalMilliseconds: 200,
          transmissionMode: 'SlimBandSlowAudibleUpper',
          txIntervalMilliseconds: 400
        },
        {
          band: { bandwidth: 1492.657470703125, begin: 17204.0771484375, end: 18696.734619140625 },
          dspConfigInitial: { fftSize: 8192, frequencyEnd: 18700, safeMarginFactor: 2.15 },
          rawByteRate: 2.5,
          rxIntervalMilliseconds: 200,
          transmissionMode: 'SlimBandSlowInaudible',
          txIntervalMilliseconds: 400
        }
      ]);
    });
  });
});
