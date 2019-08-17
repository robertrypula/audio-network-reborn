// Copyright (c) 2019 Robert Rypuła - https://github.com/robertrypula

import * as utils from '../utils';
import * as checksumAlgorithms from './checksum-algorithms';

describe('ChecksumAlgorithms', () => {
  describe('getFletcher8', () => {
    it('should ...', () => {
      expect(true).toBe(true);  // TODO implement
    });
  });

  describe('getFletcher16', () => {
    it('should return valid value', () => {
      const testCases = [
        { input: 'abcde', output: [0xC8, 0xF0] },
        { input: 'abcdef', output: [0x20, 0x57] },
        { input: 'abcdefgh', output: [0x06, 0x27] }
      ];
      testCases.forEach((testCase) =>
        expect(checksumAlgorithms.getFletcher16(utils.getBytesFromText(testCase.input))).toEqual(testCase.output)
      );
    });
  });

  describe('getSha1', () => {
    it('should return valid value', () => {
      const testCases = [
        {
          input: '',
          output: [
            0xDA, 0x39, 0xA3, 0xEE, 0x5E, 0x6B, 0x4B, 0x0D, 0x32, 0x55,
            0xBF, 0xEF, 0x95, 0x60, 0x18, 0x90, 0xAF, 0xD8, 0x07, 0x09
          ]
        },
        {
          input: 'abc',
          output: [
            0xA9, 0x99, 0x3E, 0x36, 0x47, 0x06, 0x81, 0x6A, 0xBA, 0x3E,
            0x25, 0x71, 0x78, 0x50, 0xC2, 0x6C, 0x9C, 0xD0, 0xD8, 0x9D
          ]
        },
        {
          input: 'abcdbcdecdefdefgefghfghighijhijkijkljklmklmnlmnomnopnopq',
          output: [
            0x84, 0x98, 0x3E, 0x44, 0x1C, 0x3B, 0xD2, 0x6E, 0xBA, 0xAE,
            0x4A, 0xA1, 0xF9, 0x51, 0x29, 0xE5, 0xE5, 0x46, 0x70, 0xF1
          ]
        },
        {
          input: 'abcdefghbcdefghicdefghijdefghijkefghijklfghijklmghijklmnh' +
            'ijklmnoijklmnopjklmnopqklmnopqrlmnopqrsmnopqrstnopqrstu',
          output: [
            0xA4, 0x9B, 0x24, 0x46, 0xA0, 0x2C, 0x64, 0x5B, 0xF4, 0x19,
            0xF9, 0x95, 0xB6, 0x70, 0x91, 0x25, 0x3A, 0x04, 0xA2, 0x59
          ]
        }
      ];
      testCases.forEach((testCase) =>
        expect(checksumAlgorithms.getSha1(utils.getBytesFromText(testCase.input))).toEqual(testCase.output)
      );
    });
  });
});
