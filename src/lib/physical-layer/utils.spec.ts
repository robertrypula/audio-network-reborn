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
          timeTickMillisecondsRx: 20,
          timeTickMillisecondsTx: 40,
          transmissionMode: 'ExtraordinaryBandFast'
        },
        {
          band: { bandwidth: 15128.466796875, begin: 3568.505859375, end: 18696.97265625 },
          dspConfigInitial: { fftSize: 1024, frequencyEnd: 18700, safeMarginFactor: 2.24 },
          rawByteRate: 18.51851851851852,
          timeTickMillisecondsRx: 27,
          timeTickMillisecondsTx: 54,
          transmissionMode: 'ExtraordinaryBandSlow'
        },
        {
          band: { bandwidth: 5970.6298828125, begin: 1223.0712890625, end: 7193.701171875 },
          dspConfigInitial: { fftSize: 2048, frequencyEnd: 7200, safeMarginFactor: 1.344 },
          rawByteRate: 15.625,
          timeTickMillisecondsRx: 32,
          timeTickMillisecondsTx: 64,
          transmissionMode: 'FatBandFastAudibleLower'
        },
        {
          band: { bandwidth: 5970.6298828125, begin: 9213.57421875, end: 15184.2041015625 },
          dspConfigInitial: { fftSize: 2048, frequencyEnd: 15200, safeMarginFactor: 1.344 },
          rawByteRate: 15.625,
          timeTickMillisecondsRx: 32,
          timeTickMillisecondsTx: 64,
          transmissionMode: 'FatBandFastAudibleUpper'
        },
        {
          band: { bandwidth: 7564.2333984375, begin: 11110.25390625, end: 18674.4873046875 },
          dspConfigInitial: { fftSize: 2048, frequencyEnd: 18700, safeMarginFactor: 1.344 },
          rawByteRate: 15.625,
          timeTickMillisecondsRx: 32,
          timeTickMillisecondsTx: 64,
          transmissionMode: 'FatBandFastInaudible'
        },
        {
          band: { bandwidth: 5970.6298828125, begin: 1223.0712890625, end: 7193.701171875 },
          dspConfigInitial: { fftSize: 2048, frequencyEnd: 7200, safeMarginFactor: 2.15 },
          rawByteRate: 10,
          timeTickMillisecondsRx: 50,
          timeTickMillisecondsTx: 100,
          transmissionMode: 'FatBandSlowAudibleLower'
        },
        {
          band: { bandwidth: 5970.6298828125, begin: 9213.57421875, end: 15184.2041015625 },
          dspConfigInitial: { fftSize: 2048, frequencyEnd: 15200, safeMarginFactor: 2.15 },
          rawByteRate: 10,
          timeTickMillisecondsRx: 50,
          timeTickMillisecondsTx: 100,
          transmissionMode: 'FatBandSlowAudibleUpper'
        },
        {
          band: { bandwidth: 7564.2333984375, begin: 11110.25390625, end: 18674.4873046875 },
          dspConfigInitial: { fftSize: 2048, frequencyEnd: 18700, safeMarginFactor: 2.15 },
          rawByteRate: 10,
          timeTickMillisecondsRx: 50,
          timeTickMillisecondsTx: 100,
          transmissionMode: 'FatBandSlowInaudible'
        },
        {
          band: { bandwidth: 2985.31494140625, begin: 4208.38623046875, end: 7193.701171875 },
          dspConfigInitial: { fftSize: 4096, frequencyEnd: 7200, safeMarginFactor: 1.344 },
          rawByteRate: 7.936507936507937,
          timeTickMillisecondsRx: 63,
          timeTickMillisecondsTx: 126,
          transmissionMode: 'NormalBandFastAudibleLower'
        },
        {
          band: { bandwidth: 2990.6982421875, begin: 12198.88916015625, end: 15189.58740234375 },
          dspConfigInitial: { fftSize: 4096, frequencyEnd: 15200, safeMarginFactor: 1.344 },
          rawByteRate: 7.936507936507937,
          timeTickMillisecondsRx: 63,
          timeTickMillisecondsTx: 126,
          transmissionMode: 'NormalBandFastAudibleUpper'
        },
        {
          band: { bandwidth: 4595.54443359375, begin: 14095.56884765625, end: 18691.11328125 },
          dspConfigInitial: { fftSize: 4096, frequencyEnd: 18700, safeMarginFactor: 1.344 },
          rawByteRate: 7.936507936507937,
          timeTickMillisecondsRx: 63,
          timeTickMillisecondsTx: 126,
          transmissionMode: 'NormalBandFastInaudible'
        },
        {
          band: { bandwidth: 2985.31494140625, begin: 4208.38623046875, end: 7193.701171875 },
          dspConfigInitial: { fftSize: 4096, frequencyEnd: 7200, safeMarginFactor: 2.15 },
          rawByteRate: 5,
          timeTickMillisecondsRx: 100,
          timeTickMillisecondsTx: 200,
          transmissionMode: 'NormalBandSlowAudibleLower'
        },
        {
          band: { bandwidth: 2990.6982421875, begin: 12198.88916015625, end: 15189.58740234375 },
          dspConfigInitial: { fftSize: 4096, frequencyEnd: 15200, safeMarginFactor: 2.15 },
          rawByteRate: 5,
          timeTickMillisecondsRx: 100,
          timeTickMillisecondsTx: 200,
          transmissionMode: 'NormalBandSlowAudibleUpper'
        },
        {
          band: { bandwidth: 4595.54443359375, begin: 14095.56884765625, end: 18691.11328125 },
          dspConfigInitial: { fftSize: 4096, frequencyEnd: 18700, safeMarginFactor: 2.15 },
          rawByteRate: 5,
          timeTickMillisecondsRx: 100,
          timeTickMillisecondsTx: 200,
          transmissionMode: 'NormalBandSlowInaudible'
        },
        {
          band: { bandwidth: 1495.34912109375, begin: 5701.043701171875, end: 7196.392822265625 },
          dspConfigInitial: { fftSize: 8192, frequencyEnd: 7200, safeMarginFactor: 1.344 },
          rawByteRate: 4,
          timeTickMillisecondsRx: 125,
          timeTickMillisecondsTx: 250,
          transmissionMode: 'SlimBandFastAudibleLower'
        },
        {
          band: { bandwidth: 1492.657470703125, begin: 13705.48095703125, end: 15198.138427734375 },
          dspConfigInitial: { fftSize: 8192, frequencyEnd: 15200, safeMarginFactor: 1.344 },
          rawByteRate: 4,
          timeTickMillisecondsRx: 125,
          timeTickMillisecondsTx: 250,
          transmissionMode: 'SlimBandFastAudibleUpper'
        },
        {
          band: { bandwidth: 1492.657470703125, begin: 17204.0771484375, end: 18696.734619140625 },
          dspConfigInitial: { fftSize: 8192, frequencyEnd: 18700, safeMarginFactor: 1.344 },
          rawByteRate: 4,
          timeTickMillisecondsRx: 125,
          timeTickMillisecondsTx: 250,
          transmissionMode: 'SlimBandFastInaudible'
        },
        {
          band: { bandwidth: 1495.34912109375, begin: 5701.043701171875, end: 7196.392822265625 },
          dspConfigInitial: { fftSize: 8192, frequencyEnd: 7200, safeMarginFactor: 2.15 },
          rawByteRate: 2.5,
          timeTickMillisecondsRx: 200,
          timeTickMillisecondsTx: 400,
          transmissionMode: 'SlimBandSlowAudibleLower'
        },
        {
          band: { bandwidth: 1492.657470703125, begin: 13705.48095703125, end: 15198.138427734375 },
          dspConfigInitial: { fftSize: 8192, frequencyEnd: 15200, safeMarginFactor: 2.15 },
          rawByteRate: 2.5,
          timeTickMillisecondsRx: 200,
          timeTickMillisecondsTx: 400,
          transmissionMode: 'SlimBandSlowAudibleUpper'
        },
        {
          band: { bandwidth: 1492.657470703125, begin: 17204.0771484375, end: 18696.734619140625 },
          dspConfigInitial: { fftSize: 8192, frequencyEnd: 18700, safeMarginFactor: 2.15 },
          rawByteRate: 2.5,
          timeTickMillisecondsRx: 200,
          timeTickMillisecondsTx: 400,
          transmissionMode: 'SlimBandSlowInaudible'
        }
      ]);
    });
  });
});
